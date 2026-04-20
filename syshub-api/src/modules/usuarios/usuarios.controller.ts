import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { GetUser } from '@app/common/decorators/get-user.decorator';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '@app/common/utils/multer.config';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  async findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('perfil')
  async updatePerfil(
    @GetUser('userId') userId: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.updatePerfil(userId, updateUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('perfil/foto')
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async updateFotoPerfil(
    @GetUser('userId') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se envió ninguna imagen');
    }
    return this.usuariosService.updatePerfil(userId, {
      foto_perfil: file.filename,
    });
  }
}
