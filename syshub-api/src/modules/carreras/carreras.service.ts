import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrera } from './entities/carrera.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarrerasService {
  constructor(
    @InjectRepository(Carrera)
    private readonly carreraRepository: Repository<Carrera>,
  ) {}

  async create(createCarreraDto: CreateCarreraDto) {
    return await this.carreraRepository.save(createCarreraDto);
  }

  async findAll(): Promise<Carrera[]> {
    return await this.carreraRepository.find({
      relations: { division: true },
      order: { codigo_carrera: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Carrera> {
    const carreraEncontrada = await this.carreraRepository.findOne({
      where: { id_carrera: id },
    });

    if (!carreraEncontrada) {
      throw new Error('La carrera con id: ${id} no existe');
    }

    return carreraEncontrada;
  }

  async update(id: number, data: UpdateCarreraDto) {
    const carreraActualizada = await this.carreraRepository.preload({
      id_carrera: id,
      ...data,
    });

    if (!carreraActualizada) {
      throw new NotFoundException(`Carrera con id ${id} no encontrada`);
    }

    return await this.carreraRepository.save(carreraActualizada);
  }
}
