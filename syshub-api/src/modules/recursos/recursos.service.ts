import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { Recurso } from '@app/modules/recursos/entities/recurso.entity';
import { EtiquetasService } from '../etiquetas/etiquetas.service';
import { HerramientasService } from './herramientas/herramientas.service';

@Injectable()
export class RecursosService {
  constructor(
    @InjectRepository(Recurso)
    private readonly recursoRepository: Repository<Recurso>,
    private readonly etiquetaService: EtiquetasService,
    private readonly herramientaService: HerramientasService,
  ) {}

  async create(createRecursoDto: CreateRecursoDto, userId: number): Promise<Recurso> {
    const etiquetas = createRecursoDto.etiquetas
      ? await this.etiquetaService.buscarOCrearMuchos(
          createRecursoDto.etiquetas,
        )
      : [];

    const herramientas = createRecursoDto.herramientas
      ? await this.herramientaService.buscarOCrearMuchos(
          createRecursoDto.herramientas,
        )
      : [];

    const nuevoRecurso = this.recursoRepository.create({
      ...createRecursoDto,
      etiquetas,
      herramientas,
      usuario: { id_usuario: userId },
    });
    return await this.recursoRepository.save(nuevoRecurso);
  }

  async findAll(): Promise<Recurso[]> {
    return await this.recursoRepository.find({
      relations: { etiquetas: true },
      order: { id_recurso: 'ASC' },
    });
  }

  async findHallazgos(): Promise<Recurso[]> {
    return await this.recursoRepository.find({
      where: { curso: IsNull() },
    });
  }

  async findDestacados(): Promise<Recurso[]> {
    return await this.recursoRepository.find({
      where: { es_destacado: true, curso: Not(IsNull()) },
    });
  }

  async findTareas(): Promise<Recurso[]> {
    return await this.recursoRepository.find({
      where: { curso: Not(IsNull()) },
    });
  }

  async findOne(id: number) {
    const recursoEncontrado = await this.recursoRepository.findOne({
      where: { id_recurso: id },
      relations: { etiquetas: true },
    });
    if (!recursoEncontrado) {
      throw new NotFoundException(`El recurso con id: ${id} no existe`);
    }
    return recursoEncontrado;
  }

  async remove(id: number) {
    const recursoEncontrado = await this.recursoRepository.findOne({
      where: { id_recurso: id },
    });
    if (!recursoEncontrado) {
      throw new NotFoundException(`El recurso con id: ${id} no existe`);
    }
    return await this.recursoRepository.remove(recursoEncontrado);
  }
}
