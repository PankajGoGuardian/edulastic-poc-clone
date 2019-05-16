import { createAction, createReducer } from "redux-starter-kit";
import { all, takeEvery, call, put } from "redux-saga/effects";
import { message } from "antd";
import { get } from "lodash";
import { googleApi, groupApi, enrollmentApi } from "@edulastic/api";

import { fetchGroupsAction } from "../sharedDucks/groups";

// action types
export const FETCH_CLASS_LIST = "[manageClass] fetch google class";
export const SET_GOOGLE_COURSE_LIST = "[manageClass] set google classes";
export const SET_MODAL = "[manageClass] set modal";
export const SYNC_CLASS = "[manageClass] sync selected google classes";

export const CREATE_CLASS_REQUEST = "[manageClass] create a class request";
export const CREATE_CLASS_SUCCESS = "[manageClass] create a class success";
export const CREATE_CLASS_FAILED = "[manageClass] creat a class failed";

export const UPDATE_CLASS_REQUEST = "[manageClass] update a class request";
export const UPDATE_CLASS_SUCCESS = "[manageClass] update a class success";
export const UPDATE_CLASS_FAILED = "[manageClass] update a class failed";

export const FETCH_STUDENTS_BY_ID_REQUEST = "[manageClass] fetch students request by classId";
export const FETCH_STUDENTS_BY_ID_SUCCESS = "[manageClass] fetch studnets success by classId";
export const FETCH_STUDENTS_BY_ID_ERROR = "[manageClass] fetch students error by classId";

export const SET_CLASS = "[manageClass] set a class";

export const ADD_STUDENT_REQUEST = "[manageClass] add student to a class request";
export const ADD_STUDENT_SUCCESS = "[manageClass] add student to a class success";
export const ADD_STUDENT_FAILED = "[manageClass] add student to a class failed";

export const SELECT_STUDENTS = "[manageClass] select students";

// action creators
export const fetchClassListAction = createAction(FETCH_CLASS_LIST);
export const setGoogleCourseListAction = createAction(SET_GOOGLE_COURSE_LIST);
export const setModalAction = createAction(SET_MODAL);
export const syncClassAction = createAction(SYNC_CLASS);

export const createClassAction = createAction(CREATE_CLASS_REQUEST);
export const createClassFailedAction = createAction(CREATE_CLASS_FAILED);
export const createClassSuccessAction = createAction(CREATE_CLASS_SUCCESS);

export const updateClassAction = createAction(UPDATE_CLASS_REQUEST);
export const updateClassSuccessAction = createAction(UPDATE_CLASS_SUCCESS);
export const updateClassFailedAction = createAction(UPDATE_CLASS_FAILED);

export const fetchStudentsByIdAction = createAction(FETCH_STUDENTS_BY_ID_REQUEST);
export const fetchStudentsByIdSuccessAction = createAction(FETCH_STUDENTS_BY_ID_SUCCESS);
export const fetchStudentsByIdErrorAction = createAction(FETCH_STUDENTS_BY_ID_ERROR);

export const setClassAction = createAction(SET_CLASS);

export const addStudentRequestAction = createAction(ADD_STUDENT_REQUEST);
export const addStudentSuccessAction = createAction(ADD_STUDENT_SUCCESS);
export const addStudentFailedAction = createAction(ADD_STUDENT_FAILED);

export const selectStudentAction = createAction(SELECT_STUDENTS);

// initial State
const initialState = {
  googleCourseList: [],
  showModal: false,
  creating: false,
  updating: false,
  error: null,
  studentsList: [],
  selectedStudent: [],
  loaded: true,
  entity: {},
  submitted: false,
  added: false
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
  state.error = null;
};

const createClassSuccess = (state, { payload }) => {
  state.creating = false;
  state.entity = payload;
};

const createClassFailed = (state, { payload }) => {
  state.creating = false;
  state.error = payload;
};

const setClass = (state, { payload }) => {
  state.entity = payload;
  state.selectedStudent = [];
};

const setFetchStudents = state => {
  state.loaded = false;
  state.error = null;
};

const setStudents = (state, { payload }) => {
  state.loaded = true;
  state.studentsList = payload;
};

const errorOnFetchStudents = (state, { payload }) => {
  state.loaded = true;
  state.error = payload;
};

const updateClass = state => {
  state.updating = true;
  state.error = null;
};

const updateClassSuccess = (state, { payload }) => {
  state.updating = false;
  state.entity = payload;
};

const updateClassFailed = (state, { payload }) => {
  state.updating = false;
  state.error = payload;
};

const addStudentRequest = state => {
  state.submitted = true;
  state.added = false;
  state.error = null;
};

const addStudentSuccess = (state, { payload }) => {
  if (payload) {
    state.submitted = false;
    state.added = true;
    state.studentsList.push(payload);
  }
};

const addStudentFailed = (state, { payload }) => {
  state.error = payload;
  state.submitted = false;
  state.added = false;
};

const selectStudent = (state, { payload }) => {
  state.selectedStudent = payload;
};

// main reducer
export default createReducer(initialState, {
  [SET_GOOGLE_COURSE_LIST]: setGoogleCourseList,
  [SET_MODAL]: setModal,
  [SET_CLASS]: setClass,
  [CREATE_CLASS_REQUEST]: createClass,
  [CREATE_CLASS_SUCCESS]: createClassSuccess,
  [CREATE_CLASS_FAILED]: createClassFailed,
  [FETCH_STUDENTS_BY_ID_REQUEST]: setFetchStudents,
  [FETCH_STUDENTS_BY_ID_SUCCESS]: setStudents,
  [FETCH_STUDENTS_BY_ID_ERROR]: errorOnFetchStudents,
  [UPDATE_CLASS_REQUEST]: updateClass,
  [UPDATE_CLASS_SUCCESS]: updateClassSuccess,
  [UPDATE_CLASS_FAILED]: updateClassFailed,
  [ADD_STUDENT_REQUEST]: addStudentRequest,
  [ADD_STUDENT_SUCCESS]: addStudentSuccess,
  [ADD_STUDENT_FAILED]: addStudentFailed,
  [SELECT_STUDENTS]: selectStudent
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

function* fetchStudentsByClassId({ payload }) {
  try {
    const { classId } = payload;
    const result = yield call(enrollmentApi.fetch, classId);
    yield put(fetchStudentsByIdSuccessAction(result));
  } catch (error) {
    yield put(fetchStudentsByIdErrorAction(error));
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
    yield put(createClassFailedAction({ message: errorMessage }));
  }
}

function* receiveUpdateClass({ payload }) {
  try {
    const { params, classId } = payload;
    const result = yield call(groupApi.editGroup, { body: params, groupId: classId });
    const successMessage = "Class details updated successfully!";
    yield call(message.success, successMessage);
    yield put(updateClassSuccessAction(result));
  } catch (error) {
    yield put(updateClassFailedAction(error));
  }
}

function* receiveAddStudentRequest({ payload }) {
  try {
    const result = yield call(enrollmentApi.addStudent, payload);
    const student = get(result, "data.result");
    if (student) {
      const successMsg = "User added to class successfully.";
      yield call(message.success, successMsg);
      yield put(addStudentSuccessAction(student));
    } else {
      yield put(addStudentFailedAction("add student to class failed"));
    }
  } catch (error) {
    yield put(addStudentFailedAction(error));
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
    yield takeEvery(CREATE_CLASS_REQUEST, receiveCreateClassRequest),
    yield takeEvery(FETCH_STUDENTS_BY_ID_REQUEST, fetchStudentsByClassId),
    yield takeEvery(UPDATE_CLASS_REQUEST, receiveUpdateClass),
    yield takeEvery(ADD_STUDENT_REQUEST, receiveAddStudentRequest)
  ]);
}
