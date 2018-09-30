import { CHANGE_VIEW } from '../constants/actions';

const initialState = {
  view: 'edit',
  showAnswers: false,
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case CHANGE_VIEW:
      return { ...state, view: payload.view };

    default:
      return state;
  }
}
