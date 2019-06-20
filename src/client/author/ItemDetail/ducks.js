import { createSelector } from "reselect";
import { cloneDeep, keyBy as _keyBy, omit as _omit, get, without, pull } from "lodash";
import { testItemsApi } from "@edulastic/api";
import { delay } from "redux-saga";
import { call, put, all, takeEvery, select } from "redux-saga/effects";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";

import { message } from "antd";
import { createAction } from "redux-starter-kit";
import { replace, push } from "connected-react-router";
import {
  loadQuestionsAction,
  addItemsQuestionAction,
  deleteQuestionAction,
  SET_QUESTION_SCORE
} from "../sharedDucks/questions";
import produce from "immer";
import { CLEAR_DICT_ALIGNMENTS } from "../src/constants/actions";

// constants
const testItemStatusConstants = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived"
};

export const RECEIVE_ITEM_DETAIL_REQUEST = "[itemDetail] receive request";
export const RECEIVE_ITEM_DETAIL_SUCCESS = "[itemDetail] receive success";
export const RECEIVE_ITEM_DETAIL_ERROR = "[itemDetail] receive error";
export const SET_ITEM_QIDS = "[itemDetail] set qids";

export const UPDATE_ITEM_DETAIL_REQUEST = "[itemDetail] update by id request";
export const UPDATE_ITEM_DETAIL_SUCCESS = "[itemDetail] update by id success";
export const UPDATE_ITEM_DETAIL_ERROR = "[itemDetail] update by id error";

export const SET_ITEM_DETAIL_DATA = "[itemDetail] set data";
export const SET_ITEM_DETAIL_ITEM_LEVEL_SCORING = "[itemDetail] set item level scoring";
export const SET_ITEM_DETAIL_SCORE = "[itemDetail] set item score";
export const INC_ITEM_DETAIL_SCORE = "[itemDetail] increment item score";
export const DEC_ITEM_DETAIL_SCORE = "[itemDetail] decrement item score";
export const UPDATE_ITEM_DETAIL_DIMENSION = "[itemDetail] update dimension";
export const ADD_QUESTION = "[author questions] add question";
export const REMOVE_QUESTION_BY_ID = "[author questions] delete question by id";
export const SET_DRAGGING = "[itemDetail] set dragging";

export const DELETE_ITEM_DETAIL_WIDGET = "[itemDetail] delete widget";
export const UPDATE_TAB_TITLE = "[itemDetail] update tab title";
export const USE_TABS = "[itemDetail] is use tabs";
export const USE_FLOW_LAYOUT = "[itemDetail] is use flow layout";
export const MOVE_WIDGET = "[itemDetail] move widget";
export const ITEM_DETAIL_PUBLISH = "[itemDetail] publish test item";
export const UPDATE_TESTITEM_STATUS = "[itemDetail] update test item status";
export const ITEM_SET_REDIRECT_TEST = "[itemDetail] set redirect test id";
export const ITEM_CLEAR_REDIRECT_TEST = "[itemDetail] clear redirect test id";
export const DELETE_ITEM_DETAIL_WIDGET_APPLY = "[itemDetail] delete widget apply";
export const UPDATE_DEFAULT_GRADES = "[itemDetail] update default grades";
export const UPDATE_DEFAULT_SUBJECT = "[itemDetail] update default subject";

export const SAVE_CURRENT_EDITING_TEST_ID = "[itemDetail] save current editing test id";
// actions

export const getItemDetailByIdAction = (id, params) => ({
  type: RECEIVE_ITEM_DETAIL_REQUEST,
  payload: { id, params }
});

export const receiveItemDetailSuccess = item => ({
  type: RECEIVE_ITEM_DETAIL_SUCCESS,
  payload: { item }
});

export const receiveItemDetailError = error => ({
  type: RECEIVE_ITEM_DETAIL_ERROR,
  payload: { error }
});

export const setItemDetailDataAction = item => ({
  type: SET_ITEM_DETAIL_DATA,
  payload: { item }
});

export const updateItemDetailByIdAction = (id, data, testId) => ({
  type: UPDATE_ITEM_DETAIL_REQUEST,
  payload: { id, data, testId }
});

export const updateItemDetailSuccess = item => ({
  type: UPDATE_ITEM_DETAIL_SUCCESS,
  payload: { item }
});

export const updateItemDetailError = error => ({
  type: UPDATE_ITEM_DETAIL_ERROR,
  payload: { error }
});

export const updateItemDetailDimensionAction = (left, right) => ({
  type: UPDATE_ITEM_DETAIL_DIMENSION,
  payload: { left, right }
});

export const setItemDetailDraggingAction = dragging => ({
  type: SET_DRAGGING,
  payload: { dragging }
});

export const deleteWidgetAction = (rowIndex, widgetIndex) => ({
  type: DELETE_ITEM_DETAIL_WIDGET,
  payload: { rowIndex, widgetIndex }
});

export const updateTabTitleAction = ({ rowIndex, tabIndex, value }) => ({
  type: UPDATE_TAB_TITLE,
  payload: { rowIndex, tabIndex, value }
});

export const useTabsAction = ({ rowIndex, isUseTabs }) => ({
  type: USE_TABS,
  payload: { rowIndex, isUseTabs }
});

export const useFlowLayoutAction = ({ rowIndex, isUseFlowLayout }) => ({
  type: USE_FLOW_LAYOUT,
  payload: { rowIndex, isUseFlowLayout }
});

export const moveItemDetailWidgetAction = ({ from, to }) => ({
  type: MOVE_WIDGET,
  payload: { from, to }
});

export const publishTestItemAction = testItemId => ({
  type: ITEM_DETAIL_PUBLISH,
  payload: testItemId
});

export const updateTestItemStatusAction = status => ({
  type: UPDATE_TESTITEM_STATUS,
  payload: status
});

export const updateDefaultSubjectAction = subject => ({
  type: UPDATE_DEFAULT_SUBJECT,
  payload: subject
});

export const updateDefaultGradesAction = grades => ({
  type: UPDATE_DEFAULT_GRADES,
  payload: grades
});

export const setRedirectTestAction = createAction(ITEM_SET_REDIRECT_TEST);
export const clearRedirectTestAction = createAction(ITEM_CLEAR_REDIRECT_TEST);
export const setItemLevelScoringAction = createAction(SET_ITEM_DETAIL_ITEM_LEVEL_SCORING);
export const setItemLevelScoreAction = createAction(SET_ITEM_DETAIL_SCORE);
export const incrementItemLevelScore = createAction(INC_ITEM_DETAIL_SCORE);
export const decrementItemLevelScore = createAction(DEC_ITEM_DETAIL_SCORE);

export const saveCurrentEditingTestIdAction = id => ({
  type: SAVE_CURRENT_EDITING_TEST_ID,
  payload: id
});

// selectors

export const stateSelector = state => state.itemDetail;

export const getDefaultGradesSelector = createSelector(
  stateSelector,
  state => state.defaultGrades
);
export const getDefaultSubjectSelector = createSelector(
  stateSelector,
  state => state.defaultSubject
);

export const getItemDetailSelector = createSelector(
  stateSelector,
  state => state.item
);

export const getRedirectTestSelector = createSelector(
  stateSelector,
  state => state.redirectTestId
);

export const getItemDetailSelectorForPreview = (state, id, page) => {
  let testItems = [];
  if (page === "addItems") {
    testItems = get(state, "testsAddItems.items", []);
  } else if (page === "review") {
    testItems = get(state, "tests.entity.testItems", []);
  } else {
    console.warn("unknown page type ", page);
  }
  const item = testItems.find(x => x._id === id);
  return item || undefined;
};

export const getItemIdSelector = createSelector(
  getItemDetailSelector,
  item => item && item._id
);

export const getItemLevelScoringSelector = createSelector(
  getItemDetailSelector,
  item => item && item.itemLevelScoring
);

export const getTestItemStatusSelector = createSelector(
  getItemDetailSelector,
  item => item && item.status
);

export const getRows = item =>
  item.rows &&
  item.rows.map(row => ({
    ...row,
    widgets: row.widgets.map(widget => {
      let referencePopulate = {
        data: null
      };
      let activity = {
        timespent: null,
        qIndex: null
      };

      if (item.data && item.data.questions && item.data.questions.length) {
        referencePopulate = item.data.questions.find(q => q._id === widget.reference);
      }

      if (widget && widget.entity && widget.entity.activity) {
        const { timespent } = widget.entity.activity;
        const { qIndex } = widget.entity.activity;
        activity = { timespent, qIndex };
      }

      if (!referencePopulate && item.data && item.data.resources && item.data.resources.length) {
        referencePopulate = item.data.resources.find(r => r._id === widget.reference);
      }

      return {
        ...widget,
        activity,
        referencePopulate
      };
    })
  }));

export const getItemDetailRowsSelector = createSelector(
  getItemDetailSelector,
  item => {
    if (!item) return [];
    return getRows(item);
  }
);

export const getItemDetailLoadingSelector = createSelector(
  stateSelector,
  state => state.loading
);
export const getItemDetailUpdatingSelector = createSelector(
  stateSelector,
  state => state.updating
);
export const getItemDetailDraggingSelector = createSelector(
  stateSelector,
  state => state.dragging
);

export const getItemDetailDimensionTypeSelector = createSelector(
  getItemDetailSelector,
  state => {
    if (!state || !state.rows) return "";
    const left = state.rows[0].dimension.trim().slice(0, -1);
    const right = state.rows[1] ? state.rows[1].dimension.trim().slice(0, -1) : "100";
    return `${left}-${right}`;
  }
);

export const getItemDetailValidationSelector = createSelector(
  getItemDetailRowsSelector,
  rows => {
    const validations = {};
    rows.forEach(row => {
      row.widgets.forEach(({ entity }) => {
        validations[entity.id] = entity;
      });
    });
    return validations;
  }
);

// reducer

const initialState = {
  item: null,
  error: null,
  loading: false,
  updating: false,
  updateError: null,
  dragging: false,
  redirectTestId: null,
  defaultGrades:
    getFromLocalStorage("defaultGrades") !== null
      ? getFromLocalStorage("defaultGrades")
        ? getFromLocalStorage("defaultGrades").split(",")
        : []
      : getFromLocalStorage("defaultGrades"),
  defaultSubject: getFromLocalStorage("defaultSubject"),
  currentEditingTestId: null
};

const deleteWidget = (state, { rowIndex, widgetIndex }) => {
  return produce(state, newState => {
    if (newState.item.itemLevelScoring) {
      if (newState.qids.length === 1) {
        newState.item.itemLevelScore = 0;
      } else if (newState.item.itemLevelScore > 1) {
        newState.item.itemLevelScore = newState.item.itemLevelScore - 1;
      }
    }
    const qid = newState.item.rows[rowIndex].widgets[widgetIndex].reference;
    newState.item.rows[rowIndex].widgets = newState.item.rows[rowIndex].widgets.filter((w, i) => i !== widgetIndex);

    pull(newState.qids, qid);
  });
};

const updateDimension = (state, { left, right }) => {
  const newState = cloneDeep(state);
  newState.item.rows[0].dimension = left;

  if (left === "100%") {
    newState.item.rows[0].widgets = [...newState.item.rows[0].widgets, ...newState.item.rows[1].widgets];
    newState.item.rows.length = 1;
  } else if (!newState.item.rows[1]) {
    newState.item.rows[1] = {
      tabs: [],
      dimension: right,
      widgets: []
    };
  } else {
    newState.item.rows[1].dimension = right;
  }
  return newState;
};

const updateTabTitle = (state, { rowIndex, tabIndex, value }) => {
  const newState = cloneDeep(state);
  newState.item.rows[rowIndex].tabs[tabIndex] = value;
  return newState;
};

const useTabs = (state, { rowIndex, isUseTabs }) => {
  const newState = cloneDeep(state);
  if (isUseTabs) {
    newState.item.rows[rowIndex].tabs = ["Tab 1", "Tab 2"];
  }
  if (!isUseTabs) {
    newState.item.rows[rowIndex].tabs = [];
  }
  return newState;
};

const useFlowLayout = (state, { rowIndex, isUseFlowLayout }) => {
  const newState = cloneDeep(state);
  newState.item.rows[rowIndex].flowLayout = isUseFlowLayout;
  return newState;
};

const moveWidget = (state, { from, to }) => {
  return produce(state, newState => {
    const [movedWidget] = newState.item.rows[from.rowIndex].widgets.splice(from.widgetIndex, 1);
    movedWidget.tabIndex = to.tabIndex || 0;
    newState.item.rows[to.rowIndex].widgets.splice(to.widgetIndex, 0, movedWidget);
    newState.qids = newState.item.rows
      .flatMap(x => x.widgets)
      .filter(widget => widget.widgetType === "question")
      .map(x => x.reference);
  });
};

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case RECEIVE_ITEM_DETAIL_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_ITEM_DETAIL_SUCCESS:
      return { ...state, item: payload, loading: false, error: null };

    case SET_ITEM_QIDS:
      return { ...state, qids: payload };

    case RECEIVE_ITEM_DETAIL_ERROR:
      return { ...state, loading: false, error: payload.error };

    case SET_ITEM_DETAIL_DATA:
      return { ...state, item: payload.item };

    case SET_ITEM_DETAIL_ITEM_LEVEL_SCORING:
      return { ...state, item: { ...state.item, itemLevelScoring: !!payload } };

    case SET_ITEM_DETAIL_SCORE:
      return { ...state, item: { ...state.item, itemLevelScore: payload } };

    case ADD_QUESTION:
      return {
        ...state,
        item: { ...state.item, itemLevelScore: ((state.item && state.item.itemLevelScore) || 0) + 1 }
      };

    case DELETE_ITEM_DETAIL_WIDGET_APPLY:
      return deleteWidget(state, payload);

    case UPDATE_TAB_TITLE:
      return updateTabTitle(state, payload);

    case MOVE_WIDGET:
      return moveWidget(state, payload);

    case USE_TABS:
      return useTabs(state, payload);

    case USE_FLOW_LAYOUT:
      return useFlowLayout(state, payload);

    case SET_DRAGGING:
      return { ...state, dragging: payload.dragging };

    case UPDATE_ITEM_DETAIL_DIMENSION:
      return updateDimension(state, payload);
    case UPDATE_ITEM_DETAIL_REQUEST:
      return { ...state, updating: true };
    case UPDATE_ITEM_DETAIL_SUCCESS:
      return { ...state, item: payload.item, updating: false };
    case UPDATE_ITEM_DETAIL_ERROR:
      return { ...state, updating: false, updateError: payload.error };
    case ITEM_SET_REDIRECT_TEST:
      return { ...state, redirectTestId: payload };
    case ITEM_CLEAR_REDIRECT_TEST:
      return { ...state, redirectTestId: undefined };
    case UPDATE_TESTITEM_STATUS:
      return {
        ...state,
        item: {
          ...state.item,
          status: payload
        }
      };
    case UPDATE_DEFAULT_SUBJECT:
      return {
        ...state,
        defaultSubject: payload
      };
    case UPDATE_DEFAULT_GRADES:
      return {
        ...state,
        defaultGrades: payload
      };
    case SAVE_CURRENT_EDITING_TEST_ID:
      return {
        ...state,
        currentEditingTestId: payload
      };
    default:
      return state;
  }
}

// saga

function getQuestionsSelector(state) {
  const authorQuestionsObj = state.authorQuestions.byId;
  const qids = state.itemDetail.qids || [];
  return qids.map(id => authorQuestionsObj[id]);
}

function* receiveItemSaga({ payload }) {
  try {
    const data = yield call(testItemsApi.getById, payload.id, payload.params);
    let questions = (data.data && data.data.questions) || [];
    const questionsArr = (data.data && data.data.questions) || [];
    const resources = (data.data && data.data.resources) || [];
    questions = [...questions, ...resources];
    questions = _keyBy(questions, "id");
    if (get(payload, "params.addItem", false)) {
      yield put(addItemsQuestionAction(questions));
    } else {
      yield put(loadQuestionsAction(questions));
    }
    const item = _omit(data, "data");
    const qids = questionsArr.map(x => x.id);

    const { itemLevelScore, itemLevelScoring } = data;
    yield put({
      type: RECEIVE_ITEM_DETAIL_SUCCESS,
      payload: item
    });
    yield put({
      type: SET_ITEM_QIDS,
      payload: qids
    });

    let itemLevelScore1 = data.itemLevelScore;
    //const questionsLength = ((data.data && data.data.questions) || []).length;
    // if (data.itemLevelScoring && !itemLevelScore1 && questionsLength) {
    //   itemLevelScore1 = questionsLength;
    // }
    console.log("setItemLevel", itemLevelScore1);

    yield put(setItemLevelScoreAction(itemLevelScore1));

    yield put({
      type: CLEAR_DICT_ALIGNMENTS
    });
  } catch (err) {
    console.log("err is", err);
    const errorMessage = "Receive item by id is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_ITEM_DETAIL_ERROR,
      payload: { error: errorMessage }
    });
  }
}

export function* updateItemSaga({ payload }) {
  try {
    if (!payload.keepData) {
      // avoid data part being put into db
      delete payload.data.data;
    }
    const data = _omit(payload.data, ["authors", "__v"]);
    if (payload.testId) {
      data.testId = testId;
    }
    data.data = {};

    const questions = yield select(getQuestionsSelector);
    data.data.questions = get(payload, "data.data.questions", questions);

    const { testId, ...item } = yield call(testItemsApi.updateById, payload.id, data, payload.testId);

    if (payload.redirect && item._id !== payload.id) {
      yield put(
        replace(
          payload.testId
            ? `/author/items/${item._id}/item-detail/test/${payload.testId}`
            : `/author/items/${item._id}/item-detail`
        )
      );
    }
    if (testId) {
      yield put(setRedirectTestAction(testId));
    }
    yield put({
      type: UPDATE_ITEM_DETAIL_SUCCESS,
      payload: { item }
    });
    yield call(message.success, "Update item by id is success", "Success");
  } catch (err) {
    console.error(err);
    const errorMessage = "Update item by id is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: UPDATE_ITEM_DETAIL_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* publishTestItemSaga({ payload }) {
  try {
    yield call(testItemsApi.publishTestItem, payload);
    yield put(updateTestItemStatusAction(testItemStatusConstants.PUBLISHED));
    const redirectTestId = yield select(getRedirectTestSelector);
    if (redirectTestId) {
      yield delay(1500);
      yield put(push(`/author/tests/${redirectTestId}`));
      yield put(clearRedirectTestAction());
    }
    yield call(message.success, "Successfully published");
  } catch (e) {
    console.error("publish error", e, e.stack);
    const errorMessage = "publish failed";
    yield call(message.error, errorMessage);
  }
}

function* deleteWidgetSaga({ payload: { rowIndex, widgetIndex } }) {
  const newState = yield select(state => state.itemDetail);
  const targetId = newState.item.rows[rowIndex].widgets[widgetIndex].reference;

  yield put({ type: DELETE_ITEM_DETAIL_WIDGET_APPLY, payload: { rowIndex, widgetIndex } });

  yield put(deleteQuestionAction(targetId));
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_ITEM_DETAIL_REQUEST, receiveItemSaga),
    yield takeEvery(UPDATE_ITEM_DETAIL_REQUEST, updateItemSaga),
    yield takeEvery(ITEM_DETAIL_PUBLISH, publishTestItemSaga),
    yield takeEvery(DELETE_ITEM_DETAIL_WIDGET, deleteWidgetSaga)
  ]);
}
