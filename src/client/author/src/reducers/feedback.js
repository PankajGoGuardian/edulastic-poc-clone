import { createAction, createReducer } from "redux-starter-kit";

const initialState = {};

const UPDATE_POSITION = "[feedback] update position for feedback";

const FeedbackReducer = createReducer(initialState, {
  [UPDATE_POSITION](state, action) {
    const { payload } = action;
    const { id, dimensions } = payload;
    state[id] = dimensions;
  }
});

export const updatePosition = createAction(UPDATE_POSITION);
export { FeedbackReducer as feedback };
