-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-08-2025 a las 16:47:39
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
(1, 'ggg zzz 444', 'dgkghkghkgd', '', '2025-08-09', '2025-08-02 00:00:00', '2025-08-20 09:25:00'),
(2, 'lololo zzz', 'otra nota...', '', '0000-00-00', '2025-08-02 17:31:43', '0000-00-00 00:00:00'),
(3, 'lululu zzz uuuuuuuuuuuuuuuuuuuuuuuuuuu', 'algun texto aki...', '', '2025-08-23', '2025-08-02 17:33:25', '2025-08-19 16:51:56'),
(4, 'fghkfghkghkk', 'grfghkfghk', '', '2025-08-19', '2025-08-19 15:42:50', NULL),
(5, 'gfhjlfhjlfhjl', 'hjlfjhljhlfhjl', '', '2025-08-21', '2025-08-19 15:48:10', NULL),
(7, '222 zzz', 'dfhsfhsf', '[{\"id_song\":380,\"song_number\":1068,\"title\":\"І в голос і в Як злі підходять\",\"tune\":\"\"},{\"id_song\":191,\"song_number\":200,\"title\":\"Блаженні вбогі духом бо їхнє Царство Боже\",\"tune\":\"\"}]', '2025-08-10', '2025-08-19 16:20:16', '2025-08-19 16:37:10'),
(8, '333 zzz aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'afhfsdh', '[{\"id_song\":1076,\"song_number\":558,\"title\":\"Біблія світло Боже засвітила\",\"tune\":\"\"},{\"id_song\":634,\"song_number\":115,\"title\":\"Бажаю все Тебе о Боже мій\",\"tune\":\"\"},{\"id_song\":1175,\"song_number\":659,\"title\":\"Блудний син\",\"tune\":\"\"}]', '2025-08-01', '2025-08-19 16:39:15', '2025-08-19 16:51:19'),
(9, 'nueva zzz lista', 'adfhah', '[{\"id_song\":484,\"song_number\":1181,\"title\":\"А ти шукай Христа Ідучи по дорозі\",\"tune\":\"\"},{\"id_song\":1307,\"song_number\":796,\"title\":\"Бажаю я щоб весь мій дім\",\"tune\":\"\"},{\"id_song\":1183,\"song_number\":667,\"title\":\"Боже славимо Тебе\",\"tune\":\"\"}]', '2025-08-28', '2025-08-19 16:54:42', NULL),
(10, 'new2 zzz', 'dfgfgdfhgkfhk', '', '2025-08-21', '2025-08-19 17:00:48', NULL),
(11, 'new3 zzz', 'egrjgrju', '[{\"id_song\":684,\"song_number\":165,\"title\":\"Із ран Спасителя текла струмком пречиста кров\",\"tune\":\"\"},{\"id_song\":634,\"song_number\":115,\"title\":\"Бажаю все Тебе о Боже мій\",\"tune\":\"\"},{\"id_song\":191,\"song_number\":200,\"title\":\"Блаженні вбогі духом бо їхнє Царство Боже\",\"tune\":\"\"},{\"id_song\":1076,\"song_number\":558,\"title\":\"Біблія світло Боже засвітила\",\"tune\":\"\"}]', '2025-08-22', '2025-08-19 17:03:01', NULL),
(12, 'new 4 vacio zzz', 'sadfhjsadfhash', '', '2025-08-14', '2025-08-19 17:03:39', NULL),
(13, 'hay 2 canciones zzz', 'sfgngjsfg', '', '2025-08-08', '2025-08-19 17:05:47', NULL),
(14, 'no hay canciones', '', '', '2025-08-21', '2025-08-19 17:06:22', NULL),
(15, 'otra vacia lista - decode zzz', '', '', '2025-08-20', '2025-08-19 17:10:29', NULL),
(16, 'otra llena lista - decode', 'hay 2 canciones', '[{\"id_song\":1076,\"song_number\":558,\"title\":\"Біблія світло Боже засвітила\",\"tune\":\"\"},{\"id_song\":456,\"song_number\":1152,\"title\":\"А нас манят \",\"tune\":\"\"}]', '2025-08-29', '2025-08-19 17:11:21', NULL),
(17, 'otraaaaaaaaaaa  zzz lista vacia 777', 'sfgjsfgj', '', '2025-08-24', '2025-08-19 17:18:34', NULL),
(18, 'zzz otra llena lista 777 con 2 canciones', 'sdgndgj', '[{\"id_song\":684,\"song_number\":165,\"title\":\"Із ран Спасителя текла струмком пречиста кров\",\"tune\":\"\"},{\"id_song\":634,\"song_number\":115,\"title\":\"Бажаю все Тебе о Боже мій\",\"tune\":\"\"}]', '2025-08-24', '2025-08-19 17:19:26', NULL);

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
  MODIFY `id_lista` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
