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

  @CreateDateColumn({ type: 'timestamp' })
  fecha_publicacion!: Date;

  @ManyToOne(() => Post, (post) => post.comentarios, { nullable: true })
  @JoinColumn({ name: 'post_respuesta_id' })
  postRespuesta?: Post;

  @OneToMany(() => Post, (post) => post.postRespuesta)
  comentarios!: Post[];

  @ManyToOne(() => Usuario, (usuario) => usuario.posts)
  @JoinColumn({ name: 'id_autor' })
  autor!: Usuario;

  @OneToMany(() => PostImagen, (imagen) => imagen.post, { cascade: true })
  imagenes!: PostImagen[];

  @OneToMany(() => PostsLike, (like) => like.post)
  likes!: PostsLike[];
}
