import { CHANGE_VIEW } from '../constants/actions';

export const changeViewAction = view => ({
  type: CHANGE_VIEW,
  payload: {
    view,
  },
});

export default changeViewAction;
