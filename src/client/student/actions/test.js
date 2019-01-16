import { INIT_TEST_ACTIVITY } from '../constants/actions';

export const initiateTestActivityAction = (testId, assignmentId) => ({
  type: INIT_TEST_ACTIVITY,
  payload: {
    testId,
    assignmentId
  }
});
