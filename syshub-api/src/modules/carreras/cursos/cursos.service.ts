import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Repository } from 'typeorm';
import { UsuarioCurso } from '@app/modules/usuarios/entities/usuario-curso.entity';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const curso = this.cursoRepository.create({
      ...createCursoDto,
      carrera: { id_carrera: createCursoDto.id_carrera },
    });
    return await this.cursoRepository.save(curso);
  }

  async findAll() {
    const cursos = await this.cursoRepository.find({
      relations: ['carrera', 'usuarios_cursos', 'usuarios_cursos.usuario', 'usuarios_cursos.usuario.rol'],
    });

    return cursos.map((curso) => ({
      ...curso,
      usuarios: curso.usuarios_cursos
        ?.filter((uc) => uc.usuario?.rol?.nombre_rol === 'auxiliar')
        .map((uc) => ({
          id_usuario: uc.usuario.id_usuario,
          nombre_completo: uc.usuario.nombre_completo,
          email: uc.usuario.email,
        })) || [],
    }));
  }

  async findOne(id: number) {
    const cursoEncontrado = await this.cursoRepository.findOne({
      where: { id_curso: id },
      relations: ['carrera', 'usuarios_cursos', 'usuarios_cursos.usuario', 'usuarios_cursos.usuario.rol'],
    });
    if (!cursoEncontrado) {
      throw new NotFoundException(`El curso con id: ${id} no existe`);
    }
    return {
      ...cursoEncontrado,
      usuarios: cursoEncontrado.usuarios_cursos
        ?.filter((uc) => uc.usuario?.rol?.nombre_rol === 'auxiliar')
        .map((uc) => ({
          id_usuario: uc.usuario.id_usuario,
          nombre_completo: uc.usuario.nombre_completo,
          email: uc.usuario.email,
        })) || [],
    };
  }

  async update(id: number, updateCursoDto: UpdateCursoDto) {
    const cursoActualizado = await this.cursoRepository.preload({
      id_curso: id,
      ...updateCursoDto,
    });

    if (!cursoActualizado) {
      throw new NotFoundException(`Curso con id ${id} no encontrado`);
    }

    return await this.cursoRepository.save(cursoActualizado);
  }

  async remove(id: number) {
    const cursoEncontrado = await this.cursoRepository.findOne({
      where: { id_curso: id },
    });
    if (!cursoEncontrado) {
      throw new NotFoundException(`El curso con id: ${id} no existe`);
    }
    return await this.cursoRepository.remove(cursoEncontrado);
  }

  async asignarAuxiliar(cursoId: number, idAuxiliar: number) {
    const cursoOriginal = await this.cursoRepository.findOne({
      where: { id_curso: cursoId },
      relations: ['usuarios_cursos', 'usuarios_cursos.usuario', 'usuarios_cursos.usuario.rol'],
    });

    if (!cursoOriginal) {
      throw new NotFoundException(`El curso con id: ${cursoId} no existe`);
    }

    const auxiliaresExistentes = cursoOriginal.usuarios_cursos?.filter(
      (uc) => uc.usuario?.rol?.nombre_rol === 'auxiliar',
    ) || [];

    if (auxiliaresExistentes.length > 0) {
      await this.cursoRepository.manager.remove(UsuarioCurso, auxiliaresExistentes);
    }

    const nuevoAuxiliar = new UsuarioCurso();
    nuevoAuxiliar.id_curso = cursoId;
    nuevoAuxiliar.id_usuario = idAuxiliar;
    await this.cursoRepository.manager.save(UsuarioCurso, nuevoAuxiliar);

    return await this.findOne(cursoId);
  }

  async getAuxiliares(cursoId: number) {
    const curso = await this.findOne(cursoId);
    const auxiliares = (curso.usuarios_cursos || []).filter(uc => uc.usuario?.rol?.nombre_rol === 'auxiliar');
    return auxiliares.map((uc) => ({
      id_usuario: uc.id_usuario,
      nombre_completo: uc.usuario?.nombre_completo,
    }));
  }
}
