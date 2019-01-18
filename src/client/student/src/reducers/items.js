import { SET_STUDENT_ITEMS, SET_CURRENT_ITEM } from '../../constants/actions';

const initialState = {
  items: [],
  current: 0
};

const items = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_STUDENT_ITEMS:
      return {
        ...state,
        items: payload.data
      };
    case SET_CURRENT_ITEM:
      return {
        ...state,
        current: payload.data
      };
    default:
      return state;
  }
};

export default items;
