import joi from 'joi';
import { Router } from 'express';
import EnrollmentModel from '../models/enrollment';
import AssignmentModel from '../models/assignments';
import TestModel from '../models/test';
import UserTestActivityModel from '../models/userTestActivity';
import { assignmentSchema } from '../validators/assignment';
import { successHandler } from '../utils/responseHandler';

const router = Router();

/**
 * create assignment
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, assignmentSchema);

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const Assignment = new AssignmentModel();

    const result = await Assignment.create(data);

    return successHandler(res, result);
  } catch (e) {
    res.log.error(e);
    res.boom.badRequest(e);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const body = joi.validate(data, assignmentSchema);
    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const Assignment = new AssignmentModel();
    const result = await Assignment.update(id, data);
    return successHandler(res, result);
  } catch (e) {
    res.log.error(e);
    res.boom.badRequest(e);
  }
});

router.get('/assigned', async (req, res) => {
  try {
    const Enrollment = new EnrollmentModel();
    const Assignments = new AssignmentModel();
    const Test = new TestModel();
    const userId = req.user._id;
    const enrollment = await Enrollment.getClassOfStudent(userId);
    if (!enrollment) {
      return successHandler(res, []);
    }
    const { groupId } = enrollment;
    const assignments = await Assignments.getByClassId(groupId, userId);
    const testIds = assignments.map(item => item.testId);
    const result = await Test.getByIds(testIds);
    const tests = {};
    result.forEach(({ _doc: { _id, ...test } }) => {
      tests[_id] = test;
    });


    assignments.forEach((assignment) => {
      const { testId } = assignment;
      assignment._doc.test = tests[testId];
    });
    return successHandler(res, assignments);
  } catch (e) {
    res.log.error(e);
    res.boom.badRequest(e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const Assignments = new AssignmentModel();
    await Assignments.delete(id);
    return successHandler(res, 'sucessfully deleted the assignment');
  } catch (e) {
    res.log.error(e);
    res.boom.badRequest(e);
  }
});

// fetch summary for a particular assignment
router.get('/:id/test-activity/summary', async (req, res) => {
  try {
    const { id: assignmentId } = req.params;
    const { _id: userId } = req.user;
    const { status = 'graded' } = req.query;
    const UserTestActivity = new UserTestActivityModel();
    const testActivities = await UserTestActivity.getByFields({ assignmentId, userId, status });
    return successHandler(res, testActivities);
  } catch (e) {
    res.log.error(e);
    res.boom.badRequest(e);
  }
});

router.get('/', async (req, res) => {
  try {
    const Enrollment = new EnrollmentModel();
    const Assignments = new AssignmentModel();
    const Test = new TestModel();
    const userId = req.user._id;
    const enrollments = await Enrollment.getClassListByStudent(userId);
    if (!enrollments.length) {
      return successHandler(res, []);
    }
    const groupIds = enrollments.map(enrollment => enrollment.groupId);
    const assignments = await Assignments.getByClassList(groupIds, userId);
    const testIds = assignments.map(item => item.testId);
    const result = await Test.getByIds(testIds);
    const tests = {};
    result.forEach(({ _doc: { _id, ...test } }) => {
      tests[_id] = test;
    });

    assignments.forEach((assignment) => {
      const { testId } = assignment;
      assignment._doc.test = tests[testId];
    });
    return successHandler(res, assignments);
  } catch (e) {
    res.log.error(e);
    res.boom.badRequest(e);
  }
});

export default router;
