import {
  RECEIVE_TEST_ITEMS_REQUEST,
  SET_TEST_ITEMS_REQUEST
} from '../constants/actions';

export const receiveTestItemsAction = payload => ({
  type: RECEIVE_TEST_ITEMS_REQUEST,
  payload
});

export const setTestItemsAction = data => ({
  type: SET_TEST_ITEMS_REQUEST,
  payload: { data }
});
