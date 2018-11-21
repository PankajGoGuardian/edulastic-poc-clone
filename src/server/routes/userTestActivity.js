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

router.post('/submit', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, submitTestSchema);
    if (body.error) {
      return res.boom.badRequest(body.errors.message);
    }

    const userId = req.user._id;
    const { testActivityId } = req.body;
    const TestActivity = new UserTestActivityModel();
    const activityDetails = await TestActivity.getById(testActivityId);
    if (activityDetails.userId !== userId) {
      return res.boom.badRequest('invalid request');
    }
    const totalQuestion = await getTotalQuestions(activityDetails.testId);
    const score = await scoreTestActivity(testActivityId, userId);
    await TestActivity.update(testActivityId, {
      score,
      totalQuestion,
      status: 'graded'
    });
    return successHandler(res, 'sucesfully submitted');
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;
