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
    private jswtAuthService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usuariosService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { sub: user.id_usuario, email: user.email };
    return {
      access_token: this.jswtAuthService.sign(payload),
    };
  }

  async register(registroDto: RegistroUsuarioDto) {
    const userExists = await this.usuariosService.findByEmail(
      registroDto.email,
    );

    if (userExists) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    if (!registroDto.rol) {
      const rol = await this.rolService.findByName('estudiante');
      registroDto.rol = rol.id_rol;
    }

    const usuarioData = {
      nombre_completo: registroDto.nombre_completo,
      registro_academico: registroDto.registro,
      email: registroDto.email,
      password: registroDto.password,
      id_rol: registroDto.rol,
      id_carrera: registroDto.carrera,
      fecha_cumpleanios: registroDto.fecha_nacimiento
        ? new Date(registroDto.fecha_nacimiento)
        : new Date(),
    };
    const nuevoUsuario = await this.usuariosService.create(usuarioData);
    const payload = { sub: nuevoUsuario.id_usuario, email: nuevoUsuario.email };
    const access_token = this.jswtAuthService.sign(payload);
    return {
      message: 'Usuario registrado exitosamente',
      access_token,
      user: {
        id: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre_completo,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    };
  }

  async getProfile(userId: number) {
    return this.usuariosService.findOne(userId);
  }
}
