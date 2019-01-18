/* eslint-disable */
import {
  FETCH_REPORTS,
  GET_TEST_ACTIVITY_DETAIL,
  LOAD_TEST_REPORT
} from '../constants/actions';

import {GET_SKILL_REPORT_BY_CLASSID} from '../components/skillReport/ducks';

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

/*
 * load student test Activity
 * @params {string} testActivityId - id of a particular test Activty
 */
export const loadReportAction = testActivityId => ({
  type: LOAD_TEST_REPORT,
  payload: {
    testActivityId
  }
});
