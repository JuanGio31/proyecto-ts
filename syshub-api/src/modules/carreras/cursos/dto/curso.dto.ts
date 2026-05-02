import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AsignarAuxiliarDto {
  @IsNumber()
  id_auxiliar!: number;
}

export class UpdateCursoDto {
  @IsString()
  @IsOptional()
  nombre_curso?: string;

  @IsString()
  @IsOptional()
  codigo_cunoc?: string;

  @IsNumber()
  @IsOptional()
  id_carrera?: number;
}

export class CreateCursoDto {
  @IsString()
  nombre_curso!: string;

  @IsString()
  codigo_cunoc!: string;

  @IsNumber()
  id_carrera!: number;
}