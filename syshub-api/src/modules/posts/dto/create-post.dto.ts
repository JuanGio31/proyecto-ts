import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  contenido!: string;

  @IsArray()
  @IsOptional()
  nombres_imagenes?: string[];
}
