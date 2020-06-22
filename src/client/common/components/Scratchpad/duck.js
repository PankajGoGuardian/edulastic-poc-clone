import { createAction } from "redux-starter-kit";

const UPDATE_SCRATCHPAD = "[scratchpad] update scratchpad data";
const RESET_SCRATCHPAD = "[scratchpad] reset scratchpad data";
const SET_SELECTED_NODES = "[scratchpad] set selected nodes";

export const updateScratchpadAction = createAction(UPDATE_SCRATCHPAD);
export const resetScratchPadDataAction = createAction(RESET_SCRATCHPAD);
export const setSelectedNodesAction = createAction(SET_SELECTED_NODES);

const initialState = {
  fillColor: "#ff0000",
  lineWidth: 6,
  lineColor: "#ff0000",
  fontSize: 20,
  fontFamily: "Open Sans",
  fontColor: "#000000",
  activeMode: "",
  deleteMode: false,
  selectedNodes: []
};

export function scratchpad(state = initialState, { type, payload }) {
  switch (type) {
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
