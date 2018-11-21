import joi from 'joi';
import { Router } from 'express';
import TestItemModel from '../models/testItem';
import QuestionModel from '../models/question';
import { getQuestionsData } from '../utils/questions';
import { successHandler } from '../utils/responseHandler';
import { evaluateAnswer } from '../utils/evaluation';
import {
  testItemSchema,
  createItemFormatter,
  evaluationSchema
} from '../validators/testItem';

const router = Router();

// return count of test
router.get('/count', async (req, res) => {
  try {
    const testItem = new TestItemModel();
    const result = await testItem.getCount();
    return successHandler(res, { count: result });
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
/**
 * @swagger
 * /testitem:
 *   get:
 *     tags:
 *       - TestItem
 *     summary: Get all testitems
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
    let { limit, index } = req.query;
    const { data, validation } = req.query;
    limit = !Number.isNaN(limit) ? Number(limit) : 25;
    index = !Number.isNaN(index) ? Number(index) : 0;

    const testItem = new TestItemModel();
    const testItems = await testItem.get(limit, index);

    // add question data!
    const isAuthor = validation === 'true';
    const isData = data === 'true';
    let result;
    if (isData) {
      result = [];
      /*eslint-disable */
      for (const item of testItems) {
        const questions = await getQuestionsData(item, isAuthor);
        result.push({
          ...item._doc,
          data: { questions }
        });
      }
      /* eslint-enable */
    }

    result = result || testItems;
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /testitem:
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
 * /testitem/{id}:
 *   put:
 *     tags:
 *       - TestItem
 *     summary: Update testitem by ID
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
    const body = joi.validate(data, testItemSchema);
    const { id } = req.params;

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const testItem = new TestItemModel();
    const item = await testItem.update(id, data);

    const output = [];

    /*eslint-disable */

    const questions = await getQuestionsData(item, true);
    output.push({
      ...item._doc,
      data: { questions }
    });

    /* eslint-enable */

    // const output = createItemFormatter(result);
    return successHandler(res, output[0]);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /testitem/{id}:
 *   get:
 *     tags:
 *       - TestItem
 *     summary: Get testitem by ID
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
    const { data, validation } = req.query;
    const item = new TestItemModel();
    const result = await item.getById(id);
    let output;

    // should it return question data and validation?
    const isAuthor = validation === 'true';
    const isData = data === 'true';
    if (isData) {
      const questions = await getQuestionsData(result, isAuthor);
      output = {
        ...result._doc,
        data: {
          questions
        }
      };
    }

    return successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /testitem/{id}:
 *   delete:
 *     tags:
 *       - TestItem
 *     summary: Delete testitem by ID
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
    const item = new TestItemModel();
    await item.delete(id);
    return successHandler(res, 'successfully removed entry');
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;

// evaluation api
router.post('/:id/evaluate', async (req, res) => {
  try {
    const { answers } = req.body;
    const body = joi.validate(req.body, evaluationSchema);

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const qIds = Object.keys(answers);
    const question = new QuestionModel();
    const questions = await question.selectQuestionsByIds(qIds);

    const questionsData = questions.map(({ data, _id }) => ({
      _id,
      type: data.type,
      validation: data.validation,
      userResponse: answers[_id]
    }));

    const evaluation = {};
    questionsData.forEach((item) => {
      evaluation[item._id] = evaluateAnswer(item);
    });

    return successHandler(res, evaluation);
  } catch (e) {
    res.log.error(e);
    res.boom.badRequest(e);
  }
});
