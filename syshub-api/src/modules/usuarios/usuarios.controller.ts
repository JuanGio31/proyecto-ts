import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { GetUser } from '@app/common/decorators/get-user.decorator';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioAdminDto } from './dto/create-usuario-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '@app/common/utils/multer.config';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { Roles } from '@app/common/decorators/roles.decorator';
import { ValueRol } from '@app/modules/usuarios/enums/rol.enum';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValueRol.ADMIN)
  async findAll() {
    return this.usuariosService.findAllWithRelations();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValueRol.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValueRol.ADMIN)
  async create(@Body() createUsuarioDto: CreateUsuarioAdminDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValueRol.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.updatePerfil(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValueRol.ADMIN)
  async remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }

  @Patch('perfil')
  @UseGuards(JwtAuthGuard)
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
