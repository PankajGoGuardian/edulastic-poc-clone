import { combineReducers } from 'redux';

import {
  RECEIVE_ITEMS_REQUEST,
  RECEIVE_ITEMS_SUCCESS,
  RECEIVE_ITEMS_ERROR,
  RECEIVE_ITEM_REQUEST,
  RECEIVE_ITEM_SUCCESS,
  RECEIVE_ITEM_ERROR,
} from '../constants/actions';

const initialItemsState = {
  items: [],
  error: null,
  loading: false,
};

const itemsReducer = (state = initialItemsState, { type, payload }) => {
  switch (type) {
    case RECEIVE_ITEMS_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_ITEMS_SUCCESS:
      return { ...state, loading: false, items: payload.items };
    case RECEIVE_ITEMS_ERROR:
      return { ...state, loading: false, error: payload.error };
    default:
      return state;
  }
};

const initialItemState = {
  item: null,
  error: null,
  loading: false,
};

const itemReducer = (state = initialItemState, { type, payload }) => {
  switch (type) {
    case RECEIVE_ITEM_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_ITEM_SUCCESS:
      return { ...state, loading: false, item: payload.item };
    case RECEIVE_ITEM_ERROR:
      return { ...state, loading: false, error: payload.error };
    default:
      return state;
  }
};

export default combineReducers({
  list: itemsReducer,
  item: itemReducer,
});
