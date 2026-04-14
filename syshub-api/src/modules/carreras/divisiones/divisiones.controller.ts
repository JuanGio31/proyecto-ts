import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DivisionesService } from './divisiones.service';
import { CreateDivisioneDto } from './dto/create-divisione.dto';

@Controller('divisiones')
export class DivisionesController {
  constructor(private readonly divisionesService: DivisionesService) {}

  @Post()
  create(@Body() createDivisioneDto: CreateDivisioneDto) {
    return this.divisionesService.create(createDivisioneDto);
  }

  @Get()
  findAll() {
    return this.divisionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.divisionesService.findOne(+id);
  }
}
