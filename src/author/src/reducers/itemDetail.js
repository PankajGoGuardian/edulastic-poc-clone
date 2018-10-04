import { cloneDeep } from 'lodash';
import {
  RECEIVE_ITEM_DETAIL_REQUEST,
  RECEIVE_ITEM_DETAIL_SUCCESS,
  RECEIVE_ITEM_DETAIL_ERROR,
  UPDATE_ITEM_DETAIL_REQUEST,
  UPDATE_ITEM_DETAIL_SUCCESS,
  UPDATE_ITEM_DETAIL_ERROR,
  SET_ITEM_DETAIL_DATA,
  UPDATE_ITEM_DETAIL_DIMENSION,
} from '../constants/actions';

const initialState = {
  item: null,
  error: null,
  loading: false,
  updating: false,
  updateError: null,
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case RECEIVE_ITEM_DETAIL_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_ITEM_DETAIL_SUCCESS:
      return { ...state, item: payload.item, loading: false };
    case RECEIVE_ITEM_DETAIL_ERROR:
      return { ...state, loading: false, error: payload.error };

    case SET_ITEM_DETAIL_DATA:
      return { ...state, item: payload.item };

    case UPDATE_ITEM_DETAIL_DIMENSION:
      /* eslint-disable  */
      const newState = cloneDeep(state);
      newState.item.rows[0].dimension = payload.left;
      newState.item.rows[1].dimension = payload.right;
      return newState;

    case UPDATE_ITEM_DETAIL_REQUEST:
      return { ...state, updating: true };
    case UPDATE_ITEM_DETAIL_SUCCESS:
      return { ...state, item: payload.item, updating: false };
    case UPDATE_ITEM_DETAIL_ERROR:
      return { ...state, updating: false, updateError: payload.error };

    default:
      return state;
  }
}
