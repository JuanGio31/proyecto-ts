import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { RecursosService } from './recursos.service';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { recursosMulterOptions } from '@app/common/utils/recursos-multer.config';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { GetUser } from '@app/common/decorators/get-user.decorator';

@Controller('recursos')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyRecursos(@GetUser('userId') userId: number) {
    return this.recursosService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('archivo', recursosMulterOptions))
  uploadArchivo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { nombre_archivo: '' };
    }
    return { nombre_archivo: file.filename };
  }

  @UseGuards(JwtAuthGuard)
  @Get('curso/:id')
  async getRecursosByCursoForStudents(@Param('id') id: string) {
    return this.recursosService.findByCursoForStudents(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @GetUser('userId') userId: number,
    @Body() createRecursoDto: CreateRecursoDto,
  ) {
    return this.recursosService.create(createRecursoDto, userId);
  }

  @Get()
  async findAll(
    @Query('busqueda') busqueda?: string,
    @Query('etiqueta') etiqueta?: string,
    @Query('herramienta') herramienta?: string,
    @Query('es_destacado') es_destacado?: string,
  ) {
    return this.recursosService.findAll({ busqueda, etiqueta, herramienta, es_destacado });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recursosService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/destacado')
  async toggleDestacado(@Param('id') id: string) {
    return this.recursosService.toggleDestacado(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.recursosService.remove(+id);
  }
}
