import { LOAD_TEST_ITEMS, GOTO_ITEM } from '../constants/actions';

const initialState = {
  items: [],
  currentItem: 0,
};

const test = (state = initialState, { payload, type }) => {
  switch (type) {
    case LOAD_TEST_ITEMS:
      return {
        ...state,
        items: payload.items,
      };

    case GOTO_ITEM:
      return {
        ...state,
        currentItem: payload.item,
      };
    default:
      return state;
  }
};

export default test;
