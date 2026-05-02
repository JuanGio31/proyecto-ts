import { IsOptional, IsString } from 'class-validator';

export class UpdatePerfilDto {
  @IsString()
  @IsOptional()
  nombre_completo?: string;

  @IsString()
  @IsOptional()
  fecha_nacimiento?: string;

  @IsString()
  @IsOptional()
  foto_perfil?: string;
}