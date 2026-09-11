-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-09-2026 a las 23:18:58
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
-- Estructura de tabla para la tabla `users_ajustes`
--

CREATE TABLE `users_ajustes` (
  `id_user_ajuste` bigint(20) NOT NULL,
  `id_user` bigint(20) NOT NULL,
  `id_song` bigint(20) NOT NULL,
  `ajustes_pers` tinyint(1) NOT NULL DEFAULT 0,
  `tune_transpose_pers` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `capo_pers` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `tipo_acorde_pers` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#',
  `tempo_bpm_pers` int(3) NOT NULL DEFAULT 0,
  `notes_pers` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `users_ajustes`
--
ALTER TABLE `users_ajustes`
  ADD PRIMARY KEY (`id_user_ajuste`),
  ADD UNIQUE KEY `unique_user_song` (`id_user`,`id_song`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `users_ajustes`
--
ALTER TABLE `users_ajustes`
  MODIFY `id_user_ajuste` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
