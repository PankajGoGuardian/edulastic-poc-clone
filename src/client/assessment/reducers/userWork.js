import undoable, { ActionTypes } from "redux-undo";
import { filterActions } from "redux-ignore";
import { SAVE_USER_WORK, LOAD_SCRATCH_PAD, CLEAR_USER_WORK } from "../constants/actions";

export const REQUEST_SCRATCH_PAD_SUCCESS = "[scratchpad] load success";

const initialState = {};

const userWork = (state = initialState, { type, payload }) => {
  switch (type) {
    case SAVE_USER_WORK:
      return {
        ...state,
        ...payload
      };
    case LOAD_SCRATCH_PAD:
      return {
        ...payload
      };
    case REQUEST_SCRATCH_PAD_SUCCESS:
      const { scratchPad, testItemId } = payload;
      return {
        ...state,
        [testItemId]: scratchPad
      };
    case CLEAR_USER_WORK:
      return initialState;
    default:
      return state;
  }
};

// make it a undoable reducer
// also filter out the actions that are not required to prevent creation of unwanted history.
// filterFunction of  undoable still creates history!
export default filterActions(
  undoable(userWork, {
    limit: 11
  }),
  [CLEAR_USER_WORK, LOAD_SCRATCH_PAD, SAVE_USER_WORK, REQUEST_SCRATCH_PAD_SUCCESS, ...Object.values(ActionTypes)]
);
