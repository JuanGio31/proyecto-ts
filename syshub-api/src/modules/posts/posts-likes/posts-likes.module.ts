import { Module } from '@nestjs/common';
import { PostsLikesService } from './posts-likes.service';
import { PostsLikesController } from './posts-likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsLike } from '@app/modules/posts/entities/posts-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostsLike])],
  controllers: [PostsLikesController],
  providers: [PostsLikesService],
})
export class PostsLikesModule {}
