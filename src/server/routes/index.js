import express from 'express';
import userApi from './user';

const router = express.Router();

router.use('/user', userApi);
/**
 * @swagger
 * /hello:
 *   get:
 *     tags:
 *       - test
 *     description: test api
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: sucessfull
 */
router.get('/hello', (req, res) => {
  res.json({
    message: 'edulastic api',
    version: '0.1',
  });
});

export default router;
