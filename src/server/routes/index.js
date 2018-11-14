import express from 'express';
import authApi from './auth';
import userApi from './user';
import elasticSearchApi from './elasticSearch';

const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);
router.use('/search', elasticSearchApi);

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
