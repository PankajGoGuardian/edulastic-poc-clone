import { SET_STUDENT_ASSIGNMENTS } from '../constants/actions';

const initialState = [];

const test = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_STUDENT_ASSIGNMENTS:
      return payload.assignments;
    default:
      return state;
  }
};

export default test;
