import { createAction, createReducer } from "redux-starter-kit";
import { takeEvery, call, put } from "redux-saga/effects";
import { enrollmentApi } from "@edulastic/api";

export const GET_ENROLL_CLASSES_REQUEST = "[auth] load enroll classes request";
export const GET_ENROLL_CLASSES_SUCCESS = "[auth] load enroll classes request success";
export const GET_ENROLL_CLASSES_FAIL = "[auth] load enroll classes request fail";

export const SET_FILTER_CLASS = "[manage class] set active class";

export const getEnrollClassAction = createAction(GET_ENROLL_CLASSES_REQUEST);
export const getEnrollClassActionSuccess = createAction(GET_ENROLL_CLASSES_SUCCESS);
export const getEnrollClassActionFail = createAction(GET_ENROLL_CLASSES_FAIL);

export const setFilterClassAction = createAction(SET_FILTER_CLASS);

const initialState = {
  allClasses: [],
  filteredClasses: [],
  loading: true
};
const setEnrollClassListSuccess = (state, { payload }) => {
  state.allClasses = payload;
  state.loading = false;
};

const setEnrollClassListFail = (state, { payload }) => {
  state.allClasses = [];
  state.loading = false;
};

const setFilterClass = (state, { payload }) => {
  state.filteredClasses = payload;
};

export const reducer = createReducer(initialState, {
  [GET_ENROLL_CLASSES_SUCCESS]: setEnrollClassListSuccess,
  [GET_ENROLL_CLASSES_FAIL]: setEnrollClassListFail,
  [SET_FILTER_CLASS]: setFilterClass
});

function* getEnrollClass() {
  try {
    const res = yield call(enrollmentApi.fetchStudentEnrollClass);
    const { result } = res.data;
    const activeClasses = result.filter(c => c.active === 1);
    yield put(setFilterClassAction(activeClasses));
    yield put(getEnrollClassActionSuccess(result));
  } catch (e) {
    yield put(getEnrollClassActionFail());
  }
}

export function* watcherSaga() {
  yield takeEvery(GET_ENROLL_CLASSES_REQUEST, getEnrollClass);
}
