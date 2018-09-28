import { RECEIVE_ITEMS_REQUEST, RECEIVE_ITEM_REQUEST } from '../constants/actions';

export const receiveItemsAction = ({ page, limit, search }) => ({
  type: RECEIVE_ITEMS_REQUEST,
  payload: { page, limit, search },
});

export const receiveItemByIdAction = id => ({
  type: RECEIVE_ITEM_REQUEST,
  payload: { id },
});
