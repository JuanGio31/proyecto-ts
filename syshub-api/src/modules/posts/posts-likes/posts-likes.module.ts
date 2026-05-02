import { Module } from '@nestjs/common';
import { PostsLikesService } from '@app/modules/posts/posts-likes/posts-likes.service';
import { PostsLikesController } from '@app/modules/posts/posts-likes/posts-likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsLike } from '@app/modules/posts/entities/posts-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostsLike])],
  controllers: [PostsLikesController],
  providers: [PostsLikesService],
  exports: [PostsLikesService],
})
export class PostsLikesModule {}
