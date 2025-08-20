-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-08-2025 a las 16:47:21
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
-- Estructura de tabla para la tabla `category_translations`
--

CREATE TABLE `category_translations` (
  `id` int(3) NOT NULL,
  `id_category` int(2) NOT NULL,
  `lang` varchar(5) NOT NULL,
  `lang_name` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `category_translations`
--

INSERT INTO `category_translations` (`id`, `id_category`, `lang`, `lang_name`, `name`) VALUES
(1, 1, 'en', 'english', 'At the end of church meeting'),
(2, 2, 'en', 'english', 'At the ordination'),
(3, 3, 'en', 'english', 'Baptism'),
(4, 4, 'en', 'english', 'Before church meeting'),
(5, 5, 'en', 'english', 'Bible stories'),
(6, 6, 'en', 'english', 'Call to repentance'),
(7, 7, 'en', 'english', 'Children and family'),
(8, 8, 'en', 'english', 'Christian joy'),
(9, 9, 'en', 'english', 'Christmas'),
(10, 10, 'en', 'english', 'Church'),
(11, 11, 'en', 'english', 'Consolation and encouragement'),
(12, 12, 'en', 'english', 'Determination and faithfulness'),
(13, 13, 'en', 'english', 'Following Christ'),
(14, 14, 'en', 'english', 'For new converts'),
(15, 15, 'en', 'english', 'Funeral'),
(16, 16, 'en', 'english', 'God, His love and greatness'),
(17, 17, 'en', 'english', 'Gospel'),
(18, 18, 'en', 'english', 'Harvest'),
(19, 19, 'en', 'english', 'Heavenly abode'),
(20, 20, 'en', 'english', 'Holy Ghost'),
(21, 21, 'en', 'english', 'Instruction and self-test'),
(22, 22, 'en', 'english', 'Jesus Christ'),
(23, 23, 'en', 'english', 'Journey of faith, faith and hope'),
(24, 24, 'en', 'english', 'Last days'),
(25, 25, 'en', 'english', 'Love'),
(26, 26, 'en', 'english', 'Mother'),
(27, 27, 'en', 'english', 'New Year'),
(28, 28, 'en', 'english', 'On the Lord’s Supper'),
(29, 29, 'en', 'english', 'Other'),
(30, 30, 'en', 'english', 'Practical life with God'),
(31, 31, 'en', 'english', 'Praise and thanksgiving'),
(32, 32, 'en', 'english', 'Prayer'),
(33, 33, 'en', 'english', 'Salvation'),
(34, 34, 'en', 'english', 'Spiritual struggle and victory'),
(35, 35, 'en', 'english', 'Suffering and death of Christ'),
(36, 36, 'en', 'english', 'Sunset / Sunrise'),
(37, 37, 'en', 'english', 'The resurrection of Christ'),
(38, 38, 'en', 'english', 'The Word of God'),
(39, 39, 'en', 'english', 'The call to work'),
(40, 40, 'en', 'english', 'The second coming of Christ and the judgment'),
(41, 41, 'en', 'english', 'Time'),
(42, 42, 'en', 'english', 'Various Christian holidays'),
(43, 43, 'en', 'english', 'Wedding'),
(44, 44, 'en', 'english', 'Welcome and farewell'),
(45, 45, 'en', 'english', 'Youth'),
(46, 46, 'en', 'english', 'Instrumental'),
(47, 47, 'en', 'english', 'Lullabies'),
(48, 48, 'en', 'english', 'Children\'s'),
(49, 49, 'en', 'english', 'Camp Songs'),
(50, 50, 'en', 'english', 'Healing'),
(51, 51, 'en', 'english', 'Forgiveness'),
(52, 52, 'en', 'english', 'Entry into Jerusalem'),
(53, 53, 'en', 'english', 'Ascension of the Lord'),
(54, 54, 'en', 'english', 'Easter'),
(55, 55, 'en', 'english', 'Trinity'),
(56, 1, 'es', 'español', 'Al final de la reunión de la iglesia'),
(57, 2, 'es', 'español', 'Para la ordenación'),
(58, 3, 'es', 'español', 'Bautismo'),
(59, 4, 'es', 'español', 'Antes de la reunión de la iglesia'),
(60, 5, 'es', 'español', 'Historias bíblicas'),
(61, 6, 'es', 'español', 'Llamado al arrepentimiento'),
(62, 7, 'es', 'español', 'Niños y familia'),
(63, 8, 'es', 'español', 'Gozo cristiano'),
(64, 9, 'es', 'español', 'Navidad'),
(65, 10, 'es', 'español', 'Iglesia'),
(66, 11, 'es', 'español', 'Consuelo y aliento'),
(67, 12, 'es', 'español', 'Determinación y fidelidad'),
(68, 13, 'es', 'español', 'Seguir a Cristo'),
(69, 14, 'es', 'español', 'Para los recién convertidos'),
(70, 15, 'es', 'español', 'Funerales'),
(71, 16, 'es', 'español', 'Dios, Su amor y grandeza'),
(72, 17, 'es', 'español', 'Evangelio'),
(73, 18, 'es', 'español', 'Cosecha'),
(74, 19, 'es', 'español', 'Morada celestial'),
(75, 20, 'es', 'español', 'Espíritu Santo'),
(76, 21, 'es', 'español', 'Instrucción y autoexamen'),
(77, 22, 'es', 'español', 'Jesucristo'),
(78, 23, 'es', 'español', 'Camino de fe, fe y esperanza'),
(79, 24, 'es', 'español', 'Últimos días'),
(80, 25, 'es', 'español', 'Amor'),
(81, 26, 'es', 'español', 'Mamá'),
(82, 27, 'es', 'español', 'Año Nuevo'),
(83, 28, 'es', 'español', 'Cena del Señor'),
(84, 29, 'es', 'español', 'Varios'),
(85, 30, 'es', 'español', 'Vida práctica con Dios'),
(86, 31, 'es', 'español', 'Alabanza y agradecimiento'),
(87, 32, 'es', 'español', 'Oración'),
(88, 33, 'es', 'español', 'Salvación'),
(89, 34, 'es', 'español', 'Lucha espiritual y victoria'),
(90, 35, 'es', 'español', 'Sufrimiento y muerte de Cristo'),
(91, 36, 'es', 'español', 'Atardecer / Amanecer'),
(92, 37, 'es', 'español', 'Resurrección de Cristo'),
(93, 38, 'es', 'español', 'Palabra de Dios'),
(94, 39, 'es', 'español', 'Llamado al trabajo'),
(95, 40, 'es', 'español', 'Segunda venida de Cristo y juicio'),
(96, 41, 'es', 'español', 'Tiempo'),
(97, 42, 'es', 'español', 'Diversas fiestas cristianas'),
(98, 43, 'es', 'español', 'Boda'),
(99, 44, 'es', 'español', 'Bienvenida y despedida'),
(100, 45, 'es', 'español', 'Juventud'),
(101, 46, 'es', 'español', 'Instrumental'),
(102, 47, 'es', 'español', 'Canciones de cuna'),
(103, 48, 'es', 'español', 'Infantiles'),
(104, 49, 'es', 'español', 'Canciones de campamento'),
(105, 50, 'es', 'español', 'Sanidad'),
(106, 51, 'es', 'español', 'Perdón'),
(107, 52, 'es', 'español', 'Entrada en Jerusalén'),
(108, 53, 'es', 'español', 'Ascensión del Señor'),
(109, 54, 'es', 'español', 'Pascua'),
(110, 55, 'es', 'español', 'Trinidad'),
(111, 1, 'ru', 'русский', 'В конце церковного собрания'),
(112, 2, 'ru', 'русский', 'На рукоположение'),
(113, 3, 'ru', 'русский', 'Крещение'),
(114, 4, 'ru', 'русский', 'Перед церковным собранием'),
(115, 5, 'ru', 'русский', 'Библейские истории'),
(116, 6, 'ru', 'русский', 'Призыв к покаянию'),
(117, 7, 'ru', 'русский', 'Дети и семья'),
(118, 8, 'ru', 'русский', 'Христианская радость'),
(119, 9, 'ru', 'русский', 'Рождество'),
(120, 10, 'ru', 'русский', 'Церковь'),
(121, 11, 'ru', 'русский', 'Утешение и ободрение'),
(122, 12, 'ru', 'русский', 'Решимость и верность'),
(123, 13, 'ru', 'русский', 'Следование за Христом'),
(124, 14, 'ru', 'русский', 'Для новообращённых'),
(125, 15, 'ru', 'русский', 'Похороны'),
(126, 16, 'ru', 'русский', 'Бог, Его любовь и величие'),
(127, 17, 'ru', 'русский', 'Евангелие'),
(128, 18, 'ru', 'русский', 'Жатва'),
(129, 19, 'ru', 'русский', 'Небесное обиталище'),
(130, 20, 'ru', 'русский', 'Дух Святой'),
(131, 21, 'ru', 'русский', 'Наставление и самоиспытание'),
(132, 22, 'ru', 'русский', 'Иисус Христос'),
(133, 23, 'ru', 'русский', 'Путь веры, вера и надежда'),
(134, 24, 'ru', 'русский', 'Последние дни'),
(135, 25, 'ru', 'русский', 'Любовь'),
(136, 26, 'ru', 'русский', 'Мама'),
(137, 27, 'ru', 'русский', 'Новый год'),
(138, 28, 'ru', 'русский', 'Вечеря Господня'),
(139, 29, 'ru', 'русский', 'Разное'),
(140, 30, 'ru', 'русский', 'Практическая жизнь с Богом'),
(141, 31, 'ru', 'русский', 'Хвала и благодарение'),
(142, 32, 'ru', 'русский', 'Молитва'),
(143, 33, 'ru', 'русский', 'Спасение'),
(144, 34, 'ru', 'русский', 'Духовная борьба и победа'),
(145, 35, 'ru', 'русский', 'Страдания и смерть Христа'),
(146, 36, 'ru', 'русский', 'Закат / Восход'),
(147, 37, 'ru', 'русский', 'Воскресение Христа'),
(148, 38, 'ru', 'русский', 'Слово Божье'),
(149, 39, 'ru', 'русский', 'Призыв к труду'),
(150, 40, 'ru', 'русский', 'Второе пришествие Христа и суд'),
(151, 41, 'ru', 'русский', 'Время'),
(152, 42, 'ru', 'русский', 'Различные христианские праздники'),
(153, 43, 'ru', 'русский', 'Свадьба'),
(154, 44, 'ru', 'русский', 'Приветствие и прощание'),
(155, 45, 'ru', 'русский', 'Молодёжь'),
(156, 46, 'ru', 'русский', 'Инструментал'),
(157, 47, 'ru', 'русский', 'Колыбельные'),
(158, 48, 'ru', 'русский', 'Детские'),
(159, 49, 'ru', 'русский', 'Лагерские'),
(160, 50, 'ru', 'русский', 'Исцеление'),
(161, 51, 'ru', 'русский', 'Прощение'),
(162, 52, 'ru', 'русский', 'Въезд в Иерусалим'),
(163, 53, 'ru', 'русский', 'Вознесение Господне'),
(164, 54, 'ru', 'русский', 'Пасхальные'),
(165, 55, 'ru', 'русский', 'Троица'),
(166, 1, 'ua', 'українська', 'Наприкінці церковного зібрання'),
(167, 2, 'ua', 'українська', 'На рукопокладення'),
(168, 3, 'ua', 'українська', 'Хрещення'),
(169, 4, 'ua', 'українська', 'Перед церковним зібранням'),
(170, 5, 'ua', 'українська', 'Біблійні історії'),
(171, 6, 'ua', 'українська', 'Заклик до покаяння'),
(172, 7, 'ua', 'українська', 'Діти та сім\'я'),
(173, 8, 'ua', 'українська', 'Християнська радість'),
(174, 9, 'ua', 'українська', 'Різдво'),
(175, 10, 'ua', 'українська', 'Церква'),
(176, 11, 'ua', 'українська', 'Утіха та підбадьорення'),
(177, 12, 'ua', 'українська', 'Рішучість і вірність'),
(178, 13, 'ua', 'українська', 'Слідування за Христом'),
(179, 14, 'ua', 'українська', 'Для новонавернених'),
(180, 15, 'ua', 'українська', 'Похорон'),
(181, 16, 'ua', 'українська', 'Бог, Його любов і велич'),
(182, 17, 'ua', 'українська', 'Євангеліє'),
(183, 18, 'ua', 'українська', 'Жнива'),
(184, 19, 'ua', 'українська', 'Небесне житло'),
(185, 20, 'ua', 'українська', 'Святий Дух'),
(186, 21, 'ua', 'українська', 'Настанови та самоперевірка'),
(187, 22, 'ua', 'українська', 'Ісус Христос'),
(188, 23, 'ua', 'українська', 'Шлях віри, віра і надія'),
(189, 24, 'ua', 'українська', 'Останні дні'),
(190, 25, 'ua', 'українська', 'Любов'),
(191, 26, 'ua', 'українська', 'Мама'),
(192, 27, 'ua', 'українська', 'Новий рік'),
(193, 28, 'ua', 'українська', 'Вечеря Господня'),
(194, 29, 'ua', 'українська', 'Різне'),
(195, 30, 'ua', 'українська', 'Практичне життя з Богом'),
(196, 31, 'ua', 'українська', 'Хвала і подяка'),
(197, 32, 'ua', 'українська', 'Молитва'),
(198, 33, 'ua', 'українська', 'Спасіння'),
(199, 34, 'ua', 'українська', 'Духовна боротьба і перемога'),
(200, 35, 'ua', 'українська', 'Страждання і смерть Христа'),
(201, 36, 'ua', 'українська', 'Захід / Схід сонця'),
(202, 37, 'ua', 'українська', 'Воскресіння Христа'),
(203, 38, 'ua', 'українська', 'Слово Боже'),
(204, 39, 'ua', 'українська', 'Заклик до праці'),
(205, 40, 'ua', 'українська', 'Друге пришестя Христа і суд'),
(206, 41, 'ua', 'українська', 'Час'),
(207, 42, 'ua', 'українська', 'Різні християнські свята'),
(208, 43, 'ua', 'українська', 'Весілля'),
(209, 44, 'ua', 'українська', 'Привітання та прощання'),
(210, 45, 'ua', 'українська', 'Молодь'),
(211, 46, 'ua', 'українська', 'Інструментальна'),
(212, 47, 'ua', 'українська', 'Колискові'),
(213, 48, 'ua', 'українська', 'Дитячі'),
(214, 49, 'ua', 'українська', 'Табірні'),
(215, 50, 'ua', 'українська', 'Зцілення'),
(216, 51, 'ua', 'українська', 'Прощення'),
(217, 52, 'ua', 'українська', 'В’їзд до Єрусалима'),
(218, 53, 'ua', 'українська', 'Вознесіння Господнє'),
(219, 54, 'ua', 'українська', 'Пасхальні'),
(220, 55, 'ua', 'українська', 'Трійця');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `category_translations`
--
ALTER TABLE `category_translations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `category_translations`
--
ALTER TABLE `category_translations`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=221;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
