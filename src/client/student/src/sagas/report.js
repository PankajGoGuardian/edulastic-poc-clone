import { reportsApi } from '@edulastic/api';
import { takeEvery, call, all, put } from 'redux-saga/effects';

import {
  FETCH_REPORTS,
  LOAD_REPORTS,
  GET_TEST_ACTIVITY_DETAIL,
  LOAD_TEST_ACTIVITY_DETAIL,
  GET_SKILL_REPORT_BY_CLASSID,
  LOAD_SKILL_REPORT_BY_CLASSID
} from '../constants/actions';

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

export default function* watcherSaga() {
  yield all([
    yield takeEvery(FETCH_REPORTS, fetchReports),
    yield takeEvery(GET_TEST_ACTIVITY_DETAIL, fetchTestActivityDetail),
    yield takeEvery(GET_SKILL_REPORT_BY_CLASSID, fetchSkillReport)
  ]);
}
