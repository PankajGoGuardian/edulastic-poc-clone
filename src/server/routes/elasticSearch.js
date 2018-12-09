import joi from 'joi';
import express from 'express';
import { elasticSearchStandardsSchema } from '../validators/elasticSearch';
import { successHandler } from '../utils/responseHandler';
import axios from '../utils/axiosInstance';
import config from '../config';
import { createStandardsSearch } from '../utils/elasticSearchHelpers';

const router = express.Router();

// search standards
router.post('/standards', async (req, res) => {
  try {
    const rawData = req.body;
    const body = joi.validate(rawData, elasticSearchStandardsSchema);

    if (body.error) {
      return res.boom.badRequest(res, body.error.message);
    }

    const data = createStandardsSearch(rawData);
    const { data: searchResult } = await axios({
      method: 'POST',
      url: config.elasticSearch.uri,
      data
    });

    return successHandler(res, searchResult);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

export default router;
