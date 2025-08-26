-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-08-2025 a las 17:23:01
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
-- Estructura de tabla para la tabla `songbooks`
--

CREATE TABLE `songbooks` (
  `id_songbook` int(3) NOT NULL,
  `title` varchar(255) NOT NULL,
  `info` text NOT NULL,
  `notes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `songbooks`
--

INSERT INTO `songbooks` (`id_songbook`, `title`, `info`, `notes`) VALUES
(1, 'Євангельскі Пісні', '(c) Всеукраїнський Союз об\'єднань ЕХБ, 1997; Київ', '0_Evangelsi_pisni.sps'),
(2, 'Пiснi Спасенних', 'Издательство «Христианин» 2003 \r\nТексты псалмов набраны: \r\nБорщаговка МСЦ ЕХБ, Украина, г. Киев, ул. Октябрьская 94. \r\nЕсли вы нашли ошибку, пожалуйста, уведомите по адресу: \r\nm.vetas@gmail.com \r\nСпасибо.\r\n\r\nPublishing house \"Christian\" 2003 \r\nThe texts of the psalms recruited by: \r\nBorschagovka MSC EHB, Ukraine, Kiev, st. Oktyabrskaya 94. \r\nIf you find a bug, please send an email to:  m.vetas@gmail.com \r\nThanks.', '1_Pisni_spasennyj.sps'),
(3, 'Псалмоспіви', 'PIBHE 2001\r\nChristian Mission EBENEZER\r\n288 Masterson Station Dr.\r\nLexington, KY 40511', '2_Psalmospivy_ukr.sps'),
(4, 'Временный (укр.)', 'тут пісні українською з папки Временный', '3_Vremenny.sps'),
(5, 'Временный (рос.)', 'тут пісні російскою з папки Временный', '3_Vremenny.sps'),
(6, 'Временный (esp.)', 'тут пісні іспанською з папки Временный', '3_Vremenny.sps'),
(7, 'Пісні із Папок', 'Пісні із хорових папок (змішані мови)', '4_Pisni_iz_papok.sps'),
(8, '7_vacio', '9 пісень на різні теми', ''),
(9, '10_español', '1 cancion - Yahwé, Rafá...', ''),
(10, 'Святий', '1 пісня - Святий, Святий, Святий,', ''),
(11, 'Псалмоспіви Львів', 'Львів УХМВМ \"Добрий самарянин\"', '5_Psalmospivy_Lviv.sps'),
(12, 'Песнь Возрождения 3300', '(c) И.П. Костюков, 2008; Москва, www.sirinbook.ru\r\n\r\nПоследнии исправления были сделаны 13 ноября 2011.', '6_Pesn_Vozrozhdeniya_3300_rus.sps'),
(13, 'Ahora (mix)', 'mix de canciones', 'Ahora_33_canciones_mix.sps'),
(14, 'Звуки Неба 2010 (mix)', 'Сборник молодежных песен церкви \"Concord\" (Portland, OR)', 'zvuki_neba_2010.sps'),
(15, 'Песнь возрождения Совета Церквей', 'http://www.blagovestnik.org/songs/\r\nUpdated on 11/24/11 - category update.\r\n\r\n(аккорды на немецком языке)', 'pesn_vozr_sovet_tserkvey.sps');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `songbooks`
--
ALTER TABLE `songbooks`
  ADD PRIMARY KEY (`id_songbook`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `songbooks`
--
ALTER TABLE `songbooks`
  MODIFY `id_songbook` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
