import joi from 'joi';

export const userTestActivitySchema = {
  testId: joi.string().required(),
  assignmentId: joi.string().required()
};

export const submitTestSchema = {
  testActivityId: joi.string()
};
