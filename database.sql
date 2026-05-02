-- SysHub Database Schema
-- PostgreSQL 14+

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE reaction_type AS ENUM ('like', 'dislike');

CREATE TYPE estado_solicitud AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- =====================================================
-- TABLAS BASE
-- =====================================================

-- Roles
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion_rol TEXT
);

-- Divisiones
CREATE TABLE divisiones (
    id SERIAL PRIMARY KEY,
    nombre_division VARCHAR(70) NOT NULL UNIQUE
);

-- Carreras
CREATE TABLE carreras (
    id_carrera SERIAL PRIMARY KEY,
    codigo_carrera VARCHAR(15) NOT NULL UNIQUE,
    nombre_carrera VARCHAR(100) NOT NULL,
    id_division INTEGER NOT NULL REFERENCES divisiones(id)
);

-- Cursos
CREATE TABLE cursos (
    id_curso SERIAL PRIMARY KEY,
    codigo_curso VARCHAR(10) NOT NULL UNIQUE,
    nombre_curso VARCHAR(100) NOT NULL,
    semestre INTEGER NOT NULL,
    id_carrera INTEGER NOT NULL REFERENCES carreras(id_carrera),
    id_auxiliar INTEGER
);

-- Herramientas
CREATE TABLE herramientas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Etiquetas
CREATE TABLE etiquetas (
    id_etiqueta SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- =====================================================
-- USUARIOS
-- =====================================================

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    registro_academico VARCHAR(9) UNIQUE,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50),
    foto_perfil VARCHAR(255),
    fecha_nacimiento DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_rol INTEGER NOT NULL REFERENCES roles(id_rol),
    id_carrera INTEGER REFERENCES carreras(id_carrera),
    esta_suspendido BOOLEAN DEFAULT FALSE,
    puede_crear_articulos BOOLEAN DEFAULT FALSE
);

-- Tabla intermedia usuarios_cursos
CREATE TABLE usuarios_cursos (
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_curso INTEGER NOT NULL REFERENCES cursos(id_curso) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, id_curso)
);

-- =====================================================
-- RECURSOS
-- =====================================================

CREATE TABLE recursos (
    id_recurso SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    url_archivo VARCHAR(255) NOT NULL,
    es_destacado BOOLEAN DEFAULT FALSE,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario),
    id_curso INTEGER REFERENCES cursos(id_curso)
);

-- Tabla intermedia recursos_etiquetas
CREATE TABLE recursos_etiquetas (
    id_recurso INTEGER NOT NULL REFERENCES recursos(id_recurso) ON DELETE CASCADE,
    id_etiqueta INTEGER NOT NULL REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE,
    PRIMARY KEY (id_recurso, id_etiqueta)
);

-- Tabla intermedia recursos_herramientas
CREATE TABLE recursos_herramientas (
    id_recurso INTEGER NOT NULL REFERENCES recursos(id_recurso) ON DELETE CASCADE,
    id_herramienta INTEGER NOT NULL REFERENCES herramientas(id) ON DELETE CASCADE,
    PRIMARY KEY (id_recurso, id_herramienta)
);

-- =====================================================
-- POSTS (FORO)
-- =====================================================

CREATE TABLE posts (
    id_post SERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_respuesta_id INTEGER REFERENCES posts(id_post) ON DELETE CASCADE,
    id_autor INTEGER NOT NULL REFERENCES usuarios(id_usuario)
);

-- Imágenes de posts
CREATE TABLE post_imagen (
    id_imagen SERIAL PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    id_post INTEGER NOT NULL REFERENCES posts(id_post) ON DELETE CASCADE
);

-- Likes/Dislikes de posts
CREATE TABLE posts_like (
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_post INTEGER NOT NULL REFERENCES posts(id_post) ON DELETE CASCADE,
    tipo reaction_type DEFAULT 'like',
    PRIMARY KEY (id_usuario, id_post)
);

-- =====================================================
-- ARTÍCULOS
-- =====================================================

CREATE TABLE articulos (
    id_articulo SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_autor INTEGER NOT NULL REFERENCES usuarios(id_usuario)
);

-- Tabla intermedia articulos_etiquetas
CREATE TABLE articulos_etiquetas (
    id_articulo INTEGER NOT NULL REFERENCES articulos(id_articulo) ON DELETE CASCADE,
    id_etiqueta INTEGER NOT NULL REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE,
    PRIMARY KEY (id_articulo, id_etiqueta)
);

-- Likes/Dislikes de artículos
CREATE TABLE articulos_like (
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_articulo INTEGER NOT NULL REFERENCES articulos(id_articulo) ON DELETE CASCADE,
    tipo reaction_type DEFAULT 'like',
    PRIMARY KEY (id_usuario, id_articulo)
);

-- Comentarios de artículos
CREATE TABLE articulos_comentarios (
    id_comentario SERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_articulo INTEGER NOT NULL REFERENCES articulos(id_articulo) ON DELETE CASCADE,
    id_autor INTEGER NOT NULL REFERENCES usuarios(id_usuario)
);

-- =====================================================
-- SOLICITUDES DE ARTÍCULOS
-- =====================================================

CREATE TABLE solicitudes_articulos (
    id_solicitud SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    estado estado_solicitud DEFAULT 'pendiente',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP,
    id_admin_respondedor INTEGER REFERENCES usuarios(id_usuario)
);

-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);
CREATE INDEX idx_usuarios_carrera ON usuarios(id_carrera);
CREATE INDEX idx_usuarios_email ON usuarios(email);

CREATE INDEX idx_cursos_carrera ON cursos(id_carrera);
CREATE INDEX idx_cursos_auxiliar ON cursos(id_auxiliar);

CREATE INDEX idx_recursos_usuario ON recursos(id_usuario);
CREATE INDEX idx_recursos_curso ON recursos(id_curso);
CREATE INDEX idx_recursos_destacado ON recursos(es_destacado);

CREATE INDEX idx_posts_autor ON posts(id_autor);
CREATE INDEX idx_posts_respuesta ON posts(post_respuesta_id);

CREATE INDEX idx_articulos_autor ON articulos(id_autor);

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE roles IS 'Roles del sistema: administrador, auxiliar, estudiante';
COMMENT ON TABLE divisiones IS 'Divisiones académicas de la universidad';
COMMENT ON TABLE carreras IS 'Carreras universitarias asociadas a una división';
COMMENT ON TABLE cursos IS 'Cursos dentro de una carrera';
COMMENT ON TABLE usuarios IS 'Usuarios del sistema';
COMMENT ON TABLE recursos IS 'Materiales y recursos compartidos';
COMMENT ON TABLE posts IS 'Publicaciones en el sistema de foros';
COMMENT ON TABLE articulos IS 'Artículos con contenido rico (Quill editor)';
COMMENT ON TABLE solicitudes_articulos IS 'Solicitudes de estudiantes para crear artículos';