import joi from 'joi';
import { Router } from 'express';
import TestModel from '../models/test';
import TestItemModel from '../models/testItem';
import { getQuestionsData } from '../utils/questions';
import { testSchema, createItemFormatter } from '../validators/test';
import { successHandler } from '../utils/responseHandler';

const router = Router();

/**
 * @swagger
 * /test/count:
 *   get:
 *     tags:
 *       - Tests
 *     summary: Get test count
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful
 */

router.get('/count', async (req, res) => {
  try {
    const test = new TestModel();
    const result = await test.getCount();
    return successHandler(res, { count: result });
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /test:
 *   post:
 *     tags:
 *       - Tests
 *     summary: Create a test
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: test
 *          in: body
 *     responses:
 *       200:
 *         description: successful
 */
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

/**
 * @swagger
 * /test:
 *   get:
 *     tags:
 *       - Tests
 *     summary: Get all test
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: limit
 *          in: query
 *        - name: index
 *          in: query
 *     responses:
 *       200:
 *         description: successful
 */

router.get('/', async (req, res) => {
  try {
    let { limit, skip } = req.query;

    limit = !Number.isNaN(limit) ? Number(limit) : 25;
    skip = !Number.isNaN(skip) ? Number(skip) : 0;

    const test = new TestModel();
    const result = await test.get(limit, skip);
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /test/{id}:
 *   get:
 *     tags:
 *       - Tests
 *     summary: Get test by id
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          example:
 *            id: 5bebe8706c0d6e57f3219113
 *     responses:
 *       200:
 *         description: successful
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.query;
    const Test = new TestModel();
    const TestItem = new TestItemModel();
    const test = await Test.getById(id);

    const testItemIds = test.testItems;
    const testItems = await TestItem.getByIds(testItemIds);

    const result = [];
    if (data) {
      /*eslint-disable */
      for (const item of testItems) {
        const questions = await getQuestionsData(item, false);
        result.push({
          ...item._doc,
          data: { questions }
        });
      }
      /* eslint-enable */
    }
    test.testItems = result;
    return successHandler(res, test);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /test/{id}:
 *   put:
 *     tags:
 *       - Tests
 *     summary: Update test by id
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: id
 *          in: path
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

/**
 * @swagger
 * /test/{id}:
 *   delete:
 *     tags:
 *       - Tests
 *     summary: Delete test by id
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: id
 *          in: path
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
    const test = new TestModel();
    await test.delete(id);
    return successHandler(res, 'sucessfully removed entry');
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;
