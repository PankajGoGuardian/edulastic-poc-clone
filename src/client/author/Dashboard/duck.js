import { takeEvery, call, put, all } from "redux-saga/effects";
import { dashboardApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const RECEIVE_TEACHER_DASHBOARD_REQUEST = "[dashboard teacher] receive data request";
const RECEIVE_TEACHER_DASHBOARD_SUCCESS = "[dashboard teacher] receive data success";
const RECEIVE_TEACHER_DASHBOARD_ERROR = "[dashboard teacher] receive data error";

export const receiveTeacherDashboardAction = createAction(RECEIVE_TEACHER_DASHBOARD_REQUEST);
export const receiveTeacherDashboardSuccessAction = createAction(RECEIVE_TEACHER_DASHBOARD_SUCCESS);
export const receiveTeacherDashboardErrorAction = createAction(RECEIVE_TEACHER_DASHBOARD_ERROR);

const initialState = {
  data: [],
  error: null,
  loading: false
};

export const reducer = createReducer(initialState, {
  [RECEIVE_TEACHER_DASHBOARD_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_TEACHER_DASHBOARD_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.data = payload;
  },
  [RECEIVE_TEACHER_DASHBOARD_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

function* receiveTeacherDashboardSaga() {
  try {
    const { classDetails } = yield call(dashboardApi.getTeacherDashboardDetails);
    yield put(receiveTeacherDashboardSuccessAction(classDetails));
  } catch (err) {
    const errorMessage = "Teacher dahboard request is failing";
    yield call(message.error, errorMessage);
    yield put(receiveTeacherDashboardErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_TEACHER_DASHBOARD_REQUEST, receiveTeacherDashboardSaga)]);
}
