function generarSQLInsertMultiple(datos) {
    let values = [];

    datos.forEach(item => {
        const song_number = item.number ?? 'NULL';
        const title = item.title ? `'${item.title.replace(/'/g, "''")}'` : "''";
        const category = item.category ?? 'NULL';
        const song_text = item.song_text ? `'${item.song_text.replace(/'/g, "''")}'` : "''";
        const tune = item.tune ? `'${item.tune.replace(/'/g, "''")}'` : "''";
        const count = item.count ?? 'NULL';
        const created_at = convertirFecha(item.date) ?? 'NULL';

        values.push(`(${song_number}, ${title}, ${category}, ${song_text}, ${tune}, ${count}, ${created_at})`);
    });

    const sql = `INSERT INTO songs (song_number, title, category, song_text, tune, count, created_at) VALUES ${values.join(',\r\n')};`;

    return sql;
}



