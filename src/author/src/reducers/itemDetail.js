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
  SET_DRAGGING,
  DELETE_ITEM_DETAIL_WIDGET,
  UPDATE_TAB_TITLE,
  USE_TABS,
} from '../constants/actions';

const initialState = {
  item: null,
  error: null,
  loading: false,
  updating: false,
  updateError: null,
  dragging: false,
};

const deleteWidget = (state, { rowIndex, widgetIndex }) => {
  const newState = cloneDeep(state);
  newState.item.rows[rowIndex].widgets = newState.item.rows[rowIndex].widgets.filter(
    (w, i) => i !== widgetIndex,
  );

  return newState;
};

const updateDimension = (state, { left, right }) => {
  const newState = cloneDeep(state);
  newState.item.rows[0].dimension = left;
  newState.item.rows[1].dimension = right;
  return newState;
};

const updateTabTitle = (state, { rowIndex, tabIndex, value }) => {
  const newState = cloneDeep(state);
  newState.item.rows[rowIndex].tabs[tabIndex] = value;
  return newState;
};

const useTabs = (state, { rowIndex, isUseTabs }) => {
  const newState = cloneDeep(state);
  if (isUseTabs) {
    newState.item.rows[rowIndex].tabs = ['Tab 1', 'Tab 2'];
  }
  if (!isUseTabs) {
    newState.item.rows[rowIndex].tabs = [];
  }
  return newState;
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

    case DELETE_ITEM_DETAIL_WIDGET:
      return deleteWidget(state, payload);

    case UPDATE_TAB_TITLE:
      return updateTabTitle(state, payload);

    case USE_TABS:
      return useTabs(state, payload);

    case SET_DRAGGING:
      return { ...state, dragging: payload.dragging };

    case UPDATE_ITEM_DETAIL_DIMENSION:
      return updateDimension(state, payload);

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
