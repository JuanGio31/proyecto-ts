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

  @IsOptional()
  id_curso: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  etiquetas!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  herramientas!: string[];

  @IsString()
  @IsOptional()
  @MaxLength(255)
  herramientas_adicionales?: string;

  @IsBoolean()
  @IsOptional()
  es_destacado: boolean = false;
}
