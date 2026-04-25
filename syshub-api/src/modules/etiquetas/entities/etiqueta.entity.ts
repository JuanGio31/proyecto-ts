import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('etiquetas')
export class Etiqueta {
  @PrimaryGeneratedColumn()
  id_etiqueta!: number;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;
}
