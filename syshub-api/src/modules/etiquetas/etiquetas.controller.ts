import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EtiquetasService } from './etiquetas.service';
import { CreateEtiquetaDto } from './dto/create-etiqueta.dto';
import { UpdateEtiquetaDto } from './dto/update-etiqueta.dto';

@Controller('etiquetas')
export class EtiquetasController {
  constructor(private readonly etiquetasService: EtiquetasService) {}

  @Post()
  async create(@Body() createEtiquetaDto: CreateEtiquetaDto) {
    return this.etiquetasService.create(createEtiquetaDto);
  }

  @Get()
  async findAll() {
    return this.etiquetasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.etiquetasService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEtiquetaDto: UpdateEtiquetaDto,
  ) {
    return this.etiquetasService.update(+id, updateEtiquetaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.etiquetasService.remove(+id);
  }
}
