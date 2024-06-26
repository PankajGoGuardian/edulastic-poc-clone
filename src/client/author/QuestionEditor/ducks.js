import { createSelector } from "reselect";
import { testItemsApi, evaluateApi, questionsApi } from "@edulastic/api";
import { call, put, all, takeEvery, takeLatest, select, take } from "redux-saga/effects";
import { cloneDeep, values, get, omit, set, uniqBy, intersection } from "lodash";
import produce from "immer";
import { questionType } from "@edulastic/constants";
import { helpers, notification } from "@edulastic/common";
import { push } from "connected-react-router";
import * as Sentry from "@sentry/browser";
import { storeInLocalStorage } from "@edulastic/api/src/utils/Storage";
import { alignmentStandardsFromMongoToUI as transformDomainsToStandard } from "../../assessment/utils/helpers";

import {
  getItemDetailSelector,
  UPDATE_ITEM_DETAIL_SUCCESS,
  setRedirectTestAction,
  hasStandards,
  PROCEED_PUBLISH_ACTION,
  togglePublishWarningModalAction,
  getPassageSelector,
  generateRecentlyUsedCollectionsList,
  proceedToPublishItemAction
} from "../ItemDetail/ducks";
import {
  setTestDataAndUpdateAction,
  setCreatedItemToTestAction,
  updateTestAndNavigateAction,
  getTestSelector,
  SET_TEST_DATA,
  getCurrentGroupIndexSelector
} from "../TestPage/ducks";
import { setTestItemsAction, getSelectedItemSelector } from "../TestPage/components/AddItems/ducks";
import {
  SET_RUBRIC_ID,
  UPDATE_QUESTION,
  SET_FIRST_MOUNT,
  getCurrentQuestionSelector,
  getQuestionsArraySelector,
  changeCurrentQuestionAction,
  changeUpdatedFlagAction
} from "../sharedDucks/questions";

import { SET_ALIGNMENT_FROM_QUESTION, CLEAR_ITEM_EVALUATION, ADD_ITEM_EVALUATION } from "../src/constants/actions";
import { toggleCreateItemModalAction } from "../src/actions/testItem";
import { getNewAlignmentState } from "../src/reducers/dictionaries";
import { isIncompleteQuestion, hasImproperDynamicParamsConfig } from "../questionUtils";
import { changeViewAction } from "../src/actions/view";
import {
  getDictionariesAlignmentsSelector,
  getRecentStandardsListSelector,
  getRecentCollectionsListSelector
} from "../src/selectors/dictionaries";
import { updateRecentStandardsAction, updateRecentCollectionsAction } from "../src/actions/dictionaries";
import { getOrgDataSelector, isPublisherUserSelector } from "../src/selectors/user";
import { getTestEntitySelector } from "../AssignTest/duck";
import { reSequenceQuestionsWithWidgets } from "../../common/utils/helpers";
// constants
export const resourceTypeQuestions = {
  PASSAGE: questionType.PASSAGE,
  PROTRACTOR: questionType.PROTRACTOR,
  VIDEO: questionType.VIDEO,
  TEXT: questionType.TEXT
};

export const widgetTypes = {
  QUESTION: "question",
  RESOURCE: "resource"
};

export const RECEIVE_QUESTION_REQUEST = "[question] receive question request";
export const RECEIVE_QUESTION_SUCCESS = "[question] receive question success";
export const RECEIVE_QUESTION_ERROR = "[question] receive question error";

export const SAVE_QUESTION_REQUEST = "[question] save question request";
export const SAVE_QUESTION_SUCCESS = "[question] save question success";
export const SAVE_QUESTION_ERROR = "[question] save question error";

export const SET_QUESTION_DATA = "[question] set question data";
export const SET_QUESTION_ALIGNMENT_ADD_ROW = "[question] set question alignment add row";
export const SET_QUESTION_ALIGNMENT_REMOVE_ROW = "[question] set question alignment remove row";
export const SET_QUESTION = "[question] set question";
export const LOAD_QUESTION = "[quesiton] load question from testItem";
export const ADD_AUTHORED_ITEMS_TO_TEST = "[question] add authored items to test";
export const SET_IS_GRADING_RUBRIC = "[question] set is grading rubric checkbox state";
// actions

// Variable
export const CALCULATE_FORMULA = "[variable] calculate variable formulation for example value";
export const CALCULATE_FORMULA_FAILED = "[variable] calculate variable formulation for example value failed";

export const receiveQuestionByIdAction = id => ({
  type: RECEIVE_QUESTION_REQUEST,
  payload: {
    id
  }
});

export const saveQuestionAction = (testId, isTestFlow, isEditFlow = false) => ({
  type: SAVE_QUESTION_REQUEST,
  payload: { testId, isTestFlow, isEditFlow }
});

export const setQuestionDataAction = question => ({
  type: UPDATE_QUESTION,
  payload: question
});

export const setFirstMountAction = id => ({
  type: SET_FIRST_MOUNT,
  id
});

export const setQuestionAlignmentAddRowAction = alignmentRow => ({
  type: SET_QUESTION_ALIGNMENT_ADD_ROW,
  payload: { alignmentRow }
});

export const setQuestionAlignmentRemoveRowAction = index => ({
  type: SET_QUESTION_ALIGNMENT_REMOVE_ROW,
  payload: { index }
});

export const setQuestionAction = data => ({
  type: SET_QUESTION,
  payload: { data }
});

export const loadQuestionAction = (data, rowIndex, isPassageWidget = false) => ({
  type: LOAD_QUESTION,
  payload: { data, rowIndex, isPassageWidget }
});

export const calculateFormulaAction = data => ({
  type: CALCULATE_FORMULA,
  payload: { data }
});

export const setDictAlignmentFromQuestion = payload => ({
  type: SET_ALIGNMENT_FROM_QUESTION,
  payload
});

export const addAuthoredItemsAction = payload => ({
  type: ADD_AUTHORED_ITEMS_TO_TEST,
  payload
});

export const setIsGradingRubricAction = payload => ({
  type: SET_IS_GRADING_RUBRIC,
  payload
});
// reducer

const initialState = {
  entity: null,
  loading: false,
  saving: false,
  error: null,
  saveError: null,
  calculating: false
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CLEAR_ITEM_EVALUATION: {
      return {
        ...state,
        calculating: !!payload
      };
    }
    case CALCULATE_FORMULA:
      return {
        ...state,
        calculating: true
      };
    case ADD_ITEM_EVALUATION:
    case CALCULATE_FORMULA_FAILED:
    case UPDATE_QUESTION: {
      return {
        ...state,
        calculating: false
      };
    }
    case RECEIVE_QUESTION_REQUEST:
      return {
        ...state,
        loading: true
      };
    case RECEIVE_QUESTION_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: payload.entity
      };
    case RECEIVE_QUESTION_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error
      };

    case SAVE_QUESTION_REQUEST:
      return {
        ...state,
        saving: true
      };
    case SAVE_QUESTION_SUCCESS:
      return {
        ...state,
        saving: false
      };
    case SAVE_QUESTION_ERROR:
      return {
        ...state,
        saving: false,
        saveError: payload.error
      };

    case SET_QUESTION_DATA:
      return {
        ...state,
        entity: { ...state.entity, data: payload.data }
      };
    case SET_QUESTION_ALIGNMENT_ADD_ROW: {
      const { alignmentRow } = payload;
      const currentAlignment = state.entity.data && state.entity.data.alignment;
      const newAlignment = currentAlignment ? [...currentAlignment] : [];
      newAlignment.push(alignmentRow);
      return {
        ...state,
        entity: {
          ...state.entity,
          data: {
            ...state.entity.data,
            alignment: newAlignment
          }
        }
      };
    }
    case SET_QUESTION_ALIGNMENT_REMOVE_ROW: {
      const { index } = payload;
      const newAlignment = [...state.entity.data.alignment];
      newAlignment.splice(index, 1);
      return {
        ...state,
        entity: {
          ...state.entity,
          data: {
            ...state.entity.data,
            alignment: newAlignment
          }
        }
      };
    }
    case SET_QUESTION:
      return {
        ...state,
        entity: {
          data: payload.data
        }
      };
    case SET_IS_GRADING_RUBRIC:
      return {
        ...state,
        isGradingRubric: payload
      };
    case SET_RUBRIC_ID:
      return {
        ...state,
        isGradingRubric: false
      };
    default:
      return state;
  }
};

// selectors

export const stateSelector = state => state.question;
export const getQuestionSelector = createSelector(
  stateSelector,
  state => state.entity
);
export const getQuestionDataSelector = createSelector(
  getCurrentQuestionSelector,
  state => state
);
export const getQuestionAlignmentSelector = createSelector(
  getCurrentQuestionSelector,
  state => get(state, "alignment", [])
);

export const getValidationSelector = createSelector(
  getCurrentQuestionSelector,
  state => state.validation
);

export const getAlignmentFromQuestionSelector = createSelector(
  getQuestionAlignmentSelector,
  alignments => {
    const modifyAlignment = alignments.map(item => ({
      ...item,
      ...transformDomainsToStandard(item.domains)
    }));
    delete modifyAlignment.domains;
    return modifyAlignment;
  }
);

export const getCalculatingSelector = createSelector(
  stateSelector,
  state => state.calculating
);

export const getIsGradingCheckboxState = createSelector(
  stateSelector,
  state => state.isGradingRubric
);
// saga

function* receiveQuestionSaga({ payload }) {
  try {
    const entity = yield call(questionsApi.getById, payload.id);

    yield put({
      type: RECEIVE_QUESTION_SUCCESS,
      payload: { entity }
    });
  } catch (err) {
    const errorMessage = "Receive question is failing";
    notification({ msg: errorMessage });
    yield put({
      type: RECEIVE_QUESTION_ERROR,
      payload: { error: errorMessage }
    });
  }
}

export const getQuestionIds = item => {
  const { rows = [] } = item;
  let questionIds = [];
  rows.forEach(entry => {
    const qIds = (entry.widgets || []).map(w => w.reference);
    questionIds = [...questionIds, ...qIds];
  });

  return questionIds;
};

const updateItemWithAlignmentDetails = (itemDetail = {}, alignments = []) => {
  itemDetail.grades = alignments[0]?.grades || [];
  itemDetail.subjects = itemDetail.subjects || [];
  itemDetail.curriculums = itemDetail.curriculums || [];
  alignments[0]?.subject ? itemDetail.subjects.push(alignments[0].subject) : null;
  alignments[0]?.curriculumId ? itemDetail.curriculums.push(alignments[0].curriculumId.toString()) : null;
};

export const redirectTestIdSelector = state => get(state, "itemDetail.redirectTestId", false);

function* saveQuestionSaga({ payload: { testId: tId, isTestFlow, isEditFlow, saveAndPublishFlow = false } }) {
  try {
    if (isTestFlow) {
      const questions = Object.values(yield select(state => get(state, ["authorQuestions", "byId"], {})));
      const testItem = yield select(state => get(state, ["itemDetail", "item"]));
      const isMultipartOrPassageType = testItem && (testItem.multipartItem || testItem.isPassageWithQuestions);
      const standardPresent = questions.some(hasStandards);

      // if alignment data is not present and question is not multipart or passage type ,
      // set the flag to open the modal, and wait for
      // an action from the modal.!
      if (!(isMultipartOrPassageType || standardPresent)) {
        yield put(togglePublishWarningModalAction(true));
        // action dispatched by the modal.
        const { payload: publishItem } = yield take(PROCEED_PUBLISH_ACTION);
        yield put(togglePublishWarningModalAction(false));

        // if he wishes to add some just close the modal, and go to metadata.
        // else continue the normal flow.
        if (!publishItem) {
          yield put(changeViewAction("metadata"));
          return;
        }
      }
    }
    const question = yield select(getCurrentQuestionSelector);
    const itemDetail = yield select(getItemDetailSelector);
    const alignments = yield select(getDictionariesAlignmentsSelector);

    const { itemLevelScoring = false } = itemDetail;
    const [isIncomplete, errMsg] = isIncompleteQuestion(question, itemLevelScoring);
    if (isIncomplete) {
      notification({ msg: errMsg });
      if (saveAndPublishFlow) {
        yield put({
          type: SAVE_QUESTION_ERROR,
          payload: { error: errMsg, customError: true }
        });
      }
      return;
    }

    const [hasImproperConfig, warningMsg, shouldUncheck] = hasImproperDynamicParamsConfig(question);
    if (hasImproperConfig) {
      notification({ type: "warn", msg: warningMsg });
    }

    if (shouldUncheck) {
      question.variable.enabled = false;
      delete question.variable.examples;
    }

    const isGradingCheckboxState = yield select(getIsGradingCheckboxState);

    if (isGradingCheckboxState && !question.rubrics) {
      if (saveAndPublishFlow) {
        yield put({
          type: SAVE_QUESTION_ERROR,
          payload: { error: "Rubric not associated", customError: true }
        });
      }
      return notification({ messageKey: "pleaseAssociateARubric" });
    }

    const locationState = yield select(state => state.router.location.state);
    updateItemWithAlignmentDetails(itemDetail, alignments);
    let currentQuestionIds = getQuestionIds(itemDetail);
    const { rowIndex, tabIndex } = locationState || { rowIndex: 0, tabIndex: 1 };
    const { id } = question;
    const entity = {
      ...question,
      firstMount: false
    };
    if (itemDetail && itemDetail.rows) {
      const isNew = currentQuestionIds.filter(item => item === id).length === 0;

      // if a new question add question
      if (isNew) {
        const widgetType = values(resourceTypeQuestions).includes(entity.type)
          ? widgetTypes.RESOURCE
          : widgetTypes.QUESTION;
        itemDetail.rows[rowIndex].widgets.push({
          widgetType,
          type: entity.type,
          title: entity.title,
          reference: id,
          tabIndex
        });
      }
    }

    currentQuestionIds = getQuestionIds(itemDetail);
    const allQuestions = yield select(getQuestionsArraySelector);
    const currentQuestions = allQuestions.filter(
      q => currentQuestionIds.includes(q.id) && !values(resourceTypeQuestions).includes(q.type)
    );
    const currentResources = allQuestions.filter(
      q => currentQuestionIds.includes(q.id) && values(resourceTypeQuestions).includes(q.type)
    );

    const _widgets = itemDetail?.rows
      ?.flatMap(({ widgets }) => widgets)
      ?.filter(widget => widget.widgetType === "question");

    let data = {
      ...itemDetail,
      data: {
        questions: reSequenceQuestionsWithWidgets(_widgets, currentQuestions),
        resources: currentResources
      }
    };

    data = produce(data, draftData => {
      if (draftData.data.questions.length > 0) {
        if (data.itemLevelScoring) {
          draftData.data.questions[0].itemScore = data.itemLevelScore;
          set(draftData, ["data", "questions", 0, "validation", "validResponse", "score"], data.itemLevelScore);
          for (const [index] of draftData.data.questions.entries()) {
            if (index > 0) {
              set(draftData, ["data", "questions", index, "validation", "validResponse", "score"], 0);
            }
          }
        } else if (draftData.data.questions[0].itemScore) {
          // const itemScore = draftData.data.questions[0].itemScore;
          // for (let [index] of draftData.data.questions.entries()) {
          //   draftData.data.questions[index].validation.validResponse.score =
          //     itemScore / draftData.data.questions.length;
          // }
          delete draftData.data.questions[0].itemScore;
        }

        draftData.data.questions.forEach((q, index) => {
          if (index > 0) {
            if (data.itemLevelScoring) {
              q.scoringDisabled = true;
            } else {
              delete q.scoringDisabled;
            }
          }
          if (q.template) {
            q.template = helpers.removeIndexFromTemplate(q.template);
          }
          if (q.templateMarkUp) {
            q.templateMarkUp = helpers.removeIndexFromTemplate(q.templateMarkUp);
          }
        });
      }
    });

    const redirectTestId = yield select(redirectTestIdSelector);
    let item;
    // if its a new testItem, create testItem, else update it.
    // TODO: do we need redirect testId here?!
    if (itemDetail._id === "new") {
      const reqData = omit(data, "_id");
      item = yield call(testItemsApi.create, reqData);
    } else {
      item = yield call(testItemsApi.updateById, itemDetail._id, data, redirectTestId);
    }
    yield put(changeUpdatedFlagAction(false));
    if (item.testId) {
      yield put(setRedirectTestAction(item.testId));
    }
    yield put({
      type: UPDATE_ITEM_DETAIL_SUCCESS,
      payload: { item }
    });

    if (!saveAndPublishFlow) {
      notification({ type: "success", messageKey: "itemSavedSuccess" });
    }

    const { standards = [] } = alignments[0];
    // to update recent standards used in local storage and store
    let recentStandardsList = yield select(getRecentStandardsListSelector);
    recentStandardsList = uniqBy([...standards, ...recentStandardsList], i => i._id).slice(0, 10);
    yield put(updateRecentStandardsAction({ recentStandards: recentStandardsList }));
    storeInLocalStorage("recentStandards", JSON.stringify(recentStandardsList));

    const { collections } = item;
    if (collections) {
      const { itemBanks } = yield select(getOrgDataSelector);
      let recentCollectionsList = yield select(getRecentCollectionsListSelector);
      recentCollectionsList = generateRecentlyUsedCollectionsList(collections, itemBanks, recentCollectionsList);
      yield put(updateRecentCollectionsAction({ recentCollections: recentCollectionsList }));
    }
    if (saveAndPublishFlow) {
      yield put(proceedToPublishItemAction({ itemId: item._id }));
    }
    if (isTestFlow) {
      // user should get redirected to item detail page
      // when multipart or passgae questions are being created
      // from test flow or else save and continue.
      const isFinalSave = yield select(state => state.router.location.isFinalSave);
      if ((item.multipartItem || !!item.passageId || item.isPassageWithQuestions) && !isFinalSave) {
        yield put(
          push({
            pathname: `/author/items/${item._id}/item-detail/test/${tId}`,
            state: {
              backText: "Back to item bank",
              backUrl: "/author/items",
              itemDetail: false,
              isFinalSave: true,
              isTestFlow
            }
          })
        );
        return;
      }

      const isPublisherUser = yield select(isPublisherUserSelector);
      const { itemGroups } = yield select(getTestEntitySelector);

      if (isPublisherUser && (itemGroups.length > 1 || itemGroups[0].type === "AUTOSELECT")) {
        const pathname =
          tId && tId !== "undefined" ? `/author/tests/tab/addItems/id/${tId}` : "/author/tests/create/addItems";
        yield put(
          push({
            pathname,
            state: {
              persistStore: true,
              isAuthoredNow: true
            }
          })
        );
        notification({ type: "info", messageKey: "pleaseAddItemManuallyToGroup" });
      } else {
        // add item to test entity
        yield put(addAuthoredItemsAction({ item, tId, isEditFlow }));
      }
      if (!isEditFlow) return;
      yield put(changeViewAction("edit"));
      return;
    }
    const stateToFollow =
      locationState.testAuthoring === false ? { testAuthoring: false, testId: locationState.testId } : {};
    if (itemDetail) {
      yield put(
        push({
          pathname: `/author/items/${item._id}/item-detail`,
          state: {
            backText: "Back to item bank",
            backUrl: "/author/items",
            itemDetail: false,
            ...stateToFollow
          }
        })
      );
    }
  } catch (err) {
    console.error(err);
    const errorMessage = "Save question is failing";
    if (isTestFlow) {
      yield put(toggleCreateItemModalAction(false));
    }
    notification({ messageKey: "saveQuestionFailing" });
    yield put({
      type: SAVE_QUESTION_ERROR,
      payload: { error: errorMessage }
    });
  }
}

/**
 *
 * @param {Object} variables
 */
const containsEmptyField = variables => {
  const _keys = Object.keys(variables);
  for (const key of _keys) {
    const { type = "", exampleValue = "", formula = "", set: _set = "", sequence = "" } = variables[key];
    switch (true) {
      // variables must be set
      case type !== "FORMULA" && !exampleValue:
        return { hasEmptyField: true, errMessage: "dynamic parameters has empty fields" };
      // formula must be set
      case type === "FORMULA" && !formula:
        return { hasEmptyField: true, errMessage: "formula is required" };
      // avoids recursion
      case !!intersection(_keys, _set.split(",")).length:
        return { hasEmptyField: true, errMessage: "dynamic parameters can not use variable name inside set" };
      case !!intersection(_keys, sequence.split(",")).length:
        return { hasEmptyField: true, errMessage: "dynamic parameters can not use variable name inside sequence" };
      default:
        break;
    }
  }
  return { hasEmptyField: false, errMessage: "" };
};

/**
 *
 * @param {*} payload should be an object with testId and isEditFlow flags
 *
 */
function* addAuthoredItemsToTestSaga({ payload }) {
  try {
    const { item, tId: testId, isEditFlow } = payload;
    const testItems = yield select(getSelectedItemSelector);
    const currentGroupIndex = yield select(getCurrentGroupIndexSelector);
    // updated testItems should have the current authored item
    // if it is passage item there could be multiple testitems
    // merge all into nextTestItems and add to test.
    let nextTestItems = testItems;
    if (item.passageId) {
      const passage = yield select(getPassageSelector);
      nextTestItems = [...nextTestItems, ...passage.testItems];
    } else {
      nextTestItems = [...nextTestItems, item._id];
    }

    yield put(setTestItemsAction(nextTestItems));
    yield put(setCreatedItemToTestAction(item));

    // if the item is getting created from test before saving
    // then save and continue else change the route to test
    if (!testId || testId === "undefined") {
      yield put(setTestDataAndUpdateAction({ addToTest: true, item }));
    } else {
      const test = yield select(getTestSelector);
      // update the test store with new test ITem
      const updatedTest = produce(test, draft => {
        draft.itemGroups[currentGroupIndex].items.push(item);
      });

      yield put({
        type: SET_TEST_DATA,
        payload: { data: updatedTest }
      });
      // save the test and navigate to test page.
      const pathname = !isEditFlow
        ? `/author/tests/tab/addItems/id/${testId}`
        : `/author/tests/${testId}/createItem/${item._id}`;
      yield put(updateTestAndNavigateAction({ pathname, testId }));
    }
  } catch (e) {
    console.log(e, "error");
    const errorMessage = "Loading Question is failed";
    notification({ msg: errorMessage });
  }
}
// actions

function* calculateFormulaSaga({ payload }) {
  try {
    const getLatexValuePairs = (id, variables, example) => ({
      id,
      latexes: Object.keys(variables)
        .map(variableName => variables[variableName])
        .filter(variable => variable.type === "FORMULA")
        .reduce(
          (lx, variable) => [
            ...lx,
            {
              id: variable.name,
              formula: variable.formula
            }
          ],
          []
        ),
      variables: Object.keys(variables).map(variableName => ({
        id: variableName,
        value:
          variables[variableName].type === "FORMULA"
            ? variables[variableName].formula
            : example
            ? example[variableName]
            : variables[variableName].exampleValue
      }))
    });

    const question = yield select(getCurrentQuestionSelector);

    if (!question.variable || !question.variable.enabled) {
      return [];
    }
    const variables = payload.data.variables || question.variable.variables || {};
    const examples = payload.data.examples || question.variable.examples || {};
    const latexValuePairs = [getLatexValuePairs("definition", variables)];

    const { hasEmptyField = false, errMessage = "" } = containsEmptyField(variables);
    if (hasEmptyField) {
      yield put({
        type: CALCULATE_FORMULA_FAILED
      });
      notification({ type: "warn", msg: errMessage });
      return true;
    }

    if (examples) {
      for (const example of examples) {
        const pair = getLatexValuePairs(`example${example.key}`, variables, example);
        if (pair.latexes.length > 0) {
          latexValuePairs.push(pair);
        }
      }
    }
    const variable = { ...question.variable, examples, variables };
    const results = yield call(evaluateApi.calculate, latexValuePairs);
    const newQuestion = { ...cloneDeep(question), variable };
    for (const result of results) {
      if (result.id === "definition") {
        Object.keys(result.values).forEach(key => {
          newQuestion.variable.variables[key].exampleValue = result.values[key];
        });
      } else {
        const idx = newQuestion.variable.examples.findIndex(example => `example${example.key}` === result.id);
        Object.keys(result.values).forEach(key => {
          newQuestion.variable.examples[idx][key] = result.values[key];
        });
      }
    }

    yield put({
      type: UPDATE_QUESTION,
      payload: newQuestion
    });
  } catch (err) {
    yield put({
      type: CALCULATE_FORMULA_FAILED
    });
    notification({ messageKey: "somethingWentPleaseTryAgain" });
    console.log(err);
  }
}

function* loadQuestionSaga({ payload }) {
  try {
    const { data, rowIndex, isPassageWidget = false } = payload;
    const pathname = yield select(state => state.router.location.pathname);
    const locationState = yield select(state => state.router.location?.state || {});
    yield put(changeCurrentQuestionAction(data.reference));
    if (pathname.includes("tests")) {
      yield put(
        push({
          pathname: `${pathname}/questions/edit/${data.type}`,
          state: {
            backText: "question edit",
            backUrl: pathname,
            rowIndex,
            isPassageWithQuestions: isPassageWidget,
            ...locationState
          }
        })
      );
    } else {
      yield put(
        push({
          pathname: `/author/questions/edit/${data.type}`,
          state: {
            backText: "question edit",
            backUrl: pathname,
            rowIndex,
            isPassageWithQuestions: isPassageWidget
          }
        })
      );
    }
    let alignments = yield select(getAlignmentFromQuestionSelector);
    if (!alignments.length) {
      alignments = [getNewAlignmentState()];
    }
    yield put(setDictAlignmentFromQuestion(alignments));
  } catch (e) {
    Sentry.captureException(e);
    const errorMessage = "Loading Question is failing";
    notification({ msg: errorMessage });
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_QUESTION_REQUEST, receiveQuestionSaga),
    yield takeEvery(SAVE_QUESTION_REQUEST, saveQuestionSaga),
    yield takeEvery(LOAD_QUESTION, loadQuestionSaga),
    yield takeLatest(CALCULATE_FORMULA, calculateFormulaSaga),
    yield takeEvery(ADD_AUTHORED_ITEMS_TO_TEST, addAuthoredItemsToTestSaga)
  ]);
}
