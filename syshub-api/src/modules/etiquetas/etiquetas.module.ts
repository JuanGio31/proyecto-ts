import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtiquetasService } from '@app/modules/etiquetas/etiquetas.service';
import { EtiquetasController } from '@app/modules/etiquetas/etiquetas.controller';
import { Etiqueta } from '@app/modules/etiquetas/entities/etiqueta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Etiqueta])],
  controllers: [EtiquetasController],
  providers: [EtiquetasService],
  exports: [EtiquetasService],
})
export class EtiquetasModule {}
