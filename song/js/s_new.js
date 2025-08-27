//============================================================//
//aki nuevas funciones
//============================================================//


function pintSongActive(e, arr, arr_words){//click en tr de la tabla de canciones
    console.log('=== function pintSongActive(e) === ');

    console.log('e.currentTarget: ', e.currentTarget);

    id_song = e.currentTarget.dataset.id;
    console.log('asigno global --- id_song: ', id_song);

    resetTrSelected(tbody);
    e.currentTarget.classList.add('selected');

    //song_text
    const vista_song_content = eid_block_buscar.querySelector('.vista_song_content');
    vista_song_content.innerHTML = '';//reset

    const wr_btns_action = document.querySelector('.wr_btns_action');
    wr_btns_action.innerHTML = `
        <button class="btn" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</button>
        <button class="btn" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</button>
        <button class="btn" onclick="showBlockName('cancion'); editar_song('ver');">Ver canción</button>
        <button class="btn" onclick="showBlockName('cancion'); editar_song('editar');">Editar canción</button>
        <button class="btn" onclick="showBlockName('cancion'); eliminar_song();">Eliminar canción</button>
        <button class="btn" onclick="crearSlides()">Crear slides</button>
        <button class="btn" onclick="crearSlides(); closeAll()">Crear slides + Ver</button>
        <button class="btn" onclick="addToLista();">Añadir a la Lista</button>
    `;

    //dejo '==' en vez de '===' porque id_song viene como string "925"
    objSong = arr.find(s => s.id_song == id_song);
    console.log('objSong: ', objSong);

    const regex = new RegExp(`(${arr_words.join('|')})`, 'gi');//busco las palabras del input
    console.log('regex: ', regex);

    let vista_html = '';

    if(objSong.id_song){
        //Marco en rojo las palabras encontradas en title 
        let id_song_text_red = objSong.id_song.toString().replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        let song_number_text_red = '...';

        if(objSong.song_number){
            //Marco en rojo las palabras encontradas en title 
            song_number_text_red = objSong.song_number.toString().replace(regex, (x) => {
                return `<b class="c_red">${x}</b>`;
            });
        }

        vista_html += `
            <p class="p_titulo disp_flex">
                <span>Id: <b>${id_song_text_red}</b></span>
                <span>Número: <b>${song_number_text_red}</b></span>
            </p>
        `;
    }

    if(objSong.title){
        //Marco en rojo las palabras encontradas en title 
        let titulo_text_red = objSong.title.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        vista_html += `
            <p class="p_titulo">Título Canción:</p>
            <p class="texto_norm t_big">${titulo_text_red}</p>
        `;
    }

    if(objSong.category_name){
        //Marco en rojo las palabras encontradas en title 
        let category_name_text_red = objSong.category_name.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        vista_html += `
            <p class="p_titulo">Categoría:</p>
            <p class="texto_norm t_big">${category_name_text_red}</p>
        `;
    }

    if(objSong.songbook_title){
        //Marco en rojo las palabras encontradas en title 
        let songbook_title_text_red = objSong.songbook_title.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        vista_html += `
            <p class="p_titulo">Songbook:</p>
            <p class="texto_norm t_big">${songbook_title_text_red}</p>
        `;
    }

    if(objSong.song_text){
        //Marco en rojo las palabras encontradas en song_text 
        let song_text_red = objSong.song_text.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        vista_html += `
            <p class="p_titulo">Texto:</p>
            <div class="texto_pre">${song_text_red}</div>
        `;
    }

    if(objSong.notes){
        //Marco en rojo las palabras encontradas en notes 
        let notas_text_red = objSong.notes.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        vista_html += `
            <p class="p_titulo">Notas:</p>
            <p class="texto_norm">${notas_text_red}</p>
        `;
    }

    if( esString(objSong.arr_esquema) && objSong.arr_esquema != ''){
        objSong.arr_esquema = JSON.parse(objSong.arr_esquema);
        if(objSong.arr_esquema.length > 0){
            vista_html += `
                <p class="p_titulo">Esquema:</p>
                <p class="texto_norm">Sí</p>
            `;
        }
    }


    vista_song_content.innerHTML = vista_html;

    resetBlockCancion();
    resetLineasXinBlock(eid_block_cancion);

}













