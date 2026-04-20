import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const path = req.route?.path || '';
      let destino = './uploads/perfiles';

      if (path.includes('/posts')) {
        destino = './uploads/posts';
      }

      if (!existsSync(destino)) {
        mkdirSync(destino, { recursive: true });
      }

      cb(null, destino);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      cb(null, `${uniqueSuffix}${extension}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imagenes (JPG, JPEG, PNG, WEBP)'), false);
    }
  },

  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
};
