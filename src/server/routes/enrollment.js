import joi from 'joi';
import { Router } from 'express';
import UserModel from '../models/user';
import EnrollmentModel from '../models/enrollment';
import { enrollmentSchema } from '../validators/enrollment';
import { successHandler } from '../utils/responseHandler';

const router = Router();

export default router;

/**
 * @swagger
 * /enrollment/:
 *   post:
 *     tags:
 *       - Enrollment
 *     summary: Create an Enrollment
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: enrollment
 *          in: body
 *     responses:
 *       200:
 *         description: successful
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, enrollmentSchema);

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const Enrollment = new EnrollmentModel();
    const result = await Enrollment.create(data);
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /enrollment/class/{classId}:
 *   get:
 *     tags:
 *       - Enrollment
 *     summary: Get students for a particualr class
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: classId
 *          in: path
 *          required: true
 *          example:
 *            classId: 5bebe8706c0d6e57f3219113
 *        - name: index
 *          in: query
 *     responses:
 *       200:
 *         description: successful
 */

router.get('/class/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const Enrollment = new EnrollmentModel();
    const User = new UserModel();
    const students = await Enrollment.getStudentsByClass(classId);
    const studentIds = students.map(user => user.userId);
    const details = await User.getByIds(studentIds);
    return successHandler(res, details);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
