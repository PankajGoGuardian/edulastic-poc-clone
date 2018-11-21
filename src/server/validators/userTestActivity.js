import joi from 'joi';

export const userTestActivitySchema = {
  testId: joi.string()
};

export const submitTestSchema = {
  testActivityId: joi.string()
};
