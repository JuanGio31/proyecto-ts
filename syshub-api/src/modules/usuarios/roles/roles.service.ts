import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { CreateRolDto } from '../dto/create-rol.dto';
import { UpdateRolDto } from '../dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find();
  }

  async findOne(id: number): Promise<Rol> {
    const rolEncontrado = await this.rolRepository.findOne({
      where: { id_rol: id },
    });
    if (!rolEncontrado) {
      throw new Error('El rol con id: ${id} no existe');
    }
    return rolEncontrado;
  }

  async create(rol: CreateRolDto): Promise<Rol> {
    return await this.rolRepository.save(rol);
  }

  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rolActualizado = await this.rolRepository.preload({
      id_rol: id,
      ...updateRolDto,
    });

    if (!rolActualizado) {
      throw new Error('El rol con id: ${id} no existe');
    }
    return await this.rolRepository.save(rolActualizado);
  }
}
