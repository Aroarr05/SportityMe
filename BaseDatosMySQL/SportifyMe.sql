-- DROP DATABASE IF EXISTS SportifyMe;

CREATE DATABASE SportifyMe;
USE SportifyMe;

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

INSERT INTO roles (nombre, descripcion) VALUES 
('ADMIN', 'Administrador completo del sistema'),
('USUARIO', 'Usuario estándar de la aplicación');

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol_id BIGINT NOT NULL DEFAULT 2, 
    avatar_url VARCHAR(255),
    biografia TEXT,
    ubicacion VARCHAR(100),
    fecha_nacimiento DATE,
    genero ENUM('MASCULINO', 'FEMENINO', 'OTRO', 'NO_ESPECIFICADO'),
    peso DECIMAL(5,2),
    altura INT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
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
    icono VARCHAR(50) DEFAULT NULL,
    dificultad ENUM('PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'),
    max_participantes INT,
    estado ENUM('ACTIVO', 'INACTIVO', 'ELIMINADO') DEFAULT 'ACTIVO',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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

CREATE TABLE acciones_admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    tipo_accion ENUM('CREAR_DESAFIO', 'EDITAR_DESAFIO', 'ELIMINAR_DESAFIO', 'EDITAR_USUARIO', 'ELIMINAR_USUARIO') NOT NULL,
    entidad_afectada VARCHAR(100) NOT NULL,
    id_entidad_afectada BIGINT,
    descripcion TEXT,
    fecha_accion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

DELIMITER //
CREATE TRIGGER set_icono_desafio
BEFORE INSERT ON desafios
FOR EACH ROW
BEGIN
    IF NEW.icono IS NULL THEN
        SET NEW.icono = CASE NEW.tipo_actividad
            WHEN 'correr' THEN 'fa-running'
            WHEN 'ciclismo' THEN 'fa-bicycle'
            WHEN 'natacion' THEN 'fa-swimmer'
            WHEN 'gimnasio' THEN 'fa-dumbbell'
            WHEN 'otros' THEN 'fa-star'
        END;
    END IF;
END//
DELIMITER ;

CREATE TABLE desafios_completados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    desafio_id BIGINT NOT NULL,
    fecha_completado DATETIME DEFAULT CURRENT_TIMESTAMP,
    completado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (desafio_id) REFERENCES desafios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, desafio_id)
);
