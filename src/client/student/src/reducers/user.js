import { SET_USER } from '../constants/actions';


const initialState = {
  isAuthenticated: false
};


const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return { ...payload.user, isAuthenticated: true };
    default:
      return state;
  }
};

export default reducer;
