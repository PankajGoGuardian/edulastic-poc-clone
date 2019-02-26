import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { values as _values } from "lodash";

// actions types
export const LOAD_QUESTIONS = "[author questions] load questions";
export const UPDATE_QUESTION = "[author questions] update questions";
export const ADD_QUESTION = "[author questions] add question";
export const CHANGE_CURRENT_QUESTION = "[author quesitons] change current question";

// actions creators
export const loadQuestionsAction = createAction(LOAD_QUESTIONS);
export const addQuestionAction = createAction(ADD_QUESTION);
export const updateQuestionAction = createAction(UPDATE_QUESTION);
export const changeCurrentQuestionAction = createAction(CHANGE_CURRENT_QUESTION);

// initialState
const initialState = {
  byId: {},
  current: ""
};

// load questions to the store.
const loadQuestions = (state, { payload }) => {
  state.byId = payload;
};

// update question by id
const updateQuestion = (state, { payload }) => {
  state.byId[payload.id] = payload;
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

// reducer
export default createReducer(initialState, {
  [LOAD_QUESTIONS]: loadQuestions,
  [UPDATE_QUESTION]: updateQuestion,
  [ADD_QUESTION]: addQuestion,
  [CHANGE_CURRENT_QUESTION]: changeCurrent
});

// selectors
const module = "authorQuestions";

export const getCurrentQuestionIdSelector = state => state[module].current;
export const getQuestionsSelector = state => state[module].byId;

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
