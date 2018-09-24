import { RECEIVE_ITEMS_REQUEST, RECEIVE_ITEM_REQUEST } from '../constants/actions';

export const receiveItemsAction = () => ({
  type: RECEIVE_ITEMS_REQUEST,
});

export const receiveItemByIdAction = id => ({
  type: RECEIVE_ITEM_REQUEST,
  payload: { id },
});
