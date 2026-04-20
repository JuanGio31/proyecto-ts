import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Column } from 'typeorm';
import { Post } from '@app/modules/posts/entities/post.entity';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity('posts_like')
export class PostsLike {
  @PrimaryColumn()
  id_usuario!: number;

  @PrimaryColumn()
  id_post!: number;

  @Column({ type: 'enum', enum: ReactionType, default: ReactionType.LIKE })
  tipo!: ReactionType;

  @ManyToOne(() => Usuario, (usuario) => usuario.likes)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @ManyToOne(() => Post, (post) => post.likes)
  @JoinColumn({ name: 'id_post' })
  post!: Post;
}
