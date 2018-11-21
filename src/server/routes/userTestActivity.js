import joi from 'joi';
import { Router } from 'express';
import { successHandler } from '../utils/responseHandler';
import UserTestActivityModel from '../models/userTestActivity';
import TestItemActivityModel from '../models/userTestItemActivity';
import { userTestActivitySchema } from '../validators/userTestActivity';

const router = Router();

// create user test activity
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, userTestActivitySchema);

    if (body.errors) {
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
export default router;
