USE SportifyMe;

-- ============================================
-- 1. LIMPIAR BASE DE DATOS COMPLETA (Reiniciar)
-- ============================================

-- admin contraseña: admin123
INSERT INTO usuarios (nombre, email, contraseña, rol_id, avatar_url, biografia, ubicacion, fecha_nacimiento, genero, peso, altura, fecha_registro, ultimo_login, activo) VALUES
('Admin Principal', 'admin@sportifyme.com', '$2a$10$6lkrKNHkTwB7eg/q4KwtAuP3IBkAMBPGfrizqalo1oFiUCPuzY4sq', 1, 'https://i.pinimg.com/736x/c1/34/15/c1341593e96aa5c6b9639fe3d14622a3.jpg', 'Administrador principal de SportifyMe', 'Madrid, España', '1985-03-15', 'MASCULINO', 75.5, 180, '2024-01-01 10:00:00', '2024-12-01 09:00:00', TRUE),
('Ana García', 'ana.garcia@email.com', '$2a$10$gA2aHp20CJCY7KyYf5vumu5sgz6Nc85lsNMAVRcrnIS.guzI1H9au', 2, 'https://i.pinimg.com/736x/89/06/d9/8906d97b6c51933e57e97ac5f9b6794c.jpg', 'Amante del running y ciclismo', 'Barcelona, España', '1990-07-22', 'FEMENINO', 62.0, 165, '2024-01-02 11:30:00', '2024-11-30 08:45:00', TRUE),
('Carlos López', 'carlos.lopez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/89/57/54/895754e9e4800f85b6dd9aa931b9c3ec.jpg', 'Nadador profesional', 'Valencia, España', '1988-11-10', 'MASCULINO', 80.0, 178, '2024-01-03 14:20:00', '2024-11-30 10:15:00', TRUE),
('María Rodríguez', 'maria.rodriguez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/39/2f/59/392f59b094041b858894fc7dee72a644.jpg', 'Fanática del gimnasio', 'Sevilla, España', '1992-04-18', 'FEMENINO', 58.0, 162, '2024-01-05 09:15:00', '2024-11-30 19:30:00', TRUE),
('David Chen', 'david.chen@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/06/bd/a7/06bda7ce0d5d14046e9e4aa9e7adb539.jpg', 'Especialista en yoga', 'Bilbao, España', '1987-09-30', 'MASCULINO', 72.0, 175, '2024-01-06 16:45:00', '2024-11-30 20:00:00', TRUE),
('Laura Martínez', 'laura.martinez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/75/7e/9b/757e9b583bba1631b185ac8ea0cc430b.jpg', 'Triatleta amateur', 'Málaga, España', '1995-02-14', 'FEMENINO', 55.0, 160, '2024-01-10 08:20:00', '2024-11-30 18:45:00', TRUE),
('Javier Ruiz', 'javier.ruiz@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/b9/ef/b4/b9efb4fc56c293081627016cca6ec074.jpg', 'Ciclista de montaña', 'Alicante, España', '1993-06-25', 'MASCULINO', 78.0, 182, '2024-01-11 12:30:00', '2024-11-30 07:15:00', TRUE),
('Sofía Hernández', 'sofia.hernandez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/ba/93/68/ba93687defb2afc1a97dae404cc447b6.jpg', 'CrossFit enthusiast', 'Zaragoza, España', '1998-08-08', 'FEMENINO', 60.0, 168, '2024-01-12 15:40:00', '2024-11-30 21:20:00', TRUE),
('Miguel Torres', 'miguel.torres@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/6d/58/a5/6d58a559e371f598d9a72e1d27318d60.jpg', 'Corredor de trail', 'Murcia, España', '1991-12-03', 'MASCULINO', 70.0, 176, '2024-01-13 10:10:00', '2024-11-30 17:30:00', TRUE),
('Elena Castro', 'elena.castro@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/e4/d8/8d/e4d88d00bb2dc79e1b528d9efb4c2374.jpg', 'Nadadora de aguas abiertas', 'Granada, España', '1989-05-19', 'FEMENINO', 59.0, 164, '2024-01-14 13:25:00', '2024-11-30 06:45:00', TRUE),
('Daniel Kim', 'daniel.kim@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/75/8a/1b/758a1ba8a23f5d2aaccc7c02fd6adc8d.jpg', 'Calistenia avanzada', 'Palma de Mallorca', '1994-03-22', 'MASCULINO', 68.0, 172, '2024-01-15 11:50:00', '2024-11-30 19:10:00', TRUE),
('Andrea Morales', 'andrea.morales@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/07/66/0c/07660c21eb70128e09a615cdf6aa22e5.jpg', 'Instructora de pilates', 'Santander, España', '1996-09-11', 'FEMENINO', 57.0, 163, '2024-01-16 14:35:00', '2024-11-30 20:25:00', TRUE),
('Roberto Silva', 'roberto.silva@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/ee/3a/96/ee3a96f6ef8d676a8a422e9506405f3c.jpg', 'Powerlifting', 'Vigo, España', '1986-07-07', 'MASCULINO', 85.0, 185, '2024-01-17 09:05:00', '2024-11-30 18:00:00', TRUE),
('Patricia Wong', 'patricia.wong@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/4b/f5/91/4bf591a48f564ff2816568915dfe8507.jpg', 'Boxeo fitness', 'Gijón, España', '1997-01-28', 'FEMENINO', 61.0, 167, '2024-01-18 16:20:00', '2024-11-30 07:40:00', TRUE),
('Alejandro Pérez', 'alejandro.perez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/7b/78/7f/7b787ff302d5b93c789cb103330af8ea.jpg', 'Carreras de obstáculos', 'Córdoba, España', '1990-10-05', 'MASCULINO', 74.0, 177, '2024-01-19 12:15:00', '2024-11-30 16:50:00', TRUE),
('Isabel García', 'isabel.garcia@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/ac/de/f5/acdef57b1dbd51f12fd12ced47eb1ae5.jpg', 'Danza aeróbica', 'Valladolid, España', '1993-04-12', 'FEMENINO', 58.5, 166, '2024-01-20 14:40:00', '2024-11-30 19:15:00', TRUE),
('Fernando Díaz', 'fernando.diaz@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/82/e8/87/82e887e74cbe8deccfb84340724e5208.jpg', 'Escalada deportiva', 'San Sebastián', '1988-08-25', 'MASCULINO', 71.0, 174, '2024-01-21 11:20:00', '2024-11-30 08:30:00', TRUE),
('Carmen Ruiz', 'carmen.ruiz@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/89/ed/a7/89eda7a98c255edcf57982b42a3c8e4e.jpg', 'Natación sincronizada', 'Las Palmas', '1995-12-08', 'FEMENINO', 56.0, 161, '2024-01-22 16:55:00', '2024-11-30 20:40:00', TRUE),
('Pablo Martínez', 'pablo.martinez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/6a/b5/57/6ab557e502c4117b1981c521a3125854.jpg', 'Ciclismo de ruta', 'Logroño, España', '1992-02-17', 'MASCULINO', 69.0, 179, '2024-01-23 09:30:00', '2024-11-30 17:10:00', TRUE),
('Lucía González', 'lucia.gonzalez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/fa/be/a7/fabea7545f0c9b656972e0a38dc19d31.jpg', 'Running urbano', 'Salamanca, España', '1994-07-03', 'FEMENINO', 54.0, 159, '2024-01-24 13:45:00', '2024-11-30 06:20:00', TRUE),
('Sergio López', 'sergio.lopez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/e0/9b/5d/e09b5dfb83118d100d8533e8841c5cde.jpg', 'Fútbol sala', 'Burgos, España', '1991-11-14', 'MASCULINO', 76.0, 181, '2024-01-25 15:20:00', '2024-11-30 18:35:00', TRUE),
('Marta Sánchez', 'marta.sanchez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/d4/c9/49/d4c949b9b3f69c82c935c2f5266b3749.jpg', 'Baloncesto', 'Albacete, España', '1996-05-29', 'FEMENINO', 63.0, 170, '2024-01-26 10:10:00', '2024-11-30 19:50:00', TRUE),
('Jorge Martín', 'jorge.martin@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/fe/cf/ec/fecfec6137240f4bfa6e08d1821dce1f.jpg', 'Tenis', 'Lleida, España', '1989-09-22', 'MASCULINO', 73.0, 178, '2024-01-27 14:25:00', '2024-11-30 16:15:00', TRUE),
('Natalia Castro', 'natalia.castro@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/61/10/51/611051465319dc880d4be4ecec265368.jpg', 'Voleibol', 'Tarragona, España', '1993-01-07', 'FEMENINO', 59.5, 165, '2024-01-28 11:40:00', '2024-11-30 20:05:00', TRUE),
('Raúl Hernández', 'raul.hernandez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/2d/f3/e9/2df3e9927ff8d53e25a42f0f0fd43f46.jpg', 'Pádel', 'Huelva, España', '1990-06-18', 'MASCULINO', 77.0, 183, '2024-01-29 16:30:00', '2024-11-30 07:55:00', TRUE),
('Eva Torres', 'eva.torres@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/fa/e1/48/fae148d29ec07b57faeee751ab76edd7.jpg', 'Badminton', 'Jaén, España', '1997-03-26', 'FEMENINO', 55.5, 158, '2024-01-30 09:55:00', '2024-11-30 18:20:00', TRUE),
('Alberto Ruiz', 'alberto.ruiz@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/75/d7/26/75d7269722f4120e232f4a999835e58a.jpg', 'Golf', 'Cádiz, España', '1987-12-11', 'MASCULINO', 82.0, 186, '2024-01-31 13:15:00', '2024-11-30 08:10:00', TRUE),
('Silvia Moreno', 'silvia.moreno@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/db/a5/fa/dba5fac1192498440f0d7b07a13b9f01.jpg', 'Hockey', 'Almería, España', '1994-08-04', 'FEMENINO', 60.5, 169, '2024-02-01 15:50:00', '2024-11-30 19:25:00', TRUE),
('Diego Navarro', 'diego.navarro@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/45/3c/ff/453cff946d31c2af637facb689d3ad08.jpg', 'Rugby', 'Badajoz, España', '1991-04-19', 'MASCULINO', 88.0, 188, '2024-02-02 12:05:00', '2024-11-30 17:45:00', TRUE),
('Cristina Ortega', 'cristina.ortega@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/7b/0f/9b/7b0f9b13958783ba2ae22cbd4d0c7f08.jpg', 'Atletismo', 'Guadalajara, España', '1996-10-23', 'FEMENINO', 57.5, 164, '2024-02-03 14:35:00', '2024-11-30 06:30:00', TRUE),
('Rubén Santos', 'ruben.santos@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/f8/f3/f9/f8f3f96e80736538dd35ee0c54c5814e.jpg', 'Carreras de orientación', 'Toledo, España', '1992-07-16', 'MASCULINO', 70.5, 175, '2024-02-04 10:20:00', '2024-11-30 20:15:00', TRUE),
('Patricia Jiménez', 'patricia.jimenez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/78/8c/7e/788c7e3670cc3c02d3f841860b212ab7.jpg', 'Gimnasia rítmica', 'Zamora, España', '1995-01-30', 'FEMENINO', 52.0, 157, '2024-02-05 16:45:00', '2024-11-30 08:40:00', TRUE),
('Francisco Mora', 'francisco.mora@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/f4/14/ac/f414acfa3aa5286b20c55a909d1bd51b.jpg', 'Caza submarina', 'Ceuta, España', '1988-05-13', 'MASCULINO', 75.0, 180, '2024-02-06 13:30:00', '2024-11-30 18:55:00', TRUE),
('Lorena Vega', 'lorena.vega@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/ce/57/26/ce57265103d9bf2633fa0b7e56bcb30b.jpg', 'Esquí acuático', 'Melilla, España', '1993-11-26', 'FEMENINO', 58.0, 162, '2024-02-07 11:10:00', '2024-11-30 07:05:00', TRUE),
('Joaquín Reyes', 'joaquin.reyes@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/84/bc/7a/84bc7a0d67a04c08f13cf7556fd694a2.jpg', 'Surf', 'Santa Cruz de Tenerife', '1990-02-09', 'MASCULINO', 72.5, 177, '2024-02-08 15:25:00', '2024-11-30 19:40:00', TRUE),
('Alicia Campos', 'alicia.campos@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/7c/4f/87/7c4f876f05e22778b30f77cca4b4536b.jpg', 'Snowboard', 'Huesca, España', '1997-06-21', 'FEMENINO', 56.5, 160, '2024-02-09 09:40:00', '2024-11-30 16:25:00', TRUE),
('Víctor Ramírez', 'victor.ramirez@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/95/6d/30/956d305e59b65c5168bd615111725dbe.jpg', 'Kitesurf', 'Gerona, España', '1994-12-04', 'MASCULINO', 74.0, 179, '2024-02-10 14:00:00', '2024-11-30 08:50:00', TRUE),
('Beatriz León', 'beatriz.leon@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/11/5d/05/115d0542d6008349cd3f1a592d75a428.jpg', 'Windsurf', 'Pontevedra, España', '1991-08-17', 'FEMENINO', 59.0, 163, '2024-02-11 12:35:00', '2024-11-30 17:35:00', TRUE),
('Óscar Herrera', 'oscar.herrera@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/25/8b/62/258b629f1de34bff327fed2211272208.jpg', 'Vela', 'La Coruña', '1989-03-02', 'MASCULINO', 76.5, 182, '2024-02-12 16:10:00', '2024-11-30 20:30:00', TRUE),
('Nerea Iglesias', 'nerea.iglesias@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/03/3d/06/033d06367b75f253968548baf82520d9.jpg', 'Piragüismo', 'Ourense, España', '1996-09-15', 'FEMENINO', 57.0, 161, '2024-02-13 10:45:00', '2024-11-30 07:15:00', TRUE),
('Gabriel Paredes', 'gabriel.paredes@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/23/3d/a6/233da6f21693ad798cfd9bda452e17dd.jpg', 'Remo', 'Lugo, España', '1993-05-28', 'MASCULINO', 79.0, 184, '2024-02-14 13:55:00', '2024-11-30 18:45:00', TRUE),
('Clara Montes', 'clara.montes@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/ea/bb/03/eabb03038d2c0e9a831fdfb2a152c09e.jpg', 'Equitación', 'Ávila, España', '1998-01-11', 'FEMENINO', 58.5, 166, '2024-02-15 15:05:00', '2024-11-30 09:00:00', TRUE),
('Héctor Ríos', 'hector.rios@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/75/02/e5/7502e512c5ad49bdefb6ba5222c90678.jpg', 'Motocross', 'Segovia, España', '1990-10-24', 'MASCULINO', 73.5, 178, '2024-02-16 11:25:00', '2024-11-30 19:10:00', TRUE),
('Rosa Marín', 'rosa.marin@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/dc/06/e7/dc06e7785b2ec4d773e2dc8620577b69.jpg', 'Patinaje artístico', 'Soria, España', '1995-06-07', 'FEMENINO', 55.0, 159, '2024-02-17 14:15:00', '2024-11-30 16:40:00', TRUE),
('Iván Soto', 'ivan.soto@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/41/8f/4b/418f4b937af47ea8b37672810b68ae51.jpg', 'Parkour', 'Teruel, España', '1992-12-20', 'MASCULINO', 71.0, 176, '2024-02-18 09:50:00', '2024-11-30 08:20:00', TRUE),
('Olga Ferrer', 'olga.ferrer@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/c2/56/7e/c2567e8f110783795eb4a19b4cf97caa.jpg', 'Zumba', 'Cuenca, España', '1997-04-03', 'FEMENINO', 60.0, 167, '2024-02-19 16:35:00', '2024-11-30 17:50:00', TRUE),
('Marcos Blanco', 'marcos.blanco@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/6b/d0/56/6bd0561220ddbe35e77dd12d64c85543.jpg', 'Artes marciales', 'Ciudad Real', '1991-08-16', 'MASCULINO', 77.5, 181, '2024-02-20 12:50:00', '2024-11-30 20:05:00', TRUE),
('Nora Vargas', 'nora.vargas@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/8f/35/d5/8f35d576de0b94373a349b4c209e9d8d.jpg', 'Aerobic', 'Guipúzcoa', '1994-02-01', 'FEMENINO', 56.0, 162, '2024-02-21 14:40:00', '2024-11-30 07:30:00', TRUE),
('Ricardo Molina', 'ricardo.molina@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/bd/f5/54/bdf5549e7dfed8e1cfc0fea860e7e84e.jpg', 'Culturismo', 'Alava, España', '1988-07-14', 'MASCULINO', 90.0, 187, '2024-02-22 10:15:00', '2024-11-30 18:15:00', TRUE),
('Sara Peña', 'sara.pena@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/7c/84/f8/7c84f841e584eaddf3f35ee219a579b7.jpg', 'Spinning', 'Navarra', '1993-11-27', 'FEMENINO', 61.5, 168, '2024-02-23 15:55:00', '2024-11-30 09:10:00', TRUE),
('Andrés Gil', 'andres.gil@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/2f/84/c3/2f84c3facd77d31a95c27468f5764cf0.jpg', 'Carreras de aventura', 'La Rioja', '1990-05-10', 'MASCULINO', 75.5, 180, '2024-02-24 11:30:00', '2024-11-30 19:20:00', TRUE),
('Elena Rojas', 'elena.rojas@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/9f/cc/35/9fcc358c63fb421113124cc50855bdab.jpg', 'Aquagym', 'Castellón', '1996-12-23', 'FEMENINO', 59.0, 164, '2024-02-25 13:20:00', '2024-11-30 16:50:00', TRUE),
('Julián Serrano', 'julian.serrano@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/68/70/58/687058d17bd768ca338824006fcf1a8f.jpg', 'Senderismo', 'Cáceres', '1992-06-06', 'MASCULINO', 78.0, 183, '2024-02-26 16:05:00', '2024-11-30 08:00:00', TRUE),
('Miriam Cabrera', 'miriam.cabrera@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/e7/62/a9/e762a9c3d4042af4ec0497ccb0573e92.jpg', 'Tai Chi', 'León, España', '1997-01-19', 'FEMENINO', 57.5, 165, '2024-02-27 09:35:00', '2024-11-30 17:25:00', TRUE),
('Adrián Flores', 'adrian.flores@email.com', '$2a$10$d9K5cL7vWQqS8qQqS8qQqOeW5vW5vW5vW5vW5vW5vW5vW5vW5vW5vW', 2, 'https://i.pinimg.com/736x/08/e9/47/08e947511d5c0a6345cc54445eeb51b6.jpg', 'Capoeira', 'Palencia, España', '1994-07-02', 'MASCULINO', 72.0, 177, '2024-02-28 14:50:00', '2024-11-30 20:20:00', TRUE);

-- ============================================
-- 3. INSERTAR DESAFÍOS (50 desafíos - 10 de cada actividad)
-- ============================================

-- CORRER (10 desafíos - IDs 1-10)
INSERT INTO desafios (titulo, descripcion, tipo_actividad, objetivo, unidad_objetivo, fecha_inicio, fecha_fin, creador_id, es_publico, dificultad, max_participantes, estado) VALUES
('Maratón de Primavera 2024', 'Completa un maratón completo de 42.2km esta primavera', 'correr', 42.2, 'km', '2024-03-01 00:00:00', '2024-06-30 23:59:59', 1, TRUE, 'AVANZADO', 200, 'ACTIVO'),
('5K para Principiantes', 'Programa de 8 semanas para correr tu primer 5K', 'correr', 5.0, 'km', '2024-01-15 00:00:00', '2024-03-15 23:59:59', 2, TRUE, 'PRINCIPIANTE', 300, 'ACTIVO'),
('Reto 100km Mensual', 'Corre 100km en un mes y mejora tu resistencia', 'correr', 100.0, 'km', '2024-12-01 00:00:00', '2024-12-31 23:59:59', 3, TRUE, 'INTERMEDIO', 150, 'ACTIVO'),
('Media Maratón Urbana', 'Prepara y completa una media maratón en ciudad', 'correr', 21.1, 'km', '2024-02-01 00:00:00', '2024-04-01 23:59:59', 4, TRUE, 'INTERMEDIO', 180, 'ACTIVO'),
('Carreras de Velocidad', 'Mejora tu ritmo con entrenamientos de velocidad', 'correr', 10.0, 'km', '2024-11-20 00:00:00', '2024-12-20 23:59:59', 5, TRUE, 'AVANZADO', 100, 'ACTIVO'),
('Running Nocturno', 'Descubre la ciudad corriendo de noche', 'correr', 15.0, 'km', '2024-11-25 18:00:00', '2024-12-25 23:59:59', 6, TRUE, 'INTERMEDIO', 120, 'ACTIVO'),
('Trail Running Montaña', 'Carrera por senderos de montaña con desnivel', 'correr', 25.0, 'km', '2024-03-15 00:00:00', '2024-05-15 23:59:59', 7, TRUE, 'AVANZADO', 80, 'ACTIVO'),
('Carrera Continua 60min', 'Mantén una carrera continua durante 60 minutos', 'correr', 60.0, 'minutos', '2024-01-20 00:00:00', '2024-02-20 23:59:59', 8, TRUE, 'INTERMEDIO', 200, 'ACTIVO'),
('Fartlek en Parque', 'Entrenamiento de cambios de ritmo en parque', 'correr', 8.0, 'km', '2024-12-05 00:00:00', '2024-12-26 23:59:59', 9, TRUE, 'PRINCIPIANTE', 150, 'ACTIVO'),
('Running Matutino 30días', '30 días consecutivos de running por la mañana', 'correr', 30.0, 'días', '2024-12-01 06:00:00', '2024-12-30 09:00:00', 10, TRUE, 'PRINCIPIANTE', 250, 'ACTIVO'),

-- CICLISMO (10 desafíos - IDs 11-20)
('Gran Fondo 100km', 'Completa 100km en bicicleta en una sola salida', 'ciclismo', 100.0, 'km', '2024-04-01 00:00:00', '2024-06-30 23:59:59', 11, TRUE, 'INTERMEDIO', 100, 'ACTIVO'),
('Escalada en Montana', 'Supera 2000m de desnivel en bicicleta de montaña', 'ciclismo', 2000.0, 'metros', '2024-05-01 00:00:00', '2024-07-31 23:59:59', 12, TRUE, 'AVANZADO', 50, 'ACTIVO'),
('Ciclismo Urbano 30días', 'Usa la bicicleta para desplazamientos urbanos 30 días', 'ciclismo', 30.0, 'días', '2024-01-10 00:00:00', '2024-02-10 23:59:59', 13, TRUE, 'PRINCIPIANTE', 200, 'ACTIVO'),
('Reto 500km Mensual', 'Acumula 500km en bicicleta durante el mes', 'ciclismo', 500.0, 'km', '2024-12-01 00:00:00', '2024-12-31 23:59:59', 14, TRUE, 'INTERMEDIO', 120, 'ACTIVO'),
('Velocidad en Llano', 'Mejora tu velocidad media en terreno plano', 'ciclismo', 30.0, 'km/h', '2024-03-01 00:00:00', '2024-04-30 23:59:59', 15, TRUE, 'AVANZADO', 80, 'ACTIVO'),
('Ruta Nocturna Segura', 'Rutas nocturnas con equipo de seguridad completo', 'ciclismo', 50.0, 'km', '2024-11-15 18:00:00', '2024-12-15 23:00:00', 16, TRUE, 'INTERMEDIO', 60, 'ACTIVO'),
('Bici al Trabajo', 'Ve al trabajo en bici 20 días este mes', 'ciclismo', 20.0, 'días', '2024-02-01 00:00:00', '2024-02-29 23:59:59', 17, TRUE, 'PRINCIPIANTE', 180, 'ACTIVO'),
('Enduro MTB Técnico', 'Mejora tu técnica de descenso en mountain bike', 'ciclismo', 15.0, 'tramos', '2024-06-01 00:00:00', '2024-08-31 23:59:59', 18, TRUE, 'AVANZADO', 40, 'ACTIVO'),
('Ruta Costera Panorámica', 'Disfruta de rutas panorámicas por la costa', 'ciclismo', 75.0, 'km', '2024-07-01 00:00:00', '2024-09-30 23:59:59', 19, TRUE, 'INTERMEDIO', 90, 'ACTIVO'),
('Spinning Indoor', 'Completa 20 sesiones de spinning en interior', 'ciclismo', 20.0, 'sesiones', '2024-01-05 00:00:00', '2024-02-05 23:59:59', 20, TRUE, 'PRINCIPIANTE', 150, 'ACTIVO'),

-- NATACIÓN (10 desafíos - IDs 21-30)
('Maratón Acuático 5km', 'Nada 5km en piscina o aguas abiertas', 'natacion', 5.0, 'km', '2024-05-01 00:00:00', '2024-07-31 23:59:59', 21, TRUE, 'AVANZADO', 60, 'ACTIVO'),
('Principiante en Piscina', 'Aprende las técnicas básicas de natación', 'natacion', 1.0, 'km', '2024-01-08 00:00:00', '2024-02-08 23:59:59', 22, TRUE, 'PRINCIPIANTE', 100, 'ACTIVO'),
('Estilos de Natación', 'Domina los 4 estilos: crol, espalda, braza y mariposa', 'natacion', 2.0, 'km', '2024-03-01 00:00:00', '2024-04-30 23:59:59', 23, TRUE, 'INTERMEDIO', 80, 'ACTIVO'),
('Resistencia Acuática', 'Nada 3 veces por semana durante 1 mes', 'natacion', 12.0, 'sesiones', '2024-02-01 00:00:00', '2024-02-29 23:59:59', 24, TRUE, 'INTERMEDIO', 120, 'ACTIVO'),
('Velocidad 100m Crol', 'Mejora tu tiempo en 100 metros crol', 'natacion', 100.0, 'metros', '2024-04-15 00:00:00', '2024-05-15 23:59:59', 25, TRUE, 'AVANZADO', 50, 'ACTIVO'),
('Aguas Abiertas Iniciación', 'Primeros pasos en natación en aguas abiertas', 'natacion', 1.5, 'km', '2024-06-01 00:00:00', '2024-07-31 23:59:59', 26, TRUE, 'INTERMEDIO', 40, 'ACTIVO'),
('Técnica de Respiración', 'Perfecciona tu técnica de respiración bilateral', 'natacion', 0.8, 'km', '2024-01-15 00:00:00', '2024-02-15 23:59:59', 27, TRUE, 'PRINCIPIANTE', 90, 'ACTIVO'),
('Natación con Aletas', 'Entrenamiento con aletas para mejorar potencia', 'natacion', 1.2, 'km', '2024-03-10 00:00:00', '2024-04-10 23:59:59', 28, TRUE, 'INTERMEDIO', 70, 'ACTIVO'),
('Series de Velocidad', 'Entrenamiento por intervalos para mejorar velocidad', 'natacion', 1.5, 'km', '2024-05-20 00:00:00', '2024-06-20 23:59:59', 29, TRUE, 'AVANZADO', 60, 'ACTIVO'),
('Natación Nocturna', 'Sesiones de natación por la noche en piscina cubierta', 'natacion', 2.0, 'km', '2024-11-01 20:00:00', '2024-11-30 22:00:00', 30, TRUE, 'INTERMEDIO', 50, 'ACTIVO'),

-- GIMNASIO (10 desafíos - IDs 31-40)
('Fuerza Fundamental', 'Programa de 4 semanas para ganar fuerza base', 'gimnasio', 12.0, 'sesiones', '2024-01-01 00:00:00', '2024-01-31 23:59:59', 31, TRUE, 'PRINCIPIANTE', 150, 'ACTIVO'),
('Hipertrofia Intensa', 'Rutina de 6 días para ganar masa muscular', 'gimnasio', 24.0, 'sesiones', '2024-02-01 00:00:00', '2024-02-29 23:59:59', 32, TRUE, 'AVANZADO', 80, 'ACTIVO'),
('Definición Muscular', 'Enfoque en quema de grasa y definición', 'gimnasio', 18.0, 'sesiones', '2024-03-01 00:00:00', '2024-03-31 23:59:59', 33, TRUE, 'INTERMEDIO', 100, 'ACTIVO'),
('Fuerza Máxima', 'Trabajo con cargas pesadas para fuerza pura', 'gimnasio', 15.0, 'sesiones', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 34, TRUE, 'AVANZADO', 60, 'ACTIVO'),
('Full Body 3xSemana', 'Rutina completa 3 días por semana', 'gimnasio', 12.0, 'sesiones', '2024-05-01 00:00:00', '2024-05-31 23:59:59', 35, TRUE, 'PRINCIPIANTE', 200, 'ACTIVO'),
('Push Pull Legs', 'División clásica para crecimiento muscular', 'gimnasio', 18.0, 'sesiones', '2024-06-01 00:00:00', '2024-06-30 23:59:59', 36, TRUE, 'INTERMEDIO', 120, 'ACTIVO'),
('Calistenia Básica', 'Entrenamiento con peso corporal para principiantes', 'gimnasio', 15.0, 'sesiones', '2024-07-01 00:00:00', '2024-07-31 23:59:59', 37, TRUE, 'PRINCIPIANTE', 180, 'ACTIVO'),
('Core Strength', 'Enfoque en abdomen y zona media del cuerpo', 'gimnasio', 20.0, 'sesiones', '2024-08-01 00:00:00', '2024-08-31 23:59:59', 38, TRUE, 'INTERMEDIO', 140, 'ACTIVO'),
('Mobility & Flex', 'Mejora tu movilidad y flexibilidad general', 'gimnasio', 16.0, 'sesiones', '2024-09-01 00:00:00', '2024-09-30 23:59:59', 39, TRUE, 'PRINCIPIANTE', 160, 'ACTIVO'),
('Powerlifting Básico', 'Introducción al powerlifting: sentadilla, banca, peso muerto', 'gimnasio', 12.0, 'sesiones', '2024-10-01 00:00:00', '2024-10-31 23:59:59', 40, TRUE, 'INTERMEDIO', 90, 'ACTIVO'),

-- OTROS (10 desafíos - IDs 41-50)
('Yoga 30 Días', '30 días de práctica consecutiva de yoga', 'otros', 30.0, 'días', '2024-01-01 00:00:00', '2024-01-31 23:59:59', 41, TRUE, 'PRINCIPIANTE', 200, 'ACTIVO'),
('Meditación Matutina', '21 días de meditación por la mañana', 'otros', 21.0, 'días', '2024-02-01 06:00:00', '2024-02-21 08:00:00', 42, TRUE, 'PRINCIPIANTE', 250, 'ACTIVO'),
('Escalada Indoor', 'Completa 15 rutas de diferente dificultad', 'otros', 15.0, 'rutas', '2024-03-01 00:00:00', '2024-03-31 23:59:59', 43, TRUE, 'INTERMEDIO', 80, 'ACTIVO'),
('Boxeo Fitness', 'Entrenamiento de boxeo para condición física', 'otros', 12.0, 'sesiones', '2024-04-01 00:00:00', '2024-04-30 23:59:59', 44, TRUE, 'INTERMEDIO', 100, 'ACTIVO'),
('Pilates Básico', 'Introducción al método Pilates para principiantes', 'otros', 10.0, 'sesiones', '2024-05-01 00:00:00', '2024-05-31 23:59:59', 45, TRUE, 'PRINCIPIANTE', 120, 'ACTIVO'),
('CrossFit WOD', 'Completa 10 WODs de CrossFit diferentes', 'otros', 10.0, 'wods', '2024-06-01 00:00:00', '2024-06-30 23:59:59', 46, TRUE, 'AVANZADO', 60, 'ACTIVO'),
('Baile Cardio', 'Quema calorías bailando 2 veces por semana', 'otros', 8.0, 'sesiones', '2024-07-01 00:00:00', '2024-07-31 23:59:59', 47, TRUE, 'PRINCIPIANTE', 150, 'ACTIVO'),
('TRX Suspensión', 'Entrenamiento en suspensión para fuerza integral', 'otros', 8.0, 'sesiones', '2024-08-01 00:00:00', '2024-08-31 23:59:59', 48, TRUE, 'INTERMEDIO', 70, 'ACTIVO'),
('Parkour Principiante', 'Aprende movimientos básicos de parkour', 'otros', 6.0, 'sesiones', '2024-09-01 00:00:00', '2024-09-30 23:59:59', 49, TRUE, 'PRINCIPIANTE', 50, 'ACTIVO'),
('Tai Chi para Salud', 'Arte marcial suave para equilibrio y relajación', 'otros', 12.0, 'sesiones', '2024-10-01 00:00:00', '2024-10-31 23:59:59', 50, TRUE, 'PRINCIPIANTE', 100, 'ACTIVO');

-- ============================================
-- 4. INSERTAR LOGROS
-- ============================================

INSERT INTO logros (nombre, descripcion, icono_url, criterio, valor_requerido, categoria) VALUES
('Primeros Pasos', 'Completa tu primer desafío', 'https://example.com/icons/first_steps.png', 'DESAFIOS_COMPLETADOS', 1, 'PROGRESO'),
('Maratoniano', 'Completa un maratón (42.2km)', 'https://example.com/icons/marathon.png', 'DISTANCIA_CORRER', 42200, 'PROGRESO'),
('Ciclista 100km', 'Recorre 100km en bicicleta', 'https://example.com/icons/century.png', 'DISTANCIA_CICLISMO', 100000, 'PROGRESO'),
('Nadador Olímpico', 'Nada 5km en un mes', 'https://example.com/icons/swimmer.png', 'DISTANCIA_NATACION', 5000, 'PROGRESO'),
('Fuerza Bruta', 'Completa 20 sesiones de gimnasio', 'https://example.com/icons/strength.png', 'SESIONES_GIMNASIO', 20, 'PROGRESO'),
('Socializador', 'Comenta en 5 desafíos diferentes', 'https://example.com/icons/social.png', 'COMENTARIOS', 5, 'SOCIAL'),
('Líder Nato', 'Crea 3 desafíos públicos', 'https://example.com/icons/leader.png', 'DESAFIOS_CREADOS', 3, 'SOCIAL'),
('Consistencia', 'Mantén una racha de 15 días activo', 'https://example.com/icons/consistency.png', 'DIAS_ACTIVO', 15, 'DEDICACION'),
('Noctámbulo', 'Completa 5 actividades nocturnas', 'https://example.com/icons/night.png', 'ACTIVIDADES_NOCTURNAS', 5, 'DEDICACION'),
('Mañana Productiva', 'Completa 10 actividades matutinas', 'https://example.com/icons/morning.png', 'ACTIVIDADES_MATUTINAS', 10, 'DEDICACION'),
('Todo Terreno', 'Participa en 3 tipos diferentes de actividad', 'https://example.com/icons/all_terrain.png', 'TIPOS_ACTIVIDAD', 3, 'PROGRESO'),
('Comunidad Activa', 'Únete a 10 desafíos', 'https://example.com/icons/community.png', 'DESAFIOS_UNIDOS', 10, 'SOCIAL'),
('Inquebrantable', 'Completa 25 sesiones de entrenamiento', 'https://example.com/icons/unbreakable.png', 'SESIONES_COMPLETADAS', 25, 'DEDICACION'),
('Velocista', 'Mantén un ritmo de 5min/km en 5km', 'https://example.com/icons/sprinter.png', 'VELOCIDAD_CORRER', 5, 'PROGRESO'),
('Escalador', 'Acumula 5000m de desnivel en bici', 'https://example.com/icons/climber.png', 'DESNIVEL_CICLISMO', 5000, 'PROGRESO'),
('Resistencia Acuática', 'Nada 3km en una semana', 'https://example.com/icons/water_resistance.png', 'DISTANCIA_NATACION', 3000, 'PROGRESO'),
('Powerlifter', 'Completa rutina de powerlifting básico', 'https://example.com/icons/powerlifter.png', 'POWERLIFTING', 1, 'PROGRESO'),
('Influencer', 'Consigue que 5 personas se unan a tus desafíos', 'https://example.com/icons/influencer.png', 'SEGUIDORES_DESAFIO', 5, 'SOCIAL'),
('Sabio del Deporte', 'Completa desafíos en 4 categorías diferentes', 'https://example.com/icons/wise.png', 'CATEGORIAS_COMPLETADAS', 4, 'DEDICACION'),
('Leyenda', 'Desbloquea 15 logros diferentes', 'https://example.com/icons/legend.png', 'LOGROS_TOTALES', 15, 'DEDICACION');

-- ============================================
-- 5. INSERTAR PARTICIPACIONES (MINIMO 5 POR TIPO DE ACTIVIDAD)
-- ============================================

-- CORRER (Desafíos 1-10)
INSERT INTO participaciones (usuario_id, desafio_id, fecha_union) VALUES
-- Desafío 1
(1, 1, '2024-02-28 10:00:00'), (2, 1, '2024-02-28 11:30:00'), (3, 1, '2024-03-01 09:00:00'), (4, 1, '2024-03-02 10:00:00'), (5, 1, '2024-03-03 11:00:00'),
-- Desafío 2
(6, 2, '2024-01-14 09:15:00'), (7, 2, '2024-01-15 10:00:00'), (8, 2, '2024-01-16 11:00:00'), (9, 2, '2024-01-17 12:00:00'), (10, 2, '2024-01-18 13:00:00'),
-- Desafío 3
(11, 3, '2024-11-30 14:20:00'), (12, 3, '2024-12-01 09:00:00'), (13, 3, '2024-12-02 10:00:00'), (14, 3, '2024-12-03 11:00:00'), (15, 3, '2024-12-04 12:00:00');

-- CICLISMO (Desafíos 11-20)
INSERT INTO participaciones (usuario_id, desafio_id, fecha_union) VALUES
-- Desafío 11
(16, 11, '2024-03-31 11:15:00'), (17, 11, '2024-04-01 09:00:00'), (18, 11, '2024-04-02 10:00:00'), (19, 11, '2024-04-03 11:00:00'), (20, 11, '2024-04-04 12:00:00'),
-- Desafío 12
(21, 12, '2024-04-30 14:35:00'), (22, 12, '2024-05-01 09:00:00'), (23, 12, '2024-05-02 10:00:00'), (24, 12, '2024-05-03 11:00:00'), (25, 12, '2024-05-04 12:00:00'),
-- Desafío 13
(26, 13, '2024-01-09 09:20:00'), (27, 13, '2024-01-10 09:00:00'), (28, 13, '2024-01-11 10:00:00'), (29, 13, '2024-01-12 11:00:00'), (30, 13, '2024-01-13 12:00:00');

-- NATACIÓN (Desafíos 21-30)
INSERT INTO participaciones (usuario_id, desafio_id, fecha_union) VALUES
-- Desafío 21
(31, 21, '2024-04-30 08:25:00'), (32, 21, '2024-05-01 09:00:00'), (33, 21, '2024-05-02 10:00:00'), (34, 21, '2024-05-03 11:00:00'), (35, 21, '2024-05-04 12:00:00'),
-- Desafío 22
(36, 22, '2024-01-07 14:10:00'), (37, 22, '2024-01-08 09:00:00'), (38, 22, '2024-01-09 10:00:00'), (39, 22, '2024-01-10 11:00:00'), (40, 22, '2024-01-11 12:00:00'),
-- Desafío 23
(41, 23, '2024-02-29 11:45:00'), (42, 23, '2024-03-01 09:00:00'), (43, 23, '2024-03-02 10:00:00'), (44, 23, '2024-03-03 11:00:00'), (45, 23, '2024-03-04 12:00:00');

-- GIMNASIO (Desafíos 31-40)
INSERT INTO participaciones (usuario_id, desafio_id, fecha_union) VALUES
-- Desafío 31
(46, 31, '2024-01-01 14:15:00'), (47, 31, '2024-01-02 09:00:00'), (48, 31, '2024-01-03 10:00:00'), (49, 31, '2024-01-04 11:00:00'), (50, 31, '2024-01-05 12:00:00'),
-- Desafío 32
(1, 32, '2024-01-31 11:20:00'), (2, 32, '2024-02-01 09:00:00'), (3, 32, '2024-02-02 10:00:00'), (4, 32, '2024-02-03 11:00:00'), (5, 32, '2024-02-04 12:00:00'),
-- Desafío 33
(6, 33, '2024-02-29 16:45:00'), (7, 33, '2024-03-01 09:00:00'), (8, 33, '2024-03-02 10:00:00'), (9, 33, '2024-03-03 11:00:00'), (10, 33, '2024-03-04 12:00:00');

-- OTROS (Desafíos 41-50)
INSERT INTO participaciones (usuario_id, desafio_id, fecha_union) VALUES
-- Desafío 41
(11, 41, '2024-01-01 16:05:00'), (12, 41, '2024-01-02 09:00:00'), (13, 41, '2024-01-03 10:00:00'), (14, 41, '2024-01-04 11:00:00'), (15, 41, '2024-01-05 12:00:00'),
-- Desafío 42
(16, 42, '2024-01-31 09:30:00'), (17, 42, '2024-02-01 06:00:00'), (18, 42, '2024-02-02 06:30:00'), (19, 42, '2024-02-03 07:00:00'), (20, 42, '2024-02-04 07:30:00'),
-- Desafío 43
(21, 43, '2024-02-21 12:55:00'), (22, 43, '2024-03-01 09:00:00'), (23, 43, '2024-03-02 10:00:00'), (24, 43, '2024-03-03 11:00:00'), (25, 43, '2024-03-04 12:00:00');

-- ============================================
-- 6. INSERTAR PROGRESOS (MINIMO 3 POR PARTICIPANTE EN CADA TIPO)
-- ============================================

-- CORRER
INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, fecha_registro, comentario, dispositivo) VALUES
-- Desafío 1
(1, 1, 15.5, 'km', '2024-03-05 10:30:00', 'Primera sesión de entrenamiento', 'Garmin Forerunner 945'),
(2, 1, 12.3, 'km', '2024-03-05 12:00:00', 'Rodaje suave de adaptación', 'Apple Watch Series 8'),
(3, 1, 18.5, 'km', '2024-03-10 09:30:00', 'Mejorando resistencia', 'Samsung Galaxy Watch'),
-- Desafío 2
(6, 2, 2.1, 'km', '2024-01-20 10:00:00', 'Caminata + trote inicial', 'Fitbit Charge 5'),
(7, 2, 3.2, 'km', '2024-01-25 09:30:00', 'Progresando bien', 'Polar Vantage M'),
(8, 2, 4.1, 'km', '2024-01-26 10:45:00', 'Casi al objetivo de 5K', 'Garmin Venu 2');

-- CICLISMO
INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, fecha_registro, comentario, dispositivo) VALUES
-- Desafío 11
(16, 11, 35.0, 'km', '2024-04-10 12:00:00', 'Gran salida en bici de carretera', 'Wahoo Elemnt'),
(17, 11, 45.5, 'km', '2024-04-10 09:30:00', 'Progreso constante', 'Garmin Edge 530'),
(18, 11, 62.8, 'km', '2024-04-12 11:20:00', 'Mejorando resistencia', 'Bryton Rider 750'),
-- Desafío 12
(21, 12, 850.0, 'metros', '2024-05-15 15:20:00', 'Escalada técnica en montaña', 'Garmin Edge 1030'),
(22, 12, 1250.0, 'metros', '2024-05-10 09:30:00', 'Desnivel acumulado', 'Wahoo Elemnt Bolt'),
(23, 12, 980.0, 'metros', '2024-05-11 10:45:00', 'Progresando en subidas', 'Sigma ROX 12.0');

-- NATACIÓN
INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, fecha_registro, comentario, dispositivo) VALUES
-- Desafío 21
(31, 21, 1.2, 'km', '2024-05-10 15:15:00', 'Nado de resistencia en piscina', 'Garmin Swim 2'),
(32, 21, 2.1, 'km', '2024-05-10 09:30:00', 'Mejorando distancia', 'Apple Watch Series 7'),
(33, 21, 3.5, 'km', '2024-05-11 10:45:00', 'Casi al objetivo de 5km', 'Fitbit Versa 3'),
-- Desafío 22
(36, 22, 0.4, 'km', '2024-01-15 10:40:00', 'Primeras brazadas como principiante', 'Samsung Galaxy Watch 4'),
(37, 22, 0.6, 'km', '2024-01-16 10:45:00', 'Progresando en técnica', 'Polar Vantage V2'),
(38, 22, 0.8, 'km', '2024-01-17 11:20:00', 'Mejorando confianza en el agua', 'Garmin Forerunner 945');

-- GIMNASIO
INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, fecha_registro, comentario, dispositivo) VALUES
-- Desafío 31
(46, 31, 6.0, 'sesiones', '2024-01-10 14:25:00', '6 sesiones de fuerza fundamental', 'Strong App'),
(47, 31, 8.0, 'sesiones', '2024-01-12 15:30:00', 'Progresando en fuerza base', 'MyFitnessPal'),
(48, 31, 10.0, 'sesiones', '2024-01-15 16:45:00', 'Casi completo el desafío', 'JEFIT App'),
-- Desafío 32
(1, 32, 12.0, 'sesiones', '2024-02-15 16:50:00', 'Mitad del desafío de hipertrofia completado', 'Hevy App'),
(2, 32, 15.0, 'sesiones', '2024-02-20 10:30:00', 'Progreso constante en masa muscular', 'Gymaholic App'),
(3, 32, 18.0, 'sesiones', '2024-02-21 11:45:00', 'Casi al objetivo de 24 sesiones', 'FitBod App');

-- OTROS
INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, fecha_registro, comentario, dispositivo) VALUES
-- Desafío 41
(11, 41, 15.0, 'días', '2024-01-15 12:35:00', '15 días consecutivos de yoga', 'Down Dog App'),
(12, 41, 22, 'días', '2024-01-19 13:30:00', '22 días mejorando flexibilidad', 'Glo App'),
(13, 41, 28, 'días', '2024-01-20 14:45:00', '28 días casi completo', 'Apple Watch'),
-- Desafío 42
(16, 42, 12.0, 'días', '2024-02-10 15:00:00', '12 días de meditación matutina', 'Headspace App'),
(17, 42, 16, 'días', '2024-02-13 08:00:00', '16 días rutina establecida', 'Calm App'),
(18, 42, 20, 'días', '2024-02-14 08:30:00', '20 días casi completo el reto', 'Insight Timer');

-- ============================================
-- 7. INSERTAR ACCIONES ADMIN
-- ============================================

INSERT INTO acciones_admin (admin_id, tipo_accion, entidad_afectada, id_entidad_afectada, descripcion, fecha_accion) VALUES
(1, 'CREAR_DESAFIO', 'DESAFIO', 1, 'Creación del desafío Maratón de Primavera 2024', '2024-02-25 09:00:00'),
(1, 'EDITAR_DESAFIO', 'DESAFIO', 2, 'Ajuste de fechas del desafío 5K para Principiantes', '2024-01-10 10:30:00'),
(1, 'CREAR_DESAFIO', 'DESAFIO', 11, 'Creación del desafío Gran Fondo 100km', '2024-03-25 13:10:00'),
(1, 'CREAR_DESAFIO', 'DESAFIO', 21, 'Creación del desafío Maratón Acuático 5km', '2024-04-25 10:00:00'),
(1, 'CREAR_DESAFIO', 'DESAFIO', 31, 'Creación del desafío Fuerza Fundamental', '2024-12-20 15:55:00'),
(1, 'CREAR_DESAFIO', 'DESAFIO', 41, 'Creación del desafío Yoga 30 Días', '2024-12-18 11:30:00'),
(1, 'EDITAR_DESAFIO', 'DESAFIO', 42, 'Ajuste de horarios del desafío de meditación', '2024-01-25 09:45:00'),
(1, 'EDITAR_USUARIO', 'USUARIO', 15, 'Actualización de datos de usuario', '2024-01-08 16:45:00'),
(1, 'EDITAR_USUARIO', 'USUARIO', 22, 'Restablecimiento de contraseña de usuario', '2024-01-18 12:40:00'),
(1, 'EDITAR_USUARIO', 'USUARIO', 33, 'Actualización de información de contacto', '2024-01-22 16:10:00');

-- ============================================
-- 8. INSERTAR DESAFÍOS COMPLETADOS (ALGUNOS EJEMPLOS)
-- ============================================

INSERT INTO desafios_completados (usuario_id, desafio_id, fecha_completado, completado) VALUES
(1, 1, '2024-06-15 10:30:00', TRUE),
(2, 1, '2024-06-20 14:25:00', TRUE),
(6, 2, '2024-03-10 09:15:00', TRUE),
(16, 11, '2024-06-25 11:15:00', TRUE),
(21, 12, '2024-07-28 14:35:00', TRUE),
(31, 21, '2024-07-28 08:25:00', TRUE),
(46, 31, '2024-01-29 14:15:00', TRUE),
(11, 41, '2024-01-29 16:05:00', TRUE);

-- ============================================
-- 9. INSERTAR USUARIO_LOGROS (ALGUNOS EJEMPLOS)
-- ============================================

INSERT INTO usuario_logros (usuario_id, logro_id, fecha_obtencion) VALUES
(1, 1, '2024-06-20 18:25:00'),
(2, 1, '2024-03-10 10:30:00'),
(6, 1, '2024-01-25 09:15:00'),
(16, 1, '2024-04-05 14:40:00'),
(31, 1, '2024-05-15 13:45:00'),
(46, 1, '2024-01-15 12:55:00'),
(11, 1, '2024-01-15 12:55:00'),
(1, 2, '2024-06-20 18:25:00'),
(16, 3, '2024-06-25 11:15:00'),
(31, 4, '2024-07-28 08:25:00');

-- ============================================
-- 10. VERIFICACIÓN FINAL
-- ============================================

SELECT 'VERIFICACIÓN COMPLETA' as estado;

SELECT 
    'USUARIOS' as tabla,
    COUNT(*) as total
FROM usuarios
UNION ALL
SELECT 
    'DESAFÍOS' as tabla,
    COUNT(*) as total
FROM desafios
UNION ALL
SELECT 
    'PARTICIPACIONES' as tabla,
    COUNT(*) as total
FROM participaciones
UNION ALL
SELECT 
    'PROGRESOS' as tabla,
    COUNT(*) as total
FROM progresos
UNION ALL
SELECT 
    'LOGROS' as tabla,
    COUNT(*) as total
FROM logros;

-- Verificar por tipo de actividad
SELECT 
    d.tipo_actividad,
    COUNT(DISTINCT p.usuario_id) as participantes_con_progreso,
    COUNT(DISTINCT part.usuario_id) as total_participantes,
    CASE 
        WHEN COUNT(DISTINCT part.usuario_id) > 0 
        THEN ROUND((COUNT(DISTINCT p.usuario_id) * 100.0 / COUNT(DISTINCT part.usuario_id)), 1)
        ELSE 0
    END as porcentaje_con_progreso
FROM desafios d
LEFT JOIN participaciones part ON d.id = part.desafio_id
LEFT JOIN progresos p ON d.id = p.desafio_id AND part.usuario_id = p.usuario_id
GROUP BY d.tipo_actividad
ORDER BY d.tipo_actividad;
-- ============================================
-- 11. AÑADIR MÁS PARTICIPACIONES Y PROGRESOS
-- ============================================

-- AÑADIR MÁS PARTICIPACIONES EN CICLISMO (Desafíos 14-20)
INSERT INTO participaciones (usuario_id, desafio_id, fecha_union) VALUES
-- Desafío 14 - Reto 500km Mensual
(26, 14, '2024-11-30 10:15:00'), (27, 14, '2024-12-01 09:15:00'), (28, 14, '2024-12-02 10:15:00'), (29, 14, '2024-12-03 11:15:00'), (30, 14, '2024-12-04 12:15:00'),
-- Desafío 15 - Velocidad en Llano
(31, 15, '2024-02-28 14:20:00'), (32, 15, '2024-03-01 09:15:00'), (33, 15, '2024-03-02 10:15:00'), (34, 15, '2024-03-03 11:15:00'), (35, 15, '2024-03-04 12:15:00'),
-- Desafío 16 - Ruta Nocturna Segura
(36, 16, '2024-11-14 18:30:00'), (37, 16, '2024-11-15 19:00:00'), (38, 16, '2024-11-16 19:30:00'), (39, 16, '2024-11-17 20:00:00'), (40, 16, '2024-11-18 20:30:00'),
-- Desafío 17 - Bici al Trabajo
(41, 17, '2024-01-31 16:45:00'), (42, 17, '2024-02-01 08:00:00'), (43, 17, '2024-02-02 08:15:00'), (44, 17, '2024-02-03 08:30:00'), (45, 17, '2024-02-04 08:45:00'),
-- Desafío 18 - Enduro MTB Técnico
(46, 18, '2024-05-31 15:20:00'), (47, 18, '2024-06-01 09:15:00'), (48, 18, '2024-06-02 10:15:00'), (49, 18, '2024-06-03 11:15:00'), (50, 18, '2024-06-04 12:15:00'),
-- Desafío 19 - Ruta Costera Panorámica
(1, 19, '2024-06-30 11:25:00'), (2, 19, '2024-07-01 09:15:00'), (3, 19, '2024-07-02 10:15:00'), (4, 19, '2024-07-03 11:15:00'), (5, 19, '2024-07-04 12:15:00'),
-- Desafío 20 - Spinning Indoor
(6, 20, '2024-01-04 14:35:00'), (7, 20, '2024-01-05 09:15:00'), (8, 20, '2024-01-06 10:15:00'), (9, 20, '2024-01-07 11:15:00'), (10, 20, '2024-01-08 12:15:00');

-- AÑADIR MÁS PARTICIPACIONES EN GIMNASIO (Desafíos 34-40)
INSERT INTO participaciones (usuario_id, desafio_id, fecha_union) VALUES
-- Desafío 34 - Fuerza Máxima
(11, 34, '2024-03-31 13:25:00'), (12, 34, '2024-04-01 09:15:00'), (13, 34, '2024-04-02 10:15:00'), (14, 34, '2024-04-03 11:15:00'), (15, 34, '2024-04-04 12:15:00'),
-- Desafío 35 - Full Body 3xSemana
(16, 35, '2024-04-30 15:40:00'), (17, 35, '2024-05-01 09:15:00'), (18, 35, '2024-05-02 10:15:00'), (19, 35, '2024-05-03 11:15:00'), (20, 35, '2024-05-04 12:15:00'),
-- Desafío 36 - Push Pull Legs
(21, 36, '2024-05-31 10:55:00'), (22, 36, '2024-06-01 09:15:00'), (23, 36, '2024-06-02 10:15:00'), (24, 36, '2024-06-03 11:15:00'), (25, 36, '2024-06-04 12:15:00'),
-- Desafío 37 - Calistenia Básica
(26, 37, '2024-06-30 14:15:00'), (27, 37, '2024-07-01 09:15:00'), (28, 37, '2024-07-02 10:15:00'), (29, 37, '2024-07-03 11:15:00'), (30, 37, '2024-07-04 12:15:00'),
-- Desafío 38 - Core Strength
(31, 38, '2024-07-31 16:30:00'), (32, 38, '2024-08-01 09:15:00'), (33, 38, '2024-08-02 10:15:00'), (34, 38, '2024-08-03 11:15:00'), (35, 38, '2024-08-04 12:15:00'),
-- Desafío 39 - Mobility & Flex
(36, 39, '2024-08-31 11:45:00'), (37, 39, '2024-09-01 09:15:00'), (38, 39, '2024-09-02 10:15:00'), (39, 39, '2024-09-03 11:15:00'), (40, 39, '2024-09-04 12:15:00'),
-- Desafío 40 - Powerlifting Básico
(41, 40, '2024-09-30 13:20:00'), (42, 40, '2024-10-01 09:15:00'), (43, 40, '2024-10-02 10:15:00'), (44, 40, '2024-10-03 11:15:00'), (45, 40, '2024-10-04 12:15:00');

-- ============================================
-- 12. AÑADIR MÁS PROGRESOS PARA USUARIOS EXISTENTES
-- ============================================

-- PROGRESOS PARA DESAFÍOS DE CORRER (adicionales)
INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, fecha_registro, comentario, dispositivo) VALUES
-- Desafío 3 (más usuarios)
(11, 3, 35.0, 'km', '2024-12-10 10:30:00', 'Primera semana completa', 'Garmin Forerunner 245'),
(12, 3, 42.5, 'km', '2024-12-15 09:15:00', 'Progresando hacia los 100km', 'Apple Watch Series 9'),
(13, 3, 67.8, 'km', '2024-12-20 14:20:00', 'Más de la mitad completado', 'Samsung Galaxy Watch 5'),
(14, 3, 89.2, 'km', '2024-12-25 11:45:00', 'Casi en la meta final', 'Fitbit Charge 6'),
(15, 3, 100.0, 'km', '2024-12-30 10:00:00', '¡Reto completado!', 'Polar Grit X'),
-- Desafío 4
(4, 4, 8.5, 'km', '2024-02-10 09:30:00', 'Primera media maratón en progreso', 'Garmin Forerunner 55'),
(5, 4, 12.2, 'km', '2024-02-15 10:45:00', 'Aumentando distancia', 'Apple Watch SE'),
(6, 4, 15.8, 'km', '2024-02-20 08:15:00', 'Casi en la distancia objetivo', 'Fitbit Versa 4'),
(7, 4, 18.5, 'km', '2024-02-25 16:30:00', 'Últimas semanas de entrenamiento', 'Samsung Galaxy Watch 6'),
(8, 4, 21.1, 'km', '2024-03-30 09:00:00', '¡Media maratón completada!', 'Garmin Fenix 7');

-- PROGRESOS PARA DESAFÍOS DE CICLISMO (adicionales)
INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, fecha_registro, comentario, dispositivo) VALUES
-- Desafío 14
(26, 14, 125.0, 'km', '2024-12-10 15:30:00', 'Primera semana: 125km', 'Wahoo Elemnt Roam'),
(27, 14, 245.0, 'km', '2024-12-15 14:20:00', 'Mitad del reto completado', 'Garmin Edge 840'),
(28, 14, 378.5, 'km', '2024-12-20 11:45:00', 'En camino a los 500km', 'Bryton Rider 860'),
(29, 14, 432.0, 'km', '2024-12-25 09:15:00', 'Última semana de pedaleo', 'Sigma ROX 11.1'),
(30, 14, 500.0, 'km', '2024-12-30 10:00:00', '¡500km completados!', 'Hammerhead Karoo 2'),
-- Desafío 15
(31, 15, 25.5, 'km/h', '2024-03-10 11:30:00', 'Mejorando velocidad media', 'Garmin Edge 1030 Plus'),
(32, 15, 27.2, 'km/h', '2024-03-15 10:15:00', 'Progreso constante en llano', 'Wahoo Elemnt Bolt V2'),
(33, 15, 28.8, 'km/h', '2024-03-20 09:45:00', 'Casi en el objetivo de 30km/h', 'Bryton Rider 750'),
(34, 15, 29.5, 'km/h', '2024-03-25 14:20:00', 'A punto de alcanzar la meta', 'Garmin Edge 540'),
(35, 15, 30.0, 'km/h', '2024-03-30 10:00:00', '¡Velocidad objetivo alcanzada!', 'Sigma ROX 12.0');

-- PROGRESOS PARA DESAFÍOS DE GIMNASIO (adicionales)
INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, fecha_registro, comentario, dispositivo) VALUES
-- Desafío 34
(11, 34, 5.0, 'sesiones', '2024-04-10 16:30:00', 'Primeras sesiones de fuerza máxima', 'Hevy App'),
(12, 34, 8.0, 'sesiones', '2024-04-15 17:45:00', 'Progresando con cargas pesadas', 'Strong App'),
(13, 34, 10.0, 'sesiones', '2024-04-20 18:15:00', 'Más de la mitad completado', 'JEFIT App'),
(14, 34, 12.0, 'sesiones', '2024-04-25 16:30:00', 'Casi al objetivo final', 'MyFitnessPal'),
(15, 34, 15.0, 'sesiones', '2024-04-30 17:00:00', '¡Fuerza máxima completada!', 'Gymaholic App'),
-- Desafío 35
(16, 35, 4.0, 'sesiones', '2024-05-10 09:30:00', 'Primera semana de full body', 'FitBod App'),
(17, 35, 6.0, 'sesiones', '2024-05-15 10:45:00', 'Progresando en rutina completa', 'Strong App'),
(18, 35, 8.0, 'sesiones', '2024-05-20 11:15:00', 'Más de la mitad del mes', 'Hevy App'),
(19, 35, 10.0, 'sesiones', '2024-05-25 09:45:00', 'Últimas sesiones del mes', 'JEFIT App'),
(20, 35, 12.0, 'sesiones', '2024-05-30 10:00:00', '¡Full body completado!', 'MyFitnessPal');

-- PROGRESOS PARA DESAFÍOS DE NATACIÓN (adicionales)
INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, fecha_registro, comentario, dispositivo) VALUES
-- Desafío 24
(24, 24, 4.0, 'sesiones', '2024-02-10 16:45:00', 'Primera semana: 4 sesiones', 'Garmin Swim 2'),
(25, 24, 7.0, 'sesiones', '2024-02-15 17:30:00', 'Más de la mitad de sesiones', 'Apple Watch Ultra'),
(26, 24, 9.0, 'sesiones', '2024-02-20 18:15:00', 'Progreso constante', 'Fitbit Sense 2'),
(27, 24, 10.0, 'sesiones', '2024-02-25 16:45:00', 'Casi al objetivo', 'Polar Vantage V3'),
(28, 24, 12.0, 'sesiones', '2024-02-28 17:00:00', '¡Resistencia acuática lograda!', 'Garmin Forerunner 965'),
-- Desafío 25
(25, 25, 80.0, 'metros', '2024-04-20 10:30:00', 'Mejorando tiempo en 100m', 'Garmin Swim 2'),
(26, 25, 85.5, 'metros', '2024-04-22 11:15:00', 'Progresando en velocidad', 'Apple Watch Series 8'),
(27, 25, 92.0, 'metros', '2024-04-24 09:45:00', 'Casi al objetivo de 100m', 'Fitbit Charge 5'),
(28, 25, 95.5, 'metros', '2024-04-26 10:30:00', 'Últimos entrenamientos', 'Samsung Galaxy Watch 5'),
(29, 25, 100.0, 'metros', '2024-04-28 11:00:00', '¡100m completados a buen ritmo!', 'Polar Pacer Pro');

-- PROGRESOS PARA DESAFÍOS DE OTROS (adicionales)
INSERT INTO progresos (usuario_id, desafio_id, valor_actual, unidad, fecha_registro, comentario, dispositivo) VALUES
-- Desafío 43
(22, 43, 5.0, 'rutas', '2024-03-10 15:30:00', 'Primeras rutas de escalada', 'La Sportiva App'),
(23, 43, 8.0, 'rutas', '2024-03-15 16:45:00', 'Progresando en dificultad', '8a.nu App'),
(24, 43, 12.0, 'rutas', '2024-03-20 14:20:00', 'Más de la mitad completado', 'Mountain Project'),
(25, 43, 14.0, 'rutas', '2024-03-25 17:15:00', 'Casi al objetivo final', 'Climbax App'),
(26, 43, 15.0, 'rutas', '2024-03-30 16:00:00', '¡15 rutas de escalada completadas!', 'Vertical Life'),
-- Desafío 44
(44, 44, 4.0, 'sesiones', '2024-04-10 18:30:00', 'Primeras sesiones de boxeo fitness', 'Everlast App'),
(45, 44, 6.0, 'sesiones', '2024-04-15 19:15:00', 'Progresando en técnica', 'Boxing Fitness Tracker'),
(46, 44, 8.0, 'sesiones', '2024-04-20 17:45:00', 'Más de la mitad completado', 'MyBoxing Coach'),
(47, 44, 10.0, 'sesiones', '2024-04-25 18:30:00', 'Casi al objetivo final', 'FightCamp App'),
(48, 44, 12.0, 'sesiones', '2024-04-30 19:00:00', '¡Boxeo fitness completado!', 'Centr App');

-- ============================================
-- 13. AÑADIR MÁS DESAFÍOS COMPLETADOS
-- ============================================

INSERT INTO desafios_completados (usuario_id, desafio_id, fecha_completado, completado) VALUES
(11, 3, '2024-12-30 10:00:00', TRUE),
(12, 3, '2024-12-30 11:30:00', TRUE),
(13, 3, '2024-12-30 12:45:00', TRUE),
(14, 3, '2024-12-30 14:20:00', TRUE),
(15, 3, '2024-12-30 15:30:00', TRUE),
(4, 4, '2024-03-30 09:00:00', TRUE),
(5, 4, '2024-03-30 10:15:00', TRUE),
(6, 4, '2024-03-30 11:30:00', TRUE),
(7, 4, '2024-03-30 12:45:00', TRUE),
(8, 4, '2024-03-30 14:00:00', TRUE),
(26, 14, '2024-12-30 10:00:00', TRUE),
(27, 14, '2024-12-30 11:15:00', TRUE),
(28, 14, '2024-12-30 12:30:00', TRUE),
(29, 14, '2024-12-30 13:45:00', TRUE),
(30, 14, '2024-12-30 15:00:00', TRUE),
(31, 15, '2024-03-30 10:00:00', TRUE),
(32, 15, '2024-03-30 11:15:00', TRUE),
(33, 15, '2024-03-30 12:30:00', TRUE),
(34, 15, '2024-03-30 13:45:00', TRUE),
(35, 15, '2024-03-30 15:00:00', TRUE);
