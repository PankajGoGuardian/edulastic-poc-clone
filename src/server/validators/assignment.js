import joi from 'joi';

export const assignmentSchema = {
  testId: joi.string(),
  assignedBy: joi.object(),
  startDate: joi.string(),
  endDate: joi.string(),
  class: joi.object()
};
