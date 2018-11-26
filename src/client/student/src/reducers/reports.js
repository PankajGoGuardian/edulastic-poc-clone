import { LOAD_REPORTS } from '../constants/actions';

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
    default:
      return state;
  }
};

export default reports;
