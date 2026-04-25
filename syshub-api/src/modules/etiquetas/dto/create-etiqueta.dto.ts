import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEtiquetaDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  nombre!: string;
}
