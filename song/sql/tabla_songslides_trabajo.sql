-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-09-2025 a las 22:15:33
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
-- Estructura de tabla para la tabla `songslides`
--

CREATE TABLE `songslides` (
  `id_songslide` int(10) NOT NULL,
  `id_user` int(10) NOT NULL,
  `ip_user` varchar(255) NOT NULL,
  `id_song` int(10) NOT NULL,
  `slide_actual` int(2) NOT NULL,
  `slide_text` text NOT NULL,
  `arr_pantalla` text NOT NULL,
  `pantalla_show` varchar(10) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `songslides`
--

INSERT INTO `songslides` (`id_songslide`, `id_user`, `ip_user`, `id_song`, `slide_actual`, `slide_html`, `arr_pantalla`, `pantalla_show`, `created_at`, `updated_at`) VALUES
(1, 1, '127.0.0.1', 7500, 2, 'Кто тебя любит так, как Спаситель?<br>Он умер за тебя!<br>Вечный Сын Божий - твой Искупитель,<br>Твой грех взял на Себя.', '[{\"id_song\":\"7500\",\"slide_actual\":2,\"slide_html\":\"Кто тебя любит так, как Спаситель?<br>Он умер за тебя!<br>Вечный Сын Божий - твой Искупитель,<br>Твой грех взял на Себя.\",\"add_tres_estrellas\":false,\"add_d_puntos\":false,\"add_d_music\":false,\"pantalla_show\":false}]', 'true', '2025-09-23 18:52:35', '2025-09-23 22:15:08');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `songslides`
--
ALTER TABLE `songslides`
  ADD PRIMARY KEY (`id_songslide`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `songslides`
--
ALTER TABLE `songslides`
  MODIFY `id_songslide` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
