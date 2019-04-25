import { createAction, createReducer } from "redux-starter-kit";

export const SET_CURRENT_TUTORIAL = "[tutorial] set tutorial pack";

const initialState = {
  currentTutorial: null
};

export const setCurrentTutorialAction = createAction(SET_CURRENT_TUTORIAL);

const reducer = createReducer(initialState, {
  [SET_CURRENT_TUTORIAL]: (state, { payload }) => {
    state.currentTutorial = payload;
  }
});

export default reducer;
