import { SET_ANSWER, LOAD_ANSWERS, REMOVE_ANSWERS } from "../constants/actions";

const initialState = {};

const RECEIVE_STUDENT_QUESTION_SUCCESS = "[answer] receive list success";

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_ANSWER:
      return { ...state, [payload.id]: payload.data };
    case LOAD_ANSWERS:
      return {
        ...state,
        ...payload
      };
    case REMOVE_ANSWERS:
      return {};
    case RECEIVE_STUDENT_QUESTION_SUCCESS:
      return {};
    default:
      return state;
  }
}
