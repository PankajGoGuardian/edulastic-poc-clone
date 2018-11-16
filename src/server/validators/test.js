import joi from 'joi';
import { pick } from 'lodash';

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
  collections: joi.string().allow(''),
  analytics: joi.any()
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
  'updatedDate'
];

export const createItemFormatter = result => pick(result, createItemFields);
