import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Column } from 'typeorm';
import { Articulo } from './articulo.entity';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity('articulos_like')
export class ArticuloLike {
  @PrimaryColumn()
  id_usuario!: number;

  @PrimaryColumn()
  id_articulo!: number;

  @Column({ type: 'enum', enum: ReactionType, default: ReactionType.LIKE })
  tipo!: ReactionType;

  @ManyToOne(() => Usuario, (usuario) => usuario.likes)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @ManyToOne(() => Articulo, (articulo) => articulo.likes)
  @JoinColumn({ name: 'id_articulo' })
  articulo!: Articulo;
}