import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostImagenService } from './post-imagen.service';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '@app/common/utils/multer.config';

@Controller('posts/imagenes')
export class PostImagenController {
  constructor(private readonly postImagenService: PostImagenService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FilesInterceptor('imagenes', 4, multerOptions))
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      return { nombres_archivos: [] };
    }
    return {
      nombres_archivos: files.map((file) => file.filename),
    };
  }
}
