import joi from 'joi';
import { Router } from 'express';
import QuestionModel from '../models/question';
import { questionSchema, postOutputFormatter } from '../validators/question';
import { successHandler } from '../utils/responseHandler';

const router = Router();

/**
 * @swagger
 * /question:
 *   post:
 *     tags:
 *       - Question
 *     summary: Create a question
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
    const body = joi.validate(data, questionSchema);

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const question = new QuestionModel();
    const result = await question.create(data);
    const output = postOutputFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /question:
 *   get:
 *     tags:
 *       - Question
 *     summary: Get all question
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

    const question = new QuestionModel();
    const result = await question.get(limit, index);
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /question/{id}:
 *   get:
 *     tags:
 *       - Question
 *     summary: Get question by id
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: id
 *          example:
 *            id: 5bebe8706c0d6e57f3219113
 *     responses:
 *       200:
 *         description: successful
 */

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const question = new QuestionModel();
    const result = await question.getById(id);
    const output = postOutputFormatter(result);
    successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /question/{id}:
 *   put:
 *     tags:
 *       - Question
 *     summary: Update question by id
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: id
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
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /question/{id}:
 *   delete:
 *     tags:
 *       - Question
 *     summary: Delete question by id
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: id
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
    const question = new QuestionModel();
    await question.delete(id);
    return successHandler(res, 'successfully removed entry');
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;
