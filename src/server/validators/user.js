import joi from 'joi';

// TODO: move this to constants folder
const roles = ['student', 'teacher', 'admin', 'co-teacher'];

export const userSchema = {
  email: joi.string().required(),
  password: joi.string().required(),
  role: joi.string().valid(...roles),
  firstName: joi.string().min(3),
  lastName: joi.string().min(3)
};
