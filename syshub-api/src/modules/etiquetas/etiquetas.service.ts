import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEtiquetaDto } from './dto/create-etiqueta.dto';
import { UpdateEtiquetaDto } from './dto/update-etiqueta.dto';
import { Etiqueta } from '@app/modules/etiquetas/entities/etiqueta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EtiquetasService {
  constructor(
    @InjectRepository(Etiqueta)
    private readonly etiquetaRepository: Repository<Etiqueta>,
  ) {}

  async create(createEtiquetaDto: CreateEtiquetaDto): Promise<Etiqueta> {
    const etiqueta = this.etiquetaRepository.create(createEtiquetaDto);
    return await this.etiquetaRepository.save(etiqueta);
  }

  async findAll() {
    return await this.etiquetaRepository.find();
  }

  async findOne(id: number) {
    const etiquetaEncontrada = await this.etiquetaRepository.findOne({
      where: { id_etiqueta: id },
    });
    if (!etiquetaEncontrada) {
      throw new NotFoundException(`La etiqueta con id: ${id} no existe`);
    }
    return etiquetaEncontrada;
  }

  async update(id: number, updateEtiquetaDto: UpdateEtiquetaDto) {
    const etiquetaActualizada = await this.etiquetaRepository.preload({
      id_etiqueta: id,
      ...updateEtiquetaDto,
    });
    if (!etiquetaActualizada) {
      throw new NotFoundException(`La etiqueta con id: ${id} no existe`);
    }
    return await this.etiquetaRepository.save(etiquetaActualizada);
  }

  async remove(id: number) {
    const etiquetaEncontrada = await this.etiquetaRepository.findOne({
      where: { id_etiqueta: id },
    });
    if (!etiquetaEncontrada) {
      throw new NotFoundException(`La etiqueta con id: ${id} no existe`);
    }
    return await this.etiquetaRepository.remove(etiquetaEncontrada);
  }

  async buscarOCrearMuchos(nombres: string[]): Promise<Etiqueta[]> {
    const promesas = nombres.map(async (nombre) => {
      const nombreLimpio = nombre
        .toLocaleLowerCase()
        .trim()
        .replace(/\s+/g, '-');

      let etiqueta = await this.etiquetaRepository.findOne({
        where: { nombre: nombreLimpio },
      });

      if (!etiqueta) {
        etiqueta = await this.etiquetaRepository.save({
          nombre: nombreLimpio,
        });
      }

      return etiqueta;
    });

    return Promise.all(promesas);
  }
}
