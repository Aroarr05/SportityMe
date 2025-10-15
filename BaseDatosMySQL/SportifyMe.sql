
-- DROP DATABASE IF EXISTS SportifyMe;


CREATE DATABASE SportifyMe;
USE SportifyMe;


CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    biografia TEXT,
    ubicacion VARCHAR(100),
    fecha_nacimiento DATE,
    genero ENUM('MASCULINO', 'FEMENINO', 'OTRO', 'NO_ESPECIFICADO'),
    peso DECIMAL(5,2),
    altura INT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME
);

CREATE TABLE desafios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_actividad ENUM('correr', 'ciclismo', 'natacion', 'gimnasio', 'otros') NOT NULL,
    objetivo DECIMAL(10,2),
    unidad_objetivo VARCHAR(20),
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    creador_id BIGINT NOT NULL,
    es_publico BOOLEAN DEFAULT TRUE,
    imagen_url VARCHAR(255),
    dificultad ENUM('PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'),
    max_participantes INT,
    FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE participaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    desafio_id BIGINT NOT NULL,
    fecha_union DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (desafio_id) REFERENCES desafios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, desafio_id)
);

CREATE TABLE progresos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    desafio_id BIGINT NOT NULL,
    valor_actual DECIMAL(10,2) NOT NULL,
    unidad VARCHAR(20) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    comentario TEXT,
    dispositivo VARCHAR(50),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (desafio_id) REFERENCES desafios(id) ON DELETE CASCADE
);

CREATE TABLE comentarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    desafio_id BIGINT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    editado BOOLEAN DEFAULT FALSE,
    fecha_edicion DATETIME,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (desafio_id) REFERENCES desafios(id) ON DELETE CASCADE
);

CREATE TABLE logros (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono_url VARCHAR(255),
    criterio VARCHAR(50) NOT NULL,
    valor_requerido INT,
    categoria ENUM('PROGRESO', 'SOCIAL', 'DEDICACION')
);

CREATE TABLE usuario_logros (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    logro_id BIGINT NOT NULL,
    fecha_obtencion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (logro_id) REFERENCES logros(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, logro_id)
);

CREATE TABLE notificaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    tipo ENUM('LOGRO', 'COMENTARIO', 'PROGRESO', 'DESAFIO', 'SISTEMA') NOT NULL,
    mensaje TEXT NOT NULL,
    enlace VARCHAR(255),
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
