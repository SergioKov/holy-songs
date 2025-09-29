-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-09-2025 a las 17:49:01
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
  `arr_pantalla` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pantalla_show` int(1) NOT NULL DEFAULT 0,
  `show_logo_en_fondo` int(1) NOT NULL DEFAULT 0,
  `show_legend` int(1) NOT NULL DEFAULT 0,
  `show_acordes` int(1) NOT NULL DEFAULT 0,
  `show_next_slide` int(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `songslides`
--

INSERT INTO `songslides` (`id_songslide`, `id_user`, `ip_user`, `id_song`, `slide_actual`, `arr_pantalla`, `pantalla_show`, `show_logo_en_fondo`, `show_legend`, `show_acordes`, `show_next_slide`, `created_at`, `updated_at`) VALUES
(1, 1, '127.0.0.1', 8050, 10, '[{\"tipo_content\":\"slide_text\",\"id_song\":\"8050\",\"slide_actual\":10,\"slide_text\":\"<div class=__||__wr_d_line__||__><div class=__||__d_line d_legend__||__><div>Кода:</div></div><div class=__||__d_line c__||__><span class=__||__barra__||__>|</span><span class=__||__acorde__||__ data-original=__||__Hm__||__>Hm</span><span class=__||__espacio__||__ data-length=__||__2__||__>  </span><span class=__||__acorde__||__ data-original=__||__G__||__>G</span><span class=__||__espacio__||__ data-length=__||__3__||__>   </span><span class=__||__barra__||__>|</span><span class=__||__acorde__||__ data-original=__||__D__||__>D</span><span class=__||__espacio__||__ data-length=__||__3__||__>   </span><span class=__||__barra__||__>|</span></div><div class=__||__d_line b__||__> ..  ..   ....</div><div class=__||__d_line c__||__><span class=__||__barra__||__>|</span><span class=__||__acorde__||__ data-original=__||__Hm__||__>Hm</span><span class=__||__espacio__||__ data-length=__||__2__||__>  </span><span class=__||__acorde__||__ data-original=__||__G__||__>G</span><span class=__||__espacio__||__ data-length=__||__3__||__>   </span><span class=__||__barra__||__>|</span><span class=__||__acorde__||__ data-original=__||__A__||__>A</span><span class=__||__espacio__||__ data-length=__||__3__||__>   </span><span class=__||__barra__||__>|</span></div><div class=__||__d_line b__||__> ..  ..   ....</div><div class=__||__d_line c__||__><span class=__||__barra__||__>|</span><span class=__||__acorde__||__ data-original=__||__Hm__||__>Hm</span><span class=__||__espacio__||__ data-length=__||__2__||__>  </span><span class=__||__acorde__||__ data-original=__||__G__||__>G</span><span class=__||__espacio__||__ data-length=__||__3__||__>   </span><span class=__||__barra__||__>|</span><span class=__||__acorde__||__ data-original=__||__D__||__>D</span><span class=__||__espacio__||__ data-length=__||__3__||__>   </span><span class=__||__barra__||__>|</span></div><div class=__||__d_line b__||__> ..  ..   ....</div><div class=__||__d_line c__||__><span class=__||__barra__||__>|</span><span class=__||__acorde__||__ data-original=__||__Hm__||__>Hm</span><span class=__||__espacio__||__ data-length=__||__2__||__>  </span><span class=__||__acorde__||__ data-original=__||__G__||__>G</span><span class=__||__espacio__||__ data-length=__||__1__||__> </span><span class=__||__acorde__||__ data-original=__||__A__||__>A</span><span class=__||__espacio__||__ data-length=__||__1__||__> </span><span class=__||__barra__||__>|</span><span class=__||__acorde__||__ data-original=__||__Hm__||__>Hm</span><span class=__||__espacio__||__ data-length=__||__2__||__>  </span><span class=__||__barra__||__>|</span></div><div class=__||__d_line b__||__> ..  . .  ....</div><span class=__||__tres_estrellas__||__>* * *</span><div class=__||__wr_d_music__||__><img src=__||__images/notas_de_musica_grey.svg__||__></div></div>\",\"pantalla_show\":true}]', 0, 0, 0, 0, 0, '2025-09-23 18:52:35', '2025-09-29 15:35:11');

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
