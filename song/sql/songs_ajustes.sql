-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-05-2026 a las 17:23:34
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.4

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
-- Estructura de tabla para la tabla `songs_ajustes`
--

CREATE TABLE `songs_ajustes` (
  `id_song_ajuste` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_song` int(11) NOT NULL,
  `font_size` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_columns` int(1) NOT NULL DEFAULT 1,
  `acordes_visible` tinyint(1) NOT NULL DEFAULT 1,
  `texto_visible` tinyint(1) NOT NULL DEFAULT 1,
  `contenido_width` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `songs_ajustes`
--

INSERT INTO `songs_ajustes` (`id_song_ajuste`, `id_user`, `id_song`, `font_size`, `num_columns`, `acordes_visible`, `texto_visible`, `contenido_width`, `created_at`, `updated_at`) VALUES
(1, 1, 8099, '45', 2, 1, 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `songs_ajustes`
--
ALTER TABLE `songs_ajustes`
  ADD PRIMARY KEY (`id_song_ajuste`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `songs_ajustes`
--
ALTER TABLE `songs_ajustes`
  MODIFY `id_song_ajuste` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
