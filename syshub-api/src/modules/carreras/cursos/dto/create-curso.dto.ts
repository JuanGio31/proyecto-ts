import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @MaxLength(10)
  codigo_curso!: string;

  @IsString()
  @MaxLength(100)
  nombre_curso!: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  semestre!: number;

  @IsNumber()
  id_carrera!: number;
}
