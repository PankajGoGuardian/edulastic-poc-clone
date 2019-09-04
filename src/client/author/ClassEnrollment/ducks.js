import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, takeLatest, call, put, all, select } from "redux-saga/effects";
import { enrollmentApi } from "@edulastic/api";
import { message } from "antd";
import { keyBy } from "lodash";

const RECEIVE_CLASSENROLLMENT_LIST_REQUEST = "[class enrollment] receive list request";
const RECEIVE_CLASSENROLLMENT_LIST_SUCCESS = "[class enrollment] receive list success";
const RECEIVE_CLASSENROLLMENT_LIST_ERROR = "[class enrollment] receive list error";

const SET_PAGE_NO = "[class enrollment] set page number";

export const receiveClassEnrollmentListAction = createAction(RECEIVE_CLASSENROLLMENT_LIST_REQUEST);
export const receiveClassEnrollmentListSuccessAction = createAction(RECEIVE_CLASSENROLLMENT_LIST_SUCCESS);
export const receiveClassEnrollmentListErrorAction = createAction(RECEIVE_CLASSENROLLMENT_LIST_ERROR);

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

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_CLASSENROLLMENT_LIST_REQUEST, receiveClassEnrollmentListSaga)]);
}
