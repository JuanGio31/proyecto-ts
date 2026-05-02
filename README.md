# SysHub - Sistema de Gestión Universidad

Sistema universitario desarrollado con NestJS (backend) y Vue 3 (frontend).

## Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- npm

## Estructura del Proyecto

```
proyecto-ts/
├── syshub-api/          # Backend (NestJS)
├── syshub-web/          # Frontend (Vue 3)
├── README.md
└── .gitignore
```

## Configuración de Entorno

### Base de datos PostgreSQL

```bash
# Crear la base de datos
createdb -U postgres tsdb
```

### Backend (`syshub-api/.env`)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=syshub
DB_PASSWORD=sys-hub/f2
DB_NAME=tsdb
NODE_ENV=dev
JWT_SECRET=My-secret.key
JWT_EXPIRES_IN=1200s
```

### Frontend (`syshub-web/.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Instalación

### Backend

```bash
cd syshub-api
npm install
```

### Frontend

```bash
cd syshub-web
npm install
```

## Ejecución

### Backend (Puerto 3000)

```bash
cd syshub-api
npm run start:dev
```

El backend incluye un **Seed** que se ejecuta automáticamente al iniciar, creando:
- Roles (administrador, auxiliar, estudiante)
- Divisiones, Carreras, Cursos
- Usuarios de prueba (admin, auxiliares, estudiantes)

### Frontend (Puerto 5173)

```bash
cd syshub-web
npm run dev
```

## Credenciales de Prueba

El seed crea los siguientes usuarios (contraseña: `123456`):

| Rol | Email |
|-----|-------|
| Administrador | admin@syshub.com |
| Auxiliar | auxiliar1@syshub.com, auxiliar2@syshub.com |
| Estudiante | estudiante1@syshub.com, ... |

## Rutas Principales

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión |
| `/registro` | Registro de usuarios |
| `/` | Home (Estudiante) |
| `/dashboard-auxiliar` | Dashboard Auxiliar |
| `/dashboard-admin` | Dashboard Administrador |
| `/explorar` | Explorar recursos, hallazgos, posts, artículos |
| `/repositorio` | Repositorio de materiales (Estudiante) |
| `/curaduria` | Curaduria de recursos (Auxiliar) |
| `/materias` | Gestión de materias (Auxiliar) |

## Notas Importantes

- **TypeORM synchronize: true**: La base de datos se sincroniza automáticamente con las entidades al iniciar la API. No requiere migraciones.
- El seed solo inserta datos si no existen (es idempotente).
- JWT expira en 1200s (20 minutos).

## Scripts Disponibles

### Backend
- `npm run start:dev` - Iniciar en modo desarrollo
- `npm run build` - Compilar
- `npm run lint` - Linter

### Frontend
- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción