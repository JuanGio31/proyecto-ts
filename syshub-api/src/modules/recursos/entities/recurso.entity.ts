import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Curso } from '@app/modules/carreras/cursos/entities/curso.entity';
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';
import { Etiqueta } from '@app/modules/etiquetas/entities/etiqueta.entity';
import { Herramienta } from '@app/modules/recursos/herramientas/entities/herramienta.entity';

@Entity('recursos')
export class Recurso {
  @PrimaryGeneratedColumn()
  id_recurso!: number;

  @Column({ type: 'varchar', length: 100 })
  titulo!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'varchar', length: 255 })
  url_archivo!: string;

  @Column({ type: 'boolean', default: false })
  es_destacado!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_publicacion!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.recursos)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.recursos, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_curso' })
  curso?: Curso;

  @ManyToMany(() => Etiqueta)
  @JoinTable({ name: 'recursos_etiquetas' })
  etiquetas!: Etiqueta[];

  @ManyToMany(() => Herramienta)
  @JoinTable({ name: 'recursos_herramientas' })
  herramientas!: Herramienta[];

  @Column({ type: 'text', nullable: true })
  herramientas_adicionales?: string;
}
