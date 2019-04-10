import { takeEvery, call, put, all } from "redux-saga/effects";
import { termApi } from "@edulastic/api";
import { message } from "antd";

import {
  RECEIVE_TERM_REQUEST,
  RECEIVE_TERM_SUCCESS,
  RECEIVE_TERM_ERROR,
  UPDATE_TERM_REQUEST,
  UPDATE_TERM_SUCCESS,
  UPDATE_TERM_ERROR,
  CREATE_TERM_REQUEST,
  CREATE_TERM_SUCCESS,
  CREATE_TERM_ERROR
} from "../src/constants/actions";

function* receiveTermSaga({ payload }) {
  try {
    const term = yield call(termApi.getTerm, payload);
    yield put({
      type: RECEIVE_TERM_SUCCESS,
      payload: term
    });
  } catch (err) {
    const errorMessage = "Receive Term is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_TERM_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* createTermSaga({ payload }) {
  try {
    const createTerm = yield call(termApi.createTerm, { body: payload.body });
    const key = payload.key;
    const successMessage = "Term Created Successfully!";
    yield call(message.success, successMessage);
    yield put({
      type: CREATE_TERM_SUCCESS,
      payload: { data: createTerm, key: key }
    });
  } catch (err) {
    const errorMessage = "Create Term is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: CREATE_TERM_ERROR,
      payload: { createError: errorMessage }
    });
  }
}

function* updateTermSaga({ payload }) {
  try {
    const updateTerm = yield call(termApi.updateTerm, payload);
    const successMessage = "Term Saved Successfully!";
    yield call(message.success, successMessage);
    yield put({
      type: UPDATE_TERM_SUCCESS,
      payload: updateTerm
    });
  } catch (err) {
    const errorMessage = "Update Term is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: UPDATE_TERM_ERROR,
      payload: { updateError: errorMessage }
    });
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_TERM_REQUEST, receiveTermSaga)]);
  yield all([yield takeEvery(CREATE_TERM_REQUEST, createTermSaga)]);
  yield all([yield takeEvery(UPDATE_TERM_REQUEST, updateTermSaga)]);
}
