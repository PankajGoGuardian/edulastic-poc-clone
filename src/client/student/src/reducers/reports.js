import { LOAD_REPORTS, LOAD_TEST_ACTIVITY_DETAIL } from '../constants/actions';

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
    default:
      return state;
  }
};

export default reports;
