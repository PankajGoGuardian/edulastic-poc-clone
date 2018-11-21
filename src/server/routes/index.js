import express from 'express';
import authApi from './auth';
import userApi from './user';
import testApi from './test';
import fileApi from './files';
import questionApi from './question';
import testItemsApi from './testItem';
import resourcesApi from './resources';
import elasticSearchApi from './elasticSearch';
import userTestActivity from './userTestActivity';

const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);
router.use('/file', fileApi);
router.use('/test/', testApi);
router.use('/question', questionApi);
router.use('/resources', resourcesApi);
router.use('/search', elasticSearchApi);
router.use('/testitem', testItemsApi);
router.use('/usertestactivity', userTestActivity);
/**
 * @swagger
 * /hello:
 *   get:
 *     tags:
 *       - Test
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
    version: '0.1'
  });
});

export default router;
