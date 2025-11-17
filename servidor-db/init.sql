-- ==========================================
-- CREACIÓN DE BASE DE DATOS Y USUARIO APP
-- ==========================================
CREATE DATABASE IF NOT EXISTS nvs_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nvs_db;

CREATE USER IF NOT EXISTS 'nvs_app'@'%' IDENTIFIED BY 'AppStrongPassword!';
GRANT SELECT, INSERT, UPDATE, DELETE ON nvs_db.* TO 'nvs_app'@'%';
FLUSH PRIVILEGES;

-- ==========================================
-- TABLAS
-- ==========================================

CREATE TABLE `config_metas` (
  `IdConfig` int(11) NOT NULL,
  `HorasRequeridas` decimal(5,2) NOT NULL,
  `MontoPagar` decimal(10,2) NOT NULL,
  `FchaActualizacion` timestamp NOT NULL DEFAULT current_timestamp() 
      ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `config_metas` (`IdConfig`, `HorasRequeridas`, `MontoPagar`, `FchaActualizacion`)
VALUES (1, 100.00, 30000.00, NOW());

------------------------------------------------------------

CREATE TABLE `horastrabajo` (
  `IdHoras` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `FchaHoras` date NOT NULL,
  `HoraInicio` time DEFAULT NULL,
  `HoraFin` time DEFAULT NULL,
  `Descripción` varchar(100) NOT NULL,
  `EstadoHoras` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

------------------------------------------------------------

CREATE TABLE `pago` (
  `IdPago` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `FchaPago` date NOT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `Comprobante` varchar(100) DEFAULT NULL,
  `EstadoPago` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

------------------------------------------------------------

CREATE TABLE `postulaciones` (
  `IdPostulacion` int(11) NOT NULL,
  `Pnom` varchar(100) NOT NULL,
  `Pape` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
  `FchaSolicitud` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

------------------------------------------------------------

CREATE TABLE `socio` (
  `IdSocio` int(11) NOT NULL,
  `PrimNom` varchar(50) NOT NULL,
  `PrimApe` varchar(50) NOT NULL,
  `CI` varchar(20) DEFAULT NULL,
  `FchaNac` date NOT NULL,
  `FchaIngreso` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

------------------------------------------------------------

CREATE TABLE `unidadvivienda` (
  `IdVivienda` int(11) NOT NULL,
  `NroVivienda` varchar(50) NOT NULL,
  `IdSocio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

------------------------------------------------------------

CREATE TABLE `usuario` (
  `IdUsuario` int(11) NOT NULL,
  `PrimNom` varchar(100) NOT NULL,
  `PrimApe` varchar(100) NOT NULL,
  `IdSocio` int(11) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Rol` varchar(50) NOT NULL,
  `FchaIngreso` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ==========================================
-- ÍNDICES Y AUTO_INCREMENT
-- ==========================================

ALTER TABLE `config_metas`
  ADD PRIMARY KEY (`IdConfig`);
ALTER TABLE `horastrabajo`
  ADD PRIMARY KEY (`IdHoras`),
  ADD KEY `IdUsuario` (`IdUsuario`),
  ADD KEY `fk_horas_email` (`Email`);
ALTER TABLE `pago`
  ADD PRIMARY KEY (`IdPago`),
  ADD KEY `IdUsuario` (`IdUsuario`),
  ADD KEY `fk_pago_email` (`Email`);
ALTER TABLE `postulaciones`
  ADD PRIMARY KEY (`IdPostulacion`),
  ADD UNIQUE KEY `Email` (`Email`);
ALTER TABLE `socio`
  ADD PRIMARY KEY (`IdSocio`);
ALTER TABLE `unidadvivienda`
  ADD PRIMARY KEY (`IdVivienda`),
  ADD UNIQUE KEY `NroVivienda` (`NroVivienda`),
  ADD KEY `FK_SocioVivienda` (`IdSocio`);
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`IdUsuario`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `IdSocio` (`IdSocio`);

ALTER TABLE `config_metas`
  MODIFY `IdConfig` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `horastrabajo`
  MODIFY `IdHoras` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `pago`
  MODIFY `IdPago` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `postulaciones`
  MODIFY `IdPostulacion` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `socio`
  MODIFY `IdSocio` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `unidadvivienda`
  MODIFY `IdVivienda` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `usuario`
  MODIFY `IdUsuario` int(11) NOT NULL AUTO_INCREMENT;

-- ==========================================
-- FOREIGN KEYS
-- ==========================================

ALTER TABLE `horastrabajo`
  ADD CONSTRAINT `fk_horas_email` FOREIGN KEY (`Email`) REFERENCES `usuario` (`Email`)
      ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `horastrabajo_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`IdUsuario`);

ALTER TABLE `pago`
  ADD CONSTRAINT `fk_pago_email` FOREIGN KEY (`Email`) REFERENCES `usuario` (`Email`)
      ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`IdUsuario`);

ALTER TABLE `unidadvivienda`
  ADD CONSTRAINT `FK_SocioVivienda` FOREIGN KEY (`IdSocio`) REFERENCES `socio` (`IdSocio`)
      ON UPDATE CASCADE;

ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`IdSocio`) REFERENCES `socio` (`IdSocio`);

-- ==========================================
-- USUARIO ADMIN INICIAL (ya existe en tu dump)
-- ==========================================

INSERT INTO `usuario` (`IdUsuario`, `PrimNom`, `PrimApe`, `IdSocio`, `Email`, `Contraseña`, `Rol`)
VALUES
(10, 'Alejandro', 'Aranda', 8, 'admin@gmail.com',
 '$2y$10$y6Eqnyv0Htvcrb9Obrsalu24gpqf68rYgbeHxj1rY2HIVTK9sI35u',
 'admin')
ON DUPLICATE KEY UPDATE Email=Email;

