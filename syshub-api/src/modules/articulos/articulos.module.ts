import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticulosService } from './articulos.service';
import { ArticulosController } from './articulos.controller';
import { Articulo } from './entities/articulo.entity';
import { ArticuloLike } from './entities/articulo-like.entity';
import { ArticuloComentario } from './entities/articulo-comentario.entity';
import { Etiqueta } from '@app/modules/etiquetas/entities/etiqueta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Articulo, ArticuloLike, ArticuloComentario, Etiqueta]),
  ],
  controllers: [ArticulosController],
  providers: [ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}