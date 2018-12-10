import joi from 'joi';
import { pick } from 'lodash';

// required output fields
const postOutputFields = ['_id', 'data', 'metadata', 'alignment'];

export const questionSchema = {
  data: joi.object(),
  metadata: joi.object(),
  alignment: joi.array().items(joi.object())
};

export const postOutputFormatter = result => pick(result, postOutputFields);
