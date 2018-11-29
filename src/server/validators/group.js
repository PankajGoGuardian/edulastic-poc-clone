import joi from 'joi';

export const ownerSchema = {
  id: joi.string(),
  type: joi.string()
};

export const groupSchema = {
  name: joi.string().required(),
  type: joi.string().required(),
  parent: joi.object(),
  owners: joi.array().items(ownerSchema)
};
