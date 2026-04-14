import { RegistroUsuarioDto } from '@app/modules/auth/dto/registro-auth.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(
  OmitType(RegistroUsuarioDto, [
    'id_rol',
    'id_carrera',
    'password',
    'registro_academico',
  ] as const),
) {
  @IsOptional()
  @IsString()
  foto_perfil?: string;
}
