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

    const recursoData: any = {
      titulo: createRecursoDto.titulo,
      descripcion: createRecursoDto.descripcion,
      url_archivo: createRecursoDto.url_archivo,
      herramientas_adicionales: createRecursoDto.herramientas_adicionales,
      es_destacado: createRecursoDto.es_destacado,
      etiquetas,
      herramientas,
      usuario: { id_usuario: userId },
    };

    if (createRecursoDto.id_curso) {
      recursoData.curso = { id_curso: Number(createRecursoDto.id_curso) };
    }

    const nuevoRecurso = this.recursoRepository.create(recursoData as Partial<Recurso>);
    return await this.recursoRepository.save(nuevoRecurso);
  }

  async findAll(filtros: {
    busqueda?: string;
    etiqueta?: string;
    herramienta?: string;
    es_destacado?: string;
  } = {}): Promise<Recurso[]> {
    const query = this.recursoRepository
      .createQueryBuilder('recurso')
      .leftJoinAndSelect('recurso.etiquetas', 'etiquetas')
      .leftJoinAndSelect('recurso.herramientas', 'herramientas')
      .leftJoinAndSelect('recurso.usuario', 'usuario')
      .leftJoinAndSelect('recurso.curso', 'curso');

    if (filtros.busqueda) {
      query.andWhere(
        '(recurso.titulo LIKE :busqueda OR recurso.descripcion LIKE :busqueda)',
        { busqueda: `%${filtros.busqueda}%` },
      );
    }

    if (filtros.etiqueta) {
      query.andWhere('etiquetas.nombre = :etiqueta', { etiqueta: filtros.etiqueta });
    }

    if (filtros.herramienta) {
      query.andWhere('herramientas.nombre = :herramienta', {
        herramienta: filtros.herramienta,
      });
    }

    if (filtros.es_destacado !== undefined) {
      query.andWhere('recurso.es_destacado = :es_destacado', {
        es_destacado: filtros.es_destacado === 'true',
      });
    }

    return await query.orderBy('recurso.id_recurso', 'ASC').getMany();
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
      relations: { etiquetas: true, herramientas: true, usuario: true },
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

  async toggleDestacado(id: number): Promise<Recurso> {
    const recurso = await this.recursoRepository.findOne({
      where: { id_recurso: id },
      relations: { etiquetas: true, herramientas: true },
    });
    if (!recurso) {
      throw new NotFoundException(`El recurso con id: ${id} no existe`);
    }
    recurso.es_destacado = !recurso.es_destacado;
    return await this.recursoRepository.save(recurso);
  }

  async findByUser(userId: number): Promise<Recurso[]> {
    return await this.recursoRepository.find({
      where: { usuario: { id_usuario: userId } },
      relations: ['etiquetas', 'herramientas', 'usuario', 'curso'],
      order: { fecha_publicacion: 'DESC' },
    });
  }

  async findByCursoForStudents(cursoId: number): Promise<Recurso[]> {
    return await this.recursoRepository
      .createQueryBuilder('recurso')
      .leftJoinAndSelect('recurso.etiquetas', 'etiquetas')
      .leftJoinAndSelect('recurso.herramientas', 'herramientas')
      .leftJoinAndSelect('recurso.usuario', 'usuario')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .leftJoinAndSelect('recurso.curso', 'curso')
      .where('recurso.id_curso = :cursoId', { cursoId })
      .andWhere(
        '(recurso.es_destacado = true OR rol.nombre_rol = :rolAuxiliar)',
        { rolAuxiliar: 'auxiliar' },
      )
      .orderBy('recurso.fecha_publicacion', 'DESC')
      .getMany();
  }
}
