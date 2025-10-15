USE SportifyMe;

INSERT INTO usuarios (nombre, email, contraseña, rol_id) VALUES 
('Administrador', 'admin@sportifyme.com', '123456', 1);

INSERT INTO usuarios (nombre, email, contraseña, rol_id, avatar_url, biografia, ubicacion, fecha_nacimiento, genero, peso, altura) VALUES 
('María González', 'maria.gonzalez@email.com', '$2y$10$hashedpassword1', 2, 'https://example.com/avatar1.jpg', 'Amante del running y ciclismo', 'Madrid', '1990-05-15', 'FEMENINO', 65.5, 170),
('Carlos López', 'carlos.lopez@email.com', '$2y$10$hashedpassword2', 2, 'https://example.com/avatar2.jpg', 'Nadador profesional los fines de semana', 'Barcelona', '1988-08-22', 'MASCULINO', 78.2, 182),
('Ana Rodríguez', 'ana.rodriguez@email.com', '$2y$10$hashedpassword3', 2, 'https://example.com/avatar3.jpg', 'En busca de nuevos desafíos fitness', 'Valencia', '1995-03-10', 'FEMENINO', 58.0, 165),
('Javier Martínez', 'javier.martinez@email.com', '$2y$10$hashedpassword4', 2, 'https://example.com/avatar4.jpg', 'Ciclista de montaña apasionado', 'Sevilla', '1992-11-30', 'MASCULINO', 75.0, 178),
('Laura Sánchez', 'laura.sanchez@email.com', '$2y$10$hashedpassword5', 2, 'https://example.com/avatar5.jpg', 'Yoga y running para equilibrar mente y cuerpo', 'Bilbao', '1993-07-18', 'FEMENINO', 62.3, 168),
('David Fernández', 'david.fernandez@email.com', '$2y$10$hashedpassword6', 2, 'https://example.com/avatar6.jpg', 'Preparándome para mi primera maratón', 'Zaragoza', '1987-12-05', 'MASCULINO', 80.1, 185),
('Elena Pérez', 'elena.perez@email.com', '$2y$10$hashedpassword7', 2, 'https://example.com/avatar7.jpg', 'Nadadora desde los 6 años', 'Málaga', '1994-09-25', 'FEMENINO', 59.8, 172),
('Miguel Torres', 'miguel.torres@email.com', '$2y$10$hashedpassword8', 2, 'https://example.com/avatar8.jpg', 'CrossFit y funcional training', 'Murcia', '1991-04-12', 'MASCULINO', 85.5, 180),
('Sofía Ramírez', 'sofia.ramirez@email.com', '$2y$10$hashedpassword9', 2, 'https://example.com/avatar9.jpg', 'Amante del senderismo y la naturaleza', 'Palma', '1996-01-08', 'FEMENINO', 61.0, 167),
('Daniel García', 'daniel.garcia@email.com', '$2y$10$hashedpassword10', 2, 'https://example.com/avatar10.jpg', 'Ciclista urbano y competidor amateur', 'Las Palmas', '1989-06-20', 'MASCULINO', 77.3, 176),
('Paula Hernández', 'paula.hernandez@email.com', '$2y$10$hashedpassword11', 2, 'https://example.com/avatar11.jpg', 'Instructora de pilates y corredora', 'Alicante', '1992-02-14', 'FEMENINO', 63.7, 169),
('Alejandro Díaz', 'alejandro.diaz@email.com', '$2y$10$hashedpassword12', 2, 'https://example.com/avatar12.jpg', 'Triatleta en formación', 'Córdoba', '1986-10-03', 'MASCULINO', 79.0, 181),
('Carmen Ruiz', 'carmen.ruiz@email.com', '$2y$10$hashedpassword13', 2, 'https://example.com/avatar13.jpg', 'Deportista multidisciplinar', 'Valladolid', '1993-08-17', 'FEMENINO', 60.2, 164),
('Pablo Moreno', 'pablo.moreno@email.com', '$2y$10$hashedpassword14', 2, 'https://example.com/avatar14.jpg', 'Gym rat y nutricionista aficionado', 'Vigo', '1990-11-28', 'MASCULINO', 83.4, 179),
('Isabel Castro', 'isabel.castro@email.com', '$2y$10$hashedpassword15', 2, 'https://example.com/avatar15.jpg', 'Runner principiante con grandes metas', 'Gijón', '1995-05-06', 'FEMENINO', 57.9, 163),
('Raúl Ortega', 'raul.ortega@email.com', '$2y$10$hashedpassword16', 2, 'https://example.com/avatar16.jpg', 'Ciclista de ruta los domingos', 'Hospitalet', '1988-07-19', 'MASCULINO', 76.8, 177),
('Teresa Marín', 'teresa.marin@email.com', '$2y$10$hashedpassword17', 2, 'https://example.com/avatar17.jpg', 'Nadar es mi meditación', 'Granada', '1994-12-11', 'FEMENINO', 58.5, 166),
('Roberto Navarro', 'roberto.navarro@email.com', '$2y$10$hashedpassword18', 2, 'https://example.com/avatar18.jpg', 'Preparador físico personal', 'Elche', '1987-03-24', 'MASCULINO', 81.2, 183),
('Mónica Iglesias', 'monica.iglesias@email.com', '$2y$10$hashedpassword19', 2, 'https://example.com/avatar19.jpg', 'Deporte como estilo de vida', 'Santa Cruz', '1991-09-09', 'FEMENINO', 64.1, 171);

INSERT INTO desafios (titulo, descripcion, tipo_actividad, objetivo, unidad_objetivo, fecha_inicio, fecha_fin, creador_id, dificultad, max_participantes) VALUES 
('Maratón de Primavera', 'Corre 42km durante el mes de abril', 'correr', 42.0, 'km', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 1, 'AVANZADO', 50),
('Reto Ciclista 100km', 'Completa 100km en bicicleta este mes', 'ciclismo', 100.0, 'km', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 2, 'INTERMEDIO', 30),
('Nado Semanal', 'Nada 5km cada semana', 'natacion', 20.0, 'km', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 3, 'INTERMEDIO', 25),
('Gym Challenge', '20 horas de entrenamiento en gimnasio', 'gimnasio', 20.0, 'horas', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 4, 'PRINCIPIANTE', 40),
('Running para Principiantes', 'Corre 30km en tu primer mes', 'correr', 30.0, 'km', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 1, 'PRINCIPIANTE', 100),
('Ciclismo de Montaña', '50km de trail en bicicleta', 'ciclismo', 50.0, 'km', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 6, 'AVANZADO', 20),
('Maratón Acuático', 'Nada 25km este mes', 'natacion', 25.0, 'km', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 7, 'AVANZADO', 15),
('Fuerza y Potencia', 'Entrena 15 días en gimnasio', 'gimnasio', 15.0, 'sesiones', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 8, 'INTERMEDIO', 35),
('Carrera Nocturna', 'Corre 60km bajo las estrellas', 'correr', 60.0, 'km', '2024-04-15 00:00:00', '2024-05-15 23:59:59', 9, 'INTERMEDIO', 45),
('Tour Ciclista', '200km en bicicleta este mes', 'ciclismo', 200.0, 'km', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 10, 'AVANZADO', 25);


INSERT INTO participaciones (usuario_id, desafio_id) VALUES 
(2, 1), (3, 1), (4, 1), (5, 1),
(1, 2), (3, 2), (6, 2), (7, 2),
(2, 3), (4, 3), (8, 3), (9, 3),
(3, 4), (5, 4), (10, 4), (11, 4),
(6, 5), (7, 5), (12, 5), (13, 5);


INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, comentario) VALUES 
(2, 1, 15.5, 'km', 'Primera semana completada!'),
(3, 1, 10.2, 'km', 'Voy por buen camino'),
(1, 2, 45.0, 'km', 'Mitad del reto casi completada'),
(6, 2, 30.5, 'km', 'Disfrutando del paisaje'),
(2, 3, 8.0, 'km', 'Nado matutino perfecto'),
(8, 3, 6.5, 'km', 'Mejorando mi técnica'),
(3, 4, 8.0, 'horas', 'Rutina de fuerza completada'),
(10, 4, 5.5, 'horas', 'Comenzando con buen pie');


INSERT INTO comentarios (usuario_id, desafio_id, contenido) VALUES 
(2, 1, '¡Excelente desafío! Estoy motivado para completarlo'),
(3, 1, 'Alguien quiere entrenar juntos este fin de semana?'),
(1, 2, 'Las rutas de ciclismo están increíbles en esta época'),
(4, 3, 'Consejos para mejorar la respiración en natación?'),
(5, 4, 'Este reto me está ayudando a crear el hábito del gym');

INSERT INTO logros (nombre, descripcion, criterio, valor_requerido, categoria) VALUES 
('Primeros Pasos', 'Completa tu primer desafío', 'DESAFIOS_COMPLETADOS', 1, 'PROGRESO'),
('Atleta Consistente', 'Completa 10 desafíos', 'DESAFIOS_COMPLETADOS', 10, 'PROGRESO'),
('Socializador', 'Comenta en 5 desafíos diferentes', 'COMENTARIOS_HECHOS', 5, 'SOCIAL'),
('Líder Nato', 'Crea 3 desafíos públicos', 'DESAFIOS_CREADOS', 3, 'SOCIAL'),
('Comprometido', 'Participa en desafíos por 30 días seguidos', 'DIAS_SEGUIDOS', 30, 'DEDICACION');


INSERT INTO usuario_logros (usuario_id, logro_id) VALUES 
(1, 1), (2, 1), (3, 1), (4, 1), 
(1, 2), (2, 2),                   
(1, 3), (2, 3), (5, 3);           

INSERT INTO acciones_admin (admin_id, tipo_accion, entidad_afectada, id_entidad_afectada, descripcion) VALUES 
(1, 'CREAR_DESAFIO', 'DESAFIO', 1, 'Creación del Maratón de Primavera'),
(1, 'CREAR_DESAFIO', 'DESAFIO', 2, 'Creación del Reto Ciclista 100km'),
(1, 'EDITAR_USUARIO', 'USUARIO', 3, 'Actualización de perfil de usuario');

UPDATE usuarios SET ultimo_login = '2024-04-10 09:30:00' WHERE id IN (1, 2, 3, 4, 5);
UPDATE usuarios SET ultimo_login = '2024-04-09 14:20:00' WHERE id IN (6, 7, 8, 9, 10);