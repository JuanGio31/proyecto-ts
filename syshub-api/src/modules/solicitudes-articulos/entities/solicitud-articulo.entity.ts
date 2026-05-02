import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';

export enum EstadoSolicitud {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
}

@Entity('solicitudes_articulos')
export class SolicitudArticulo {
  @PrimaryGeneratedColumn()
  id_solicitud!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes_articulos)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @Column({ type: 'varchar', length: 50, default: EstadoSolicitud.PENDIENTE })
  estado!: EstadoSolicitud;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_solicitud!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  fecha_respuesta?: Date;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'id_admin_respondedor' })
  admin_respondedor?: Usuario;
}