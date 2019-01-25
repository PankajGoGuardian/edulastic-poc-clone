import { createAction } from 'redux-starter-kit';
import { takeEvery, put, call, all, select } from 'redux-saga/effects';
import { reportsApi, testsApi } from '@edulastic/api';
import { setTestItemsAction } from '../sharedDucks/TestItem';
import { getReportByIdSelector } from '../sharedDucks/ReportsModule/ducks';
import { push } from 'react-router-redux';
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
    if (!data || !data.testId) {
      yield put(push('/home/reports'));
      return;
    }

    const [test, reports] = yield all([
      call(testsApi.getById, data.testId, { data: true }),
      call(reportsApi.fetchTestActivityReport, testActivityId)
    ]);

    yield put(setTestItemsAction(test.testItems));
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

//reducer

export const setCurrentItemAction = index => ({
  type: SET_CURRENT_ITEM,
  payload: {
    data: index
  }
});
