// @flow
import jwt from 'jsonwebtoken';
import config from '../config';

const { secret, expiresIn } = config.jwt;

export const generateAuthToken = (payload: string): string =>
  jwt.sign(payload, secret, { expiresIn });

export const decodeAuthToken = (token: string): string =>
  jwt.verify(token, secret);
