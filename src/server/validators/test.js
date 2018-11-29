import joi from 'joi';
import { pick } from 'lodash';

const sharingSchema = joi.object({
  permission: joi.string().required(), // move it to a set of values
  type: joi.string().required(), // .valid()
  id: joi.string().required(),
  name: joi.string(),
  level: joi.string()
});

export const testSchema = {
  title: joi.string().allow(''),
  description: joi.string().allow(''),
  renderingType: joi.string().allow(''),
  createdBy: joi.object(),
  status: joi.string().allow(''),
  tags: joi.array(),
  thumbnail: joi.string().uri(),
  scoring: joi.object(),
  testItems: joi.array(),
  assignments: joi.array(),
  standardsTag: joi.object(),
  grades: joi.array(),
  subjects: joi.array(),
  courses: joi.array(),
  collections: joi.any(),
  analytics: joi.any(),
  sharing: joi.array().items(sharingSchema)
};

const createItemFields = [
  '_id',
  'title',
  'description',
  'renderingType',
  'createdBy',
  'status',
  'tags',
  'thumbnail',
  'scoring',
  'testItems',
  'assignments',
  'standardsTag',
  'grades',
  'subjects',
  'courses',
  'collections',
  'analytics',
  'createdDate',
  'updatedDate',
  'sharing'
];

export const createItemFormatter = result => pick(result, createItemFields);
