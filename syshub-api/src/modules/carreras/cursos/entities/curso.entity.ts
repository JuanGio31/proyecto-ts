import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Carrera } from '@app/modules/carreras/entities/carrera.entity';
import { Recurso } from '@app/modules/recursos/entities/recurso.entity';
import { UsuarioCurso } from '@app/modules/usuarios/entities/usuario-curso.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id_curso!: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  codigo_curso!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre_curso!: string;

  @Column({ type: 'int' })
  semestre!: number;

  @ManyToOne(() => Carrera, (carrera) => carrera.cursos)
  @JoinColumn({ name: 'id_carrera' })
  carrera!: Carrera;

  @OneToMany(() => Recurso, (recurso) => recurso.curso)
  recursos!: Recurso[];

  @OneToMany(() => UsuarioCurso, (uc) => uc.curso)
  usuarios_cursos!: UsuarioCurso[];
}
