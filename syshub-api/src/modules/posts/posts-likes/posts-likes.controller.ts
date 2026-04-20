import { Controller, Post, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { PostsLikesService } from './posts-likes.service';
import { ReactionType } from '../entities/posts-like.entity';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { GetUser } from '@app/common/decorators/get-user.decorator';

@Controller('posts/:postId/reactions')
@UseGuards(JwtAuthGuard)
export class PostsLikesController {
  constructor(private readonly postsLikesService: PostsLikesService) {}

  @Post('like')
  async toggleLike(
    @Param('postId') postId: number,
    @GetUser('userId') userId: number,
  ) {
    return this.postsLikesService.toggleReaction(
      postId,
      userId,
      ReactionType.LIKE,
    );
  }

  @Post('dislike')
  async toggleDislike(
    @Param('postId') postId: number,
    @GetUser('userId') userId: number,
  ) {
    return this.postsLikesService.toggleReaction(
      postId,
      userId,
      ReactionType.DISLIKE,
    );
  }

  @Delete()
  async removeReaction(
    @Param('postId') postId: number,
    @GetUser('userId') userId: number,
  ) {
    await this.postsLikesService.remove(postId, userId);
    return this.postsLikesService.getCounts(postId);
  }

  @Get()
  async getReactions(@Param('postId') postId: number) {
    const counts = await this.postsLikesService.getCounts(postId);
    return counts;
  }

  @Get('me')
  async getMyReaction(
    @Param('postId') postId: number,
    @GetUser('userId') userId: number,
  ) {
    const reaction = await this.postsLikesService.getUserReaction(postId, userId);
    return { reaction };
  }
}
