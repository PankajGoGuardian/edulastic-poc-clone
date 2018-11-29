import { testItemsApi, testActivityApi, testsApi } from '@edulastic/api';
import { takeEvery, call, all, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import {
  LOAD_TEST,
  LOAD_TEST_ITEMS,
  INIT_TEST_ACTIVITY,
  SET_TEST_ACTIVITY_ID,
  SET_TEST_ID,
  FINISH_TEST,
  LOAD_PREVIOUS_RESPONSES,
  LOAD_ANSWERS
} from '../constants/actions';

function* loadTest({ payload }) {
  try {
    let items;
    // if all fetch all testItems else fetch only particular test
    if (!payload.test) {
      items = yield call(testItemsApi.getAll, {
        validation: true,
        data: true
      });
    } else {
      yield put({
        type: SET_TEST_ID,
        payload: {
          testId: payload.testId
        }
      });
      const result = yield call(testsApi.getById, payload.testId, {
        validation: true,
        data: true
      });
      items = result.testItems;
    }

    yield put({
      type: LOAD_TEST_ITEMS,
      payload: {
        items
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// create/load a testActivity and load it to store(test).
function* initiateTestActivity({ payload }) {
  try {
    const { testId } = payload;
    // test without testId can now have a place holder
    let testActivityId = 'test';
    if (testId !== 'test') {
      const result = yield testActivityApi.create({
        testId
      });

      // eslint-disable-next-line prefer-destructuring
      testActivityId = result.testActivityId;
    }

    yield put({
      type: SET_TEST_ACTIVITY_ID,
      payload: {
        testActivityId
      }
    });

    yield put({
      type: LOAD_PREVIOUS_RESPONSES
    });
  } catch (err) {
    console.log(err);
  }
}

// load users previous responses for a particular test
function* loadPreviousResponses() {
  try {
    const testActivityId = yield select(
      state => state.test && state.test.testActivityId
    );
    const answers = yield testActivityApi.previousResponses(testActivityId);
    yield put({
      type: LOAD_ANSWERS,
      payload: { ...answers }
    });
  } catch (err) {
    console.log(err);
  }
}

function* submitTest() {
  try {
    const testActivityId = yield select(
      state => state.test && state.test.testActivityId
    );
    if (testActivityId === 'test') {
      console.log('practice test');
      return;
    }
    yield testActivityApi.submit(testActivityId);
    yield put(push('/home/reports'));
  } catch (err) {
    console.log(err);
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(LOAD_TEST, loadTest),
    yield takeEvery(INIT_TEST_ACTIVITY, initiateTestActivity),
    yield takeEvery(FINISH_TEST, submitTest),
    yield takeEvery(LOAD_PREVIOUS_RESPONSES, loadPreviousResponses)
  ]);
}
