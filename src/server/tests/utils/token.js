import test from 'ava';
import { generateAuthToken, decodeAuthToken } from '../../utils/token';

const payload = {
  _id: 'testId'
};

test('authToken', async (t) => {
  const token = generateAuthToken(payload);
  const decodedToken = decodeAuthToken(token);
  t.is(decodedToken._id, payload._id, 'invalid token generation');
  t.truthy(decodedToken.exp, 'token has no expiry');
});
