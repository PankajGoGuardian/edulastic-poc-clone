import { SET_ANSWER } from '../constants/actions';

const initialState = {};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_ANSWER:
      return { ...state, [payload.id]: payload.data };

    default:
      return state;
  }
}
