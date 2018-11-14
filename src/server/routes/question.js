import joi from 'joi';
import { Router } from 'express';
import QuestionModel from '../models/question';
import { questionSchema, postOutputFormatter } from '../validators/question';
import { successHandler } from '../utils/responseHandler';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, questionSchema);

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const question = new QuestionModel();
    const result = await question.create(data);
    const output = postOutputFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    console.log('error:', e);
    res.boom.badRequest(e);
  }
});

router.get('/', async (req, res) => {
  try {
    let { limit, index } = req.query;
    limit = !Number.isNaN(limit) ? Number(limit) : 25;
    index = !Number.isNaN(index) ? Number(index) : 0;

    const question = new QuestionModel();
    const result = await question.get(limit, index);
    return successHandler(res, result);
  } catch (e) {
    console.log('error:', e);
    res.boom.badRequest(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const question = new QuestionModel();
    const result = await question.getById(id);
    const output = postOutputFormatter(result);
    successHandler(res, output);
  } catch (e) {
    console.log('error: ', e);
    res.boom.badRequest(e);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, questionSchema);
    const { id } = req.params;
    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const question = new QuestionModel();
    const result = await question.update(id, data);
    const output = postOutputFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    console.log('error: ', e);
    res.boom.badRequest(e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const question = new QuestionModel();
    await question.delete(id);
    return successHandler(res, 'successfully removed entry');
  } catch (e) {
    console.log('error: ', e);
    res.boom.badRequest(e);
  }
});
export default router;
