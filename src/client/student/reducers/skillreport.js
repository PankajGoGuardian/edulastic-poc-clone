import { LOAD_SKILL_REPORT_BY_CLASSID } from '../constants/actions';

const initialState = {
  skillReport: {}
};

const skillReport = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_SKILL_REPORT_BY_CLASSID:
      return {
        ...state,
        report: payload
      };
    default:
      return state;
  }
};

export default skillReport;
