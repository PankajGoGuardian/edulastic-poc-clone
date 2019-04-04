import { TOGGLE_FILTER } from "../constants/actions";

const initialItemsState = {
  isShowFilter: false
};

export const filterReducer = (state = initialItemsState, { type, payload }) => {
  switch (type) {
    case TOGGLE_FILTER:
      return {
        ...state,
        isShowFilter: !state.isShowFilter
      };
    default:
      return state;
  }
};

export default filterReducer;
