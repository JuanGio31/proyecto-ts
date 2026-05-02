import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudArticulo, EstadoSolicitud } from './entities/solicitud-articulo.entity';
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';

@Injectable()
export class SolicitudesArticulosService {
  constructor(
    @InjectRepository(SolicitudArticulo)
    private readonly solicitudRepository: Repository<SolicitudArticulo>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async crearSolicitud(userId: number): Promise<SolicitudArticulo> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: userId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (usuario.puede_crear_articulos) {
      throw new BadRequestException('Ya tienes permiso para crear artículos');
    }

    const solicitudPendiente = await this.solicitudRepository.findOne({
      where: {
        usuario: { id_usuario: userId },
        estado: EstadoSolicitud.PENDIENTE,
      },
    });

    if (solicitudPendiente) {
      throw new BadRequestException('Ya tienes una solicitud pendiente');
    }

    const solicitud = this.solicitudRepository.create({
      usuario: { id_usuario: userId },
      estado: EstadoSolicitud.PENDIENTE,
    });

    return await this.solicitudRepository.save(solicitud);
  }

  async getSolicitudesPendientes(): Promise<SolicitudArticulo[]> {
    return await this.solicitudRepository.find({
      where: { estado: EstadoSolicitud.PENDIENTE },
      relations: ['usuario', 'usuario.rol'],
      order: { fecha_solicitud: 'DESC' },
    });
  }

  async getTodasSolicitudes(): Promise<SolicitudArticulo[]> {
    return await this.solicitudRepository.find({
      relations: ['usuario', 'usuario.rol', 'admin_respondedor'],
      order: { fecha_solicitud: 'DESC' },
    });
  }

  async aprobar(id: number, adminId: number): Promise<SolicitudArticulo> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitud: id },
      relations: ['usuario'],
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
      throw new BadRequestException('La solicitud ya ha sido procesada');
    }

    solicitud.estado = EstadoSolicitud.APROBADA;
    solicitud.admin_respondedor = { id_usuario: adminId } as Usuario;

    await this.usuarioRepository.update(solicitud.usuario.id_usuario, {
      puede_crear_articulos: true,
    });

    return await this.solicitudRepository.save(solicitud);
  }

  async rechazar(id: number, adminId: number): Promise<SolicitudArticulo> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitud: id },
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
      throw new BadRequestException('La solicitud ya ha sido procesada');
    }

    solicitud.estado = EstadoSolicitud.RECHAZADA;
    solicitud.admin_respondedor = { id_usuario: adminId } as Usuario;

    return await this.solicitudRepository.save(solicitud);
  }

  async getMiSolicitud(userId: number): Promise<SolicitudArticulo | null> {
    return await this.solicitudRepository.findOne({
      where: { usuario: { id_usuario: userId } },
      order: { fecha_solicitud: 'DESC' },
    });
  }
}