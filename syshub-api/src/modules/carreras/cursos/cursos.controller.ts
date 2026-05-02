import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { AsignarAuxiliarDto } from './dto/curso.dto';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { Roles } from '@app/common/decorators/roles.decorator';
import { ValueRol } from '@app/modules/usuarios/enums/rol.enum';

@Controller('cursos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  @Roles(ValueRol.ADMIN)
  async create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  async findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cursosService.findOne(+id);
  }

  @Patch(':id')
  @Roles(ValueRol.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCursoDto: UpdateCursoDto,
  ) {
    return this.cursosService.update(+id, updateCursoDto);
  }

  @Delete(':id')
  @Roles(ValueRol.ADMIN)
  async remove(@Param('id') id: string) {
    return this.cursosService.remove(+id);
  }

  @Post(':id/auxiliar')
  @Roles(ValueRol.ADMIN)
  async asignarAuxiliar(
    @Param('id') id: string,
    @Body() dto: AsignarAuxiliarDto,
  ) {
    return this.cursosService.asignarAuxiliar(+id, dto.id_auxiliar);
  }

  @Get(':id/auxiliares')
  async getAuxiliares(@Param('id') id: string) {
    return this.cursosService.getAuxiliares(+id);
  }
}
