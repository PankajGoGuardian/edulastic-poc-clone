import { RECEIVE_ITEM_DETAIL_REQUEST } from '../constants/actions';

export const getItemDetailByIdAction = id => ({
  type: RECEIVE_ITEM_DETAIL_REQUEST,
  payload: { id },
});
