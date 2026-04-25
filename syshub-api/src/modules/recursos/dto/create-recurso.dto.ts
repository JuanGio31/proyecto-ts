import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRecursoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  descripcion!: string;

  @IsString()
  @IsOptional()
  url_archivo?: string;

  @IsInt()
  @IsOptional()
  id_curso?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  etiquetas!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  herramientas!: string[];

  @IsString()
  @IsOptional()
  @MaxLength(255)
  herramientas_adicionales?: string;

  @IsBoolean()
  @IsOptional()
  es_destacado: boolean = false;
}
