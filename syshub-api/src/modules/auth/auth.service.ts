import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegistroUsuarioDto } from './dto/registro-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from '../usuarios/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private rolService: RolesService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usuariosService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    console.log('Login - user:', user);

    const payload = {
      sub: user.id_usuario,
      userId: user.id_usuario,
      email: user.email,
      rol: user.rol.nombre_rol,
    };

    console.log('Login - payload:', payload);

    const token = await this.jwtService.signAsync(payload);
    console.log('Login - token generated');

    return {
      access_token: token,
    };
  }

  async register(registroDto: RegistroUsuarioDto) {
    const userExists = await this.usuariosService.findByEmail(
      registroDto.email,
    );

    if (userExists) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    let rolIdAsignado = registroDto.id_rol;
    if (!rolIdAsignado) {
      const rol = await this.rolService.findByName('estudiante');
      rolIdAsignado = rol.id_rol;
    }

    const usuarioData = {
      nombre_completo: registroDto.nombre_completo,
      registro_academico: registroDto.registro_academico,
      email: registroDto.email,
      password: registroDto.password,
      fecha_nacimiento: registroDto.fecha_nacimiento
        ? new Date(registroDto.fecha_nacimiento)
        : new Date(),
      rol: { id_rol: rolIdAsignado },
      carrera: { id_carrera: registroDto.id_carrera },
    };

    const nuevoUsuario = await this.usuariosService.create(usuarioData);
    // token de primer acceso
    const payload = {
      userId: nuevoUsuario.id_usuario,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol.nombre_rol,
    };

    const access_token = this.jwtService.signAsync(payload);
    return {
      message: 'Usuario registrado exitosamente',
      access_token,
      user: {
        id: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre_completo,
        email: nuevoUsuario.email,
        //rol: nuevoUsuario.rol,
      },
    };
  }

  async getProfile(userId: number) {
    return this.usuariosService.findOne(userId);
  }
}
