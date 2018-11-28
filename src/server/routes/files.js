import { Router } from 'express';
import { s3Upload } from '../services/aws';
import { successHandler } from '../utils/responseHandler';

const router = Router();

router.post('/upload', s3Upload.single('file'), (req, res) => {
  const { location } = res.req.file;
  return successHandler(res, {
    fileUri: location
  });
});

export default router;
