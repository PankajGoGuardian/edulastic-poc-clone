/* eslint-disable */
import { LOGIN, SIGNUP, LOGOUT } from '../constants/actions';

export const loginAction = user => ({
  type: LOGIN,
  payload: {
    value: user
  }
});

export const signupAction = user => ({
  type: SIGNUP,
  payload: {
    value: user
  }
});

export const logoutAction = () => ({
  type: LOGOUT
});
