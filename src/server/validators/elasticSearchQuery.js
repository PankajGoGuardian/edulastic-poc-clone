import joi from 'joi';

const gradesBaseSchema = joi.object({ grades: joi.string() });

const subjectBaseSchema = joi.object({ subject: joi.string() });
const collection1BaseSchema = joi.object({ collection1: joi.string() });
const depthOfKnowledgeBaseSchema = joi.object({ depthOfKnowledge: joi.string() });
const difficultyBaseSchema = joi.object({ difficulty: joi.string() });
const questionTypesBaseSchema = joi.object({ questionTypes: joi.string() });
const standardsStandardSetBaseSchema = joi.object({ 'standards.standardSet': joi.string() });
const standardsDomainsStandardsNameBaseSchema = joi.object({ 'standards.domains.standards.name': joi.string() });

const itemsSchema = joi.array().items(
  gradesBaseSchema,
  subjectBaseSchema,
  collection1BaseSchema,
  depthOfKnowledgeBaseSchema,
  difficultyBaseSchema,
  questionTypesBaseSchema,
  standardsStandardSetBaseSchema,
  standardsDomainsStandardsNameBaseSchema,
);

export const elasticSearchQuerySchema = {
  orSearch: itemsSchema,
  andSearch: itemsSchema,
};
