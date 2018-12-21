import { TOGGLE_MENU, RESPONSIVE_TOGGLE_MENU } from '../constants/actions';

const initialState = {
  isSidebarCollapse: false,
  isResponsive: false
};

const reducer = (state = initialState, { type }) => {
  switch (type) {
    case TOGGLE_MENU:
      return {
        ...state,
        isSidebarCollapse: !state.isSidebarCollapse
      };
    case RESPONSIVE_TOGGLE_MENU:
      return {
        ...state,
        isResponsive: !state.isResponsive
      };
    default:
      return state;
  }
};

export default reducer;
