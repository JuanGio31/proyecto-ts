import { PartialType } from '@nestjs/mapped-types';
import { CreatePostImagenDto } from './create-post-imagen.dto';

export class UpdatePostImagenDto extends PartialType(CreatePostImagenDto) {}
