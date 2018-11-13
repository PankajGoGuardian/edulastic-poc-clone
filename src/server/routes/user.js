import joi from 'joi';
import express from 'express';
import UserModel from '../models/user';
import { userSchema } from '../validators/user';
import { generateAuthToken } from '../utils/token';
import { hashPassword, comparePassword } from '../utils/passwordHash';
import { successHandler } from '../utils/responseHandler';

const router = express.Router();

// login api
router.post('/login', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, userSchema);

    if (body.error) {
      return res.boom.badRequest(res, body.error.message);
    }

    const user = new UserModel();
    const result = await user.getByEmail(data.email);

    if (!result) {
      return res.badRequest('invalid username or password');
    }
    const passwordMatch = await comparePassword(data.password, result.password);
    if (!passwordMatch) {
      return res.boom.badRequest('invalid username or password');
    }
    const token = generateAuthToken({ _id: result._id });
    return successHandler(res, { token });
  } catch (e) {
    console.log('error: ', e);
    res.boom.badRequest(e);
  }
});

// create user api
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, userSchema);
    if (body.error) {
      return res.boom.badRequest(res, body.error.message);
    }
    data.password = await hashPassword(data.password);
    const user = new UserModel();
    const userExists = await user.getByEmail(data.email);
    if (userExists) {
      return res.boom.badRequest('email already exists');
    }
    await user.create(data);
    return successHandler(res, 'account sucesssfully created');
  } catch (e) {
    console.log('error: ', e);
    res.boom.badRequest(res, e);
  }
});

export default router;
