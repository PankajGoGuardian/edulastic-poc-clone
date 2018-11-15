import joi from 'joi';
import { Router } from 'express';
import TestItemModel from '../models/testItem';
import { testItemSchema, createItemFormatter } from '../validators/testItem';
import { successHandler } from '../utils/responseHandler';

const router = Router();

/**
 * @swagger
 * /testitems:
 *   get:
 *     tags:
 *       - TestItem
 *     summary: Get all testitems
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: question
 *          in: body
 *     responses:
 *       200:
 *         description: successful
 */

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

/**
 * @swagger
 * /testitems:
 *   post:
 *     tags:
 *       - TestItem
 *     summary: Create testitem
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: question
 *          in: body
 *     responses:
 *       200:
 *         description: successful
 */

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

/**
 * @swagger
 * /testitems/{id}:
 *   put:
 *     tags:
 *       - TestItem
 *     summary: Update testitem by ID
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: question
 *          in: body
 *          required: true
 *          example:
 *            id: 5bebe8706c0d6e57f3219113
 *     responses:
 *       200:
 *         description: successful
 */

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

/**
 * @swagger
 * /testitems/{id}:
 *   get:
 *     tags:
 *       - TestItem
 *     summary: Get testitem by ID
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: question
 *          example:
 *            id: 5bebe8706c0d6e57f3219113
 *     responses:
 *       200:
 *         description: successful
 */

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

/**
 * @swagger
 * /testitems/{id}:
 *   delete:
 *     tags:
 *       - TestItem
 *     summary: Delete testitem by ID
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: question
 *          in: body
 *          required: true
 *          example:
 *            id: 5bebe8706c0d6e57f3219113
 *     responses:
 *       200:
 *         description: successful
 */

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
