import {
  LOAD_REPORTS,
  LOAD_TEST_ACTIVITY_DETAIL
} from '../constants/actions';

import { LOAD_SKILL_REPORT_BY_CLASSID } from '../components/skillReport/ducks';

const initialState = {
  reports: []
};

const reports = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_REPORTS:
      return {
        ...state,
        reports: payload.reports
      };
    case LOAD_TEST_ACTIVITY_DETAIL:
      return {
        ...state,
        reportDetail: payload.reports.data.result
      };
    case LOAD_SKILL_REPORT_BY_CLASSID:
      return {
        ...state,
        skillReport: payload
      };
    default:
      return state;
  }
};

export default reports;
