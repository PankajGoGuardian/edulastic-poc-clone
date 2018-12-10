import joi from 'joi';
import express from 'express';
import { elasticSearchStandardsSchema } from '../validators/elasticSearch';
import { successHandler } from '../utils/responseHandler';
import axios from '../utils/axiosInstance';
import config from '../config';
import { createStandardsSearch } from '../utils/elasticSearchHelpers';

const router = express.Router();

/**
 * @swagger
 * /search/standards:
 *   post:
 *     tags:
 *       - Standards
 *     summary: Search standards
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: curriculumId
 *          in: body
 *          example:
 *            curriculumId: "101fb864c08631ce28aa61bd"
 *        - name: grades
 *          in: body
 *          example:
 *            grades: ["K", "1"]
 *        - name: search
 *          in: body
 *          example:
 *            search: "K.CC"
 *     responses:
 *       200:
 *         description: successful
 */
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
