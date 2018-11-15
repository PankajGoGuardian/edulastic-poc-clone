import joi from 'joi';
import { Router } from 'express';
import TestItemModel from '../models/testItem';
import { testItemSchema, createItemFormatter } from '../validators/testItem';
import { successHandler } from '../utils/responseHandler';

const router = Router();

// get all testITems
router.get('/', async (req, res) => {
  try {
    let { limit, index } = req.query;
    limit = !Number.isNaN(limit) ? Number(limit) : 25;
    index = !Number.isNaN(index) ? Number(index) : 0;

    const item = new TestItemModel();
    const result = await item.get(limit, index);

    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

// create test item
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, testItemSchema);

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const testItem = new TestItemModel();
    const result = await testItem.create(data);
    const output = createItemFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

// update testItem
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, testItemSchema);
    const { id } = req.params;

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const testItem = new TestItemModel();
    const result = await testItem.update(id, data);
    const output = createItemFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

// get testItem by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const item = new TestItemModel();
    const result = await item.getById(id);
    const output = createItemFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

// delete a particular  testItem
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = new TestItemModel();
    await item.delete(id);
    return successHandler(res, 'successfully removed entry');
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;
