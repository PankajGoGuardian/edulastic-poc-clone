import { takeEvery, call, put, all } from 'redux-saga/effects';
import { testsApi } from '@edulastic/api';
import { message } from 'antd';

import {
  CREATE_TEST_REQUEST,
  CREATE_TEST_SUCCESS,
  CREATE_TEST_ERROR,
  RECEIVE_TEST_BY_ID_REQUEST,
  RECEIVE_TEST_BY_ID_ERROR,
  RECEIVE_TEST_BY_ID_SUCCESS,
  UPDATE_TEST_REQUEST,
  UPDATE_TEST_SUCCESS,
  UPDATE_TEST_ERROR
} from '../constants/actions';

function* receiveTestByIdSaga({ payload }) {
  try {
    const entity = yield call(testsApi.getById, payload.id, { data: true });

    yield put({
      type: RECEIVE_TEST_BY_ID_SUCCESS,
      payload: { entity }
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Receive test by id is failing';
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_TEST_BY_ID_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* createTestSaga({ payload }) {
  try {
    const entity = yield call(testsApi.create, payload.data);

    yield put({
      type: CREATE_TEST_SUCCESS,
      payload: { entity }
    });
    yield call(message.success, 'Success create');
  } catch (err) {
    console.error(err);
    const errorMessage = 'Create test is failing';
    yield call(message.error, errorMessage);
    yield put({
      type: CREATE_TEST_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* updateTestSaga({ payload }) {
  try {
    // remove createdDate and updatedDate
    delete payload.data.updatedDate;
    delete payload.data.createdDate;

    const entity = yield call(testsApi.update, payload);

    yield put({
      type: UPDATE_TEST_SUCCESS,
      payload: { entity }
    });
    yield call(message.success, 'Success update');
  } catch (err) {
    console.error(err);
    const errorMessage = 'Update test is failing';
    yield call(message.error, errorMessage);
    yield put({
      type: UPDATE_TEST_ERROR,
      payload: { error: errorMessage }
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_TEST_BY_ID_REQUEST, receiveTestByIdSaga),
    yield takeEvery(CREATE_TEST_REQUEST, createTestSaga),
    yield takeEvery(UPDATE_TEST_REQUEST, updateTestSaga)
  ]);
}
