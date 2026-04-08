import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegistroUsuarioDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nombre_completo: string;

  @IsString()
  @Length(9)
  registro_academico: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsNumber()
  id_carrera: number;

  @IsDate()
  @Type(() => Date)
  fecha_cumpleanios: Date;
}
