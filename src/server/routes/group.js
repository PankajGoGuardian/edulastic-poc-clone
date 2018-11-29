import joi from 'joi';
import { Router } from 'express';
import GroupModel from '../models/group';
import { groupSchema } from '../validators/group';
import { successHandler } from '../utils/responseHandler';

const router = Router();

/**
 * @swagger
 * /group:
 *   post:
 *     tags:
 *       - Group
 *     summary: Create a group
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: group
 *          in: body
 *     responses:
 *       200:
 *         description: successful
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const body = joi.validate(data, groupSchema);

    if (body.error) {
      return res.boom.badRequest(body.error.message);
    }

    const Group = new GroupModel();
    const result = await Group.create(data);
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});

/**
 * @swagger
 * /group/mygroups:
 *   get:
 *     tags:
 *       - Group
 *     summary: Get all groups where i am the owner
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: limit
 *          in: query
 *        - name: skip
 *          in: query
 *     responses:
 *       200:
 *         description: successful
 */
router.get('/mygroups', async (req, res) => {
  try {
    let { limit, skip } = req.query;
    limit = !Number.isNaN(limit) ? Number(limit) : 25;
    skip = !Number.isNaN(skip) ? Number(skip) : 0;

    const Group = new GroupModel();
    const result = await Group.getByOwnerId(req.user._id, { limit, skip });
    return successHandler(res, result);
  } catch (e) {
    req.log.error(e);
    res.boom.badRequest(e);
  }
});
export default router;
