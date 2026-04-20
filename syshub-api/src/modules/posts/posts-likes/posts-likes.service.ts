import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsLike, ReactionType } from '../entities/posts-like.entity';

@Injectable()
export class PostsLikesService {
  constructor(
    @InjectRepository(PostsLike)
    private readonly postsLikeRepository: Repository<PostsLike>,
  ) {}

  async toggleReaction(
    postId: number,
    userId: number,
    tipo: ReactionType,
  ): Promise<{ reaction: string; likes: number; dislikes: number }> {
    const existingReaction = await this.postsLikeRepository.findOne({
      where: { id_post: postId, id_usuario: userId },
    });

    let reaction: string;

    if (existingReaction) {
      if (existingReaction.tipo === tipo) {
        await this.postsLikeRepository.remove(existingReaction);
        reaction = 'removed';
      } else {
        existingReaction.tipo = tipo;
        await this.postsLikeRepository.save(existingReaction);
        reaction = 'updated';
      }
    } else {
      const newReaction = this.postsLikeRepository.create({
        id_post: postId,
        id_usuario: userId,
        tipo,
      });
      await this.postsLikeRepository.save(newReaction);
      reaction = 'created';
    }

    const counts = await this.getCounts(postId);
    return { reaction, ...counts };
  }

  async getCounts(postId: number): Promise<{ likes: number; dislikes: number }> {
    const likes = await this.postsLikeRepository.count({
      where: { id_post: postId, tipo: ReactionType.LIKE },
    });
    const dislikes = await this.postsLikeRepository.count({
      where: { id_post: postId, tipo: ReactionType.DISLIKE },
    });
    return { likes, dislikes };
  }

  async getUserReaction(
    postId: number,
    userId: number,
  ): Promise<ReactionType | null> {
    const reaction = await this.postsLikeRepository.findOne({
      where: { id_post: postId, id_usuario: userId },
    });
    return reaction?.tipo || null;
  }

  async remove(postId: number, userId: number): Promise<void> {
    const reaction = await this.postsLikeRepository.findOne({
      where: { id_post: postId, id_usuario: userId },
    });
    if (reaction) {
      await this.postsLikeRepository.remove(reaction);
    }
  }
}
