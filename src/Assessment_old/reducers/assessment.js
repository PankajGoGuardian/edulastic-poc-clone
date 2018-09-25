import { LOAD_ASSESSMENT } from '../constants/actions';

const assessment = (state = {}, action) => {
  switch (action.type) {
    case LOAD_ASSESSMENT:
      return { ...action.payload };
    default:
      return state;
  }
};

export default assessment;
