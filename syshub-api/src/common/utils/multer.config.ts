import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  // Destino: La carpeta donde se guardarán las imágenes
  storage: diskStorage({
    destination: './uploads/perfiles',
    filename: (req, file, cb) => {
      // Generar un nombre de archivo unico
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),

  //Filtro de tipo de archivo
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPG, PNG, GIF)'), false);
    }
  },

  //Limite de tamaño
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
};
