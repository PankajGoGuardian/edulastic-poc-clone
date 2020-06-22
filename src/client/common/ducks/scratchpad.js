import { createAction } from "redux-starter-kit";
// SHOUD BE REMOVED
const UPDATE_SCRATCHPAD = "[scratchpad] update scratchpad data";
const RESET_SCRATCHPAD = "[scratchpad] reset scratchpad data";

export const updateScratchpadAction = createAction(UPDATE_SCRATCHPAD);
export const resetScratchPadDataAction = createAction(RESET_SCRATCHPAD);

const initialState = {
  fillColor: "#ff0000",
  lineColor: "#ff0000",
  currentFont: "",
  activeMode: "",
  lineWidth: 6,
  deleteMode: false
};

export function scratchpad(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_SCRATCHPAD:
      return {
        ...state,
        ...payload
      };
    case RESET_SCRATCHPAD:
      return initialState;
    default:
      return state;
  }
}
