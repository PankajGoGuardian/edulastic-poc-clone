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
const reducer = (state = initialState, { type, payload }) => {
  /**
   * cannot set default value {} to argument
   * sometimes null values are passed
   */
  const { componentName } = payload || {};

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
      if (componentName) {
        return produce(state, draft => {
          draft.currentlyLoading = draft.currentlyLoading || [];
          draft.currentlyLoading.push(componentName);
        });
      }
      return state;
    case REMOVE_LOADING_COMPONENT:
      if (componentName) {
        if (state.currentlyLoading?.includes(componentName)) {
          return produce(state, draft => {
            const index = draft.currentlyLoading.findIndex(comp => comp === componentName);
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
