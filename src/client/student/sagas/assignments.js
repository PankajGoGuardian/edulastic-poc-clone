import { assignmentApi, testActivityApi } from '@edulastic/api';
import { takeEvery, call, all, put } from 'redux-saga/effects';

import {
  LOAD_STUDENT_ASSIGNMENTS,
  SET_STUDENT_ASSIGNMENTS,
  INIT_TEST_ACTIVITY,
  SET_TEST_ACTIVITY_ID,
  LOAD_PREVIOUS_RESPONSES
} from '../constants/actions';

function* loadAssignments() {
  try {
    const assignments = yield call(assignmentApi.fetchAssigned);

    yield put({
      type: SET_STUDENT_ASSIGNMENTS,
      payload: {
        assignments
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// create/load a testActivity and load it to store(test).
function* initiateTestActivity({ payload }) {
  try {
    const { assignmentId } = payload;
    if (!assignmentId) return;

    const { _id } = yield testActivityApi.create({
      assignmentId
    });

    yield put({
      type: SET_TEST_ACTIVITY_ID,
      payload: {
        testActivityId: _id
      }
    });
    yield put({
      type: LOAD_PREVIOUS_RESPONSES
    });
  } catch (err) {
    console.log(err);
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(LOAD_STUDENT_ASSIGNMENTS, loadAssignments),
    yield takeEvery(INIT_TEST_ACTIVITY, initiateTestActivity)
  ]);
}
