-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-11-2025 a las 13:26:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nvs_new_vision_software_`
--

CREATE DATABASE IF NOT EXISTS nvs_new_vision_software_ DEFAULT CHARACTER_SET  utf8mb4 COLLATE utf8mb4_general_ci; 
USE nvs_new_vision_software_;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `config_metas`
--

CREATE TABLE `config_metas` (
  `IdConfig` int(11) NOT NULL,
  `HorasRequeridas` decimal(5,2) NOT NULL,
  `MontoPagar` decimal(10,2) NOT NULL,
  `FchaActualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `FchaCorteGlobal` date NOT NULL DEFAULT '1900-01-01'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `config_metas`
--

INSERT INTO `config_metas` (`IdConfig`, `HorasRequeridas`, `MontoPagar`, `FchaActualizacion`, `FchaCorteGlobal`) VALUES
(1, 200.00, 60000.00, '2025-11-17 12:08:49', '2025-11-17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horastrabajo`
--

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

--
-- Volcado de datos para la tabla `horastrabajo`
--

INSERT INTO `horastrabajo` (`IdHoras`, `IdUsuario`, `Email`, `FchaHoras`, `HoraInicio`, `HoraFin`, `Descripción`, `EstadoHoras`) VALUES
(8, 9, 'javierdiazcontreras1@gmail.com', '2025-09-29', '12:23:00', '23:23:00', '123123', 'rechazado'),
(9, 9, 'javierdiazcontreras1@gmail.com', '2025-09-29', '11:23:00', '23:54:00', 'asldasd', 'rechazado'),
(10, 9, 'javierdiazcontreras1@gmail.com', '2025-09-29', '12:00:00', '22:00:00', 'hola mundo', 'aprobado'),
(11, 9, 'javierdiazcontreras1@gmail.com', '2025-10-06', '12:00:00', '20:00:00', 'ajsdkjhad', 'rechazado'),
(12, 9, 'javierdiazcontreras1@gmail.com', '2025-10-28', '16:41:00', '01:45:00', 'jhgvjhg', 'rechazado'),
(13, 10, 'admin@gmail.com', '2025-11-03', '00:00:00', '08:00:00', 'gallina putaaa', 'aprobado'),
(14, 9, 'javierdiazcontreras1@gmail.com', '2025-11-06', '12:00:00', '20:00:00', 'asfasf', 'aprobado'),
(15, 10, 'admin@gmail.com', '2025-11-12', '12:32:00', '12:34:00', 'asasdad', 'rechazado'),
(16, 9, 'javierdiazcontreras1@gmail.com', '2025-11-12', '12:13:00', '23:34:00', 'asdsdf', 'rechazado'),
(18, 10, 'admin@gmail.com', '2025-11-12', '12:00:00', '20:00:00', 'sdfsdf', 'aprobado'),
(19, 9, 'javierdiazcontreras1@gmail.com', '2025-11-12', '12:03:00', '14:09:00', 'qodhaksjd', 'aprobado'),
(20, 9, 'javierdiazcontreras1@gmail.com', '2007-07-04', '20:20:00', '00:00:00', 'kjqjdadkj', 'aprobado'),
(21, 9, 'javierdiazcontreras1@gmail.com', '2007-07-04', '05:08:00', '22:22:00', 'asd', 'aprobado'),
(22, 9, 'javierdiazcontreras1@gmail.com', '2007-07-04', '12:00:00', '20:00:00', 'asfasdad', 'aprobado'),
(23, 9, 'javierdiazcontreras1@gmail.com', '2025-11-14', '12:03:00', '23:00:00', 'ANDNAD', 'aprobado'),
(24, 9, 'javierdiazcontreras1@gmail.com', '2025-11-17', '00:00:00', '12:00:00', 'asdad', 'aprobado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `IdPago` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `FchaPago` date NOT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `Comprobante` varchar(100) DEFAULT NULL,
  `EstadoPago` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`IdPago`, `IdUsuario`, `Email`, `FchaPago`, `Monto`, `Comprobante`, `EstadoPago`) VALUES
(7, 10, 'admin@gmail.com', '2025-11-03', 80000.00, 'pago_6908950173f4e.pdf', 'rechazado'),
(11, 9, 'javierdiazcontreras1@gmail.com', '2025-11-14', 10000.00, 'pago_6916a7d4ec58c.pdf', 'aprobado'),
(12, 10, 'admin@gmail.com', '2025-11-14', 20000.00, 'pago_6916aa3544731.pdf', 'aprobado'),
(13, 10, 'admin@gmail.com', '2025-11-14', 10000.00, 'pago_6916aa5199192.pdf', 'aprobado'),
(14, 9, 'javierdiazcontreras1@gmail.com', '2025-11-14', 20000.00, 'pago_6916aaef7a1fa.pdf', 'aprobado'),
(15, 10, 'admin@gmail.com', '2025-11-14', 10000.00, 'pago_6916b6ca2e085.pdf', 'aprobado'),
(16, 9, 'javierdiazcontreras1@gmail.com', '2025-11-17', 1000.00, 'pago_691b0fad4f97c.pdf', 'aprobado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `postulaciones`
--

CREATE TABLE `postulaciones` (
  `IdPostulacion` int(11) NOT NULL,
  `Pnom` varchar(100) NOT NULL,
  `Pape` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
  `FchaSolicitud` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `postulaciones`
--

INSERT INTO `postulaciones` (`IdPostulacion`, `Pnom`, `Pape`, `Email`, `password`, `estado`, `FchaSolicitud`) VALUES
(8, 'Javier ', 'Diaz', 'javierdiazcontreras1@gmail.com', '$2y$10$ndSmfU053VGeai.RTH4upuuZeJACMG1IuDmGHivQsNwRm67eVFVq2', 'rechazada', '2025-09-15 21:41:01'),
(9, 'NicoNuñez', 'Aranda', 'socio@gmail.com', '$2y$10$lijpIQDVDGstCy5hf9OajOmdsVbxMTG3sb.iNZDDkMvlDuuqpg/dy', 'rechazada', '2025-09-29 11:27:05'),
(10, 'Javier ', 'diaz', 'prueba@gmail.com', '$2y$10$vq2lkK0lo3YyWNkFVQPHYOTNZuF6IRX5O.wG.r1T.pqstI1wwhaSG', 'rechazada', '2025-09-29 12:20:09'),
(11, 'NicoNuñez', 'Aranda', 'juam@gmail.com', '$2y$10$hSntGh3AsyipLYvKf/MlA.MoiEuvzVrl41N0pc53Mm/LNydD9eC1q', 'rechazada', '2025-10-29 00:40:41'),
(12, 'Mateo', 'asdasd', 'unjavimas@gmail.com', '$2y$10$UfGHAZuqjpz3ASh8hxKU7eJSv.82tYHg/diheTpWT4.5tbXM/H4SG', 'aprobada', '2025-11-05 15:45:08'),
(13, 'Javier Diaz', 'asfd', 'diegofranchi07@gmail.com', '$2y$10$Ij66ElreVriJqAfy/IFelOW2hCt4yxoCu2/VuQpCQYx3uZGZfazAO', 'rechazada', '2025-11-12 03:59:06'),
(14, 'asd', 'asd', 'asfasf@gmail.com', '$2y$10$ns5xF/MpswvGF/UdRh1VJOGinS6e2qVm90CFZAuBhChfIGHJyCS16', 'rechazada', '2025-11-12 04:29:02'),
(15, 'Alejandro', 'Aranda', '67@gmail.com', '$2y$10$3xi0hg5ZxUtLCmCYM94iJ.7nKgB/gMg9up9XyXHoMelgg6/K/tAnK', 'aprobada', '2025-11-12 10:45:38'),
(16, 'Javier ', 'argento', 'pruebaa@gmail.com', '$2y$10$5A61nYDxyKKmt0oe2aPIL.9nuDlvHHFOT5tC3ipl7eNPD8S/vAESG', 'aprobada', '2025-11-12 10:46:52'),
(17, 'Juan', 'Perez', 'juan@gmail.com', '$2y$10$Q0fYJ5cFqApqXKQolB8Uk./2pr5Hn64oJeSrAIcGWQsYx2xeMCkPW', 'aprobada', '2025-11-12 11:22:31'),
(18, 'Pedro', 'Perez', 'pedro@gmail.com', '$2y$10$jRx6/gqy6zCkG1mJSZbI3eVffGXWxJI0gyIenI9SA.H33quz2SquK', 'aprobada', '2025-11-12 23:54:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `socio`
--

CREATE TABLE `socio` (
  `IdSocio` int(11) NOT NULL,
  `PrimNom` varchar(50) NOT NULL,
  `PrimApe` varchar(50) NOT NULL,
  `CI` varchar(20) DEFAULT NULL,
  `FchaNac` date NOT NULL,
  `FchaIngreso` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `socio`
--

INSERT INTO `socio` (`IdSocio`, `PrimNom`, `PrimApe`, `CI`, `FchaNac`, `FchaIngreso`) VALUES
(6, 'Javier ', 'Diaz', NULL, '1900-01-01', '2025-09-15 13:58:08'),
(7, 'Javier ', 'Diaz', '63765730', '2007-07-04', '2025-09-15 19:48:00'),
(8, 'Alejandro', 'Aranda', NULL, '1900-01-01', '2025-09-15 19:54:29'),
(12, 'Mateo', 'asdasd', NULL, '1900-01-01', '2025-11-12 04:28:23'),
(15, 'Alejandro', 'Aranda', NULL, '1900-01-01', '2025-11-12 10:46:11'),
(16, 'Javier ', 'argento', NULL, '1900-01-01', '2025-11-12 10:47:17'),
(17, 'Juan', 'Perez', NULL, '1900-01-01', '2025-11-12 11:23:46'),
(18, 'Pedro', 'Perez', NULL, '1900-01-01', '2025-11-12 23:55:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidadvivienda`
--

CREATE TABLE `unidadvivienda` (
  `IdVivienda` int(11) NOT NULL,
  `NroVivienda` varchar(50) NOT NULL,
  `IdSocio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unidadvivienda`
--

INSERT INTO `unidadvivienda` (`IdVivienda`, `NroVivienda`, `IdSocio`) VALUES
(3, '001', NULL),
(4, '002', 8),
(5, '003', NULL),
(7, '005', NULL),
(8, '006', 7),
(9, '007', NULL),
(10, '008', NULL),
(11, '009', NULL),
(12, '010', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

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

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`IdUsuario`, `PrimNom`, `PrimApe`, `IdSocio`, `Email`, `Contraseña`, `Rol`, `FchaIngreso`) VALUES
(9, 'Javier ', 'Diaz', 7, 'javierdiazcontreras1@gmail.com', '$2y$10$N5kPJwNpoW4xjkpWvlX/e.OjT1Q2BuDnlKuFGqQlP/KiU5zFy26MC', 'socio', '2025-09-15 19:48:00'),
(10, 'Alejandro', 'Aranda', 8, 'admin@gmail.com', '$2y$10$y6Eqnyv0Htvcrb9Obrsalu24gpqf68rYgbeHxj1rY2HIVTK9sI35u', 'admin', '2025-09-15 19:54:29');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `config_metas`
--
ALTER TABLE `config_metas`
  ADD PRIMARY KEY (`IdConfig`);

--
-- Indices de la tabla `horastrabajo`
--
ALTER TABLE `horastrabajo`
  ADD PRIMARY KEY (`IdHoras`),
  ADD KEY `IdUsuario` (`IdUsuario`),
  ADD KEY `fk_horas_email` (`Email`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`IdPago`),
  ADD KEY `IdUsuario` (`IdUsuario`),
  ADD KEY `fk_pago_email` (`Email`);

--
-- Indices de la tabla `postulaciones`
--
ALTER TABLE `postulaciones`
  ADD PRIMARY KEY (`IdPostulacion`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indices de la tabla `socio`
--
ALTER TABLE `socio`
  ADD PRIMARY KEY (`IdSocio`);

--
-- Indices de la tabla `unidadvivienda`
--
ALTER TABLE `unidadvivienda`
  ADD PRIMARY KEY (`IdVivienda`),
  ADD UNIQUE KEY `NroVivienda` (`NroVivienda`),
  ADD KEY `FK_SocioVivienda` (`IdSocio`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`IdUsuario`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `IdSocio` (`IdSocio`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `config_metas`
--
ALTER TABLE `config_metas`
  MODIFY `IdConfig` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `horastrabajo`
--
ALTER TABLE `horastrabajo`
  MODIFY `IdHoras` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `IdPago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `postulaciones`
--
ALTER TABLE `postulaciones`
  MODIFY `IdPostulacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `socio`
--
ALTER TABLE `socio`
  MODIFY `IdSocio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `unidadvivienda`
--
ALTER TABLE `unidadvivienda`
  MODIFY `IdVivienda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `IdUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `horastrabajo`
--
ALTER TABLE `horastrabajo`
  ADD CONSTRAINT `fk_horas_email` FOREIGN KEY (`Email`) REFERENCES `usuario` (`Email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `horastrabajo_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`IdUsuario`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `fk_pago_email` FOREIGN KEY (`Email`) REFERENCES `usuario` (`Email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`IdUsuario`);

--
-- Filtros para la tabla `unidadvivienda`
--
ALTER TABLE `unidadvivienda`
  ADD CONSTRAINT `FK_SocioVivienda` FOREIGN KEY (`IdSocio`) REFERENCES `socio` (`IdSocio`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`IdSocio`) REFERENCES `socio` (`IdSocio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
