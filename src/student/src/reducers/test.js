import { SET_STUDENT_TEST } from '../constants/actions';

const initialState = {
  tests: [],
};

const test = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_STUDENT_TEST:
      return {
        ...state,
        tests: payload.tests,
      };
    default:
      return state;
  }
};

export default test;
