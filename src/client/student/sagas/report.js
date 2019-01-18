import { reportsApi, testsApi } from '@edulastic/api';
import { message } from 'antd';
import { takeEvery, call, all, put, select } from 'redux-saga/effects';
import { getReportSelector } from '../src/selectors/reports';
import {
  FETCH_REPORTS,
  LOAD_REPORTS,
  GET_TEST_ACTIVITY_DETAIL,
  LOAD_TEST_ACTIVITY_DETAIL,
  LOAD_TEST_REPORT,
  SET_STUDENT_ITEMS
} from '../constants/actions';

import {
  GET_SKILL_REPORT_BY_CLASSID,
  LOAD_SKILL_REPORT_BY_CLASSID } from '../components/skillReport/ducks';

function* fetchReports() {
  try {
    const reports = yield call(reportsApi.fetchReports);
    yield put({ type: LOAD_REPORTS, payload: { reports } });
  } catch (err) {
    console.error(err);
  }
}

function* fetchTestActivityDetail(action) {
  const { id } = action.payload;
  try {
    const reports = yield call(reportsApi.fetchTestActivityDetail, id);
    yield put({ type: LOAD_TEST_ACTIVITY_DETAIL, payload: { reports } });
  } catch (err) {
    console.error(err);
  }
}

function* fetchSkillReport(action) {
  const { classId } = action.payload;
  try {
    const reports = yield call(reportsApi.fetchSkillReport, classId);
    yield put({ type: LOAD_SKILL_REPORT_BY_CLASSID, payload: { reports } });
  } catch (err) {
    console.error(err);
  }
}

/*
 *
 */
function* loadTestReport({ payload }) {
  try {
    // TODO: remove local storage dependency
    const testActivityId =
      payload.testActivityId || localStorage.testActivityId;
    localStorage.testActivityId = testActivityId;
    const testActivity = yield select(getReportSelector(testActivityId));
    const { testId } = testActivity;
    const [activityItems, test] = yield [
      call(reportsApi.fetchTestActivityReport, testActivityId),
      call(testsApi.getById, testId, { data: true })
    ];
    const { testItems } = test;
    if (!testItems) throw new Error();

    // load items
    yield put({
      type: SET_STUDENT_ITEMS,
      payload: {
        data: testItems
      }
    });
  } catch (err) {
    // TODO: add error notification
    console.error(err);
    const errorMessage = 'Failed loading reports';
    yield call(message.error, errorMessage);
  }
}
export default function* watcherSaga() {
  yield all([
    yield takeEvery(FETCH_REPORTS, fetchReports),
    yield takeEvery(GET_TEST_ACTIVITY_DETAIL, fetchTestActivityDetail),
    yield takeEvery(GET_SKILL_REPORT_BY_CLASSID, fetchSkillReport),
    yield takeEvery(LOAD_TEST_REPORT, loadTestReport)
  ]);
}
