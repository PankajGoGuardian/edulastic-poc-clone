import { createReducer, createAction } from "redux-starter-kit";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { testsApi } from "@edulastic/api";

const FETCH_PUBLIC_TEST = "[test] fetch publicly shared test";
const FETCH_PUBLIC_TEST_SUCCESS = "[test] success fetch publicly shared test";
const FETCH_PUBLIC_TEST_FAILURE = "[test] failed fetch publicly shared test ";

export const fetchTestAction = createAction(FETCH_PUBLIC_TEST);

const initialState = {
  loading: false
};

//reducers
export const publicTestReducer = createReducer(initialState, {
  [FETCH_PUBLIC_TEST]: state => {
    state.loading = true;
  },
  [FETCH_PUBLIC_TEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.test = payload.test;
  },
  [FETCH_PUBLIC_TEST_FAILURE]: state => {
    state.loading = false;
    state.error = true;
  }
});

// sagas
function* fetchPublicTest({ payload }) {
  const { testId, ...params } = payload;
  try {
    const test = yield call(testsApi.getPublicTest, testId, params);
    yield put({ type: FETCH_PUBLIC_TEST_SUCCESS, payload: { test } });
  } catch (err) {
    yield put({ type: FETCH_PUBLIC_TEST_FAILURE, payload: err });
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(FETCH_PUBLIC_TEST, fetchPublicTest)]);
}
