// multer.config.ts
import * as fs from 'fs';
import { diskStorage } from 'multer';

export const multerConfig = {
  dest: './uploads', // specify your upload directory
  storage: diskStorage({
    destination: (req, file, callback) => {
      if (!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads');
      }
      callback(null, './uploads');
    },
    filename: (req, file, callback) => {
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      callback(null, `${timestamp}-${file.originalname}`);
    },
  }),
};
