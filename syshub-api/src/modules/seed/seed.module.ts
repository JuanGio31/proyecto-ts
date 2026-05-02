import { Module } from '@nestjs/common';
import { SeedService } from '@app/modules/seed/seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';
import { Rol } from '@app/modules/usuarios/entities/rol.entity';
import { Division } from '@app/modules/carreras/divisiones/entities/divisione.entity';
import { Carrera } from '@app/modules/carreras/entities/carrera.entity';
import { Curso } from '@app/modules/carreras/cursos/entities/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol, Division, Carrera, Curso])],
  providers: [SeedService],
})
export class SeedModule {}
