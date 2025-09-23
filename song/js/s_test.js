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


function mostrarElemento(elemento){
    if(!elemento) return;
    elemento.classList.remove('d-none');
    elemento.classList.add('d-block');
}
function ocultarElemento(elemento){
    if(!elemento) return;
    elemento.classList.remove('d-block');
    elemento.classList.add('d-none');
}


function mostrarElementosPrimEn(elemento){
    if(!elemento) return;
    elemento.querySelector('.opt_prim').classList.remove('d-none');
    elemento.querySelector('.opt_prim').classList.add('d-block');
}
function ocultarElementosPrimEn(elemento){
    if(!elemento) return;
    elemento.querySelector('.opt_prim').classList.remove('d-block');
    elemento.querySelector('.opt_prim').classList.add('d-none');
}


function mostrarElementosEditablesEn(elemento){
    if(!elemento) return;
    elemento.classList.remove('prim_shown');
    elemento.classList.add('edit_shown');
}
function ocultarElementosEditablesEn(elemento){
    if(!elemento) return;
    elemento.classList.remove('edit_shown');
}














async function guardarSongPantallaEnBd(){
    console.log('=== function guardarSongPantallaEnBd() ===');

    try {
    
        id_song = objSong.id_song;
        console.log('id_song: ', id_song);

        if(!id_song){
            alert('en guardarSongPantallaEnBd() --- id_song no está indicado... hago return.');
        }

        const data = await insertarSongPantalla();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'id_song insertado con éxito.';
            console.log(text_show);

            showToast('ok', text_show, 5000);

            if(data.id_song){
                console.log('id_song: ', data.id_song);
            }
            
        }else{
            
            let text_show = 'Error al insertar id_song.';
            console.error('text_show: ', text_show);

            showToast('ok', text_show, 5000);
        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarSongPantallaEnBd(). error: ',error);        
    }

}


async function guardarArrPantallaEnBd(){
    console.log('=== function guardarArrPantallaEnBd() ===');

    try {
    
        id_song = objSong.id_song;
        console.log('id_song: ', id_song);

        if(arr_pantalla.length == 0){
            alert('en guardarArrPantallaEnBd() --- arr_pantalla es vacio... hago return.');
        }

        const data = await insertarArrPantalla();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'id_song insertado con éxito.';
            console.log(text_show);

            showToast('ok', text_show, 5000);

            if(data.id_song){
                console.log('id_song: ', data.id_song);
            }
            
        }else{
            
            let text_show = 'Error al insertar id_song.';
            console.error('text_show: ', text_show);

            showToast('ok', text_show, 5000);
        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarArrPantallaEnBd(). error: ',error);        
    }

}



// no funciona correctamente...
// async function getPublicIP() {
//   const res = await fetch('https://api.ipify.org?format=json');
//   const data = await res.json();
//   return data.ip; // e.g. "203.0.113.45"
// }



