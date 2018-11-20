import joi from 'joi';
import { pick } from 'lodash';
// create testItem output fields
const createItemFields = ['_id', 'data', 'rows', 'columns', 'tags', 'metadata'];

export const testItemSchema = {
  rows: joi.array(),
  columns: joi.array(),
  tags: joi.object(),
  metadata: joi.array()
};

export const evaluationSchema = {
  answers: joi.object()
};
export const createItemFormatter = result => pick(result, createItemFields);
