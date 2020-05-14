import { createReducer } from "redux-starter-kit";
import { STORE_OPTIONS, CLEAR_OPTIONS } from "../constants/actions";

const initialState = {};

const reducer = createReducer(initialState, {
  [STORE_OPTIONS]: (state, { payload }) => {
    const { itemId, options } = payload;
    state[itemId] = options;
    return state;
  },
  [CLEAR_OPTIONS]: () => initialState
});

export default reducer;
