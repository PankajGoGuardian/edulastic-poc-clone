import test from 'ava';
import superTest from 'supertest';
import { httpMessages } from '@edulastic/constants';
import app from '../../app';
import UserModel from '../../models/user';
import { user1 } from '../data/signup';


const request = superTest(app);
const url = '/api/auth/signup';


const deleteUserByEmail = (email) => {
  const User = new UserModel();
  return User.deleteByEmail(email);
};

test.before(async () => {
  await deleteUserByEmail(user1.email);
});

test('#user Signup', async (t) => {
  try {
    let res = await request.post(url).send(user1);
    t.is(res.status, 200);
    t.is(res.body.result, httpMessages.ACCOUNT_CREATED);
    res = await request.post(url).send(user1);
    t.is(res.status, 400);
    t.is(res.body.message, httpMessages.EMAIL_EXIST);
  } catch (e) {
    t.log(e);
    console.log(e);
  }
});

test.after(async () => {
  await deleteUserByEmail(user1.email);
});
