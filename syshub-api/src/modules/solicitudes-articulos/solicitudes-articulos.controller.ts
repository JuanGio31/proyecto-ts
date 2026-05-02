import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SolicitudesArticulosService } from './solicitudes-articulos.service';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { GetUser } from '@app/common/decorators/get-user.decorator';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { Roles } from '@app/common/decorators/roles.decorator';
import { ValueRol } from '@app/modules/usuarios/enums/rol.enum';

@Controller('solicitudes-articulos')
export class SolicitudesArticulosController {
  constructor(
    private readonly solicitudesService: SolicitudesArticulosService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async crearSolicitud(@GetUser('userId') userId: number) {
    return this.solicitudesService.crearSolicitud(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValueRol.ADMIN)
  @Get('pendientes')
  async getPendientes() {
    return this.solicitudesService.getSolicitudesPendientes();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValueRol.ADMIN)
  @Get()
  async getTodas() {
    return this.solicitudesService.getTodasSolicitudes();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValueRol.ADMIN)
  @Patch(':id/aprobar')
  async aprobar(
    @Param('id') id: string,
    @GetUser('userId') adminId: number,
  ) {
    return this.solicitudesService.aprobar(+id, adminId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValueRol.ADMIN)
  @Patch(':id/rechazar')
  async rechazar(
    @Param('id') id: string,
    @GetUser('userId') adminId: number,
  ) {
    return this.solicitudesService.rechazar(+id, adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mi-solicitud')
  async getMiSolicitud(@GetUser('userId') userId: number) {
    return this.solicitudesService.getMiSolicitud(userId);
  }
}