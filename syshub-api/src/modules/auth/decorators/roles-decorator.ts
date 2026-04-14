import { SetMetadata } from '@nestjs/common';

// Clave para la metadata
export const ROLES_KEY = 'roles';

// decorador que recibe un array de roles
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
