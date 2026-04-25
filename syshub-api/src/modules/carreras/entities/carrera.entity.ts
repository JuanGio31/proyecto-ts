import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Division } from '@app/modules/carreras/divisiones/entities/divisione.entity';
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';
import { Curso } from '@app/modules/carreras/cursos/entities/curso.entity';
@Entity('carreras')
export class Carrera {
  @PrimaryGeneratedColumn()
  id_carrera!: number;

  @Column({ type: 'varchar', length: 15, unique: true })
  codigo_carrera!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre_carrera!: string;

  //Muchos carreras pertenecen a una division
  @ManyToOne(() => Division, (division) => division.carreras)
  @JoinColumn({ name: 'id_division' })
  division!: Division;

  //Una carrera tiene muchos usuarios
  @OneToMany(() => Usuario, (usuario) => usuario.carrera)
  usuarios!: Usuario[];

  //Una carrera tiene muchos cursos
  @OneToMany(() => Curso, (curso) => curso.carrera)
  cursos!: Curso[];
}
