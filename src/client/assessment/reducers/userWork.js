import undoable from "redux-undo";
import { SAVE_USER_WORK, LOAD_SCRATCH_PAD, LOAD_TESTLET_STATE } from "../constants/actions";

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
    case LOAD_TESTLET_STATE:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
};

// make it a undoable reducer
export default undoable(userWork, {
  limit: 10
});
