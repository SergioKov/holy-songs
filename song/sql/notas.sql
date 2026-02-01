-- cambiar collation de las tablas
ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE category_translations CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE listas CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE songs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE song_book CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;













ALTER TABLE songs
ADD CONSTRAINT fk_songs_categories
FOREIGN KEY (category) REFERENCES categories(id_category)
ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE songs
ADD CONSTRAINT fk_songs_songbooks
FOREIGN KEY (songbook) REFERENCES songbooks(id_songbook)
ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE category_translations
ADD CONSTRAINT fk_category_translations_categories
FOREIGN KEY (id_category) REFERENCES categories(id_category)
ON DELETE CASCADE ON UPDATE CASCADE;






CREATE TABLE listas_songs (
    id_lista_song INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_lista INT NOT NULL,
    id_song INT NOT NULL,
    FOREIGN KEY (id_lista) REFERENCES listas(id_lista) ON DELETE CASCADE,
    FOREIGN KEY (id_song) REFERENCES songs(id_song) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE listas_songs (
    id_lista INT NOT NULL,
    id_song INT NOT NULL,
    PRIMARY KEY (id_lista, id_song),
    FOREIGN KEY (id_lista) REFERENCES listas(id_lista) ON DELETE CASCADE,
    FOREIGN KEY (id_song) REFERENCES songs(id_song) ON DELETE CASCADE
) ENGINE=InnoDB;



INSERT INTO listas_songs (id_lista, id_song) VALUES
(5, 951),
(5, 893),
(5, 1304),
(5, 1321),
(5, 456)
;

INSERT INTO listas_songs (id_lista, id_song) VALUES
(24, 484),
(24, 490),
(24, 1175)
;



SELECT 
    l.id_lista, l.title, l.arr_lista , l.notes,
    s.id_song, s.title, s.notes  
FROM (songs s, listas l) 
JOIN listas_songs ls ON s.id_song = ls.id_song 
WHERE l.id_lista = 25 and ls.id_lista = 25
ORDER BY ls.ordenar asc
;



---------------------------------------------------------------------

-- scripts SQL ---

ALTER TABLE songs
ADD COLUMN song_text_search TEXT AFTER song_text;


UPDATE songs
SET song_text_search =
  REGEXP_REPLACE(
    TRIM(
      REGEXP_REPLACE(
        LOWER(
          -- 1) proteger apóstrofe entre letras
          REGEXP_REPLACE(
            REPLACE(
            REPLACE(
            REPLACE(
            REPLACE(
            REPLACE(song_text,'á','a'),
            'é','e'),
            'í','i'),
            'ó','o'),
            'ú','u'),
            '([[:alpha:]])''([[:alpha:]])',
            '\\1§§§\\2'
          )
        ),
        -- 2) quitar puntuación
        '[^[:alnum:] ñüА-Яа-яЁёІіЇїЄєҐґ§]',
        ' '
      )
    ),
    ' +',
    ' '
  );

-- 3) restaurar apóstrofe protegido
UPDATE songs
SET song_text_search = REPLACE(song_text_search, '§§§', '''');







ALTER TABLE `songs` CHANGE `title` `title` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;

ALTER TABLE songs
ADD COLUMN title2 VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL AFTER title;

ALTER TABLE songs
ADD COLUMN title_note VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL AFTER title2;

ALTER TABLE songs
ADD COLUMN title_search TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL AFTER title_note;



UPDATE songs
SET title_search =
  REGEXP_REPLACE(
    TRIM(
      REGEXP_REPLACE(
        LOWER(
          -- 1) proteger apóstrofe entre letras
          REGEXP_REPLACE(
            REPLACE(
            REPLACE(
            REPLACE(
            REPLACE(
            REPLACE(title,'á','a'),
            'é','e'),
            'í','i'),
            'ó','o'),
            'ú','u'),
            '([[:alpha:]])''([[:alpha:]])',
            '\\1§§§\\2'
          )
        ),
        -- 2) quitar puntuación
        '[^[:alnum:] ñüА-Яа-яЁёІіЇїЄєҐґ§]',
        ' '
      )
    ),
    ' +',
    ' '
  );

-- 3) restaurar apóstrofe protegido
UPDATE songs
SET title_search = REPLACE(title_search, '§§§', '''');