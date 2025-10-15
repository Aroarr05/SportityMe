USE SportifyMe;

INSERT INTO usuarios (nombre, email, contraseña, avatar_url, biografia, ubicacion, fecha_nacimiento, genero, peso, altura, es_admin) VALUES 
('Admin Principal', 'admin@sportifyme.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/admin.jpg', 'Administrador de SportifyMe', 'Madrid', '1985-05-15', 'MASCULINO', 75.5, 180, TRUE),
('María García', 'maria.garcia@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/maria.jpg', 'Amante del running y ciclismo', 'Barcelona', '1990-08-22', 'FEMENINO', 60.2, 165, FALSE),
('Carlos López', 'carlos.lopez@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/carlos.jpg', 'Nadador profesional', 'Valencia', '1988-03-10', 'MASCULINO', 80.0, 178, FALSE),
('Ana Rodríguez', 'ana.rodriguez@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/ana.jpg', 'Fan del gimnasio y crossfit', 'Sevilla', '1992-11-05', 'FEMENINO', 58.7, 162, FALSE),
('David Martínez', 'david.martinez@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/david.jpg', 'Ciclista de montaña', 'Bilbao', '1987-07-18', 'MASCULINO', 72.3, 175, FALSE),
('Laura Hernández', 'laura.hernandez@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/laura.jpg', 'Corredora de maratones', 'Zaragoza', '1991-04-30', 'FEMENINO', 55.8, 160, FALSE),
('Javier Pérez', 'javier.perez@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/javier.jpg', 'Triatleta aficionado', 'Málaga', '1989-09-12', 'MASCULINO', 77.1, 182, FALSE),
('Elena Sánchez', 'elena.sanchez@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/elena.jpg', 'Nadadora en aguas abiertas', 'Murcia', '1993-06-25', 'FEMENINO', 59.4, 167, FALSE),
('Miguel González', 'miguel.gonzalez@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/miguel.jpg', 'Amante del senderismo', 'Palma', '1986-12-08', 'MASCULINO', 81.2, 185, FALSE),
('Sofía Fernández', 'sofia.fernandez@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/sofia.jpg', 'Yoga y pilates', 'Las Palmas', '1994-02-14', 'FEMENINO', 57.3, 163, FALSE),
('Daniel Torres', 'daniel.torres@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/daniel.jpg', 'Boxeador amateur', 'Alicante', '1990-10-03', 'MASCULINO', 74.8, 177, FALSE),
('Paula Ramírez', 'paula.ramirez@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/paula.jpg', 'Ciclista urbana', 'Córdoba', '1995-07-19', 'FEMENINO', 56.1, 161, FALSE),
('Alejandro Morales', 'alejandro.morales@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/alejandro.jpg', 'Corredor de trail', 'Valladolid', '1988-01-27', 'MASCULINO', 76.5, 179, FALSE),
('Carmen Ortega', 'carmen.ortega@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/carmen.jpg', 'Natación sincronizada', 'Vigo', '1992-08-09', 'FEMENINO', 58.9, 166, FALSE),
('Roberto Vargas', 'roberto.vargas@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/roberto.jpg', 'Culturista', 'Gijón', '1985-11-16', 'MASCULINO', 85.0, 181, FALSE),
('Isabel Castro', 'isabel.castro@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/isabel.jpg', 'Bailarina y atleta', 'Granada', '1991-03-22', 'FEMENINO', 54.7, 159, FALSE),
('Francisco Ruiz', 'francisco.ruiz@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/francisco.jpg', 'Maratoniano', 'Badajoz', '1987-05-04', 'MASCULINO', 70.2, 176, FALSE),
('Beatriz Santos', 'beatriz.santos@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/beatriz.jpg', 'Triatleta profesional', 'Santander', '1989-12-11', 'FEMENINO', 61.5, 168, FALSE),
('Pedro Navarro', 'pedro.navarro@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/pedro.jpg', 'Ciclista de ruta', 'Logroño', '1993-09-28', 'MASCULINO', 73.8, 174, FALSE),
('Raquel Jiménez', 'raquel.jimenez@email.com', '$2a$10$rOzZz7P2p2d5p2K5p2K5pe', 'https://example.com/avatars/raquel.jpg', 'Amante del fitness', 'Tarragona', '1994-06-07', 'FEMENINO', 57.6, 164, FALSE);

INSERT INTO desafios (titulo, descripcion, tipo_actividad, objetivo, unidad_objetivo, fecha_inicio, fecha_fin, creador_id, es_publico, imagen_url, dificultad, max_participantes) VALUES 
('Maratón de Primavera', 'Corre 42km durante la primavera', 'correr', 42.0, 'km', '2024-03-01', '2024-06-30', 1, TRUE, 'https://example.com/images/maraton.jpg', 'AVANZADO', 100),
('Reto Ciclista 100km', 'Completa 100km en bicicleta', 'ciclismo', 100.0, 'km', '2024-04-01', '2024-04-30', 2, TRUE, 'https://example.com/images/ciclismo.jpg', 'INTERMEDIO', 50),
('Nado en Aguas Abiertas', 'Nada 5km en aguas abiertas', 'natacion', 5.0, 'km', '2024-05-01', '2024-08-31', 3, TRUE, 'https://example.com/images/natacion.jpg', 'AVANZADO', 30),
('Gym Challenge 30 Días', 'Entrena 20 días en 30', 'gimnasio', 20.0, 'días', '2024-04-15', '2024-05-15', 4, TRUE, 'https://example.com/images/gym.jpg', 'PRINCIPIANTE', 200),
('Carrera Nocturna 10k', 'Corre 10km por la noche', 'correr', 10.0, 'km', '2024-06-01', '2024-06-30', 5, TRUE, 'https://example.com/images/noche.jpg', 'INTERMEDIO', 80),
('Ruta Montaña BTT', 'Ruta de mountain bike 50km', 'ciclismo', 50.0, 'km', '2024-05-10', '2024-07-10', 6, TRUE, 'https://example.com/images/montana.jpg', 'AVANZADO', 40),
('Mariposa Master', 'Nada 2km estilo mariposa', 'natacion', 2.0, 'km', '2024-04-20', '2024-05-20', 7, TRUE, 'https://example.com/images/mariposa.jpg', 'AVANZADO', 25),
('Fuerza Maxima', 'Levanta tu máximo peso', 'gimnasio', 1.0, 'repetición', '2024-04-01', '2024-04-30', 8, TRUE, 'https://example.com/images/fuerza.jpg', 'INTERMEDIO', 100),
('Sprint 5k', 'Corre 5km lo más rápido posible', 'correr', 5.0, 'km', '2024-05-01', '2024-05-31', 9, TRUE, 'https://example.com/images/sprint.jpg', 'PRINCIPIANTE', 150),
('Tour Urbano', 'Recorre la ciudad en bici', 'ciclismo', 25.0, 'km', '2024-04-25', '2024-05-25', 10, TRUE, 'https://example.com/images/urbano.jpg', 'PRINCIPIANTE', 75),
('Estilo Libre 3k', 'Nada 3km estilo libre', 'natacion', 3.0, 'km', '2024-06-01', '2024-07-01', 11, TRUE, 'https://example.com/images/libre.jpg', 'INTERMEDIO', 35),
('HIIT Challenge', '20 sesiones de HIIT', 'gimnasio', 20.0, 'sesiones', '2024-04-10', '2024-05-10', 12, TRUE, 'https://example.com/images/hiit.jpg', 'INTERMEDIO', 120),
('Media Maratón', '21km de running', 'correr', 21.0, 'km', '2024-07-01', '2024-08-31', 13, TRUE, 'https://example.com/images/media.jpg', 'INTERMEDIO', 90),
('Gravel Adventure', 'Ruta gravel 80km', 'ciclismo', 80.0, 'km', '2024-05-15', '2024-06-15', 14, TRUE, 'https://example.com/images/gravel.jpg', 'AVANZADO', 45),
('Espalda 1.5k', 'Nada 1.5km estilo espalda', 'natacion', 1.5, 'km', '2024-04-30', '2024-05-30', 15, TRUE, 'https://example.com/images/espalda.jpg', 'INTERMEDIO', 28),
('Calistenia Básica', 'Aprende ejercicios básicos', 'gimnasio', 15.0, 'ejercicios', '2024-05-01', '2024-06-30', 16, TRUE, 'https://example.com/images/calistenia.jpg', 'PRINCIPIANTE', 180),
('Trail Running 15k', '15km por montaña', 'correr', 15.0, 'km', '2024-06-10', '2024-07-10', 17, TRUE, 'https://example.com/images/trail.jpg', 'AVANZADO', 60),
('Paseo Familiar', 'Ruta suave en bici', 'ciclismo', 10.0, 'km', '2024-04-20', '2024-05-20', 18, TRUE, 'https://example.com/images/familiar.jpg', 'PRINCIPIANTE', 100),
('Pecho 2k', 'Nada 2km estilo pecho', 'natacion', 2.0, 'km', '2024-05-05', '2024-06-05', 19, TRUE, 'https://example.com/images/pecho.jpg', 'INTERMEDIO', 32),
('Yoga 30 Días', 'Practica yoga 30 días seguidos', 'otros', 30.0, 'días', '2024-04-01', '2024-05-01', 20, TRUE, 'https://example.com/images/yoga.jpg', 'PRINCIPIANTE', 250);

INSERT INTO participaciones (usuario_id, desafio_id) VALUES 
(2, 1), (3, 1), (4, 1), (5, 2), (6, 2), (7, 3), (8, 3), (9, 4), (10, 4), (11, 5),
(12, 5), (13, 6), (14, 6), (15, 7), (16, 7), (17, 8), (18, 8), (19, 9), (20, 9), (2, 10);

INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, comentario, dispositivo) VALUES 
(2, 1, 15.5, 'km', 'Buen comienzo!', 'Strava'),
(3, 1, 25.0, 'km', 'Avanzando bien', 'Garmin'),
(4, 1, 8.2, 'km', 'Primera semana', 'Apple Watch'),
(5, 2, 45.0, 'km', 'Mitad del camino', 'Strava'),
(6, 2, 75.3, 'km', 'Casi terminado', 'Garmin'),
(7, 3, 2.1, 'km', 'Agua fría pero divertido', 'Suunto'),
(8, 3, 3.8, 'km', 'Excelente progreso', 'Apple Watch'),
(9, 4, 12.0, 'días', 'Muy constante', 'Fitbit'),
(10, 4, 8.0, 'días', 'Voy por buen camino', 'Garmin'),
(11, 5, 6.5, 'km', 'Buen ritmo nocturno', 'Strava'),
(12, 5, 9.8, 'km', 'Casi completo', 'Apple Watch'),
(13, 6, 35.2, 'km', 'Ruta técnica', 'Garmin'),
(14, 6, 42.7, 'km', 'Hermosos paisajes', 'Strava'),
(15, 7, 1.2, 'km', 'Estilo difícil', 'Suunto'),
(16, 7, 1.8, 'km', 'Mejorando técnica', 'Apple Watch'),
(17, 8, 0.8, 'repetición', 'Casi llego a mi máximo', 'Fitbit'),
(18, 8, 1.0, 'repetición', '¡Nuevo récord!', 'Garmin'),
(19, 9, 3.2, 'km', 'Buen tiempo', 'Strava'),
(20, 9, 4.1, 'km', 'Preparando para 5k', 'Apple Watch'),
(2, 10, 18.5, 'km', 'Paseo agradable', 'Garmin');

INSERT INTO comentarios (usuario_id, desafio_id, contenido) VALUES 
(2, 1, '¡Excelente desafío! Estoy disfrutando mucho del entrenamiento.'),
(3, 1, 'Alguien quiere entrenar juntos este fin de semana?'),
(4, 1, 'Consejos para mejorar mi tiempo en los 42km?'),
(5, 2, 'Las rutas de ciclismo están increíbles en esta época.'),
(6, 2, 'Acabo de completar mis primeros 50km, ¡qué emoción!'),
(7, 3, 'El agua está un poco fría pero se aguanta bien.'),
(8, 3, 'Recomiendo traje de neopreno para este desafío.'),
(9, 4, 'El gimnasio está más lleno de lo normal, jeje.'),
(10, 4, '¿Alguien tiene rutina de gym para compartir?'),
(11, 5, 'Correr de noche es una experiencia única.'),
(12, 5, 'Cuidado con los coches, corred con luces.'),
(13, 6, 'La ruta de montaña es espectacular.'),
(14, 6, 'Necesito reparar mi bici después de esta ruta.'),
(15, 7, 'El estilo mariposa es agotador pero gratificante.'),
(16, 7, 'Consejos para mejorar la técnica de mariposa?'),
(17, 8, 'Nuevo PR en press de banca hoy!'),
(18, 8, '¿Cuál es vuestro ejercicio favorito de fuerza?'),
(19, 9, 'Mejoré mi tiempo en 5k por 2 minutos!'),
(20, 9, 'Perfecto para principiantes como yo.');

INSERT INTO logros (nombre, descripcion, criterio, valor_requerido, categoria) VALUES 
('Maratoniano', 'Completa un maratón', 'MARATON_COMPLETADO', 1, 'PROGRESO'),
('Cien Kilómetros', 'Cicla 100km en un mes', 'CICLISMO_100KM', 100, 'PROGRESO'),
('Nadador Olímpico', 'Nada 5km en un mes', 'NATACION_5KM', 5, 'PROGRESO'),
('Gym Rat', 'Visita el gimnasio 50 veces', 'GYM_50_VECES', 50, 'DEDICACION'),
('Noctámbulo', 'Completa 5 carreras nocturnas', 'CARRERAS_NOCTURNAS', 5, 'PROGRESO'),
('Montañero', 'Completa 10 rutas de montaña', 'RUTAS_MONTAÑA', 10, 'PROGRESO'),
('Estilista', 'Domina 4 estilos de natación', 'ESTILOS_NATACION', 4, 'PROGRESO'),
('Hércules', 'Levanta 100kg en press banca', 'FUERZA_100KG', 100, 'PROGRESO'),
('Velocista', 'Corre 5k en menos de 20min', 'VELOCIDAD_5K', 1, 'PROGRESO'),
('Explorador Urbano', 'Descubre 20 rutas urbanas', 'RUTAS_URBANAS', 20, 'SOCIAL'),
('Instructor', 'Ayuda a 5 principiantes', 'AYUDA_PRINCIPIANTES', 5, 'SOCIAL'),
('Coleccionista', 'Obtén 10 logros diferentes', 'LOGROS_DIFERENTES', 10, 'DEDICACION'),
('Estratega', 'Completa desafíos de 3 tipos diferentes', 'TIPOS_DESAFIOS', 3, 'PROGRESO'),
('Motivador', 'Recibe 20 likes en comentarios', 'LIKES_COMENTARIOS', 20, 'SOCIAL'),
('Pionero', 'Sé de los primeros en unirte a 5 desafíos', 'PRIMERO_DESAFIOS', 5, 'SOCIAL');

INSERT INTO usuario_logros (usuario_id, logro_id) VALUES 
(2, 1), (3, 1), (4, 2), (5, 2), (6, 3), (7, 3), (8, 4), (9, 4), (10, 5), (11, 5),
(12, 6), (13, 6), (14, 7), (15, 7), (16, 8), (17, 8), (18, 9), (19, 9), (20, 10), (2, 11);


INSERT INTO acciones_admin (admin_id, tipo_accion, entidad_afectada, id_entidad_afectada, descripcion) VALUES 
(1, 'CREAR_DESAFIO', 'desafios', 1, 'Creó el desafío Maratón de Primavera'),
(1, 'CREAR_DESAFIO', 'desafios', 2, 'Creó el desafío Reto Ciclista 100km'),
(1, 'CREAR_DESAFIO', 'desafios', 3, 'Creó el desafío Nado en Aguas Abiertas'),
(1, 'CREAR_DESAFIO', 'desafios', 4, 'Creó el desafío Gym Challenge 30 Días'),
(1, 'CREAR_DESAFIO', 'desafios', 5, 'Creó el desafío Carrera Nocturna 10k'),
(1, 'EDITAR_DESAFIO', 'desafios', 1, 'Actualizó fecha de fin del maratón'),
(1, 'EDITAR_DESAFIO', 'desafios', 2, 'Aumentó máximo de participantes'),
(1, 'EDITAR_DESAFIO', 'desafios', 3, 'Cambió imagen del desafío'),
(1, 'EDITAR_DESAFIO', 'desafios', 4, 'Modificó dificultad a principiante'),
(1, 'EDITAR_DESAFIO', 'desafios', 5, 'Actualizó descripción'),
(1, 'ELIMINAR_DESAFIO', 'desafios', 15, 'Eliminó desafío duplicado'),
(1, 'EDITAR_USUARIO', 'usuarios', 2, 'Restableció contraseña de usuario'),
(1, 'EDITAR_USUARIO', 'usuarios', 5, 'Actualizó información de perfil'),
(1, 'EDITAR_USUARIO', 'usuarios', 8, 'Solucionó problema de acceso'),
(1, 'EDITAR_USUARIO', 'usuarios', 12, 'Verificó cuenta de usuario'),
(1, 'ELIMINAR_USUARIO', 'usuarios', 25, 'Eliminó cuenta inactiva'),
(1, 'CREAR_DESAFIO', 'desafios', 6, 'Creó desafío Ruta Montaña BTT'),
(1, 'CREAR_DESAFIO', 'desafios', 7, 'Creó desafío Mariposa Master'),
(1, 'CREAR_DESAFIO', 'desafios', 8, 'Creó desafío Fuerza Maxima'),
(1, 'CREAR_DESAFIO', 'desafios', 9, 'Creó desafío Sprint 5k');

