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

// actions types
export const LOAD_QUESTIONS = "[author questions] load questions";
export const ADD_ITEMS_QUESTION = "[author question] load question";
export const UPDATE_QUESTION = "[author questions] update questions";
export const SET_FIRST_MOUNT = "[author questions] set first mount";
export const CHANGE_ITEM = "[author questions] change item";
export const CHANGE_ITEM_UI_STYLE = "[author questions] change item ui_style";
export const ADD_QUESTION = "[author questions] add question";
export const CHANGE_CURRENT_QUESTION = "[author quesitons] change current question";
export const ADD_ALIGNMENT = "[author questions] add alignment";
export const REMOVE_ALIGNMENT = "[author questions] remove alignment";
export const DELETE_QUESTION = "[author questions] delete question by id";

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

// initialState
const initialState = {
  byId: {},
  current: ""
};

// load questions to the store.
const loadQuestions = (state, { payload }) => {
  state.byId = payload;
};

const addQuestions = (state, { payload }) => {
  state.byId = { ...state.byId, ...payload };
};

const deleteQuestion = (state, { payload }) => {
  const newState = _cloneDeep(state);

  const questions = sortBy(_values(newState.byId), ["qIndex"]);
  const questionIndex = questions.findIndex(q => q.id === payload);

  const updatedQuestions = questions.map((question, index) =>
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
};

// update question by id
const updateQuestion = (state, { payload }) => {
  state.byId[payload.id] = payload;
};

const changeItem = (state, { payload }) => {
  const newItem = _cloneDeep(state.byId[state.current]);
  newItem[payload.prop] = payload.value;
  state.byId[state.current] = newItem;
};

const changeUIStyle = (state, { payload }) => {
  const newItem = _cloneDeep(state.byId[state.current]);

  if (!newItem.ui_style) {
    newItem.ui_style = {};
  }

  newItem.ui_style[payload.prop] = payload.value;
  state.byId[state.current] = newItem;
};

const setFirstMount = (state, { id }) => {
  state.byId[id].firstMount = false;
};

// add a new question
const addQuestion = (state, { payload }) => {
  state.byId[payload.id] = payload;
  state.current = payload.id;
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
  [SET_QUESTION_SCORE]: (state, { payload }) => {
    const { qid, score } = payload;
    set(state.byId[qid], "validation.valid_response.score", score);
  },
  [SET_ITEM_DETAIL_ITEM_LEVEL_SCORING]: (state, { payload }) => {
    if (!payload) {
      for (const key of Object.keys(state.byId)) {
        const oldScore = get(state.byId, "validation.valid_response.score", 0);
        if (oldScore === 0) {
          set(state.byId[key], "validation.valid_response.score", 1);
        }
      }
    }
  }
});

// selectors

export const getCurrentQuestionIdSelector = state => state[module].current;
export const getQuestionsSelector = state => state[module].byId;

export const getQuestionsSelectorForReview = state => {
  const testItems = get(state, "tests.entity.testItems", []);
  return testItems.reduce((acc, item) => {
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
};

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
