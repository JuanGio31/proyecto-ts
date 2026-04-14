import { IsString } from 'class-validator';

export class CreateDivisioneDto {
  @IsString()
  nombre_division!: string;
}
