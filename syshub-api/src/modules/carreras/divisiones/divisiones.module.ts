import { Module } from '@nestjs/common';
import { DivisionesService } from './divisiones.service';
import { DivisionesController } from './divisiones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Division } from './entities/divisione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Division])],
  controllers: [DivisionesController],
  providers: [DivisionesService],
})
export class DivisionesModule {}
