import { PostImagen } from '@app/modules/posts/entities/post-imagen.entity';
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';
import { PostsLike } from '@app/modules/posts/entities/posts-like.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id_post!: number;

  @Column({ type: 'text' })
  contenido!: string;

  @CreateDateColumn({ type: 'date' })
  fecha_publicacion!: Date;

  // muchos posts pertenecen a un usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.posts)
  @JoinColumn({ name: 'id_autor' })
  autor!: Usuario;

  // un post puede tener muchas imagenes
  @OneToMany(() => PostImagen, (imagen) => imagen.post, { cascade: true })
  imagenes!: PostImagen[];

  @OneToMany(() => PostsLike, (like) => like.post)
  likes!: PostsLike[];
}
