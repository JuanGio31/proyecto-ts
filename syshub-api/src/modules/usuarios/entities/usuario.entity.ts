import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinColumn } from 'typeorm';
import { Rol } from '@app/modules/usuarios/entities/rol.entity';
import { Carrera } from '@app/modules/carreras/entities/carrera.entity';
import { Post } from '@app/modules/posts/entities/post.entity';
import { PostsLike } from '@app/modules/posts/entities/posts-like.entity';

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

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  username?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foto_perfil!: string;

  @Column({ type: 'date' })
  fecha_nacimiento!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_registro!: Date;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn({ name: 'id_rol' })
  rol!: Rol;

  @ManyToOne(() => Carrera, (carrera) => carrera.usuarios)
  @JoinColumn({ name: 'id_carrera' })
  carrera!: Carrera;

  @OneToMany(() => Post, (post) => post.autor)
  posts!: Post[];

  @OneToMany(() => PostsLike, (like) => like.usuario)
  likes!: PostsLike[];
}
