-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-08-2025 a las 16:57:17
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
-- Base de datos: `db_songs`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `listas`
--

CREATE TABLE `listas` (
  `id_lista` int(7) NOT NULL,
  `title` varchar(255) NOT NULL,
  `notes` text NOT NULL,
  `arr_lista` text NOT NULL,
  `fecha` date DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `listas`
--

INSERT INTO `listas` (`id_lista`, `title`, `notes`, `arr_lista`, `fecha`, `created_at`, `updated_at`) VALUES
(1, 'ggg zzz 4444444444444444444', 'dgkghkghkgd', '[]', '2025-08-09', '2025-08-02 00:00:00', '2025-08-19 16:56:09'),
(2, 'lololo zzz', 'otra nota...', '', '0000-00-00', '2025-08-02 17:31:43', '0000-00-00 00:00:00'),
(3, 'lululu zzz uuuuuuuuuuuuuuuuuuuuuuuuuuu', 'algun texto aki...', '[]', '2025-08-23', '2025-08-02 17:33:25', '2025-08-19 16:51:56'),
(4, 'fghkfghkghkk', 'grfghkfghk', '', '2025-08-19', '2025-08-19 15:42:50', NULL),
(5, 'gfhjlfhjlfhjl', 'hjlfjhljhlfhjl', '', '2025-08-21', '2025-08-19 15:48:10', NULL),
(7, '222 zzz', 'dfhsfhsf', '[{\"id_song\":380,\"song_number\":1068,\"title\":\"І в голос і в Як злі підходять\",\"tune\":\"\"},{\"id_song\":191,\"song_number\":200,\"title\":\"Блаженні вбогі духом бо їхнє Царство Боже\",\"tune\":\"\"}]', '2025-08-10', '2025-08-19 16:20:16', '2025-08-19 16:37:10'),
(8, '333 zzz aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'afhfsdh', '[{\"id_song\":1076,\"song_number\":558,\"title\":\"Біблія світло Боже засвітила\",\"tune\":\"\"},{\"id_song\":634,\"song_number\":115,\"title\":\"Бажаю все Тебе о Боже мій\",\"tune\":\"\"},{\"id_song\":1175,\"song_number\":659,\"title\":\"Блудний син\",\"tune\":\"\"}]', '2025-08-01', '2025-08-19 16:39:15', '2025-08-19 16:51:19'),
(9, 'nueva zzz lista', 'adfhah', '[{\"id_song\":484,\"song_number\":1181,\"title\":\"А ти шукай Христа Ідучи по дорозі\",\"tune\":\"\"},{\"id_song\":1307,\"song_number\":796,\"title\":\"Бажаю я щоб весь мій дім\",\"tune\":\"\"},{\"id_song\":1183,\"song_number\":667,\"title\":\"Боже славимо Тебе\",\"tune\":\"\"}]', '2025-08-28', '2025-08-19 16:54:42', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `listas`
--
ALTER TABLE `listas`
  ADD PRIMARY KEY (`id_lista`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `listas`
--
ALTER TABLE `listas`
  MODIFY `id_lista` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
