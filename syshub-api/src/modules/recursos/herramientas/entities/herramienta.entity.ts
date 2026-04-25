import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('herramientas')
export class Herramienta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  nombre!: string;
}
