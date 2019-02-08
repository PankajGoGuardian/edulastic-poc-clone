import { SAVE_SCRATCH_PAD } from '../constants/actions';

const initialState = {};

const userWork = (state = initialState, { type, payload }) => {
  switch (type) {
    case SAVE_SCRATCH_PAD:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
};

export default userWork;
