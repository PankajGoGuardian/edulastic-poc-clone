import { SAVE_HINT_USAGE, SHOW_HINTS, Hide_HINTS } from "../constants/actions";

export const saveHintUsageAction = payload => ({
  type: SAVE_HINT_USAGE,
  payload
});

export const showHintsAction = () => ({ type: SHOW_HINTS });

export const hideHintsAction = () => ({ type: Hide_HINTS });
