import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const createDiskStorage = (folder: string) =>
  diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `uploads/${folder}`;
      if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      cb(null, unique);
    },
  });

export const imageFileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
};

export const toFileUrl = (file: Express.Multer.File) =>
  `/${file.path.replace(/\\/g, '/')}`;
