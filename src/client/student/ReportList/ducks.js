import { createAction } from 'redux-starter-kit';
import { takeEvery, put, call, all, select } from 'redux-saga/effects';
import { reportsApi, testsApi } from '@edulastic/api';
import {
  getReportByIdSelector,
  UPDATE_TEST_ACTIVITY
} from '../ReportsModule/ducks';

// types
export const LOAD_TEST_ACTIVITY_REPORT =
  '[studentReports] load testActivity  report';

export const SET_STUDENT_ITEMS = '[studentItems] set Student items';

// actions
export const loadTestActivityReportAction = createAction(
  LOAD_TEST_ACTIVITY_REPORT
);

function* loadTestActivityReport({ payload }) {
  try {
    const { testActivityId } = payload;
    if (!testActivityId) {
      throw new Error('invalid data');
    }
    const data = yield select(getReportByIdSelector(testActivityId));
    const [test, reports] = yield all([
      call(testsApi.getById, data.testId, { data: true }),
      call(reportsApi.fetchTestActivityReport, testActivityId)
    ]);

    yield put({
      type: UPDATE_TEST_ACTIVITY,
      payload: reports
    });

    yield put({
      type: SET_STUDENT_ITEMS,
      payload: {
        data: test.testItems
      }
    });
  } catch (e) {
    console.log(e);
  }
}

// set actions watcherss
export function* watcherSaga() {
  yield all([
    yield takeEvery(LOAD_TEST_ACTIVITY_REPORT, loadTestActivityReport)
  ]);
}
