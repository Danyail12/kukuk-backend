import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
dotenv.config({
    path: './config/config.env'
});

const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
  },
  region: process.env.AWS_REGION,
  endpoint: 'https://s3.hidrive.strato.com'
});

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString());
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only (jpeg, jpg, png, gif, mp4, mov, png)!');
  }
}

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}); 

export default upload;
