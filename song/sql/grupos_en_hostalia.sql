-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: PMYSQL120.dns-servicio.com:3306
-- Tiempo de generación: 03-03-2026 a las 13:58:30
-- Versión del servidor: 8.4.8
-- Versión de PHP: 8.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `7229353_db_holy_songs`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos`
--

CREATE TABLE `grupos` (
  `id_grupo` int NOT NULL,
  `id_iglesia` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `comentario` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `grupos`
--

INSERT INTO `grupos` (`id_grupo`, `id_iglesia`, `nombre`, `comentario`, `created_at`, `updated_at`) VALUES
(1, 1, 'Група 1 - (Юля Демко)', '', '2026-01-27 20:53:39', '0000-00-00 00:00:00'),
(2, 1, 'Група 2 - (Роман Демко)', '', '2026-01-27 20:53:39', '0000-00-00 00:00:00'),
(3, 1, 'Група 3 - (Настя Лозова)', '', '2026-01-27 14:18:19', '0000-00-00 00:00:00'),
(4, 1, 'Група 4 - (Альберт)', '', '2026-01-27 14:18:46', '0000-00-00 00:00:00'),
(5, 1, 'Загальний спів - (Оксана Куник)', '', '2026-01-27 14:19:58', NULL),
(6, 1, 'Брати - (Веніамін Хлопецький)', '', '2026-01-27 14:20:41', NULL),
(7, 1, 'Молодь - (Марта Мельничук)', '', '2026-01-27 14:21:56', NULL),
(8, 1, 'Сергій Ковальчук', '', '2026-03-03 10:15:40', NULL),
(9, 1, 'Веніамін Хлопецький', '', '2026-03-03 10:16:35', NULL),
(10, 1, 'Марта Мельничук', '', '2026-03-03 10:16:57', NULL),
(11, 1, 'Мікс', '', '2026-03-03 10:21:09', NULL),
(12, 1, 'Інші виконавці або гості', '', '2026-03-03 10:21:29', NULL),
(13, 1, 'Невідомий виконавець...', '', '2026-03-03 10:27:00', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `grupos`
--
ALTER TABLE `grupos`
  ADD PRIMARY KEY (`id_grupo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `grupos`
--
ALTER TABLE `grupos`
  MODIFY `id_grupo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
