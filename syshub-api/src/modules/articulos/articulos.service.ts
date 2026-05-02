import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { ArticuloLike, ReactionType } from './entities/articulo-like.entity';
import { ArticuloComentario } from './entities/articulo-comentario.entity';
import { Etiqueta } from '@app/modules/etiquetas/entities/etiqueta.entity';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
    @InjectRepository(ArticuloLike)
    private readonly articuloLikeRepository: Repository<ArticuloLike>,
    @InjectRepository(ArticuloComentario)
    private readonly articuloComentarioRepository: Repository<ArticuloComentario>,
    @InjectRepository(Etiqueta)
    private readonly etiquetaRepository: Repository<Etiqueta>,
  ) {}

  async create(createArticuloDto: CreateArticuloDto, userId: number) {
    const etiquetas = createArticuloDto.ids_etiquetas?.length
      ? await this.etiquetaRepository.findByIds(createArticuloDto.ids_etiquetas)
      : [];

    const articulo = this.articuloRepository.create({
      titulo: createArticuloDto.titulo,
      contenido: createArticuloDto.contenido,
      autor: { id_usuario: userId },
      etiquetas,
    });

    return await this.articuloRepository.save(articulo);
  }

  async findAll() {
    return await this.articuloRepository.find({
      relations: ['autor', 'autor.carrera', 'etiquetas', 'likes'],
      order: { fecha_publicacion: 'DESC' },
    });
  }

  async findOne(id: number) {
    const articulo = await this.articuloRepository.findOne({
      where: { id_articulo: id },
      relations: ['autor', 'autor.carrera', 'etiquetas', 'likes', 'comentarios', 'comentarios.autor'],
    });

    if (!articulo) {
      throw new NotFoundException(`Artículo con id ${id} no encontrado`);
    }

    return articulo;
  }

  async findByUser(userId: number) {
    return await this.articuloRepository.find({
      where: { autor: { id_usuario: userId } },
      relations: ['autor', 'autor.carrera', 'etiquetas', 'likes'],
      order: { fecha_publicacion: 'DESC' },
    });
  }

  async update(id: number, updateArticuloDto: UpdateArticuloDto) {
    const articulo = await this.findOne(id);

    if (updateArticuloDto.titulo) {
      articulo.titulo = updateArticuloDto.titulo;
    }
    if (updateArticuloDto.contenido) {
      articulo.contenido = updateArticuloDto.contenido;
    }
    if (updateArticuloDto.ids_etiquetas) {
      const etiquetas = await this.etiquetaRepository.findByIds(updateArticuloDto.ids_etiquetas);
      articulo.etiquetas = etiquetas;
    }

    return await this.articuloRepository.save(articulo);
  }

  async remove(id: number) {
    const articulo = await this.findOne(id);
    await this.articuloRepository.remove(articulo);
    return { message: 'Artículo eliminado correctamente' };
  }

  async toggleReaction(
    articuloId: number,
    userId: number,
    tipo: ReactionType,
  ): Promise<{ reaction: string; likes: number; dislikes: number }> {
    const existingReaction = await this.articuloLikeRepository.findOne({
      where: { id_articulo: articuloId, id_usuario: userId },
    });

    let reaction: string;

    if (existingReaction) {
      if (existingReaction.tipo === tipo) {
        await this.articuloLikeRepository.remove(existingReaction);
        reaction = 'removed';
      } else {
        existingReaction.tipo = tipo;
        await this.articuloLikeRepository.save(existingReaction);
        reaction = 'updated';
      }
    } else {
      const newReaction = this.articuloLikeRepository.create({
        id_articulo: articuloId,
        id_usuario: userId,
        tipo,
      });
      await this.articuloLikeRepository.save(newReaction);
      reaction = 'created';
    }

    const counts = await this.getCounts(articuloId);
    return { reaction, ...counts };
  }

  async getCounts(articuloId: number): Promise<{ likes: number; dislikes: number }> {
    const likes = await this.articuloLikeRepository.count({
      where: { id_articulo: articuloId, tipo: ReactionType.LIKE },
    });
    const dislikes = await this.articuloLikeRepository.count({
      where: { id_articulo: articuloId, tipo: ReactionType.DISLIKE },
    });
    return { likes, dislikes };
  }

  async getUserReaction(articuloId: number, userId: number): Promise<ReactionType | null> {
    const reaction = await this.articuloLikeRepository.findOne({
      where: { id_articulo: articuloId, id_usuario: userId },
    });
    return reaction?.tipo || null;
  }

  async removeReaction(articuloId: number, userId: number): Promise<{ likes: number; dislikes: number }> {
    const reaction = await this.articuloLikeRepository.findOne({
      where: { id_articulo: articuloId, id_usuario: userId },
    });
    if (reaction) {
      await this.articuloLikeRepository.remove(reaction);
    }
    return this.getCounts(articuloId);
  }

  async addComentario(articuloId: number, userId: number, contenido: string) {
    await this.findOne(articuloId);

    const comentario = this.articuloComentarioRepository.create({
      contenido,
      articulo: { id_articulo: articuloId },
      autor: { id_usuario: userId },
    });

    return await this.articuloComentarioRepository.save(comentario);
  }

  async getComentarios(articuloId: number) {
    return await this.articuloComentarioRepository.find({
      where: { articulo: { id_articulo: articuloId } },
      relations: ['autor'],
      order: { fecha_creacion: 'ASC' },
    });
  }

  async findMyLikes(userId: number) {
    const likes = await this.articuloLikeRepository.find({
      where: { id_usuario: userId },
      relations: ['articulo', 'articulo.autor', 'articulo.autor.carrera', 'articulo.etiquetas'],
    });
    return likes.map(like => ({
      ...like.articulo,
      reaction: like.tipo,
    }));
  }

  async findMyComments(userId: number) {
    return await this.articuloComentarioRepository.find({
      where: { autor: { id_usuario: userId } },
      relations: ['articulo', 'articulo.autor'],
      order: { fecha_creacion: 'DESC' },
    });
  }
}