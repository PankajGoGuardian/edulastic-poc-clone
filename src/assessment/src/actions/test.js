import { LOAD_TEST } from '../constants/actions';

export const loadTest = (test, testId) => ({
  type: LOAD_TEST,
  payload: {
    test,
    testId,
  },
});
