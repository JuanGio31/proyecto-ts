import { Module } from '@nestjs/common';
import { PostImagenService } from './post-imagen.service';
import { PostImagenController } from './post-imagen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImagen } from '../entities/post-imagen.entity';

@Module({
  controllers: [PostImagenController],
  providers: [PostImagenService],
  imports: [TypeOrmModule.forFeature([PostImagen])],
  exports: [PostImagenService],
})
export class PostImagenModule {}
