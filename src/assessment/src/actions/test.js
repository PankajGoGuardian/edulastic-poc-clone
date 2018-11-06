import {
  LOAD_TEST,
  INIT_TEST_ACTIVITY,
  FINISH_TEST,
} from '../constants/actions';

export const loadTest = (test, testId) => ({
  type: LOAD_TEST,
  payload: {
    test,
    testId,
  },
});

export const initiateTestActivityAction = () => ({
  type: INIT_TEST_ACTIVITY,
});

export const finishTestAcitivityAction = () => ({
  type: FINISH_TEST,
});
