import { testItemsApi, testActivityApi, testsApi } from '@edulastic/api';
import { takeEvery, call, all, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import {
  LOAD_TEST,
  LOAD_TEST_ITEMS,
  SET_TEST_ID,
  FINISH_TEST,
  LOAD_PREVIOUS_RESPONSES,
  LOAD_ANSWERS,
  SET_TEST_ACTIVITY_ID,
  GOTO_ITEM
} from '../constants/actions';
import { SET_RESUME_STATUS } from '../../student/Assignments/ducks';

function* loadTest({ payload }) {
  try {
    let { testActivityId, testId } = payload;
    yield put({
      type: SET_TEST_ID,
      payload: {
        testId: testId
      }
    });

    // if testActivityId is passed, need to load previous responses as well!
    let getTestActivity = testActivityId
      ? call(testActivityApi.getById, testActivityId)
      : false;
    const [test, testActivity] = yield all([
      call(testsApi.getById, testId, {
        validation: true,
        data: true
      }),
      getTestActivity
    ]);

    yield put({
      type: LOAD_TEST_ITEMS,
      payload: {
        items: test.testItems
      }
    });

    // if testActivity is present.
    if (testActivity) {
      let allAnswers = {};

      yield put({
        type: SET_TEST_ACTIVITY_ID,
        payload: { testActivityId }
      });

      let { testItemActivities } = testActivity;
      let currentTestItem = testItemActivities[0];

      testItemActivities.forEach(item => {
        allAnswers = {
          ...allAnswers,
          ...item.answers
        };

        currentTestItem =
          item.updatedAt > currentTestItem.updatedAt ? item : currentTestItem;
      });

      // get currentItem index;
      let lastAttendedQuestion = 0;
      test.testItems.forEach((item, index) => {
        if (item._id === currentTestItem.testItemId) {
          lastAttendedQuestion = index;
        }
      });

      // load previous responses
      yield put({
        type: LOAD_ANSWERS,
        payload: allAnswers
      });

      // only load from previous attempted if resuming from assignments page
      let loadFromLast = yield select(state => state.test && state.test.resume);

      // move to last attended question
      if (loadFromLast) {
        yield put(push(`${lastAttendedQuestion}`));
        yield put({
          type: SET_RESUME_STATUS,
          payload: false
        });
      }
    }
  } catch (err) {
    console.error(err);
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
    yield takeEvery(FINISH_TEST, submitTest),
    yield takeEvery(LOAD_PREVIOUS_RESPONSES, loadPreviousResponses)
  ]);
}
