import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrerasService } from '@app/modules/carreras/carreras.service';
import { CarrerasController } from '@app/modules/carreras/carreras.controller';
import { Carrera } from '@app/modules/carreras/entities/carrera.entity';
import { DivisionesModule } from '@app/modules/carreras/divisiones/divisiones.module';
import { CursosModule } from '@app/modules/carreras/cursos/cursos.module';

@Module({
  controllers: [CarrerasController],
  providers: [CarrerasService],
  imports: [
    TypeOrmModule.forFeature([Carrera]),
    DivisionesModule,
    CursosModule,
  ],
})
export class CarrerasModule {}
