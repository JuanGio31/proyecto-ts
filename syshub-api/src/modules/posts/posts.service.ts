import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const imagenerAGuardar = createPostDto.nombres_imagenes?.map((nombre) => ({
      nombre_archivo: nombre,
    })) || [];

    const nuevoPost = this.postRepository.create({
      contenido: createPostDto.contenido,
      autor: { id_usuario: userId },
      imagenes: imagenerAGuardar,
    });
    return await this.postRepository.save(nuevoPost);
  }

  async findAll() {
    return this.postRepository.find({
      relations: ['autor', 'autor.carrera', 'imagenes'],
      order: { fecha_publicacion: 'DESC' },
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
