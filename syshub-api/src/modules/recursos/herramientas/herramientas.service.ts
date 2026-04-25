import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHerramientaDto } from './dto/create-herramienta.dto';
import { UpdateHerramientaDto } from './dto/update-herramienta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Herramienta } from './entities/herramienta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HerramientasService {
  constructor(
    @InjectRepository(Herramienta)
    private readonly herramientaRepository: Repository<Herramienta>,
  ) {}

  async create(
    createHerramientaDto: CreateHerramientaDto,
  ): Promise<Herramienta> {
    const herramienta = this.herramientaRepository.create(createHerramientaDto);
    return await this.herramientaRepository.save(herramienta);
  }

  async findAll(): Promise<Herramienta[]> {
    return await this.herramientaRepository.find();
  }

  async findOne(id: number): Promise<Herramienta> {
    const herramientaEncontrada = await this.herramientaRepository.findOne({
      where: { id: id },
    });
    if (!herramientaEncontrada) {
      throw new NotFoundException(`La herramienta con id: ${id} no existe`);
    }
    return herramientaEncontrada;
  }

  async update(
    id: number,
    updateHerramientaDto: UpdateHerramientaDto,
  ): Promise<Herramienta> {
    const herramientaActualizada = await this.herramientaRepository.preload({
      id: id,
      ...updateHerramientaDto,
    });
    if (!herramientaActualizada) {
      throw new NotFoundException(`La herramienta con id: ${id} no existe`);
    }
    return await this.herramientaRepository.save(herramientaActualizada);
  }

  async remove(id: number): Promise<Herramienta> {
    const herramientaEncontrada = await this.herramientaRepository.findOne({
      where: { id: id },
    });
    if (!herramientaEncontrada) {
      throw new NotFoundException(`La herramienta con id: ${id} no existe`);
    }
    return await this.herramientaRepository.remove(herramientaEncontrada);
  }

  async buscarOCrearMuchos(nombres: string[]): Promise<Herramienta[]> {
    const promesas = nombres.map(async (nombre) => {
      const nombreLimpio = nombre
        .toLocaleLowerCase()
        .trim()
        .replace(/\s+/g, '-');

      let herramienta = await this.herramientaRepository.findOne({
        where: { nombre: nombreLimpio },
      });

      if (!herramienta) {
        herramienta = await this.herramientaRepository.save({
          nombre: nombreLimpio,
        });
      }

      return herramienta;
    });

    return Promise.all(promesas);
  }
}
