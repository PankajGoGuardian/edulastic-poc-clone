import { createAction, createReducer } from "redux-starter-kit";

export const TOGGLE_MENU = "[homeUI] toggle menu";
export const RESPONSIVE_TOGGLE_MENU = "[homeUI] responsive toggle menu";
export const SET_ZOOM_LEVEL = "[homeUI] set zoom level";
export const SET_THEME = "[homeUI] set theme";
export const SET_SETTINGS_MODAL_VISIBILITY = "[homeUI] set settings modal visibility";

const initialState = {
  isSidebarCollapsed: true,
  isResponsive: false,
  zoomLevel: localStorage.getItem("zoomLevel") || "1",
  selectedTheme: localStorage.getItem("selectedTheme") || "default",
  settingsModalVisible: false
};

export const toggleSideBarAction = createAction(TOGGLE_MENU);
export const setZoomLevelAction = createAction(SET_ZOOM_LEVEL);
export const setSettingsModalVisibilityAction = createAction(SET_SETTINGS_MODAL_VISIBILITY);
export const setSelectedThemeAction = createAction(SET_THEME);

const reducer = createReducer(initialState, {
  [SET_THEME]: (state, { payload }) => {
    state.selectedTheme = payload;
  },
  [SET_SETTINGS_MODAL_VISIBILITY]: (state, { payload }) => {
    state.settingsModalVisible = payload;
  },
  [SET_ZOOM_LEVEL]: (state, { payload }) => {
    state.zoomLevel = payload;
  },
  [TOGGLE_MENU]: state => {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
  },
  [RESPONSIVE_TOGGLE_MENU]: state => {
    state.isResponsive = !state.isResponsive;
  }
});

export default reducer;
