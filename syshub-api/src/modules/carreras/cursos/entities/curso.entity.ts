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

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id_curso!: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  codigo_cunoc!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre_curso!: string;

  //un curso pertenece a una carrera
  @ManyToOne(() => Carrera, (carrera) => carrera.cursos)
  @JoinColumn({ name: 'id_carrera' })
  carrera!: Carrera;

  //un curso puede tener muchos recursos
  @OneToMany(() => Recurso, (recurso) => recurso.curso)
  recursos!: Recurso[];
}
