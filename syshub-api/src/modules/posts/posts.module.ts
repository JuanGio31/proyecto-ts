import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsLike } from './entities/posts-like.entity';
import { PostImagen } from './entities/post-imagen.entity';
import { PostsLikesModule } from './posts-likes/posts-likes.module';
import { PostImagenModule } from './post-imagen/post-imagen.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostsLike, PostImagen]),
    PostsLikesModule,
    PostImagenModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
