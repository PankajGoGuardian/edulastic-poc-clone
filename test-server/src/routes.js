import { Router } from 'express';
import assessmentRouter from './assessment/routes';
import questionRouter from './question/routes';
import itemsRoute from './items/routes';

const router = Router();

// register routes
router.use('/assessment', assessmentRouter);
router.use('/question', questionRouter);
router.use('/items', itemsRoute);

export default router;
