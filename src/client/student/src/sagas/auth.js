import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { authApi } from '@edulastic/api';
import { message } from 'antd';
import { SIGNUP, LOGIN } from '../constants/actions';

function* login({ payload }) {
  try {
    const result = yield call(authApi.login, payload.value);
    localStorage.setItem('access_token', result.token);
    yield put(push('/Home'));
  } catch (err) {
    console.error(err);
    const errorMessage = 'Invalid username or password';
    yield call(message.error, errorMessage);
  }
}

function* signup({ payload }) {
  try {
    yield call(authApi.signup, payload.value);
    yield put(push('/Login'));
  } catch (err) {
    console.error(err);
    const errorMessage = 'Email already exist';
    yield call(message.error, errorMessage);
  }
}

export default function* watcherSaga() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(SIGNUP, signup);
}
