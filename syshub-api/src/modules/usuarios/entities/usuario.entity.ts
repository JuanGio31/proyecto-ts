import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rol } from '@app/modules/usuarios/entities/rol.entity';
import { Carrera } from '@app/modules/carreras/entities/carrera.entity';
import { Post } from '@app/modules/posts/entities/post.entity';
import { PostsLike } from '@app/modules/posts/entities/posts-like.entity';
import { Recurso } from '@app/modules/recursos/entities/recurso.entity';
import { UsuarioCurso } from '@app/modules/usuarios/entities/usuario-curso.entity';
import { Articulo } from '@app/modules/articulos/entities/articulo.entity';
import { SolicitudArticulo } from '@app/modules/solicitudes-articulos/entities/solicitud-articulo.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column({ type: 'varchar', length: 9, unique: true, nullable: true })
  registro_academico?: string;

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

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_registro!: Date;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn({ name: 'id_rol' })
  rol!: Rol;

  @ManyToOne(() => Carrera, (carrera) => carrera.usuarios, { nullable: true })
  @JoinColumn({ name: 'id_carrera' })
  carrera?: Carrera;

  @OneToMany(() => UsuarioCurso, (uc) => uc.usuario)
  usuarios_cursos!: UsuarioCurso[];

  @OneToMany(() => Recurso, (recurso) => recurso.usuario)
  recursos!: Recurso[];

  @OneToMany(() => Post, (post) => post.autor)
  posts!: Post[];

  @OneToMany(() => Articulo, (articulo) => articulo.autor)
  articulos!: Articulo[];

  @OneToMany(() => PostsLike, (like) => like.usuario)
  likes!: PostsLike[];

  @Column({ type: 'boolean', default: false })
  esta_suspendido!: boolean;

  @Column({ type: 'boolean', default: false })
  puede_crear_articulos!: boolean;

  @OneToMany(() => SolicitudArticulo, (solicitud) => solicitud.usuario)
  solicitudes_articulos!: SolicitudArticulo[];
}
