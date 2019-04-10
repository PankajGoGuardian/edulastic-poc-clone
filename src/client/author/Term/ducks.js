import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { settingsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const CREATE_TERM_REQUEST = "[term] create data request";
const CREATE_TERM_SUCCESS = "[term] create data success";
const CREATE_TERM_ERROR = "[term] create data error";
const RECEIVE_TERM_REQUEST = "[term] receive data request";
const RECEIVE_TERM_SUCCESS = "[term] receive data success";
const RECEIVE_TERM_ERROR = "[term] receive data error";
const UPDATE_TERM_REQUEST = "[term] update data request";
const UPDATE_TERM_SUCCESS = "[term] update data success";
const UPDATE_TERM_ERROR = "[term] update data error";
const DELETE_TERM_REQUEST = "[term] delete data request";
const DELETE_TERM_SUCCESS = "[term] delete data success";
const DELETE_TERM_ERROR = "[term] delete data ERROR";

export const createTermAction = createAction(CREATE_TERM_REQUEST);
export const createTermSuccessAction = createAction(CREATE_TERM_SUCCESS);
export const createTermErrorAction = createAction(CREATE_TERM_ERROR);
export const receiveTermAction = createAction(RECEIVE_TERM_REQUEST);
export const receiveTermSuccessAction = createAction(RECEIVE_TERM_SUCCESS);
export const receiveTermErrorAction = createAction(RECEIVE_TERM_ERROR);
export const updateTermAction = createAction(UPDATE_TERM_REQUEST);
export const updateTermSuccessAction = createAction(UPDATE_TERM_SUCCESS);
export const updateTermErrorAction = createAction(UPDATE_TERM_ERROR);
export const deleteTermAction = createAction(DELETE_TERM_REQUEST);
export const deleteTermSuccessAction = createAction(DELETE_TERM_SUCCESS);
export const deleteTermErrorAction = createAction(DELETE_TERM_ERROR);

// selectors
const stateTermSelector = state => state.termReducer;
export const getTermSelector = createSelector(
  stateTermSelector,
  state => state.data
);

export const getTermLoadingSelector = createSelector(
  stateTermSelector,
  state => state.loading
);

export const getTermUpdatingSelector = createSelector(
  stateTermSelector,
  state => state.updating
);

export const getCreatedTermSelector = createSelector(
  stateTermSelector,
  state => ({ data: state.create })
);

export const getTermCreatingSelector = createSelector(
  stateTermSelector,
  state => state.creating
);

export const getDeletedTermSelector = createSelector(
  stateTermSelector,
  state => state.delete
);

// reducers
const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  update: null,
  updateError: null,
  creating: false,
  create: { data: {}, key: -1 },
  createError: null,
  deleting: false,
  deleteError: null
};

const createTermRequest = state => ({
  ...state,
  creating: true
});

const createTermSuccess = (state, { payload }) => ({
  ...state,
  creating: false,
  create: payload,
  data: [payload.data].concat(state.data)
});

const createTermError = (state, { payload }) => ({
  ...state,
  creating: false,
  createError: payload.error
});

const receiveTermRequest = state => ({
  ...state,
  loading: true
});

const receiveTermSuccess = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

const receiveTermError = (state, { payload }) => ({
  ...state,
  loading: false,
  error: payload.error
});

const updateTermRequest = state => ({
  ...state,
  updating: true
});

const updateTermSuccess = (state, { payload }) => {
  const termData = state.data.map(term => {
    if (term._id === payload._id) {
      return { ...term, ...payload };
    }
    return term;
  });

  return {
    ...state,
    update: payload,
    data: termData,
    updating: false
  };
};

const updateTermError = (state, { payload }) => ({
  ...state,
  updating: false,
  updateError: payload.error
});

const deleteTermRequest = state => ({
  ...state,
  deleting: true
});

const deleteTermSuccess = (state, { payload }) => ({
  ...state,
  deleting: false,
  data: state.data.filter(term => term._id !== payload)
});

const deleteTermError = (state, { payload }) => ({
  ...state,
  deleting: false,
  deleteError: payload.error
});

export const reducer = createReducer(initialState, {
  [CREATE_TERM_REQUEST]: createTermRequest,
  [CREATE_TERM_SUCCESS]: createTermSuccess,
  [CREATE_TERM_ERROR]: createTermError,
  [RECEIVE_TERM_REQUEST]: receiveTermRequest,
  [RECEIVE_TERM_SUCCESS]: receiveTermSuccess,
  [RECEIVE_TERM_ERROR]: receiveTermError,
  [UPDATE_TERM_REQUEST]: updateTermRequest,
  [UPDATE_TERM_SUCCESS]: updateTermSuccess,
  [UPDATE_TERM_ERROR]: updateTermError,
  [DELETE_TERM_REQUEST]: deleteTermRequest,
  [DELETE_TERM_SUCCESS]: deleteTermSuccess,
  [DELETE_TERM_ERROR]: deleteTermError
});

// sagas
function* receiveTermeSaga({ payload }) {
  try {
    const term = yield call(settingsApi.getTerm, payload);
    yield put(receiveTermSuccessAction(term));
  } catch (err) {
    const errorMessage = "Receive Term is failing";
    yield call(message.error, errorMessage);
    yield put(receiveTermErrorAction({ error: errorMessage }));
  }
}

function* createTermSaga({ payload }) {
  try {
    const createTerm = yield call(settingsApi.createTerm, { body: payload.body });
    const key = payload.key;
    const successMessage = "Term Created Successfully!";
    yield call(message.success, successMessage);
    yield put(createTermSuccessAction({ data: createTerm, key: key }));
  } catch (err) {
    const errorMessage = "Create Term is failing";
    yield call(message.error, errorMessage);
    yield put(createTermErrorAction({ error: errorMessage }));
  }
}

function* updateTermSaga({ payload }) {
  try {
    const updateTerm = yield call(settingsApi.updateTerm, payload);
    const successMessage = "Term Saved Successfully!";
    yield call(message.success, successMessage);
    yield put(updateTermSuccessAction(updateTerm));
  } catch (err) {
    const errorMessage = "Update Term is failing";
    yield call(message.error, errorMessage);
    yield put(updateTermErrorAction({ error: errorMessage }));
  }
}

function* deleteTermSaga({ payload }) {
  try {
    const deleteTerm = yield call(settingsApi.deleteTerm, payload);
    const successMessage = "Term Deleted Successfully!";
    yield call(message.success, successMessage);
    yield put(deleteTermSuccessAction(payload.body.termId));
  } catch (err) {
    const errorMessage = "Delete Term is failing";
    yield call(message.error, errorMessage);
    yield put(deleteTermErrorAction({ deleteError: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_TERM_REQUEST, receiveTermeSaga)]);
  yield all([yield takeEvery(CREATE_TERM_REQUEST, createTermSaga)]);
  yield all([yield takeEvery(UPDATE_TERM_REQUEST, updateTermSaga)]);
  yield all([yield takeEvery(DELETE_TERM_REQUEST, deleteTermSaga)]);
}
