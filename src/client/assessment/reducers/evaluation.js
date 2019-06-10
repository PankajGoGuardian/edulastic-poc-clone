import { ADD_ITEM_EVALUATION, CLEAR_ITEM_EVALUATION } from "../constants/actions";

const initialState = {};

const evaluation = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_ITEM_EVALUATION:
      return {
        ...payload
      };
    case CLEAR_ITEM_EVALUATION:
      return initialState;
    default:
      return state;
  }
};

export default evaluation;
