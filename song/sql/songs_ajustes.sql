-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-05-2026 a las 13:54:24
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
  `device_resolution` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orientation` enum('portrait','landscape') COLLATE utf8mb4_unicode_ci NOT NULL,
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

INSERT INTO `songs_ajustes` (`id_song_ajuste`, `id_user`, `id_song`, `device_resolution`, `orientation`, `font_size`, `num_columns`, `acordes_visible`, `texto_visible`, `contenido_width`, `created_at`, `updated_at`) VALUES
(1, 3, 8078, '1080x1920', 'landscape', 22, 1, 1, 1, 0, '2026-05-27 11:23:02', '2026-05-27 16:02:56'),
(5, 3, 8078, '425x800', 'portrait', 29, 1, 0, 1, 1, '2026-05-27 11:59:13', '2026-05-27 12:29:08'),
(6, 3, 8078, '425x800', 'landscape', 22, 3, 1, 1, 1, '2026-05-27 11:59:44', '2026-05-27 11:59:44'),
(7, 3, 8078, '375x800', 'portrait', 25, 1, 1, 1, 0, '2026-05-27 12:09:54', '2026-05-27 12:12:09'),
(8, 3, 8078, '768x800', 'portrait', 22, 3, 1, 1, 1, '2026-05-27 12:10:42', '2026-05-27 12:10:42'),
(11, 3, 8078, '320x800', 'portrait', 19, 1, 0, 1, 1, '2026-05-27 12:12:49', '2026-05-27 12:12:59'),
(18, 3, 8049, '1080x1920', 'landscape', 19, 4, 1, 1, 1, '2026-05-27 12:31:47', '2026-05-27 12:31:47'),
(19, 3, 2631, '1080x1920', 'landscape', 23, 2, 1, 1, 0, '2026-05-27 12:32:22', '2026-05-27 12:32:22'),
(20, 3, 8050, '1080x1920', 'landscape', 23, 3, 1, 1, 0, '2026-05-27 12:32:38', '2026-05-27 12:32:38'),
(21, 3, 8099, '1080x1920', 'landscape', 16, 1, 1, 1, 0, '2026-05-27 12:32:54', '2026-05-27 12:39:51'),
(22, 3, 8099, '500x800', 'portrait', 17, 1, 1, 1, 0, '2026-05-27 12:35:02', '2026-05-27 12:42:30'),
(23, 3, 8050, '500x800', 'portrait', 15, 2, 1, 1, 1, '2026-05-27 12:35:22', '2026-05-27 12:42:09'),
(24, 3, 2631, '500x800', 'portrait', 25, 1, 0, 1, 1, '2026-05-27 12:36:50', '2026-05-27 12:41:54'),
(25, 3, 8078, '500x800', 'portrait', 12, 1, 1, 1, 0, '2026-05-27 12:37:13', '2026-05-27 12:41:18'),
(33, 3, 8099, '500x800', 'landscape', 10, 2, 1, 1, 0, '2026-05-27 12:43:48', '2026-05-27 12:43:48'),
(34, 3, 8050, '500x800', 'landscape', 9, 3, 1, 1, 0, '2026-05-27 12:44:03', '2026-05-27 12:44:03'),
(35, 3, 2631, '500x800', 'landscape', 10, 3, 1, 1, 0, '2026-05-27 12:44:53', '2026-05-27 12:44:53'),
(36, 3, 8078, '500x800', 'landscape', 14, 2, 1, 1, 0, '2026-05-27 12:45:09', '2026-05-27 12:45:09'),
(49, 82, 8062, '1080x1920', 'landscape', 22, 1, 1, 1, 0, '2026-05-27 23:15:08', '2026-05-27 23:15:26'),
(51, 82, 8050, '', '', 0, 0, 0, 0, 0, '2026-05-27 23:44:56', '2026-05-27 23:55:24'),
(54, 82, 8099, '1080x1920', 'landscape', 22, 1, 1, 1, 0, '2026-05-28 00:54:44', '2026-05-28 00:56:40'),
(57, 82, 8050, '1080x1920', 'landscape', 22, 1, 1, 1, 0, '2026-05-28 01:08:41', '2026-05-28 01:08:41'),
(58, 3, 8101, '1080x1920', 'landscape', 22, 1, 1, 1, 0, '2026-05-28 13:24:24', '2026-05-28 13:24:24'),
(59, 3, 8102, '1080x1920', 'landscape', 22, 1, 1, 1, 0, '2026-05-28 13:35:12', '2026-05-28 13:35:12'),
(60, 3, 8103, '1080x1920', 'landscape', 22, 1, 1, 1, 0, '2026-05-28 13:35:53', '2026-05-28 13:35:53'),
(61, 3, 8104, '1080x1920', 'landscape', 22, 1, 1, 1, 0, '2026-05-28 13:41:57', '2026-05-28 13:41:57'),
(62, 3, 8105, '1080x1920', 'landscape', 22, 1, 1, 1, 0, '2026-05-28 13:49:49', '2026-05-28 13:49:49');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `songs_ajustes`
--
ALTER TABLE `songs_ajustes`
  ADD PRIMARY KEY (`id_song_ajuste`),
  ADD UNIQUE KEY `unique_user_song_device_orientation` (`id_user`,`id_song`,`device_resolution`,`orientation`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `songs_ajustes`
--
ALTER TABLE `songs_ajustes`
  MODIFY `id_song_ajuste` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
