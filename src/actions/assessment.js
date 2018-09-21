import { LOAD_ASSESSMENT } from '../constants/actions';

export const loadAssessment = (id, name) => {
  return {
    type: LOAD_ASSESSMENT,
    payload: {
      id,
      name
    }
  };
};
