import jwt from 'jsonwebtoken';
import config from '../config';

const { secret, expiresIn } = config.jwt;

export const generateAuthToken = payload =>
  jwt.sign(payload, secret, { expiresIn });

export const decodeAuthToken = token => jwt.verify(token, secret);
