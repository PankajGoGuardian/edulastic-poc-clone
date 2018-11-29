import joi from 'joi';

export const enrollmentSchema = {
  type: joi.string().required(),
  groupId: joi.string().required(),
  userId: joi.string().required(),
  startDate: joi.string(),
  endDate: joi.string(),
  status: joi.string().required()
};
