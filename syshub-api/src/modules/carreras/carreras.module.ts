import { Module } from '@nestjs/common';
import { CarrerasService } from './carreras.service';
import { CarrerasController } from './carreras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrera } from './entities/carrera.entity';
import { DivisionesModule } from './divisiones/divisiones.module';

@Module({
  controllers: [CarrerasController],
  providers: [CarrerasService],
  imports: [TypeOrmModule.forFeature([Carrera]), DivisionesModule],
})
export class CarrerasModule {}
