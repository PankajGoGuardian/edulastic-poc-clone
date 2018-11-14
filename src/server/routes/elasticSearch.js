import joi from 'joi';
import express from 'express';
import { elasticSearchQuerySchema } from '../validators/elasticSearchQuery';
import { successHandler } from '../utils/responseHandler';
import axios from '../utils/axiosInstance';
import config from '../config';
import { createSearchByFieldsRequest } from '../utils/elasticSearchHelpers';

const router = express.Router();

// search by fields api
router.post('/fields', async (req, res) => {
  try {
    const rawData = req.body;
    const body = joi.validate(rawData, elasticSearchQuerySchema);

    if (body.error) {
      return res.boom.badRequest(res, body.error.message);
    }

    const data = createSearchByFieldsRequest(rawData);
    const { data: searchResult } = await axios({
      method: 'POST',
      url: config.elasticSearch.uri,
      data,
    });

    return successHandler(res, searchResult);
  } catch (e) {
    console.log('error: ', e);
    res.boom.badRequest(e);
  }
});

export default router;
