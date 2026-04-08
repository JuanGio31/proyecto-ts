import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Carrera } from '../../entities/carrera.entity';

@Entity('divisiones')
export class Division {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 70, unique: true })
  nombre_division!: string;

  @OneToMany(() => Carrera, (carrera) => carrera.division)
  carreras!: Carrera[];
}
