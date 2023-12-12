import multer from 'multer';
import path from 'path';
import { HttpError } from '../helpers/index.js';

const tempDir = path.resolve('tmp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const uniqueFileName = `${uniqueSuffix}_${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const extention = file.originalname.split('.').pop();
  if (extention === 'exe') {
    return cb(HttpError(400, 'invalid filke extention'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
