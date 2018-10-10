import { CREATE_TEST_ITEM_REQUEST } from '../constants/actions';

export const createTestItemAction = data => ({
  type: CREATE_TEST_ITEM_REQUEST,
  payload: data,
});
