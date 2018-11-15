import joi from 'joi';
import { Router } from 'express';
import TestModel from '../models/test';
import { testSchema, createItemFormatter } from '../validators/test';
import { successHandler } from '../utils/responseHandler';

const router = Router();

// create test
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, testSchema);

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const test = new TestModel();
    const result = await test.create(data);
    const output = createItemFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

router.get('/', async (req, res) => {
  try {
    let { limit, index } = req.query;

    limit = !Number.isNaN(limit) ? Number(limit) : 25;
    index = !Number.isNaN(index) ? Number(index) : 0;

    const test = new TestModel();
    const result = await test.get(limit, index);

    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const test = new TestModel();
    const result = await test.getById(id);

    const output = createItemFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, testSchema);
    const { id } = req.params;

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const test = new TestModel();
    const result = await test.update(id, data);
    const output = createItemFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const test = new TestModel();
    await test.delete(id);
    return successHandler(res, 'sucessfully removed entry');
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;
