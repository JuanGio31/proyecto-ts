/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(nuevo: any): Promise<Usuario> {
    const { password, ...userData } = nuevo;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const nuevoUsuario = this.usuarioRepository.create({
      nombre_completo: userData.nombre_completo,
      email: userData.email,
      fecha_nacimiento: userData.fecha_nacimiento,
      registro_academico: userData.registro_academico,
      password: hashedPassword,
      rol: userData.rol,
      carrera: userData.carrera,
    }) as Usuario;

    return await this.usuarioRepository.save(nuevoUsuario);
  }

  async findEmailWithPassword(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
      select: ['id_usuario', 'email', 'password', 'nombre_completo', 'registro_academico'],
      relations: ['rol'],
    });
  }

  async findAll() {
    return await this.usuarioRepository.find();
  }

  async findOne(id: number) {
    return await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      relations: ['carrera'],
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<Usuario | null> {
    const user = await this.findEmailWithPassword(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result as Usuario;
    }
    return null;
  }

  async updatePerfil(id: number, data: UpdateUsuarioDto) {
    const usuarioAc = await this.usuarioRepository.update(id, data);

    if (usuarioAc.affected == 0) {
      throw new NotFoundException('El usuario con id: ${id} no existe');
    }
    return await this.usuarioRepository.findOne({ where: { id_usuario: id } });
  }
}
