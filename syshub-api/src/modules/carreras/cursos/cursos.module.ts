import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from '@app/modules/carreras/cursos/entities/curso.entity';
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, Usuario])],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}
