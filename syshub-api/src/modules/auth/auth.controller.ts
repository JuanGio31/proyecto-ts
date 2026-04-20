import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login-auth.dto';
import { RegistroUsuarioDto } from './dto/registro-auth.dto';
import { GetUser } from '@app/common/decorators/get-user.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registroDto: RegistroUsuarioDto) {
    return this.authService.register(registroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@GetUser('userId') userId: number) {
    return this.authService.getProfile(userId);
  }
}
