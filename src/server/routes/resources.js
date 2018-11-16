import joi from 'joi';
import { Router } from 'express';
import ResourcesModel from '../models/resources';
import { resourcesSchema, postOutputFormatter } from '../validators/resources';
import { successHandler } from '../utils/responseHandler';

const router = Router();

/**
 * @swagger
 * /resources:
 *   post:
 *     tags:
 *       - Resource
 *     summary: Create a data source
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: resources
 *          in: body
 *     responses:
 *       200:
 *         description: successful
 */

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, resourcesSchema);

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const resources = new ResourcesModel();
    const result = await resources.create(data);
    const output = postOutputFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /resources:
 *   get:
 *     tags:
 *       - Resource
 *     summary: Get all data source
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
    limit = !Number.isNaN(limit) ? Number(limit) : 25;
    index = !Number.isNaN(index) ? Number(index) : 0;

    const resources = new ResourcesModel();
    const result = await resources.get(limit, index);
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     tags:
 *       - Resource
 *     summary: Get data source by id
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

    const resources = new ResourcesModel();
    const result = await resources.getById(id);
    const output = postOutputFormatter(result);
    successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /resources/{id}:
 *   put:
 *     tags:
 *       - Resource
 *     summary: Update data source by id
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
    const body = joi.validate(data, resourcesSchema);
    const { id } = req.params;
    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const resources = new ResourcesModel();
    const result = await resources.update(id, data);
    const output = postOutputFormatter(result);
    return successHandler(res, output);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /resources/{id}:
 *   delete:
 *     tags:
 *       - Resource
 *     summary: Delete data source by id
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
    const resources = new ResourcesModel();
    await resources.delete(id);
    return successHandler(res, 'successfully removed entry');
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;
