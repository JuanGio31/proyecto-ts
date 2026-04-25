import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUsuarioAdminDto {
  @IsString()
  @MinLength(1)
  nombre_completo!: string;

  @IsString()
  @IsOptional()
  registro_academico?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsNumber()
  id_rol!: number;

  @IsNumber()
  @IsOptional()
  id_carrera?: number;

  @IsString()
  @IsOptional()
  fecha_nacimiento?: string;
}