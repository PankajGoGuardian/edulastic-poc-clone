import joi from 'joi';

export const userTestItemActivitySchema = {
  testActivityId: joi.string(),
  answers: joi.object(),
  testItemId: joi.string()
};
