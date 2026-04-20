import { Post } from '@app/modules/posts/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('post_imagen')
export class PostImagen {
  @PrimaryGeneratedColumn()
  id_imagen!: number;

  @Column({ type: 'varchar', length: 255 })
  nombre_archivo!: string;

  // muchas imagenes a un post
  @ManyToOne(() => Post, (post) => post.imagenes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_post' })
  post!: Post;
}
