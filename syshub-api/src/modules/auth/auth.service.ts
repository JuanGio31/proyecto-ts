import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegistroUsuarioDto } from './dto/registro-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
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

    // 2. Crear el usuario (el hashing se hace dentro de usuariosService.create)
    const nuevoUsuario = this.usuariosService.create(registroDto);

    // 3. Generar el payload para el token
    // const payload = {
    //   sub: nuevoUsuario.id_usuario,
    //   email: nuevoUsuario.email,
    // };

    // 4. Retornar el token y los datos básicos del usuario
    return {
      message: 'Usuario registrado exitosamente',
      //access_token: await this.jwtService.signAsync(payload),
      user: {
        id: (await nuevoUsuario).id_usuario,
        nombre: (await nuevoUsuario).nombre_completo,
        email: (await nuevoUsuario).email,
      },
    };
  }
}
