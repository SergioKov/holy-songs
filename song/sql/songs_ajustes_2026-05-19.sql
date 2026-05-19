-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-05-2026 a las 18:26:12
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
  `id_song_ajuste` bigint(20) NOT NULL,
  `id_user` bigint(20) NOT NULL,
  `id_song` bigint(20) NOT NULL,
  `device_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `font_size` tinyint(4) NOT NULL DEFAULT 22,
  `num_columns` tinyint(1) NOT NULL DEFAULT 1,
  `acordes_visible` tinyint(1) NOT NULL DEFAULT 1,
  `texto_visible` tinyint(1) NOT NULL DEFAULT 1,
  `contenido_width` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `songs_ajustes`
--

INSERT INTO `songs_ajustes` (`id_song_ajuste`, `id_user`, `id_song`, `device_key`, `font_size`, `num_columns`, `acordes_visible`, `texto_visible`, `contenido_width`, `created_at`, `updated_at`) VALUES
(13, 1, 8078, '425_portrait', 32, 1, 1, 1, 1, '2026-05-19 15:27:32', '2026-05-19 16:27:25'),
(14, 1, 2631, '425_portrait', 20, 2, 1, 1, 1, '2026-05-19 15:49:37', '2026-05-19 16:27:48'),
(25, 1, 8050, '425_portrait', 12, 2, 1, 1, 1, '2026-05-19 16:02:25', '2026-05-19 16:29:41'),
(27, 1, 8049, '425_portrait', 17, 1, 1, 1, 0, '2026-05-19 16:04:43', '2026-05-19 16:27:36'),
(28, 1, 8073, '425_portrait', 56, 1, 1, 1, 0, '2026-05-19 16:04:58', '2026-05-19 16:27:41'),
(31, 1, 8099, '425_portrait', 22, 1, 1, 1, 0, '2026-05-19 16:05:47', '2026-05-19 16:28:46'),
(45, 1, 8078, '1918_landscape', 29, 1, 1, 1, 1, '2026-05-19 16:46:33', '2026-05-19 16:46:33'),
(46, 1, 8049, '1918_landscape', 14, 1, 1, 1, 0, '2026-05-19 16:47:12', '2026-05-19 16:47:12'),
(47, 1, 8073, '1918_landscape', 54, 1, 1, 1, 0, '2026-05-19 16:48:01', '2026-05-19 16:48:01'),
(48, 1, 2631, '1918_landscape', 32, 1, 1, 1, 1, '2026-05-19 16:48:12', '2026-05-19 16:48:12'),
(49, 1, 8050, '1918_landscape', 50, 1, 1, 1, 1, '2026-05-19 16:48:23', '2026-05-19 16:49:14'),
(57, 1, 8050, '1920_landscape', 15, 2, 1, 1, 0, '2026-05-19 18:15:29', '2026-05-19 18:15:29');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `songs_ajustes`
--
ALTER TABLE `songs_ajustes`
  ADD PRIMARY KEY (`id_song_ajuste`),
  ADD UNIQUE KEY `unique_user_song_device` (`id_user`,`id_song`,`device_key`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `songs_ajustes`
--
ALTER TABLE `songs_ajustes`
  MODIFY `id_song_ajuste` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
