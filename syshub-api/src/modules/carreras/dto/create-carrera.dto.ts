import { IsNumber, IsString } from 'class-validator';

export class CreateCarreraDto {
  @IsString()
  codigo_carrera!: string;
  @IsString()
  nombre_carrera!: string;
  @IsNumber()
  id_division!: number;
}
