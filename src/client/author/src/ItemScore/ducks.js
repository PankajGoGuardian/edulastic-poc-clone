import { createReducer } from "redux-starter-kit";

export const SET_ITEM_SCORE = "[itemScore] set item score";
export const RESET_ITEM_SCORE = "[itemScore] reset item score";

const initialState = {
  score: 0,
  maxScore: 0,
  showScore: false
};

function setItemScore(state, { payload }) {
  return { ...state, ...payload };
}

function resetItemScore() {
  return initialState;
}

const itemScoreReducer = createReducer(initialState, {
  [SET_ITEM_SCORE]: setItemScore,
  [RESET_ITEM_SCORE]: resetItemScore
});

export default itemScoreReducer;
