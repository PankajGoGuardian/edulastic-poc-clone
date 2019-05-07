import { createAction, createReducer } from "redux-starter-kit";
import { all, takeEvery, call, put } from "redux-saga/effects";
import { message } from "antd";
import { googleApi, groupApi } from "@edulastic/api";

import { fetchGroupsAction } from "../sharedDucks/groups";

// action types
export const FETCH_CLASS_LIST = "[manageClass] fetch google class";
export const SET_GOOGLE_COURSE_LIST = "[manageClass] set google classes";
export const SET_MODAL = "[manageClass] set modal";
export const SYNC_CLASS = "[manageClass] sync selected google classes";

export const CREATE_CLASS_REQUEST = "[manageClass] create a class request";
export const CREATE_CLASS_SUCCESS = "[manageClass] create a class success";
export const CREATE_CLASS_FAILED = "[manageClass] creat a class failed";

// action creators
export const fetchClassListAction = createAction(FETCH_CLASS_LIST);
export const setGoogleCourseListAction = createAction(SET_GOOGLE_COURSE_LIST);
export const setModalAction = createAction(SET_MODAL);
export const syncClassAction = createAction(SYNC_CLASS);

export const createClassAction = createAction(CREATE_CLASS_REQUEST);
export const createClassFailedAction = createAction(CREATE_CLASS_FAILED);
export const createClassSuccessAction = createAction(CREATE_CLASS_SUCCESS);

// initial State
const initialState = {
  googleCourseList: [],
  showModal: false,
  creating: false,
  error: null,
  entity: {}
};

// reducers
const setGoogleCourseList = (state, { payload }) => {
  state.googleCourseList = payload;
  state.showModal = true;
};

// toggle modal
const setModal = (state, { payload }) => {
  state.showModal = payload;
};

const createClass = state => {
  state.creating = true;
};

const createClassSuccess = (state, { payload }) => {
  state.creating = false;
  state.entity = payload;
};

const createClassFailed = (state, { payload }) => {
  state.creating = false;
  state.error = payload.error;
};

// main reducer
export default createReducer(initialState, {
  [SET_GOOGLE_COURSE_LIST]: setGoogleCourseList,
  [SET_MODAL]: setModal,
  [CREATE_CLASS_REQUEST]: createClass,
  [CREATE_CLASS_SUCCESS]: createClassSuccess,
  [CREATE_CLASS_FAILED]: createClassFailed
});

// sagas boi
function* fetchClassList({ payload }) {
  try {
    const { code } = payload;
    const result = yield call(googleApi.getCourseList, { code });
    yield put(setGoogleCourseListAction(result.courseDetails));
  } catch (e) {
    const errorMessage = "fetching classlist failed";
    yield call(message.error, errorMessage);
    console.log(e);
  }
}

function* receiveCreateClassRequest({ payload }) {
  try {
    const result = yield call(groupApi.createGroup, payload);
    const successMessage = "Create Class is successed!";
    yield call(message.success, successMessage);
    yield put(createClassSuccessAction(result));
  } catch (error) {
    const errorMessage = "creating a class failed";
    yield call(message.error, errorMessage);
    yield put(createClassFailedAction(error));
  }
}

// sync google class
function* syncClass({ payload }) {
  try {
    yield call(googleApi.syncClass, { codes: payload });
    yield put(setModalAction(false));
    yield put(fetchGroupsAction());
  } catch (e) {
    yield call(message.error, "class sync failed");
    console.log(e);
  }
}
// watcher saga
export function* watcherSaga() {
  yield all([
    yield takeEvery(FETCH_CLASS_LIST, fetchClassList),
    yield takeEvery(SYNC_CLASS, syncClass),
    yield takeEvery(CREATE_CLASS_REQUEST, receiveCreateClassRequest)
  ]);
}
