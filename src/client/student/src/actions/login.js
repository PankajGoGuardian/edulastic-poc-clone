/* eslint-disable */
import { LOGIN } from '../constants/actions';

export const loginAction = user => ({
  type: LOGIN,
  payload: {
    value: user
  }
});
