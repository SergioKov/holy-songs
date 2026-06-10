-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-06-2026 a las 18:31:30
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
-- Estructura de tabla para la tabla `images`
--

CREATE TABLE `images` (
  `id_image` int(10) UNSIGNED NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `filepath` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int(10) UNSIGNED DEFAULT NULL,
  `file_hash` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL,
  `id_iglesia` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `images`
--

INSERT INTO `images` (`id_image`, `filename`, `is_active`, `filepath`, `mime_type`, `file_size`, `file_hash`, `id_user`, `id_iglesia`, `created_at`) VALUES
(37, 'IMG_0803.PNG', 1, 'uploads/fondos/1/bg_6a2990f8294d99.54057521.png', 'image/png', 3250335, '86ca07d24b7fa33a7d188e5ce1660953490917cceff4417ba7c6e02696205d40', 1, 1, '2026-06-10 18:29:44'),
(38, 'IMG_0805.PNG', 0, 'uploads/fondos/1/bg_6a299101b121f1.05922243.png', 'image/png', 2114849, 'deea447d0a87322b65b2164a8abb7869dbecd9d54bc475fdd0ef64ce69d24bbf', 1, 1, '2026-06-10 18:29:53'),
(39, 'IMG_0806.PNG', 0, 'uploads/fondos/1/bg_6a299107084df7.63911905.png', 'image/png', 2275253, '44d9eeb76ceff94b5c444c857859eae809ab2e7cb0260bcb33d498afbccddf91', 1, 1, '2026-06-10 18:29:59'),
(40, 'IMG_0808.PNG', 0, 'uploads/fondos/1/bg_6a29910ee8ec34.47785772.png', 'image/png', 1997172, '75ba6eaecdfb35ec820092b96fd551ff527e812aff91fc89d4bbdc76fbbd3264', 1, 1, '2026-06-10 18:30:06'),
(41, 'hs_login.png', 0, 'uploads/fondos/1/bg_6a299115acdd34.09461379.png', 'image/png', 1695824, '5c51986c557cfdf9578e0a331963eaa5cfa891a5c7e7ccf163001877398153a6', 1, 1, '2026-06-10 18:30:13');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id_image`),
  ADD UNIQUE KEY `idx_file_hash` (`file_hash`),
  ADD KEY `idx_id_user` (`id_user`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `images`
--
ALTER TABLE `images`
  MODIFY `id_image` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
