import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';
import { Articulo } from './articulo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('articulos_comentarios')
export class ArticuloComentario {
  @PrimaryGeneratedColumn()
  id_comentario!: number;

  @Column({ type: 'text' })
  contenido!: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion!: Date;

  @ManyToOne(() => Articulo, (articulo) => articulo.comentarios)
  @JoinColumn({ name: 'id_articulo' })
  articulo!: Articulo;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_autor' })
  autor!: Usuario;
}