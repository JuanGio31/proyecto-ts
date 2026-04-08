import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { CarrerasModule } from './modules/carreras/carreras.module';
import { RolesModule } from './modules/usuarios/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // cargar variables de entorno y usarlas en todo el proyecto
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // configurar conexión de typeorm
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') !== 'prod',
        logging: configService.get('NODE_ENV') !== 'prod',
      }),
    }),
    UsuariosModule,
    CarrerasModule,
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}
