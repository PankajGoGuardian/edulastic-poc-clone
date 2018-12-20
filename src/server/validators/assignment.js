import joi from 'joi';


export const assignmentSchema = {
  testId: joi.string(),
  assignedBy: joi.object(),
  startDate: joi.string(),
  endDate: joi.string(),
  class: joi.array(),
  students: joi.array(),
  openPolicy: joi.string(),
  closePolicy: joi.string(),
  specificStudents: joi.boolean()
};


export const submitAssignmentSchema = {
  status: joi.string().required()
};
