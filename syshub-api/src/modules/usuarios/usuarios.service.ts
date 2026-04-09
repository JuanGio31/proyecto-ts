import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
    return await this.usuarioRepository.save({
      ...userData,
      password: hashedPassword,
      id_rol: 5,
    });
  }

  async findEmailWithPassword(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
      select: ['id_usuario', 'email', 'password', 'nombre_completo'],
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
}
