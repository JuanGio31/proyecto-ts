import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostsLike } from './entities/posts-like.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostsLike)
    private readonly postsLikeRepository: Repository<PostsLike>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const imagenerAGuardar =
      createPostDto.nombres_imagenes?.map((nombre) => ({
        nombre_archivo: nombre,
      })) || [];

    const postData: any = {
      contenido: createPostDto.contenido,
      autor: { id_usuario: userId },
      imagenes: imagenerAGuardar,
    };

    if (createPostDto.post_respuesta_id) {
      postData.postRespuesta = { id_post: createPostDto.post_respuesta_id };
    }

    const nuevoPost = this.postRepository.create(postData);
    return await this.postRepository.save(nuevoPost);
  }

  async findAll() {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.autor', 'autor')
      .leftJoinAndSelect('autor.carrera', 'carrera')
      .leftJoinAndSelect('post.imagenes', 'imagenes')
      .leftJoinAndSelect('post.comentarios', 'comentarios')
      .leftJoinAndSelect('comentarios.autor', 'comentarioAutor')
      .leftJoinAndSelect('comentarios.imagenes', 'comentarioImagen')
      .where('post.post_respuesta_id IS NULL')
      .orderBy('post.fecha_publicacion', 'DESC')
      .getMany();
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id_post: id },
      relations: [
        'autor',
        'autor.carrera',
        'imagenes',
        'comentarios',
        'comentarios.autor',
        'comentarios.imagenes',
      ],
    });
    if (!post) {
      throw new NotFoundException(`Post con id ${id} no encontrado`);
    }
    return post;
  }

  async getComentarios(postId: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.autor', 'autor')
      .leftJoinAndSelect('autor.carrera', 'carrera')
      .leftJoinAndSelect('post.imagenes', 'imagenes')
      .where('post.post_respuesta_id = :postId', { postId })
      .orderBy('post.fecha_publicacion', 'ASC')
      .getMany();
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async findMyPosts(userId: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.autor', 'autor')
      .leftJoinAndSelect('autor.carrera', 'carrera')
      .leftJoinAndSelect('post.imagenes', 'imagenes')
      .leftJoinAndSelect('post.comentarios', 'comentarios')
      .leftJoinAndSelect('comentarios.autor', 'comentarioAutor')
      .where('post.autor.id_usuario = :userId', { userId })
      .andWhere('post.post_respuesta_id IS NULL')
      .orderBy('post.fecha_publicacion', 'DESC')
      .getMany();
  }

  async findMyLikes(userId: number) {
    const likes = await this.postsLikeRepository.find({
      where: { id_usuario: userId },
      relations: ['post', 'post.autor', 'post.autor.carrera', 'post.imagenes'],
      order: { id_usuario: 'DESC' },
    });
    return likes.map((like) => ({
      ...like.post,
      reaction: like.tipo,
    }));
  }

  async findMyComments(userId: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.autor', 'autor')
      .leftJoinAndSelect('autor.carrera', 'carrera')
      .leftJoinAndSelect('post.imagenes', 'imagenes')
      .leftJoinAndSelect('post.postRespuesta', 'postPrincipal')
      .leftJoinAndSelect('postPrincipal.autor', 'postPrincipalAutor')
      .where('post.autor.id_usuario = :userId', { userId })
      .andWhere('post.post_respuesta_id IS NOT NULL')
      .orderBy('post.fecha_publicacion', 'DESC')
      .getMany();
  }
}
