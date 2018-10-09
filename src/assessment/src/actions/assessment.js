/* eslint-disable */
import { LOAD_ASSESSMENT } from '../constants/actions';

export const loadAssessment = (id, name) => ({
  type: LOAD_ASSESSMENT,
  payload: {
    id,
    name
  }
});
