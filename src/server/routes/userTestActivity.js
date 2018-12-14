import joi from 'joi';
import { Router } from 'express';
import { successHandler } from '../utils/responseHandler';
import UserTestActivityModel from '../models/userTestActivity';
import TestItemActivityModel from '../models/userTestItemActivity';
import scoreTestActivity from '../utils/scoreTest';
import { getTotalQuestions } from '../utils/test';
import {
  userTestActivitySchema,
  submitTestSchema
} from '../validators/userTestActivity';

const router = Router();

/**
 * @swagger
 * /usertestactivity:
 *   post:
 *     tags:
 *       - TestActivity
 *     summary: Create user testActivity
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: testactivity
 *          in: body
 *     responses:
 *       200:
 *         description: successful
 */
// create user test activity
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, userTestActivitySchema);

    if (body.error) {
      res.boom.badRequest(body.error.message);
    }

    data.userId = req.user._id;
    const testActivity = new UserTestActivityModel();
    const result = await testActivity.create(data);
    const testActivityId = result._id;

    return successHandler(res, {
      testActivityId
    });
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /usertestactivity/{id}/previousResponses:
 *   get:
 *     tags:
 *       - TestActivity
 *     summary: Fetching previous responses
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          example:
 *            id: 5bebe8706c0d6e57f3219113
 *     responses:
 *       200:
 *         description: successful
 */
router.get('/:id/previousResponses', async (req, res) => {
  try {
    const testActivityId = req.params.id;
    const TestItemActivity = new TestItemActivityModel();
    const result = await TestItemActivity.getByTestActivityId(
      testActivityId,
      req.user._id
    );

    let answers = {};
    result.forEach((item) => {
      answers = { ...answers, ...item.answers };
    });

    return successHandler(res, answers);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /usertestactivity/submit:
 *   post:
 *     tags:
 *       - TestActivity
 *     summary: Submit test
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: id
 *          in: body
 *          required: true
 *          example:
 *            testActivityId: ahgjsgjdghsshvd
 *     responses:
 *       200:
 *         description: successful
 */
router.post('/submit', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, submitTestSchema);
    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const userId = req.user._id;
    const { testActivityId } = req.body;
    const TestActivity = new UserTestActivityModel();
    const activityDetails = await TestActivity.getById(testActivityId);
    if (activityDetails.userId !== userId) {
      return res.boom.badRequest('invalid request');
    }
    const totalQuestion = await getTotalQuestions(activityDetails.testId);
    const { score, correctAnswers } = await scoreTestActivity(testActivityId, userId);
    await TestActivity.update(testActivityId, {
      score,
      totalQuestion,
      correctAnswers,
      status: 'graded'
    });
    return successHandler(res, 'sucesfully submitted');
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;

/**
 * @swagger
 * /usertestactivity:
 *   get:
 *     tags:
 *       - TestActivity
 *     summary: Fetching users test activities
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: status
 *          in: query
 *          example:
 *            status: graded
 *     responses:
 *       200:
 *         description: successful
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    const userId = req.user._id;
    const TestActivity = new UserTestActivityModel();
    const testActivities = await TestActivity.getByUser(userId, { status });

    return successHandler(res, testActivities);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

router.get('/summary', async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const TestActivity = new UserTestActivityModel();
    const testActivities = await TestActivity.getByFields({ userId });
    return successHandler(res, testActivities);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
