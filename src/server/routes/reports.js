import { Router } from 'express';
import { successHandler } from '../utils/responseHandler';
import UserTestActivityModel from '../models/userTestActivity';
import TestModel from '../models/test';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const TestActivity = new UserTestActivityModel();
    const Test = new TestModel();
    const testActivities = await TestActivity.getByUser(userId, {
      status: 'graded'
    });
    const testIds = testActivities.map(item => item.testId);
    const testResult = await Test.getByIds(testIds);
    const tests = {};
    testResult.forEach((testItem) => {
      tests[testItem._id] = testItem.title;
    });
    const result = testActivities.map(activity => ({
      ...activity._doc,
      testName: tests[activity.testId]
    }));

    successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;
