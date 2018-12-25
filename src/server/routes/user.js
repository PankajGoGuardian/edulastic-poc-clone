import express from 'express';
import UserModel from '../models/user';
import { successHandler } from '../utils/responseHandler';

const router = express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Return the request sending users info
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful
 */
router.get('/', async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const User = new UserModel();
    const result = await User.getById(userId, {});
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

export default router;
