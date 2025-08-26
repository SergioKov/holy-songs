-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-08-2025 a las 19:47:49
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
-- Base de datos: `db_holy_songs`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `listas_songs`
--

CREATE TABLE `listas_songs` (
  `id_lista` int(11) NOT NULL,
  `id_song` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `listas_songs`
--

INSERT INTO `listas_songs` (`id_lista`, `id_song`) VALUES
(5, 456),
(5, 893),
(5, 951),
(5, 1304),
(5, 1321),
(24, 484),
(24, 490),
(24, 1175);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `listas_songs`
--
ALTER TABLE `listas_songs`
  ADD PRIMARY KEY (`id_lista`,`id_song`),
  ADD KEY `id_song` (`id_song`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `listas_songs`
--
ALTER TABLE `listas_songs`
  ADD CONSTRAINT `listas_songs_ibfk_1` FOREIGN KEY (`id_lista`) REFERENCES `listas` (`id_lista`) ON DELETE CASCADE,
  ADD CONSTRAINT `listas_songs_ibfk_2` FOREIGN KEY (`id_song`) REFERENCES `songs` (`id_song`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
