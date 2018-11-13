import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'edulastic api',
    version: '0.1',
  });
});

export default router;
