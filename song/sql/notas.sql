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