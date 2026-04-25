import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @MaxLength(10)
  codigo_curso!: string;

  @IsString()
  @MaxLength(100)
  nombre_curso!: string;

  @IsNumber()
  id_carrera!: number;
}
