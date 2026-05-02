import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudesArticulosService } from './solicitudes-articulos.service';
import { SolicitudesArticulosController } from './solicitudes-articulos.controller';
import { SolicitudArticulo } from './entities/solicitud-articulo.entity';
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SolicitudArticulo, Usuario])],
  controllers: [SolicitudesArticulosController],
  providers: [SolicitudesArticulosService],
  exports: [SolicitudesArticulosService],
})
export class SolicitudesArticulosModule {}