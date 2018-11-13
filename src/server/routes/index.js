import express from 'express';

const router = express.Router();

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
