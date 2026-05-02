import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateArticuloDto {
  @IsString()
  titulo!: string;

  @IsString()
  contenido!: string;

  @IsNumber({}, { each: true })
  @IsOptional()
  ids_etiquetas?: number[];
}