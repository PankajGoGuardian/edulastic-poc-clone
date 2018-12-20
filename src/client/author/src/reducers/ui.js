import { TOGGLE_MENU, RESPONSIVE_TOGGLE_MENU } from '../constants/actions';

const initialState = {
  flag: false,
  sidebar: false
};

const reducer = (state = initialState, { type }) => {
  switch (type) {
    case TOGGLE_MENU:
      return {
        ...state,
        flag: !state.flag
      };
    case RESPONSIVE_TOGGLE_MENU:
      return {
        ...state,
        sidebar: !state.sidebar
      };
    default:
      return state;
  }
};

export default reducer;
