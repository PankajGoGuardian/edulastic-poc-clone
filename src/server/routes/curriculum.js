import { Router } from 'express';
import CurriculumModel from '../models/curriculum';
import { successHandler } from '../utils/responseHandler';

const router = Router();

/**
 * @swagger
 * /curriculum:
 *   get:
 *     tags:
 *       - Curriculums
 *     summary: Get all curriculums
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: limit
 *          in: query
 *        - name: index
 *          in: query
 *     responses:
 *       200:
 *         description: successful
 */

router.get('/', async (req, res) => {
  try {
    let { limit, skip } = req.query;

    limit = !Number.isNaN(limit) ? Number(limit) : 25;
    skip = !Number.isNaN(skip) ? Number(skip) : 0;

    const curriculum = new CurriculumModel();
    const result = await curriculum.get(limit, skip);
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

export default router;
