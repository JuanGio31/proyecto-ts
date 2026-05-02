import { Etiqueta } from '@app/modules/etiquetas/entities/etiqueta.entity';
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';
import { ArticuloLike } from './articulo-like.entity';
import { ArticuloComentario } from './articulo-comentario.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn()
  id_articulo!: number;

  @Column({ type: 'varchar', length: 100 })
  titulo!: string;

  @Column({ type: 'text' })
  contenido!: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_publicacion!: Date;

  @ManyToMany(() => Etiqueta)
  @JoinTable({ name: 'articulos_etiquetas' })
  etiquetas!: Etiqueta[];

  @ManyToOne(() => Usuario, (usuario) => usuario.articulos)
  @JoinColumn({ name: 'id_autor' })
  autor!: Usuario;

  @OneToMany(() => ArticuloLike, (like) => like.articulo)
  likes!: ArticuloLike[];

  @OneToMany(() => ArticuloComentario, (comentario) => comentario.articulo)
  comentarios!: ArticuloComentario[];
}
