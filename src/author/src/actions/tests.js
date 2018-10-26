import { RECEIVE_TESTS_REQUEST, CREATE_TEST_REQUEST } from '../constants/actions';

export const receiveTestsAction = ({ page, limit } = { page: 1, limit: 5 }) => ({
  type: RECEIVE_TESTS_REQUEST,
  payload: { page, limit },
});

export const createTestAction = data => ({
  type: CREATE_TEST_REQUEST,
  payload: { data },
});
