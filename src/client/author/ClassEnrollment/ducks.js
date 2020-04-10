import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { enrollmentApi } from "@edulastic/api";
import { message } from "antd";

const RECEIVE_CLASSENROLLMENT_LIST_REQUEST = "[class enrollment] receive list request";
const RECEIVE_CLASSENROLLMENT_LIST_SUCCESS = "[class enrollment] receive list success";
const RECEIVE_CLASSENROLLMENT_LIST_ERROR = "[class enrollment] receive list error";
const REQ_ENROL_EXISTING_USER_TO_CLASS = "[class enrollment] request enrol existing user to class";

const SET_PAGE_NO = "[class enrollment] set page number";

export const receiveClassEnrollmentListAction = createAction(RECEIVE_CLASSENROLLMENT_LIST_REQUEST);
export const receiveClassEnrollmentListSuccessAction = createAction(RECEIVE_CLASSENROLLMENT_LIST_SUCCESS);
export const receiveClassEnrollmentListErrorAction = createAction(RECEIVE_CLASSENROLLMENT_LIST_ERROR);
export const requestEnrolExistingUserToClassAction = createAction(REQ_ENROL_EXISTING_USER_TO_CLASS);

export const setPageNoAction = createAction(SET_PAGE_NO);

const classEnrollmentSelector = state => state.classEnrollmentReducer;
export const getClassEnrollmentUsersSelector = createSelector(
  classEnrollmentSelector,
  state => state.data
);
export const getClassEnrollmentUsersCountSelector = createSelector(
  classEnrollmentSelector,
  state => state.totalUsers
);
// reducers
const initialState = {
  data: [],
  totalUsers: 0,
  error: null,
  loading: false,
  updating: false,
  creating: false,
  deleting: false
};

export const reducer = createReducer(initialState, {
  [RECEIVE_CLASSENROLLMENT_LIST_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_CLASSENROLLMENT_LIST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.data = payload.activeUsers;
    state.totalUsers = payload.total;
  },
  [RECEIVE_CLASSENROLLMENT_LIST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// sagas
function* receiveClassEnrollmentListSaga({ payload }) {
  try {
    const data = yield call(enrollmentApi.fetchClassEnrollmentUsers, payload);
    const { total, result } = data;
    const activeUsers = result.filter(o => o.status === "1" || o.status == 1);
    yield put(receiveClassEnrollmentListSuccessAction({ activeUsers, total }));
  } catch (err) {
    const errorMessage = "Receive Enrollment Classes is failing!";
    yield call(message.error, errorMessage);
    yield put(receiveClassEnrollmentListErrorAction({ error: errorMessage }));
  }
}

function* enrolExistingUserToClass({ payload }) {
  try {
    const { classCode, districtId, studentIds, type, name } = payload;
    const res = yield call(enrollmentApi.SearchAddEnrolMultiStudents, { classCode, districtId, studentIds });
    if (res)
      yield call(message.success, `Students enrolled to ${type === "class" ? "class" : "group"} ${name} successfully`);
  } catch (error) {
    yield call(message.error, "Add user failed");
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_CLASSENROLLMENT_LIST_REQUEST, receiveClassEnrollmentListSaga),
    yield takeEvery(REQ_ENROL_EXISTING_USER_TO_CLASS, enrolExistingUserToClass)
  ]);
}
