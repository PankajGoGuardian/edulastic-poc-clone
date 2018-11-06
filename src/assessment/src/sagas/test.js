import { testItemsApi, testActivityApi, testsApi } from '@edulastic/api';
import { takeEvery, call, all, put, select } from 'redux-saga/effects';

import {
  LOAD_TEST,
  LOAD_TEST_ITEMS,
  INIT_TEST_ACTIVITY,
  SET_TEST_ACTIVITY_ID,
  SET_TEST_ID,
  FINISH_TEST,
} from '../constants/actions';

function* loadTest({ payload }) {
  try {
    let items;
    // if all fetch all testItems else fetch only particular test
    if (!payload.test) {
      items = yield call(testItemsApi.getAll, {
        validation: true,
        data: true,
      });
    } else {
      yield put({
        type: SET_TEST_ID,
        payload: {
          testId: payload.testId,
        },
      });
      const result = yield call(testsApi.getById, payload.testId, {
        validation: true,
        data: true,
      });
      items = result.testItems;
    }

    yield put({
      type: LOAD_TEST_ITEMS,
      payload: {
        items,
      },
    });
  } catch (err) {
    console.error(err);
  }
}

// create/load a testActivity and load it to store(test).
function* initiateTestActivity() {
  try {
    // const result = yield testActivityApi.create({
    //   userId: 'testUser',
    //   testId: 'test',
    // });
    yield put({
      type: SET_TEST_ACTIVITY_ID,
      payload: {
        testActivityId: '5bdbdad7af1f8b599b41d26c', // result.id,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

function* submitTest() {
  try {
    const testActivityId = yield select(state => state.test && state.test.testActivityId);
    console.log('submitting test');
    yield testActivityApi.submit(testActivityId);
  } catch (err) {
    console.log(err);
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(LOAD_TEST, loadTest),
    yield takeEvery(INIT_TEST_ACTIVITY, initiateTestActivity),
    yield takeEvery(INIT_TEST_ACTIVITY, initiateTestActivity),
    yield takeEvery(FINISH_TEST, submitTest),
  ]);
}
