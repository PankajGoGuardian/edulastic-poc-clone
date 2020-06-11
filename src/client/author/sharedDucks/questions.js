import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import {
  values as _values,
  groupBy as _groupBy,
  intersection as _intersection,
  cloneDeep as _cloneDeep,
  get,
  set,
  sortBy
} from "lodash";
import produce from "immer";
import { markQuestionLabel } from "../../assessment/Transformer";
import { UPDATE_TEST_DOC_BASED_REQUEST } from "../TestPage/ducks";

// actions types
export const LOAD_QUESTIONS = "[author questions] load questions";
export const ADD_ITEMS_QUESTION = "[author question] load question";
export const UPDATE_QUESTION = "[author questions] update questions";
export const CHANGE_LABEL = "[author questions] change label";
export const SET_FIRST_MOUNT = "[author questions] set first mount";
export const CHANGE_ITEM = "[author questions] change item";
export const CHANGE_ITEM_UI_STYLE = "[author questions] change item uiStyle";
export const ADD_QUESTION = "[author questions] add question";
export const CHANGE_CURRENT_QUESTION = "[author quesitons] change current question";
export const ADD_ALIGNMENT = "[author questions] add alignment";
export const REMOVE_ALIGNMENT = "[author questions] remove alignment";
export const DELETE_QUESTION = "[author questions] delete question by id";
export const SET_RUBRIC_ID = "[author questions] set rubric id";
export const REMOVE_RUBRIC_ID = "[author questions] remove rubricId";
export const CHANGE_UPDATE_FLAG = "[authorQuestions] update the updated flag";
// actions creators
export const loadQuestionsAction = createAction(LOAD_QUESTIONS);
export const addItemsQuestionAction = createAction(ADD_ITEMS_QUESTION);
export const addQuestionAction = createAction(ADD_QUESTION);
export const updateQuestionAction = createAction(UPDATE_QUESTION);
export const changeItemAction = createAction(CHANGE_ITEM);
export const changeUIStyleAction = createAction(CHANGE_ITEM_UI_STYLE);
export const setFirstMountAction = createAction(SET_FIRST_MOUNT);
export const changeCurrentQuestionAction = createAction(CHANGE_CURRENT_QUESTION);
export const addAlignmentAction = createAction(ADD_ALIGNMENT);
export const removeAlignmentAction = createAction(REMOVE_ALIGNMENT);
export const deleteQuestionAction = createAction(DELETE_QUESTION);
export const setRubricIdAction = createAction(SET_RUBRIC_ID);
export const removeRubricIdAction = createAction(REMOVE_RUBRIC_ID);
export const changeUpdatedFlagAction = createAction(CHANGE_UPDATE_FLAG);
// initialState
const initialState = {
  byId: {},
  current: "",
  updated: false
};

// load questions to the store.
const loadQuestions = (state, { payload }) => {
  state.byId = payload;
  state.updated = false;
};

const addQuestions = (state, { payload }) => {
  state.byId = { ...state.byId, ...payload };
  state.updated = false;
};

const deleteQuestion = (state, { payload }) => {
  const newState = _cloneDeep(state);

  const questions = sortBy(_values(newState.byId), ["qIndex"]);
  const questionIndex = questions.findIndex(q => q.id === payload);
  let updatedQuestions = questions;
  updatedQuestions = questions.map((question, index) =>
    index < questionIndex
      ? question
      : {
        ...question,
        qIndex: question.qIndex - 1
      }
  );
  updatedQuestions.splice(questionIndex, 1);
  const byId = updatedQuestions.reduce(
    (total, question) => ({
      ...total,
      [question.id]: question
    }),
    {}
  );

  state.byId = { ...byId };
  state.updated = true;
};

// update question by id
const updateQuestion = (state, { payload }) => {
  let newPayload = payload;

  const { updated = true } = newPayload;

  delete newPayload.updated;

  const prevGroupPossibleResponsesState = get(state.byId[payload.id], "groupPossibleResponses");
  const groupPossibleResponses = get(payload, "groupPossibleResponses");

  if (groupPossibleResponses === true && groupPossibleResponses !== prevGroupPossibleResponsesState) {
    // toggle group response on - update first group responses with possible responses
    newPayload = produce(payload, draft => {
      !draft.possibleResponseGroups[0]
        ? (draft.possibleResponseGroups = [{ title: "Group 1", responses: draft.possibleResponses }])
        : (draft.possibleResponseGroups[0].responses = draft.possibleResponses);
    });
  } else if (groupPossibleResponses === false && groupPossibleResponses !== prevGroupPossibleResponsesState) {
    // toggle group response off - put back updated first group responses
    newPayload = produce(payload, draft => {
      draft.possibleResponses = (draft.possibleResponseGroups[0] && draft.possibleResponseGroups[0].responses) || [];
    });
  }

  state.byId[payload.id] = newPayload;
  state.updated = updated;
};

const changeItem = (state, { payload }) => {
  const newItem = _cloneDeep(state.byId[state.current]);
  newItem[payload.prop] = payload.value;
  state.byId[state.current] = newItem;
};

const changeUIStyle = (state, { payload }) => {
  const newItem = _cloneDeep(state.byId[state.current]);

  if (!newItem.uiStyle) {
    newItem.uiStyle = {};
  }

  newItem.uiStyle[payload.prop] = payload.value;
  state.byId[state.current] = newItem;
};

const setFirstMount = (state, { id }) => {
  state.byId[id].firstMount = false;
};

// add a new question
const addQuestion = (state, { payload }) => {
  const { updated = true } = payload;

  delete payload.updated;

  state.byId[payload.id] = payload;
  state.current = payload.id;
  state.updated = updated;

  // sort the question indices in docBsed
  if (payload.isDocBased) {
    const qids = Object.values(state.byId)
      .sort((a, b) => a.qIndex - b.qIndex)
      .map(obj => obj.id);
    qids.forEach((id, i) => {
      state.byId[id].qIndex = i + 1;
    });
  }
};

// change current question
const changeCurrent = (state, { payload }) => {
  state.current = payload;
};

// add alignment to question
const addAlignment = (state, { payload }) => {
  const currentQuestion = state.byId[state.current];

  if (!currentQuestion.alignment || currentQuestion.alignment.length === 0) {
    state.byId[currentQuestion.id].alignment = [payload];
    return;
  }

  let existing = false;

  for (const alignment of currentQuestion.alignment) {
    if (alignment.curriculumId === payload.curriculumId) {
      existing = true;
      const domainGrouped = _groupBy(payload.domain, "id");
      for (const domain of alignment.domains) {
        if (domainGrouped[domain.id]) {
          const selected = domainGrouped[domain.id];
          domain.standards = _intersection(domain.standards, selected.standards, "id");
        }
      }
    }
  }

  if (!existing) {
    currentQuestion.alignment.push(payload);
  }
};

const removeAlignment = (state, { payload }) => {
  const currentQuestion = state.byId[state.current];
  currentQuestion.alignment = currentQuestion.alignment.filter(item => item.curriculumId !== payload);
};

export const SET_ITEM_DETAIL_ITEM_LEVEL_SCORING = "[itemDetail] set item level scoring";
export const SET_QUESTION_SCORE = "[author questions] set question score";
export const setQuestionScoreAction = createAction(SET_QUESTION_SCORE);
const module = "authorQuestions";

// reducer
export default createReducer(initialState, {
  [LOAD_QUESTIONS]: loadQuestions,
  [ADD_ITEMS_QUESTION]: addQuestions,
  [UPDATE_QUESTION]: updateQuestion,
  [CHANGE_ITEM]: changeItem,
  [CHANGE_ITEM_UI_STYLE]: changeUIStyle,
  [ADD_QUESTION]: addQuestion,
  [SET_FIRST_MOUNT]: setFirstMount,
  [CHANGE_CURRENT_QUESTION]: changeCurrent,
  [ADD_ALIGNMENT]: addAlignment,
  [REMOVE_ALIGNMENT]: removeAlignment,
  [DELETE_QUESTION]: deleteQuestion,
  [CHANGE_UPDATE_FLAG]: (state, { payload }) => {
    state.updated = payload;
  },
  [UPDATE_TEST_DOC_BASED_REQUEST]: state => {
    state.updated = false;
  },
  [SET_QUESTION_SCORE]: (state, { payload }) => {
    const { qid, score } = payload;
    if (!(score > 0)) {
      return state;
    }
    set(state.byId[qid], "validation.validResponse.score", score);
  },
  [SET_ITEM_DETAIL_ITEM_LEVEL_SCORING]: (state, { payload }) => {
    if (!payload) {
      for (const key of Object.keys(state.byId)) {
        const oldScore = get(state.byId[key], "validation.validResponse.score", 0);
        if (parseFloat(oldScore) === 0) {
          set(state.byId[key], "validation.validResponse.score", 1);
        }
      }
    }
  },
  [SET_RUBRIC_ID]: (state, { payload }) => {
    state.byId[state.current].rubrics = payload.metadata;
    state.byId[state.current].validation.validResponse.score = payload.maxScore;
  },
  [REMOVE_RUBRIC_ID]: state => {
    delete state.byId[state.current].rubrics;
    state.byId[state.current].validation.validResponse.score = 1;
  }
});

// selectors

export const getCurrentQuestionIdSelector = state => state[module].current;
export const getQuestionsSelector = state => state[module].byId;
export const getTestStateSelector = state => state.tests;
export const getAuthorQuestionSelector = state => state[module];

export const getTestSelector = createSelector(
  getTestStateSelector,
  state => state.entity
);

export const getQuestionsSelectorForReview = createSelector(
  getTestSelector,
  state => {
    const testItems = state.itemGroups.flatMap(itemGroup => itemGroup.items || []) || [];
    const testItemsLabeled = produce(testItems, draft => {
      markQuestionLabel(draft);
    });
    const passages = get(state, "tests.entity.passages", []);
    const questionsKeyed = testItemsLabeled.reduce((acc, item) => {
      const questions = get(item, "data.questions", []);
      const resources = get(item, "data.resources", []);
      for (const question of questions) {
        acc[question.id] = question;
      }
      for (const resource of resources) {
        acc[resource.id] = resource;
      }
      return acc;
    }, {});
    const passagesKeyed = passages.reduce((acc, passage) => {
      for (const data of passage.data) {
        acc[data.id] = { ...data, isPassage: true };
      }
      return acc;
    }, {});
    return { ...questionsKeyed, ...passagesKeyed };
  }
);

// get current Question
export const getCurrentQuestionSelector = createSelector(
  getQuestionsSelector,
  getCurrentQuestionIdSelector,
  (questions, currentId) => questions[currentId]
);

export const getQuestionsArraySelector = createSelector(
  getQuestionsSelector,
  questions => _values(questions)
);

export const getQuestionByIdSelector = (state, qId) => state[module].byId[qId] || {};

// get alignment of current question
export const getQuestionAlignmentSelector = createSelector(
  getCurrentQuestionSelector,
  question => question.alignment || []
);

// get curret updated state of author question
export const getAuthorQuestionStatus = createSelector(
  getAuthorQuestionSelector,
  state => state.updated
);
