import {
  SAVE_HINT_USAGE,
  SHOW_HINTS,
  Hide_HINTS,
  START_TIMER,
  DEC_TIMER,
  STOP_TIMER,
  RESET_TIMER
} from "../constants/actions";
import { createAction } from "redux-starter-kit";

export const saveHintUsageAction = payload => ({
  type: SAVE_HINT_USAGE,
  payload
});

export const showHintsAction = () => ({ type: SHOW_HINTS });

export const hideHintsAction = () => ({ type: Hide_HINTS });

// Assignment Timer
export const startAssignmentTimerAction = createAction(START_TIMER);
export const decrementTimerAction = createAction(DEC_TIMER);
export const stopAssignmentTimerAction = createAction(STOP_TIMER);
export const resetAssignmentTimer = createAction(RESET_TIMER);
