import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
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
  @Post('upload')
  @UseInterceptors(FileInterceptor('archivo', recursosMulterOptions))
  uploadArchivo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { nombre_archivo: '' };
    }
    return { nombre_archivo: file.filename };
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
  async findAll() {
    return this.recursosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recursosService.findOne(+id);
  }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateRecursoDto: UpdateRecursoDto,
  // ) {
  //   return this.recursosService.update(+id, updateRecursoDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.recursosService.remove(+id);
  }
}
