import { assignmentApi } from '@edulastic/api';
import { takeEvery, call, all, put } from 'redux-saga/effects';

import { LOAD_STUDENT_ASSIGNMENTS, SET_STUDENT_ASSIGNMENTS } from '../constants/actions';

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

export default function* watcherSaga() {
  yield all([yield takeEvery(LOAD_STUDENT_ASSIGNMENTS, loadAssignments)]);
}
