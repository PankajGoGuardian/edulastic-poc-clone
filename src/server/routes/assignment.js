import joi from 'joi';
import { Router } from 'express';
import EnrollmentModel from '../models/enrollment';
import AssignmentModel from '../models/assignments';
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

    console.log('user Id', req.user._id);
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

router.get('/assigned', async (req, res) => {
  try {
    const Enrollment = new EnrollmentModel();
    const Assignments = new AssignmentModel();
    const userId = req.user._id;
    const classDetails = await Enrollment.getClassOfStudent(userId);
    const classId = classDetails.groupId;
    const assignments = await Assignments.getByClassId(classId);
    return successHandler(res, assignments);
  } catch (e) {
    res.log.error(e);
    res.boom.badRequest(e);
  }
});

export default router;
