// eslint-disable-next-line import/no-unresolved
import AWS from 'aws-sdk';
// eslint-disable-next-line import/no-unresolved
import multer from 'multer';
// eslint-disable-next-line import/no-unresolved
import multerS3 from 'multer-s3';
import config from '../config';

const { key, keyId } = config.s3;

AWS.config.update({
  accessKeyId: keyId,
  secretAccessKey: key
});

const s3 = new AWS.S3({});

export const s3Upload = multer({
  storage: multerS3({
    s3,
    bucket: 'edureact-dev',
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, `${Date.now().toString()}_${file.originalname}`);
    }
  })
});
