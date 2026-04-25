import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto {
  @IsString()
  @IsOptional()
  nombre_completo?: string;

  @IsNumber()
  @IsOptional()
  id_rol?: number;

  @IsNumber()
  @IsOptional()
  id_carrera?: number;

  @IsString()
  @IsOptional()
  foto_perfil?: string;
}