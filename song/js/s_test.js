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




async function getSong(id_song){
    const obj = await getDataSongFromBd();//IMPORTANTE para cojer todos los datos necesarios
    console.log('(getSong) --- obj: ', obj);
}


async function getLista(id_lista_pram){
    id_lista = id_lista_pram;
    const obj = await getDataListaFromBd();//IMPORTANTE para cojer todos los datos necesarios
    console.log('(getLista) --- obj: ', obj);
}























//click sobre Book, Chapter, Verse en vklad_nav de sidebar
function clickLCR(e, param, id_contenedor, cols_number = 2, esquema_vklad = null){
    console.log('=== function clickLCR() ===');

    const contenedor = document.getElementById(id_contenedor);//'block_buscar', 'block_esquema'
    let contenedorBtns ;//'#block_buscar_head .wr_lcr'
    let contenedorBlocks;
    
    if(id_contenedor == 'block_esquema' && esquema_vklad){
        switch (esquema_vklad) {
            default:
            case 'ver_esquema':
                contenedorBtns = contenedor.querySelector(`#${id_contenedor}_head .vklad_ver_esquema .wr_lcr`);
                contenedorBlocks = contenedor.querySelector(`#${id_contenedor}_body .vklad_ver_esquema`);
                break;
                
            case 'crear_esquema':
                contenedorBtns = contenedor.querySelector(`#${id_contenedor}_head .vklad_crear_esquema .wr_lcr`);
                contenedorBlocks = contenedor.querySelector(`#${id_contenedor}_body .vklad_crear_esquema`);
                break;
                
            case 'select_slide':
                contenedorBtns = contenedor.querySelector(`#${id_contenedor}_head .vklad_select_slide .wr_lcr`);
                contenedorBlocks = contenedor.querySelector(`#${id_contenedor}_body .vklad_select_slide`);
                break;        
        }
    }else{
        contenedorBtns = contenedor.querySelector(`#${id_contenedor}_head  .wr_lcr`);//'#block_buscar_head .wr_lcr'
        contenedorBlocks = contenedor.querySelector(`#${id_contenedor}_body`);//'#block_buscar_body'
    }
    
    resetLcrActiveEn(contenedorBtns);
    e.classList.add('lcr_active');

    resetLineActiveEn(contenedorBtns);
    resetBlActiveEn(contenedorBlocks);
        
    const ecl_lcr_line = contenedorBtns.querySelector('.lcr_line');

    switch (param) {
        default:
        case 'l': //Select Block Left
            ecl_lcr_line.classList.add( (cols_number == 2) ? 'line_2l' : 'line_3l');
            contenedorBlocks.querySelector('.bl_parte_l').classList.add('bl_active');
            break;
    
        case 'c': //Select Block Central
            ecl_lcr_line.classList.add( (cols_number == 2) ? 'line_2c' : 'line_3c');
            contenedorBlocks.querySelector('.bl_parte_c').classList.add('bl_active');
            break;
    
        case 'r': //Select Block Right
            ecl_lcr_line.classList.add( (cols_number == 2) ? 'line_2r' : 'line_3r');
            contenedorBlocks.querySelector('.bl_parte_r').classList.add('bl_active');
            break;
    }

    switch (id_contenedor) {
        default:
        case 'block_buscar':
            mySizeBuscar();
            break;

        case 'block_esquema':
            mySizeEsquema();
            break;

        case 'block_cancion':
            mySizeCancion();
            break;

        case 'block_ejemplo':
            mySizeEjemplo();
            break;

        case 'block_lista':
            mySizeLista();
            break;
    }

}


function resetBlActiveEn(contenedor){
    console.log('contenedor:' , contenedor);
    contenedor.querySelectorAll('.partes').forEach(bl => {
        console.log('bl:' , bl);
        
        bl.classList.remove('bl_active');
    })
}

function resetLcrActiveEn(contenedor){
    console.log('contenedor:' , contenedor);
    
    //Botones grandes arriba de seleccionar: 'bl_parte_l', 'bl_parte_c', 'bl_parte_r'
    contenedor.querySelectorAll('.v_lcr').forEach(v_lcr => {
        console.log('v_lcr:' , v_lcr);
        v_lcr.classList.remove('lcr_active');
    });
}

function resetLineActiveEn(contenedor){
    const lcr_line = contenedor.querySelector('.lcr_line');
    console.log('contenedor:' , contenedor);
    console.log('lcr_line:' , lcr_line);

    const arr_line_clases = ['line_2l','line_2r', 'line_3l','line_3c','line_3r'];
    arr_line_clases.forEach(cl => {
        console.log('cl:' , cl);
        if(lcr_line.classList.contains(cl)){
            lcr_line.classList.remove(cl);
        }                
    })
}