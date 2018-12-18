import { pick, last } from 'lodash';
import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { authApi } from '@edulastic/api';
import { message } from 'antd';
import { roleuser } from '@edulastic/constants';
import { SIGNUP, LOGIN, SET_USER } from '../constants/actions';

function* login({ payload }) {
  try {
    const result = yield call(authApi.login, payload.value);
    localStorage.setItem('access_token', result.token);
    const user = pick(result, [
      '_id',
      'firstName',
      'lastName',
      'email',
      'role'
    ]);
    yield put({
      type: SET_USER,
      payload: {
        user
      }
    });
    if (user.role === roleuser.STUDENT) yield put(push('/home/dashboard'));
    else if (user.role === roleuser.ADMIN) yield put(push('/author/items'));
    else if (user.role === roleuser.TEACHER) yield put(push('/author/items'));
  } catch (err) {
    console.error(err);
    const errorMessage = 'Invalid username or password';
    yield call(message.error, errorMessage);
  }
}

function* signup({ payload }) {
  try {
    const { name, email, password, role } = payload.value;
    const nameList = name.split(' ');
    let firstName; let
      lastName;
    if (nameList.length > 1) {
      lastName = last(nameList);
      firstName = nameList.slice(0, -1).join(' ');
    } else {
      firstName = name;
    }
    const obj = {
      password,
      email,
      firstName,
      lastName,
      role
    };
    yield call(authApi.signup, obj);
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
