import { createAction } from "redux-starter-kit";

const UPDATE_SCRATCHPAD = "[scratchpad] update scratchpad data";
const RESET_SCRATCHPAD = "[scratchpad] reset scratchpad data";
const SET_SELECTED_NODES = "[scratchpad] set selected nodes";
const TOGGLE_BUTTONS = "[scratchpad] toggle buttons";
const UPDATE_EDIT_MODE = "[scratchpad] update scratchpad edit mode";

export const updateScratchpadAction = createAction(UPDATE_SCRATCHPAD);
export const resetScratchPadDataAction = createAction(RESET_SCRATCHPAD);
export const setSelectedNodesAction = createAction(SET_SELECTED_NODES);
export const toggleButtonsAction = createAction(TOGGLE_BUTTONS);
export const updateEditModeAction = createAction(UPDATE_EDIT_MODE);

const initialState = {
  fillColor: "#ff0000",
  lineWidth: 6,
  lineColor: "#ff0000",
  fontSize: 20,
  fontFamily: "Open Sans",
  fontColor: "#000000",
  activeMode: "",
  deleteMode: false,
  editMode: "",
  selectedNodes: []
};

export function scratchpad(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_EDIT_MODE:
    case TOGGLE_BUTTONS:
    case UPDATE_SCRATCHPAD:
      return {
        ...state,
        ...payload
      };
    case SET_SELECTED_NODES:
      return {
        ...state,
        selectedNodes: payload
      };
    case RESET_SCRATCHPAD:
      return initialState;
    default:
      return state;
  }
}
