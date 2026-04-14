import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // Passport/JwtStrategy inyectó automáticamente los datos aquí
    const user = request.user;

    // Si pedimos una propiedad específica (ej. 'userId'), devolvemos solo eso.
    // Si no pedimos nada, devolvemos todo el objeto del usuario.
    return data ? user?.[data] : user;
  },
);
