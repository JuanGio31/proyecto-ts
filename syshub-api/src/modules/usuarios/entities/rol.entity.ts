import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre_rol!: string;

  @Column({ type: 'text', nullable: true })
  descripcion_rol!: string;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios!: Usuario[];
}
