import { createReducer } from "redux-starter-kit";
import { SAVE_HINT_USAGE } from "../constants/actions";

const initialState = {};

const saveHintUsage = (state, { payload }) => {
  const { itemId, hintUsage } = payload;

  return {
    ...state,
    [itemId]: [...(state[itemId] || []), hintUsage]
  };
};

export default createReducer(initialState, {
  [SAVE_HINT_USAGE]: saveHintUsage
});
