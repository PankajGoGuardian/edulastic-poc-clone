import { takeEvery, call, put, all } from 'redux-saga/effects';
import { testsApi } from '@edulastic/api';
import { NotificationManager } from 'react-notifications';

import {
  RECEIVE_TESTS_REQUEST,
  RECEIVE_TESTS_SUCCESS,
  RECEIVE_TESTS_ERROR,
  CREATE_TEST_REQUEST,
  CREATE_TEST_SUCCESS,
  CREATE_TEST_ERROR,
  RECEIVE_TEST_BY_ID_REQUEST,
  RECEIVE_TEST_BY_ID_ERROR,
  RECEIVE_TEST_BY_ID_SUCCESS,
  UPDATE_TEST_REQUEST,
  UPDATE_TEST_SUCCESS,
  UPDATE_TEST_ERROR,
} from '../constants/actions';

function* receiveTestsSaga({ payload }) {
  try {
    const entities = yield call(testsApi.getAll, payload);
    const { count } = yield call(testsApi.getCount);

    yield put({
      type: RECEIVE_TESTS_SUCCESS,
      payload: { entities, count, page: payload.page, limit: payload.limit },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Receive tests is failing';
    NotificationManager.error(errorMessage, 'Error');
    yield put({
      type: RECEIVE_TESTS_ERROR,
      payload: { error: errorMessage },
    });
  }
}

function* receiveTestByIdSaga({ payload }) {
  try {
    const entity = yield call(testsApi.getById, payload.id);

    yield put({
      type: RECEIVE_TEST_BY_ID_SUCCESS,
      payload: { entity },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Receive test by id is failing';
    NotificationManager.error(errorMessage, 'Error');
    yield put({
      type: RECEIVE_TEST_BY_ID_ERROR,
      payload: { error: errorMessage },
    });
  }
}

function* createTestSaga({ payload }) {
  try {
    const entity = yield call(testsApi.create, payload);

    yield put({
      type: CREATE_TEST_SUCCESS,
      payload: { entity },
    });
    NotificationManager.success('Success create', 'Success');
  } catch (err) {
    console.error(err);
    const errorMessage = 'Create test is failing';
    NotificationManager.error(errorMessage, 'Error');
    yield put({
      type: CREATE_TEST_ERROR,
      payload: { error: errorMessage },
    });
  }
}

function* updateTestSaga({ payload }) {
  try {
    const entity = yield call(testsApi.update, payload);

    yield put({
      type: UPDATE_TEST_SUCCESS,
      payload: { entity },
    });
    NotificationManager.success('Success update', 'Success');
  } catch (err) {
    console.error(err);
    const errorMessage = 'Update test is failing';
    NotificationManager.error(errorMessage, 'Error');
    yield put({
      type: UPDATE_TEST_ERROR,
      payload: { error: errorMessage },
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_TESTS_REQUEST, receiveTestsSaga),
    yield takeEvery(RECEIVE_TEST_BY_ID_REQUEST, receiveTestByIdSaga),
    yield takeEvery(CREATE_TEST_REQUEST, createTestSaga),
    yield takeEvery(UPDATE_TEST_REQUEST, updateTestSaga),
  ]);
}
