import { hash, compare } from 'bcrypt';

export const hashPassword = password => hash(password, 10);

export const comparePassword = compare;
