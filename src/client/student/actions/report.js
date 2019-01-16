/* eslint-disable */
import {
  FETCH_REPORTS,
  GET_TEST_ACTIVITY_DETAIL,
  GET_SKILL_REPORT_BY_CLASSID
} from '../constants/actions';

export const fetchReportAction = () => ({
  type: FETCH_REPORTS
});

export const fetchTestActivityDetailAction = id => ({
  type: GET_TEST_ACTIVITY_DETAIL,
  payload: { id }
});

export const fetchSkillReportAction = classId => ({
  type: GET_SKILL_REPORT_BY_CLASSID,
  payload: { classId }
});
