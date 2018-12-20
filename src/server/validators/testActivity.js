import joi from 'joi';

export const createTestActivitySchema = {
  assignmentId: joi.string().required()
};
