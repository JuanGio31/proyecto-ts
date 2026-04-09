import {
  IsEmail,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegistroUsuarioDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nombre_completo!: string;

  @IsString()
  @Length(9)
  registro!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsNumber()
  @IsOptional()
  rol?: number;

  @IsNumber()
  carrera!: number;

  @IsString()
  @IsOptional()
  fecha_nacimiento?: string;
}
