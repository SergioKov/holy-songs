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

    resetBlockEsquemaSoloHTML();
    resetBlockCancion();
    resetLineasXinBlock(eid_block_cancion);

}




function showOneSlideFrom(elementClicked, arr_esquema_bucle){
    console.log('=== function showOneSlideFrom() ===');
    console.log('elementClicked: ', elementClicked);

    if(elementClicked.dataset.titulo === '_titulo_cancion_'){
        //return;
    }

    const index_esquema = elementClicked.dataset.idx;
    console.log('index_esquema: ', index_esquema);

    const elementBtnSimple = wr_vista_btns.querySelector(`.btn_simple[data-idx="${index_esquema}"]`);
    console.log('elementBtnSimple: ', elementBtnSimple);

    const elementFieldset = song_bloques.querySelector(`fieldset[data-idx="${index_esquema}"]`);
    console.log('elementFieldset: ', elementFieldset);

    wr_vista_blocks.innerHTML = '';//reset
    wr_vista_blocks.removeAttribute('style');// quitar font-size anterior

    resetBtnActive(wr_vista_btns);//reseteo btn_active de botones en el contenedor
    elementBtnSimple.classList.add('btn_active');

    resetFldActive(song_bloques);//reseteo fieldset active de kuplet's a la izda
    elementFieldset.classList.add('fld_active');

    if(elementClicked === elementBtnSimple){
        console.log('es button -> btn_clicked ');
        elementFieldset.scrollIntoView({behavior: 'smooth', block: "center"});//btn clicked -> muevo fildset
    }else{
        console.log('es fieldset clicked');
        elementBtnSimple.scrollIntoView({behavior: 'smooth', block: "center"});//fieldset clicked -> muevo btn
    }
        
    const wr_full_block_inner = document.createElement('div');
    wr_full_block_inner.className = 'wr_full_block_inner';
    wr_vista_blocks.append(wr_full_block_inner);

    const el_fieldset_cloned = song_bloques.querySelectorAll('fieldset')[index_esquema].cloneNode(true); // true para clonar hijos

    //Primer slide
    if(elementClicked.dataset.titulo === '_titulo_cancion_' || index_esquema == 0){
        el_fieldset_cloned.querySelector('.song_titulo').textContent = '...';//muestro ... en vez del título del slide 1
    }

    //Ultimo slide
    if(index_esquema == arr_esquema_bucle.length - 1){
        const p = document.createElement('p');
        p.className = 'tres_estrellas';
        p.textContent = '* * *';
        el_fieldset_cloned.append(p);//muestro ... en vez del título del slide 1
    }

    wr_full_block_inner.append(el_fieldset_cloned);

    const contenedorSlideView = document.querySelector('.wr_full_block');

    ajustarTextoContenedor(contenedorSlideView);

    make_arr_pantalla(el_fieldset_cloned, arr_esquema_bucle);
}






function make_arr_pantalla(el_fieldset_cloned, arr_esquema_bucle){
    console.log('=== function make_arr_pantalla() ===');

    arr_pantalla = [];//reset   
    let song_text = '';
    let arr_p_text = [];

    let p_textAll = el_fieldset_cloned.querySelectorAll('p.t');//solo texto
    console.log('p_textAll: ', p_textAll);

    p_textAll.forEach((p, i, arr) => {
        console.log('p: ', p);
        song_text += p.innerHTML;
        if(i != arr.length - 1){
            song_text += '<br>';
        }
        //arr_p_text.push(p.textContent);
    });

    //si es ultimo slide
    if(el_fieldset_cloned.dataset.idx == arr_esquema_bucle.length - 1){
        song_text += `<span class="tres_estrellas">* * *</span>`;
    }

    if(p_textAll.length == 0){//si no se encuentra el verse, no hago nada
        //alert('no hay texto en la diapositiva seleccionada. pero sigo...');
        let hay_song_titulo = el_fieldset_cloned.querySelector('.song_titulo');
        if(hay_song_titulo){
            song_text += `
                <div class="wr_d_puntos">
                    <p>...</p>
                </div>
            `;
        }

        let p_acordeAll = el_fieldset_cloned.querySelectorAll('p.c');
        if(p_acordeAll.length > 0){
            song_text += `
                <div class="wr_d_music">
                    <img src="images/notas_de_musica_grey.svg">
                </div>
            `;
        }
    }


    let pantalla = {
        //tipo_content: 'song_text',
        //arr_p_text: arr_p_text,
        //fieldset_html: el_fieldset_cloned.outerHTML,
        song_text: song_text
    };
    console.log('pantalla: ', pantalla);

    arr_pantalla.push(pantalla);
    console.log('arr_pantalla: ', arr_pantalla);

    let arr_pantalla_string = JSON.stringify(arr_pantalla);

    localStorage.setItem('arr_pantalla',arr_pantalla_string);

    //buildArrPantallaDesktop(arr_pantalla);
}


function enableDisablePantallaShow(){//muestra 
    if(pantallaShow){
        pantallaShow = false;//siguiente accion
    }else{        
        pantallaShow = true;//siguiente accion
    }
    check_pantallaShow();
}

function check_pantallaShow(){
    //console.log('=== function check_pantallaShow() ===');
    //console.log('pantallaShow: ', pantallaShow);

    if(pantallaShow){
        mostrar_pantallaShow();
    }else{
        ocultar_pantallaShow();
    }
}

function mostrar_pantallaShow(){
    const eid_btn_pantallaShow = document.querySelector('#btn_pantallaShow');
    eid_btn_pantallaShow.classList.add('btn_active');

    // eid_btn_pantallaShow.classList.add('btn_active');
    // eid_vklad_btn_pantallaShow.classList.add('btn_active');
    //eid_contenedor.classList.add('shown');
    //eid_fondo_body.classList.add('fondo_black');

    localStorage.setItem('pantallaShow','true');

    //make_arr_pantalla(act_show_verse);
}

function ocultar_pantallaShow(){
    const eid_btn_pantallaShow = document.querySelector('#btn_pantallaShow');
    eid_btn_pantallaShow.classList.remove('btn_active');

    // eid_btn_pantallaShow.classList.remove('btn_active');
    // eid_vklad_btn_pantallaShow.classList.remove('btn_active');
    //eid_contenedor.classList.remove('shown');
    //eid_fondo_body.classList.remove('fondo_black');
    
    localStorage.setItem('pantallaShow','false');
}












