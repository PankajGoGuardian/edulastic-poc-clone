import {
  RECEIVE_ITEM_DETAIL_REQUEST,
  UPDATE_ITEM_DETAIL_REQUEST,
  SET_ITEM_DETAIL_DATA,
  UPDATE_ITEM_DETAIL_DIMENSION,
} from '../constants/actions';

export const getItemDetailByIdAction = (id, params) => ({
  type: RECEIVE_ITEM_DETAIL_REQUEST,
  payload: { id, params },
});

export const setItemDetailDataAction = item => ({
  type: SET_ITEM_DETAIL_DATA,
  payload: { item },
});

export const updateItemDetailByIdAction = (id, data) => ({
  type: UPDATE_ITEM_DETAIL_REQUEST,
  payload: { id, data },
});

export const updateItemDetailDimensionAction = (left, right) => ({
  type: UPDATE_ITEM_DETAIL_DIMENSION,
  payload: { left, right },
});
