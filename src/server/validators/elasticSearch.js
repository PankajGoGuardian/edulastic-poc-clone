import joi from 'joi';

export const elasticSearchStandardsSchema = {
  curriculumId: joi.string(),
  grades: joi.array().items(joi.string()),
  search: joi.string()
};
