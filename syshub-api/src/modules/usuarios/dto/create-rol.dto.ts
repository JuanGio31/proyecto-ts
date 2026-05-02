import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  nombre_rol!: string;

  @IsString()
  @IsOptional()
  descripcion_rol?: string;
}
