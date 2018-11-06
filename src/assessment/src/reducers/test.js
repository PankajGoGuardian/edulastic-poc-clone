import { LOAD_TEST_ITEMS, GOTO_ITEM, SET_TEST_ID } from '../constants/actions';

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

    case SET_TEST_ID:
      return {
        ...state,
        testId: payload.testId,
      };

    default:
      return state;
  }
};

export default test;
