import { CREATE_TEST_ITEM_REQUEST, UPDATE_TEST_ITEM_REQUEST } from '../constants/actions';

export const createTestItemAction = data => ({
  type: CREATE_TEST_ITEM_REQUEST,
  payload: data,
});

export const updateTestItemByIdAction = (id, data) => ({
  type: UPDATE_TEST_ITEM_REQUEST,
  payload: { id, data },
});
