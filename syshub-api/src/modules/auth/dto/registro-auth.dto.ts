import {
  IsEmail,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class RegistroUsuarioDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nombre_completo!: string;

  @IsString()
  @Length(9)
  registro_academico?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsNumber()
  @IsOptional()
  id_rol?: number;

  @IsNumber()
  id_carrera!: number;

  @IsDateString()
  @IsOptional()
  fecha_nacimiento?: string;
}
