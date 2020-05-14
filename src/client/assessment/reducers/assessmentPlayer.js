import { createReducer } from "redux-starter-kit";
import { STORE_OPTIONS, CLEAR_OPTIONS } from "../constants/actions";

const initialState = {};

const reducer = createReducer(initialState, {
  [STORE_OPTIONS](state, { payload }) {
    const { itemId, options } = payload;
    state[itemId] = options;
  },
  // eslint-disable-next-line no-unused-vars
  [CLEAR_OPTIONS](state) {
    state = initialState;
  }
});

export default reducer;
