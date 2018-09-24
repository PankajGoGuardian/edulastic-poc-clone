import { Router } from 'express';
import assessmentRouter from './assessment/routes';
import questionRouter from './question/routes';
const router = Router();

// register routes
router.use('/assessment', assessmentRouter);
router.use('/question', questionRouter);

export default router;
