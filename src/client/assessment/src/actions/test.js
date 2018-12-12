import {
  LOAD_TEST,
  FINISH_TEST,
  LOAD_PREVIOUS_RESPONSES
} from '../constants/actions';

export const loadTestAction = (test, testId) => ({
  type: LOAD_TEST,
  payload: {
    test,
    testId
  }
});

export const finishTestAcitivityAction = () => ({
  type: FINISH_TEST
});

export const loadPreviousReponseAction = () => ({
  type: LOAD_PREVIOUS_RESPONSES
});
