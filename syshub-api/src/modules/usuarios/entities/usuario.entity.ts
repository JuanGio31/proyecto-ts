import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { Carrera } from '@app/modules/carreras/entities/carrera.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column({ type: 'varchar', length: 9, unique: true })
  registro_academico!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre_completo!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ select: false, type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foto_perfil!: string;

  @Column({ type: 'date' })
  fecha_cumpleanios!: Date;

  @CreateDateColumn({ type: 'date' })
  fecha_registro!: Date;

  @Column({ name: 'id_rol' })
  id_rol!: number;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn({ name: 'id_rol' })
  rol!: Rol;

  @Column({ name: 'id_carrera' })
  id_carrera!: number;

  @ManyToOne(() => Carrera, (carrera) => carrera.usuarios)
  @JoinColumn({ name: 'id_carrera' })
  carrera!: Carrera;
}
