import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const curso = this.cursoRepository.create(createCursoDto);
    return await this.cursoRepository.save(curso);
  }

  async findAll() {
    return await this.cursoRepository.find();
  }

  async findOne(id: number) {
    const cursoEncontrado = await this.cursoRepository.findOne({
      where: { id_curso: id },
    });
    if (!cursoEncontrado) {
      throw new NotFoundException(`El curso con id: ${id} no existe`);
    }
    return cursoEncontrado;
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
}
