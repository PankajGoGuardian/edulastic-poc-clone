import { createAction } from "redux-starter-kit";
import { TOGGLE_PRESENTATION_MODE } from "../constants/actions";

// toggle presentation mode!
export const togglePresentationModeAction = createAction(TOGGLE_PRESENTATION_MODE);
