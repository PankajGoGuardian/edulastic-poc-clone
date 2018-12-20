import joi from 'joi';
import { Router } from 'express';
import { testActivityStatus, httpMessages } from '@edulastic/constants';
import TestActivityModel from '../models/userTestActivity';
import AssignmentModel from '../models/assignments';
import TestItemActivityModel from '../models/userTestItemActivity';
import TestModel from '../models/test';
import TestItemModel from '../models/testItem';
import { getTestItemQuestions } from '../utils/testItem';
import { scoreTestItem } from '../utils/scoreItem';
import { successHandler } from '../utils/responseHandler';
import { testItemActivitySchema } from '../validators/testItemActivity';
import { createTestActivitySchema } from '../validators/testActivity';

const router = Router();

const {
  START,
  SUBMITTED
} = testActivityStatus;

// start a test activity
router.post('/', async (req, res) => {
  try {
    const body = joi.validate(req.body, createTestActivitySchema);
    const { _id: userId } = req.user;

    // invalid request
    if (body.error) {
      res.boom.badRequest(body.error.message);
    }

    // is a valid assignment?
    const { assignmentId } = body.value;
    const Assignment = new AssignmentModel();
    const assignment = await Assignment.getById(assignmentId, ['_id', 'testId']);

    if (!assignment) {
      res.boom.notFound(httpMessages.INVALID_ASSIGNMENT);
    }

    // create testActivity and send result
    const { testId } = assignment;
    const TestActivity = new TestActivityModel();
    const result = await TestActivity.create({
      assignmentId,
      testId,
      userId,
      status: START
    });
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

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
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

// save/update user test activity
router.post('/:id/test-item/:itemId', async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const userId = req.user._id;
    const body = joi.validate(req.body, testItemActivitySchema);

    // invalid req object
    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const Test = new TestModel();
    const TestActivity = new TestActivityModel();
    const TestItem = new TestItemModel();

    // if already submitted, userresponse cannot be modified
    const { status, testId } = await TestActivity.getById(id, userId);
    if (status === SUBMITTED) {
      return res.boom.forbidden(httpMessages.ASSIGNMENT_ALREADY_SUBMITTED);
    }

    //  if testItem doesnt belong here, throw an error
    const { testItems } = await Test.getFields(testId, ['testItems']);

    if (!testItems.includes(itemId)) {
      return res.boom.notFound(httpMessages.INVALID_TEST_ITEM);
    }

    const { userResponse } = body.value;

    // check if user response has question that doesnt belong to
    // the test item
    const testItem = await TestItem.getById(itemId);
    const testItemQuestions = getTestItemQuestions(testItem);
    const attemptedQuestions = Object.keys(userResponse);


    /* eslint-disable */
    for (let qId of attemptedQuestions) {
      if (!testItemQuestions.includes(qId)) {
        return res.boom.notFound(httpMessages.INVALID_TEST_ITEM);
      }
    }
    /* eslint-enable */

    const totalQuestions = testItemQuestions.length;
    const TestItemActivity = new TestItemActivityModel();
    const evaluation = await scoreTestItem(userResponse, testItemQuestions);
    const { correct } = evaluation;
    const wrong = totalQuestions - correct;
    // create a new entry if entry doesnt for testActivity + testItem
    // combination, else update
    const result = await TestItemActivity.add({
      testItemId: itemId,
      testActivityId: id,
      answers: userResponse,
      ...evaluation,
      wrong
    });
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;
