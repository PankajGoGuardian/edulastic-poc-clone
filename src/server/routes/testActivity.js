import { Router } from 'express';
import { testActivityStatus } from '@edulastic/constants';
import TestActivityModel from '../models/userTestActivity';
import { successHandler } from '../utils/responseHandler';

const router = Router();

const {
  START,
  SUBMITTED
} = testActivityStatus;

/**
 * @swagger
 * /test-activity/summary:
 *   get:
 *     tags:
 *       - testActivity
 *     summary: Get testActivity for a particular user
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: status
 *          in: query
 *          example:
 *            status: start
 *     responses:
 *       200:
 *         description: successful
 */
router.get('/summary', async (req, res) => {
  try {
    let { status } = req.query;
    const { _id: userId } = req.user;
    status = [START, SUBMITTED].includes(status)
      ? status
      : undefined;

    const fields = { userId };
    if (status) fields.status = status;
    const TestActivity = new TestActivityModel();
    const result = await TestActivity.getByFields(fields);
    return successHandler(res, result);
  } catch (e) {
    console.log(e);
    res.boom.badRequest(e);
  }
});

export default router;
