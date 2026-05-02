/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuarioCurso } from './entities/usuario-curso.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(UsuarioCurso)
    private readonly usuarioCursoRepository: Repository<UsuarioCurso>,
  ) {}

  async create(nuevo: any): Promise<Usuario> {
    const { password, id_rol, id_carrera, ...userData } = nuevo;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createData: Partial<Usuario> = {
      nombre_completo: userData.nombre_completo,
      email: userData.email,
      fecha_nacimiento: userData.fecha_nacimiento,
      registro_academico: userData.registro_academico || null,
      password: hashedPassword,
      username: `user_${crypto.randomUUID()}`,
    };

    if (id_rol) {
      createData.rol = { id_rol } as any;
    }
    if (id_carrera) {
      createData.carrera = { id_carrera } as any;
    }

    const nuevoUsuario = this.usuarioRepository.create(createData);
    return await this.usuarioRepository.save(nuevoUsuario);
  }

  async findEmailWithPassword(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
      select: [
        'id_usuario',
        'email',
        'password',
        'nombre_completo',
        'registro_academico',
      ],
      relations: ['rol'],
    });
  }

  async findAll() {
    return await this.usuarioRepository.find();
  }

  async findAllWithRelations() {
    return await this.usuarioRepository.find({
      relations: ['carrera', 'rol'],
    });
  }

  async findOne(id: number) {
    return await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      relations: ['carrera', 'rol'],
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
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });
    if (!usuario) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }

    const updateData: any = { ...data };
    if (data.id_rol) {
      updateData.rol = { id_rol: data.id_rol };
      delete updateData.id_rol;
    }
    if (data.id_carrera) {
      updateData.carrera = { id_carrera: data.id_carrera };
      delete updateData.id_carrera;
    }

    await this.usuarioRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });
    if (!usuario) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }
    await this.usuarioRepository.remove(usuario);
    return { message: 'Usuario eliminado correctamente' };
  }

  async getCursos(userId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: userId },
      relations: ['usuarios_cursos', 'usuarios_cursos.curso'],
    });
    if (!usuario) {
      return [];
    }
    return usuario.usuarios_cursos.map((uc) => ({
      id_curso: uc.curso?.id_curso,
      nombre_curso: uc.curso?.nombre_curso,
      codigo_curso: uc.curso?.codigo_curso,
    }));
  }

  async getEstudiantesDeMisCursos(userId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: userId },
      relations: ['usuarios_cursos', 'usuarios_cursos.curso'],
    });
    if (!usuario) {
      return [];
    }

    const cursosIds = usuario.usuarios_cursos
      .filter(uc => uc.curso?.id_curso)
      .map(uc => uc.curso.id_curso);

    if (cursosIds.length === 0) {
      return [];
    }

    const resultados = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .innerJoin('usuario.usuarios_cursos', 'uc', 'uc.id_curso IN (:...cursosIds)', { cursosIds })
      .innerJoin('uc.curso', 'curso')
      .andWhere('usuario.id_usuario != :userId', { userId })
      .select([
        'usuario.id_usuario',
        'usuario.nombre_completo',
        'usuario.email',
        'usuario.registro_academico',
        'curso.id_curso',
        'curso.nombre_curso',
        'curso.codigo_curso',
      ])
      .getRawMany();

    return resultados.map((est: any) => ({
      id_usuario: est.usuario_id_usuario,
      nombre_completo: est.usuario_nombre_completo,
      email: est.usuario_email,
      registro_academico: est.usuario_registro_academico,
      curso: {
        id_curso: est.curso_id_curso,
        nombre_curso: est.curso_nombre_curso,
        codigo_curso: est.curso_codigo_curso,
      },
    }));
  }

  async suspender(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });
    if (!usuario) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }
    usuario.esta_suspendido = true;
    return await this.usuarioRepository.save(usuario);
  }

  async activar(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });
    if (!usuario) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }
    usuario.esta_suspendido = false;
    return await this.usuarioRepository.save(usuario);
  }

  async inscribirEstudiante(idEstudiante: number, idCurso: number) {
    const estudiante = await this.usuarioRepository.findOne({
      where: { id_usuario: idEstudiante },
    });
    if (!estudiante) {
      throw new NotFoundException(`El estudiante con id: ${idEstudiante} no existe`);
    }

    const existe = await this.usuarioCursoRepository.findOne({
      where: { id_usuario: idEstudiante, id_curso: idCurso },
    });
    if (existe) {
      throw new BadRequestException('El estudiante ya está inscrito en este curso');
    }

    const nuevaInscripcion = this.usuarioCursoRepository.create({
      id_usuario: idEstudiante,
      id_curso: idCurso,
    });
    return await this.usuarioCursoRepository.save(nuevaInscripcion);
  }

  async desinscribirEstudiante(idEstudiante: number, idCurso: number) {
    const inscripcion = await this.usuarioCursoRepository.findOne({
      where: { id_usuario: idEstudiante, id_curso: idCurso },
    });
    if (!inscripcion) {
      throw new NotFoundException('El estudiante no está inscrito en este curso');
    }
    await this.usuarioCursoRepository.remove(inscripcion);
    return { message: 'Estudiante desinscrito correctamente' };
  }

  async getEstudiantesInscritos(idCurso: number) {
    return this.usuarioCursoRepository.find({
      where: { id_curso: idCurso },
      relations: ['usuario', 'usuario.rol'],
    });
  }
}
