import joi from 'joi';

// TODO: old one, remove
export const userTestItemActivitySchema = {
  testActivityId: joi.string(),
  answers: joi.object(),
  testItemId: joi.string()
};

export const TestItemActivitySchema = {
  userResponse: joi.object()
};
