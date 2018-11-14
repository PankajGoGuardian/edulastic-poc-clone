import joi from 'joi';
import { pick } from 'lodash';

// required output fields
const postOutputFields = ['_id', 'data', 'metadata'];

export const questionSchema = {
  data: joi.object(),
  metadata: joi.object()
};

export const postOutputFormatter = result => pick(result, postOutputFields);
