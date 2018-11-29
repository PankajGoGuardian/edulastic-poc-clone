import express from 'express';
import authApi from './auth';
import userApi from './user';
import testApi from './test';
import fileApi from './files';
import groupApi from './group';
import reportsApi from './reports';
import questionApi from './question';
import testItemsApi from './testItem';
import resourcesApi from './resources';
import elasticSearchApi from './elasticSearch';
import userTestActivity from './userTestActivity';
import userTestItemActivity from './userTestItemActivity';

const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);
router.use('/file', fileApi);
router.use('/test', testApi);
router.use('/group', groupApi);
router.use('/question', questionApi);
router.use('/report', reportsApi);
router.use('/resources', resourcesApi);
router.use('/search', elasticSearchApi);
router.use('/testitem', testItemsApi);
router.use('/usertestactivity', userTestActivity);
router.use('/usertestitemactivity', userTestItemActivity);

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
