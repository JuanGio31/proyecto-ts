import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  contenido!: string;

  @IsArray()
  @IsOptional()
  nombres_imagenes?: string[];

  @IsInt()
  @IsOptional()
  post_respuesta_id?: number;
}
