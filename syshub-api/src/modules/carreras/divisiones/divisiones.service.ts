import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDivisioneDto } from './dto/create-divisione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from './entities/divisione.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DivisionesService {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
  ) {}

  async create(createDivisioneDto: CreateDivisioneDto): Promise<Division> {
    const division = this.divisionRepository.create(createDivisioneDto);
    return await this.divisionRepository.save(division);
  }

  async findAll(): Promise<Division[]> {
    return await this.divisionRepository.find();
  }

  async findOne(id: number): Promise<Division> {
    const divisionEncontrada = await this.divisionRepository.findOne({
      where: { id },
    });

    if (!divisionEncontrada) {
      throw new NotFoundException(`La division con id: ${id} no existe`);
    }

    return divisionEncontrada;
  }
}
