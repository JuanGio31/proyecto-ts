import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateHerramientaDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  nombre!: string;
}
