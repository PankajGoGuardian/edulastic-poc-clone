/* eslint-disable */
import { SIGNUP } from '../constants/actions';

export const signupAction = user => ({
  type: SIGNUP,
  payload: {
    value: user
  }
});
