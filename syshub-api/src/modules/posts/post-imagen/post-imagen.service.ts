import { Injectable } from '@nestjs/common';
import { CreatePostImagenDto } from './dto/create-post-imagen.dto';
import { UpdatePostImagenDto } from './dto/update-post-imagen.dto';

@Injectable()
export class PostImagenService {
  create(createPostImagenDto: CreatePostImagenDto) {
    return 'This action adds a new postImagen';
  }

  findAll() {
    return `This action returns all postImagen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postImagen`;
  }

  update(id: number, updatePostImagenDto: UpdatePostImagenDto) {
    return `This action updates a #${id} postImagen`;
  }

  remove(id: number) {
    return `This action removes a #${id} postImagen`;
  }
}
