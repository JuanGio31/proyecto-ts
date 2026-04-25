import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursosService } from '@app/modules/recursos/recursos.service';
import { RecursosController } from '@app/modules/recursos/recursos.controller';
import { Recurso } from '@app/modules/recursos/entities/recurso.entity';
import { HerramientasModule } from '@app/modules/recursos/herramientas/herramientas.module';
import { EtiquetasModule } from '@app/modules/etiquetas/etiquetas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recurso]),
    HerramientasModule,
    EtiquetasModule,
  ],
  controllers: [RecursosController],
  providers: [RecursosService],
})
export class RecursosModule {}
