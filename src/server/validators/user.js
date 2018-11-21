import joi from 'joi';

export const userSchema = {
  email: joi.string().required(),
  password: joi.string().required(),
  role: joi.string()
};
