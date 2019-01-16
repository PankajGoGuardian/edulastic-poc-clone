import { skillReportApi } from '@edulastic/api';
import { takeEvery, call, all, put } from 'redux-saga/effects';

import { GET_SKILL_REPORT_BY_CLASSID, LOAD_SKILL_REPORT_BY_CLASSID } from '../constants/actions';

function* fetchSkillReport(action) {
  const { classId } = action.payload;
  try {
    const reports = yield call(skillReportApi.fetchSkillReport, classId);
    yield put({ type: LOAD_SKILL_REPORT_BY_CLASSID, payload: { reports } });
  } catch (err) {
    console.error(err);
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(GET_SKILL_REPORT_BY_CLASSID, fetchSkillReport)
  ]);
}
