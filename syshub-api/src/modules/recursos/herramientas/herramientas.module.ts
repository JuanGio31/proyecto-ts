import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HerramientasService } from '@app/modules/recursos/herramientas/herramientas.service';
import { HerramientasController } from '@app/modules/recursos/herramientas/herramientas.controller';
import { Herramienta } from '@app/modules/recursos/herramientas/entities/herramienta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Herramienta])],
  controllers: [HerramientasController],
  providers: [HerramientasService],
  exports: [HerramientasService],
})
export class HerramientasModule {}
