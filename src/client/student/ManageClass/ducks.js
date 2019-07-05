import { createAction, createReducer } from "redux-starter-kit";
import { takeEvery, call, put } from "redux-saga/effects";
import { enrollmentApi } from "@edulastic/api";

export const GET_ENROLL_CLASSES_REQUEST = "[auth] load enroll classes request";
export const GET_ENROLL_CLASSES_SUCCESS = "[auth] load enroll classes request success";
export const GET_ENROLL_CLASSES_FAIL = "[auth] load enroll classes request fail";

export const getEnrollClassAction = createAction(GET_ENROLL_CLASSES_REQUEST);
export const getEnrollClassActionSuccess = createAction(GET_ENROLL_CLASSES_SUCCESS);
export const getEnrollClassActionFail = createAction(GET_ENROLL_CLASSES_FAIL);

const initialState = {
  enrollClasslist: [],
  loading: true
};
const setEnrollClassListSuccess = (state, { payload }) => {
  state.enrollClasslist = payload;
  state.loading = false;
};

const setEnrollClassListFail = (state, { payload }) => {
  state.enrollClasslist = [];
  state.loading = false;
};

export const reducer = createReducer(initialState, {
  [GET_ENROLL_CLASSES_SUCCESS]: setEnrollClassListSuccess,
  [GET_ENROLL_CLASSES_FAIL]: setEnrollClassListFail
});

function* getEnrollClass() {
  try {
    const res = yield call(enrollmentApi.fetchStudentEnrollClass);
    const { result } = res.data;
    yield put(getEnrollClassActionSuccess(result));
  } catch (e) {
    yield put(getEnrollClassActionFail());
  }
}

export function* watcherSaga() {
  yield takeEvery(GET_ENROLL_CLASSES_REQUEST, getEnrollClass);
}
