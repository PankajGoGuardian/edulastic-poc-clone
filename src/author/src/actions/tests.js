import { RECEIVE_TESTS_REQUEST, CREATE_TEST_REQUEST } from '../constants/actions';

export const receiveTestsAction = payload => ({
  type: RECEIVE_TESTS_REQUEST,
  payload,
});

export const createTestAction = data => ({
  type: CREATE_TEST_REQUEST,
  payload: { data },
});
