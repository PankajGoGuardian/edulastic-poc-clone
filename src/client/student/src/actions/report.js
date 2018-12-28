/* eslint-disable */
import { FETCH_REPORTS, GET_TEST_ACTIVITY_DETAIL } from '../constants/actions';

export const fetchReportAction = () => ({
  type: FETCH_REPORTS
});

export const fetchTestActivityDetailAction = id => ({
  type: GET_TEST_ACTIVITY_DETAIL,
  payload: { id }
});
