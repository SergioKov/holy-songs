function generarSQLInsertMultiple(datos, id_songbook, lang_val) {
    let values = [];

    datos.forEach(item => {
        
        const song_number = item.number ?? 'NULL';
        const title = item.title ? `'${item.title.replace(/'/g, "''")}'` : "''";
        const category = item.category ?? 0;
        const songbook = item.songbook ?? id_songbook;//mirar en bd
        const song_text = item.song_text ? `'${item.song_text.replace(/'/g, "''")}'` : "''";
        const tune = item.tune ? `'${item.tune.replace(/'/g, "''")}'` : "''";
        const words = item.words ? `'${item.words.replace(/'/g, "''")}'` : "''";
        const music = item.music ? `'${item.music.replace(/'/g, "''")}'` : "''";
        const notes = item.notes ? `'${item.notes.replace(/'/g, "''")}'` : "''";
        const lang = `'${lang_val}'` ?? "''";//fijate en el nombre de songbook
        const count = item.count ?? 0;
        const created_at = convertirFecha(item.date) ?? 'NULL';

        values.push(`(${song_number}, ${title}, ${category}, ${songbook}, ${song_text}, ${tune}, ${words}, ${music}, ${notes}, ${lang}, ${count}, ${created_at})`);
    });

    const sql = `INSERT INTO songs (song_number, title, category, songbook, song_text, tune, words, music, notes, lang, count, created_at) VALUES ${values.join(',\r\n')};`;

    return sql;
}



