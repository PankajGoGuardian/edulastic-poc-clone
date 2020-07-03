import produce from "immer";
import {
  TOGGLE_MENU,
  RESPONSIVE_TOGGLE_MENU,
  ADD_LOADING_COMPONENT,
  REMOVE_LOADING_COMPONENT
} from "../constants/actions";

const initialState = {
  isSidebarCollapsed: true,
  isResponsive: false,
  currentlyLoading: []
};
const reducer = (state = initialState, { type, payload = {} }) => {
  const { compoentName } = payload;

  switch (type) {
    case TOGGLE_MENU:
      return {
        ...state,
        isSidebarCollapsed: !state.isSidebarCollapsed
      };
    case RESPONSIVE_TOGGLE_MENU:
      return {
        ...state,
        isResponsive: !state.isResponsive
      };
    case ADD_LOADING_COMPONENT:
      if (compoentName) {
        return produce(state, draft => {
          draft.currentlyLoading = draft.currentlyLoading || [];
          draft.currentlyLoading.push(compoentName);
        });
      }
      return state;
    case REMOVE_LOADING_COMPONENT:
      if (compoentName) {
        if (state.currentlyLoading?.includes(compoentName)) {
          return produce(state, draft => {
            const index = draft.currentlyLoading.findIndex(comp => comp === compoentName);
            if (index !== -1) {
              draft.currentlyLoading.splice(index, 1);
            }
          });
        }
      }
      return state;
    default:
      return state;
  }
};

export default reducer;
