import joi from 'joi';
import { Router } from 'express';
import { successHandler } from '../utils/responseHandler';
import { userTestItemActivitySchema } from '../validators/userTestItemActivity';
import UserTestItemActivity from '../models/userTestItemActivity';

const router = Router();

// create user testActivityitem
router.post('/', async (req, res) => {
  try {
    let data = req.body;
    let body = joi.validate(data, userTestItemActivitySchema);

    if (body.error) {
      res.boom.badRequest(body.error.message);
    }

    data.userId = req.user._id;

    let testItemActivity = new UserTestItemActivity();
    await testItemActivity.create(data);
    return successHandler(res, 'save');
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

export default router;
