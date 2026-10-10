//============================================================//
//aki nuevas funciones
//============================================================//


function pintSongActive(){//click en tr de la tabla de canciones
    console.log('=== function pintSongActive(e) === ');

    console.log('asignado global --- id_song: ', id_song);

    //resetTrSelected(tbody);//antes
    //tbody.querySelector(`.tr_song[data-id="${id_song}"]`).classList.add('selected');//antes
    
    resetPSongActive(eid_bl_songs_finded);//new
    eid_bl_songs_finded.querySelector(`.p_song[data-id="${id_song}"]`).classList.add('active');//new

    mostrarVista(eid_block_buscar_body);

    mostrarPrim = false;
    ocultarElementosPrimEn(buscar_option_inner);
    mostrarElementosEditablesEn(buscar_option_inner);
    mySizeBuscar();//importante después de quitar opt_prim y mostrar opt_edit 

    //song_text
    buscar_vista_song_content.innerHTML = '';//reset

    buscar_ul_action.innerHTML = `
        <div class="razdel">Lista:</div>
        <li class="li_action btn_add_lista" onclick="addToLista();">    
            <!--Añadir a una Lista nueva o a la lista actual-->
        </li>

        <div class="razdel">Esquema:</div>
        <li class="li_action" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); select_slide();">Select slide</li>
        
        <div class="razdel">Canción:</div>
        <li class="li_action" onclick="showBlockName('cancion'); editar_song();">Ver / Editar canción</li>
        <li class="li_action" onclick="showBlockName('cancion'); eliminar_song();">Eliminar canción</li>
        
        <div class="razdel">Modal:</div>
        <li class="li_action" onclick="openModal('full','Ver Canción',null,'buildFormCancion',true, 'ver')">Ver canción</li>
        <li class="li_action" onclick="openModal('full','Editar Canción',null,'buildFormCancion',true, 'editar')">Editar canción</li>
        <li class="li_action" onclick="openModal('full','Eliminar Canción',null,'buildFormCancion',true, 'eliminar')">Eliminar canción</li>
        
        <div class="razdel">Diapositivas:</div>
        <li class="li_action" onclick="crearSlides()">Crear slides</li>
        <li class="li_action" onclick="crearSlides(); closeAll()">Crear slides + Ver</li>
    `;
    buscar_ul_action.onclick = e => close_ul_action(e);

    //dejo '==' en vez de '===' porque id_song viene como string: "925"
    objSong = objDataSongs.arr_data.find(s => s.id_song == id_song);
    console.log('objSong: ', objSong);

    pintSongActiveSoloDatos();

    resetBlockEsquemaSoloHTML();
    resetBlockCancion();
    resetLineasXinBlock(eid_block_cancion);
}

function pintSongActiveSoloDatos(){
    console.log('=== function pintSongActiveSoloDatos() === ');

    if(!objSong){
        alert('no hay objSong');
        return;
    }

    const p_song = eid_bl_songs_finded.querySelector(`.p_song[data-id="${objSong.id_song}"]`);
    console.log('p_song: ', p_song);
    
    if(!p_song){
        //alert('no hay tr_song');
        console.log('no hay p_song. no actualizo p_song...');
        return;
    }

    let hay_esquema_texto;

    //convierto arr_esquema (string) en array correcto
    if(esArray(objSong.arr_esquema) && objSong.arr_esquema.length > 0){
        hay_esquema_texto = `Sí (${objSong.arr_esquema.length})`;
    }else{
        hay_esquema_texto = '';
    }
    console.log('(bd) --- objSong.arr_esquema: ', objSong.arr_esquema);

    let category_name_text = '';
    if(objSong.category != 0 && objSong.category_name != null){
        //inportante en una linea
        category_name_text = `<span class="sp_number">${objSong.category}.</span> <span class="sp_name">${objSong.category_name}</span>`;
    }

    let songbook_title_text = '';
    if(objSong.songbook != 0 && objSong.songbook_title != null){
        //inportante en una linea
        songbook_title_text = `<span class="sp_number">${objSong.songbook}.</span> <span class="sp_name">${objSong.songbook_title}</span>`;
    }

    let lang_name_text = '';
    if(objSong.lang){
        lang_name_text = obj_lang_names[objSong.lang];
    }

    const el_cl_title = p_song.querySelector('.cl_title');
    const el_cl_title2 = p_song.querySelector('.cl_title2');
    const el_cl_title_note = p_song.querySelector('.cl_title_note');

    //new - actualizo datos de p_song
    el_cl_title.textContent = objSong.title || '';//siempre debe estar

    el_cl_title2.textContent = objSong.title2 || '';
    el_cl_title2.classList.toggle('d-none', !objSong.title2);;//si title2 es true -> quito 'd-none', si es false ->  lo elimino
    
    el_cl_title_note.textContent = objSong.title_note || '';
    el_cl_title_note.classList.toggle('d-none', !objSong.title_note);;//si title_note es true -> quito 'd-none', si es false ->  lo elimino

    //p_song.querySelector('.td_idioma').textContent = lang_name_text;
    p_song.querySelector('.l_tune').textContent = objSong.tune || '';
    p_song.querySelector('.l_tune_transpose').textContent = objSong.tune_transpose || '';
   

   // Normalizamos palabras de 'arr_words' (global)
    //const arr_normalized = arr_words.map(normalize);//modo corto de escribir la func abajo
    const arr_normalized = arr_words.map( palabra => {
        return normalize(palabra);
    });
    console.log('arr_normalized: ', arr_normalized);
        
    const regex = new RegExp(`(${arr_normalized.join('|')})`, 'gi');//busco las palabras del input
    console.log('regex: ', regex);

    let cl_campo_title = 'd-none';
    let cl_campo_title2 = 'd-none';
    let cl_campo_title_note = 'd-none';
    
    let content_id_song = '';
    let content_title = '';
    let content_title2 = '';
    let content_title_note = '';
    
    if(objSong.id_song){
        //Marco en rojo las palabras encontradas en title 
        let id_song_text_red = objSong.id_song.toString().replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_id_song = id_song_text_red;
    }

    if(objSong.title){
        cl_campo_title = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let titulo_text_red = objSong.title.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_title = titulo_text_red;
    }

    if(objSong.title2){
        cl_campo_title2 = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let titulo2_text_red = objSong.title2.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_title2 = titulo2_text_red;
    }

    if(objSong.title_note){
        cl_campo_title_note = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let titulo_note_text_red = objSong.title_note.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_title_note = titulo_note_text_red;
    }

    const titulo_detalles = document.createElement('div');
    titulo_detalles.className = 's_detalles';
    titulo_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('s_titulo_detalles');">
            Canción <span class="f_r">${content_id_song}</span>
        </p>    
        <p id="s_titulo_detalles" class="texto_norm t_big" style="display: block;">
            <span class="detalles_inner">
                <span class="linea_fx ${cl_campo_title}">
                    <span class="cl_campo">Título:</span>
                    <span>${content_title}</span>
                </span>
                <span class="linea_fx ${cl_campo_title2}">
                    <span class="cl_campo">Título2:</span>
                    <span>${content_title2}</span>
                </span>
                <span class="linea_fx ${cl_campo_title_note}">
                    <span class="cl_campo">T. nota:</span>
                    <span>${content_title_note}</span>
                </span>
            </span><!--/.detalles_inner-->
        </p>
    `;

    let cl_campo_song_number = 'd-none';
    let cl_campo_category_name = 'd-none';
    let cl_campo_songbook_title = 'd-none';
    
    let content_song_number = '';
    let content_category_name = '';
    let content_songbook_title = '';

    if(objSong.song_number){
        cl_campo_song_number = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let song_number_text_red = objSong.song_number.toString().replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_song_number = song_number_text_red;
    }

    if(objSong.category_name){
        cl_campo_category_name = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let category_name_text_red = objSong.category_name.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_category_name = objSong.category + '. ' + category_name_text_red;
    }

    if(objSong.songbook_title){
        cl_campo_songbook_title = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let songbook_title_text_red = objSong.songbook_title.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_songbook_title = objSong.songbook + '. ' + songbook_title_text_red;
    }

    const otros_detalles = document.createElement('div');
    otros_detalles.className = 's_detalles';
    otros_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('s_otros_detalles');">Detalles</p>
        <p id="s_otros_detalles" class="texto_norm t_big" style="display: block;">
            <span class="detalles_inner">            
                <!-- aki van los otros datos -->
                <span class="linea_fx ${cl_campo_song_number}">
                    <span class="cl_campo">Número:</span>
                    <span>${content_song_number}</span>
                </span>
                <span class="linea_fx ${cl_campo_category_name}">
                <span class="cl_campo">Categoría:</span>
                    <span>${content_category_name}</span>
                </span>
                <span class="linea_fx ${cl_campo_songbook_title}">
                    <span class="cl_campo">Songbook:</span>
                    <span>${content_songbook_title}</span>
                </span>
            </span><!--/.detalles_inner-->
        </p>
    `;

    let cl_campo_song_text = 'd-none';    
    let content_song_text = '';

    if(objSong.song_text){
        cl_campo_song_text = '';//muestro
        //Marco en rojo las palabras encontradas en song_text 
        let song_text_red = objSong.song_text.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_song_text = song_text_red;
    }

    const texto_detalles = document.createElement('div');
    texto_detalles.className = 's_detalles';
    texto_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('s_texto_detalles');">Texto</p>
        <div id="s_texto_detalles" style="display: block;">
            <div class="texto_pre">${content_song_text}</div>
        </div>
    `;


    const d_esquema_titulos = document.createElement('div');
    d_esquema_titulos.className = 'd_esquema_titulos';

    let cl_campo_url_recurso = 'd-none';
    let cl_campo_notes = 'd-none';
    
    let content_url_recurso = '';
    let content_notes = '';

    if(objSong.url_recurso){
        cl_campo_url_recurso = '';//muestro
        //Marco en rojo las palabras encontradas en notes 
        let url_recurso_text_red = objSong.url_recurso.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_url_recurso = url_recurso_text_red;
    }

    if(objSong.notes){
        cl_campo_notes = '';//muestro
        //Marco en rojo las palabras encontradas en notes 
        let notas_text_red = objSong.notes.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_notes = notas_text_red;
    }



    const notes_detalles = document.createElement('div');
    notes_detalles.className = 's_detalles';
    notes_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('s_notes_detalles');">Notas</p>
        <p id="s_notes_detalles" class="texto_norm t_big" style="display: block;">
            <span class="detalles_inner">            
                <!-- aki van los notes datos -->
                <span class="linea_fx ${cl_campo_url_recurso}">
                    <span class="cl_campo">Recurso:</span>
                    <span>${content_url_recurso}</span>
                </span>                
                <span class="linea_fx ${cl_campo_notes}">
                    <span class="cl_campo">Apuntes:</span>
                    <span>${content_notes}</span>
                </span>
            </span><!--/.detalles_inner-->
        </p>
    `;


    //añado al DOM
    buscar_vista_song_content.append(titulo_detalles);
    buscar_vista_song_content.append(otros_detalles);
    buscar_vista_song_content.append(texto_detalles);
    buscar_vista_song_content.append(d_esquema_titulos);
    buscar_vista_song_content.append(notes_detalles);

    //Construyo titulos de esquema después de añadir d_esquema_titulos al DOM
    buildEsquemaSoloTitulos(buscar_vista_song_content.querySelector('.d_esquema_titulos'), objSong.arr_esquema);
}

function ocultarTodasVistas(){
    console.log('=== function resetShowVista() === ');

    document.querySelectorAll('.vista_r.shown').forEach( vista_r => {
        vista_r.classList.remove('shown');
        vista_r.querySelector('.vista_head')?.classList.remove('shown');
    });//reseteo parte derecha de vista
}

function mostrarVista(contenedor){
    console.log('=== function mostrarVista(contenedor) === ');

    if(!contenedor) return;

    if(window.innerWidth > pantallaTabletMaxPx){// pantallaTabletMaxPx = 1023px es portatil small
        //no muestro vista en desktop porque ya se muestra al lado derecho.
        return;
    }

    ocultarTodasVistas();

    //setTimeout(()=>{
        contenedor.querySelector('.vista_r')?.classList.add('shown');//muestro parte derecha de vista
    //},5);


    setTimeout(()=>{
        contenedor.querySelector('.vista_head')?.classList.add('shown');
    },10);//transition 0.5s = 500mc.
}


function mostrarVistaFixed(){
    console.log('=== function mostrarVistaFixed === ');

    //if(!contenedor) return;

    // if(window.innerWidth > pantallaTabletMaxPx){// pantallaTabletMaxPx = 1023px es portatil small
    //     //no muestro vista en desktop porque ya se muestra al lado derecho.
    //     return;
    // }

    //ocultarTodasVistas();
    //contenedor.querySelector('.vista_r')?.classList.add('shown');//muestro parte derecha de vista
    document.querySelector('.vista_fixed')?.classList.add('shown');//muestro parte derecha de vista

    // setTimeout(()=>{
    //     contenedor.querySelector('.vista_head')?.classList.add('shown');
    // },10);//transition 0.5s = 500mc.
}

function ocultarVistaFixed(){
    console.log('=== function ocultarVistaFixed() === ');
    document.querySelector('.vista_fixed')?.classList.remove('shown');

    const d_state_fullscreen = document.querySelector('#d_state_fullscreen');

    if(is_fullscreen && d_state_fullscreen){
        toggleFullscreen('.vista_fixed', d_state_fullscreen);
    }
}

function toggleVistaFixed() {
    const vista_fixed = document.querySelector('.vista_fixed');

    if (vista_fixed.classList.contains('shown')) {//es mostrado
        ocultarVistaFixed();//oculto
    } else {
        mostrarVistaFixed();//muestro
    }
}







function mostrarMenuOver(){
    console.log('=== function mostrarMenuOver === ');
    const d_menu_over = document.querySelector('.d_menu_over');
    const hamburger3 = document.getElementById('hamburger3');
    const d_contenedor = document.querySelector('.vista_fixed .d_contenedor');

    d_menu_over?.classList.add('shown');//muestro menu que cubre todo el body de vista_fixed
    hamburger3.classList.add('active'); // Cambiar hamburguesa a flecha o 'x'
    d_contenedor.classList.add('scrollbar_menu_over');//activo vista de scrollbar en contenedor para poder ver donde estoy

    //ocultarDragOver();
}

function ocultarMenuOver(){
    console.log('=== function ocultarMenuOver() === ');
    const d_menu_over = document.querySelector('.d_menu_over');
    const hamburger3 = document.getElementById('hamburger3');
    const d_contenedor = document.querySelector('.vista_fixed .d_contenedor');

    d_menu_over?.classList.remove('shown');
    hamburger3.classList.remove('active'); // Cambiar flecha o 'x' a hamburguesa
    d_contenedor.classList.remove('scrollbar_menu_over');//desactivo vista de scrollbar en contenedor. que sea por defecto
}

function toggleMenuOver() {
    const d_menu_over = document.querySelector('.d_menu_over');

    if (d_menu_over.classList.contains('shown')) {//es mostrado
        ocultarMenuOver();//oculto
    } else {
        mostrarMenuOver();//muestro
    }
}




function mostrarDragOver(){
    console.log('=== function mostrarDragOver === ');
    const d_drag_over = document.querySelector('.d_drag_over');
    const d_state_drag_song = document.querySelector('#d_state_drag_song');
    const d_contenedor = document.querySelector('.vista_fixed .d_contenedor');

    dragSong = true;
    d_drag_over?.classList.add('shown');//muestro div drag_overu que cubre todo el body de vista_fixed
    d_state_drag_song.classList.add('active');
    d_contenedor.classList.add('scrollbar_drag_over');//activo vista de scrollbar en contenedor para poder ver donde estoy
    
    showToast('info', `Deslizamiento activado`, 2000, 'center', false,'', document.querySelector('.vista_fixed_body'));

    //ocultarMenuOver();//revisar ! hace falta?..
    refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
}

function ocultarDragOver(){
    console.log('=== function ocultarDragOver() === ');
    const d_drag_over = document.querySelector('.d_drag_over');
    const d_state_drag_song = document.querySelector('#d_state_drag_song');
    const d_contenedor = document.querySelector('.vista_fixed .d_contenedor');

    dragSong = false;
    d_drag_over?.classList.remove('shown');
    d_state_drag_song.classList.remove('active');
    d_contenedor.classList.remove('scrollbar_drag_over');//desactivo vista de scrollbar en contenedor. que sea por defecto
    
    showToast('info', `Deslizamiento desactivado`, 2000, 'center', false,'', document.querySelector('.vista_fixed_body'));

    resetPartialFieldsets();
    resetBottomPadding();
}

function toggleDragSong() {
    console.log('=== function toggleDragSong() ===');    

    if (dragSong) {
        ocultarDragOver();//sig action
    } else {
        mostrarDragOver();//sig action
    }
}







function mostrarTapSlide(){
    console.log('=== function mostrarTapSlide === ');
    const d_tap_over = document.querySelector('.d_tap_over');
    const d_state_tap_slide = document.querySelector('#d_esq_state_tap_slide');

    tapSlide = true;
    d_tap_over?.classList.add('shown');//muestro div d_tap_over que cubre todo el body de contenedor_prev
    d_state_tap_slide.classList.add('active');
}

function ocultarTapSlide(){
    console.log('=== function ocultarTapOver() === ');
    const d_tap_over = document.querySelector('.d_tap_over');
    const d_state_tap_slide = document.querySelector('#d_esq_state_tap_slide');

    tapSlide = false;
    d_tap_over?.classList.remove('shown');
    d_state_tap_slide.classList.remove('active');
}

function toggleTapSlide() {
    console.log('=== function toggleTapSlide() ===');    

    if (tapSlide) {
        ocultarTapSlide();//sig action
    } else {
        mostrarTapSlide();//sig action
    }
}




async function refreshSong(){
    console.log('=== function refreshSong() === ');

    //actualizo objSong desde bd por si se han hecho cambios
    objSong = await getDataSongFromBd();
    console.log('despues --- objSong: ', objSong);

    editar_song();

    pintSongActiveSoloDatos();

    eid_block_cancion.querySelector('.btn_song_refresh img').classList.toggle('rotate');//animación refresh
}

async function refreshLista(){
    console.log('=== function refreshLista() === ');

    if(!id_lista){
        return;
    }

    //actualizo objLista desde bd por si se han hecho cambios
    objLista = await getDataListaFromBd();
    console.log('despues --- objLista: ', objLista);

    const itemListaUpdate = objDataListas.arr_data?.find(item => item.id_lista == id_lista);
    if (itemListaUpdate) {
        Object.assign(itemListaUpdate, objLista);
        // el objeto dentro de arr_data ya está actualizado
    } else {
        console.warn('No encontrado objlista.id_lista en objDatalistas.arr_data');
    }

    //Actualizo p_lista 
    pintListaActiveSoloDatos();

    eid_block_lista.querySelector('.btn_refresh img').classList.toggle('rotate');//animación refresh
}

function pintListaActive(){
    console.log('=== function pintListaActive(e) === ');
        
    console.log('asignado global --- id_lista: ', id_lista);

    //resetTrSelected(tbody_lista);
    //tbody_lista.querySelector(`.tr_lista[data-id="${id_lista}"]`).classList.add('selected');

    resetPListaActive(eid_bl_listas_finded);//new
    eid_bl_listas_finded.querySelector(`.p_lista[data-id="${id_lista}"]`)?.classList.add('active');//new

    //creo btn actualizar lista
    const element_btn_lista_refresh = eid_block_lista.querySelector('#btn_lista_refresh');
    if(!element_btn_lista_refresh){
        const ejemplo_btn_lista_refresh = `
            <button id="btn_lista_refresh" class="btn btn_refresh" onclick="refreshLista()">
                <img src="images/refresh.png" class="">
                <span>Actualizar</span>
            </button>        
        `;
        const btn_lista_refresh = document.createElement('button');
        btn_lista_refresh.id = 'btn_lista_refresh';
        btn_lista_refresh.className = 'btn btn_refresh';
        btn_lista_refresh.innerHTML = `
            <img src="images/refresh.png" class="">
            <span>Actualizar</span>
        `;
        btn_lista_refresh.onclick = () => refreshLista();

        const separador = document.createElement('div');
        separador.className = 'separador for_btn_lista_refresh';

        //añado al DOM
        eid_block_lista_head.querySelector('.wr_block_option_inner').prepend(separador);
        eid_block_lista_head.querySelector('.wr_block_option_inner').prepend(btn_lista_refresh);

    }     

    mostrarVista(eid_block_lista_body);

    mostrarPrim = false;
    ocultarElementosPrimEn(lista_option_inner);
    mostrarElementosEditablesEn(lista_option_inner);
    mySizeLista();//importante después de quitar opt_prim y mostrar opt_edit 


    //Dejo '==' en vez de '===' porque id_lista viene como string: "925"
    objLista = objDataListas.arr_data.find(s => s.id_lista == id_lista);
    console.log('objLista: ', objLista);  
    
    pintListaActiveSoloDatos();//new
}

function pintListaActiveSoloDatos(){
    console.log('=== function pintListaActiveSoloDatos() === ');
    
    if(!objLista){
        alert('no hay objLista');
        return;
    }

    //comprobar si existe tr_lista de la lista activa
    // const tr_lista = tbody_lista.querySelector(`.tr_lista[data-id="${objLista.id_lista}"]`);
    const p_lista = eid_bl_listas_finded.querySelector(`.p_lista[data-id="${objLista.id_lista}"]`);
    console.log('p_lista: ', p_lista);

    const btn_add_lista = document.querySelector(`.li_action.btn_add_lista`);
    console.log('btn_add_lista: ', btn_add_lista);
    
    // if(tr_lista){
    //     //alert('no hay tr_lista');
    //     //return;
        
    //     //Actualizo datos de tr_lista
    //     tr_lista.querySelector('.td_titulo').textContent = objLista.title || '';
    //     tr_lista.querySelector('.td_dia_semana').textContent = diaSemana(objLista.fecha) || '';
    //     tr_lista.querySelector('.td_fecha').textContent = objLista.fecha_ver || '';
    //     tr_lista.querySelector('.td_lista').textContent = (objLista.arr_lista.length > 0) ? `Sí (${objLista.arr_lista.length})` :  '';
    // }

    if(p_lista){
        //Actualizo datos de p_lista
        p_lista.querySelector('.cl_title').textContent = objLista.title || '';
        p_lista.querySelector('.cl_grupo_nombre ').textContent = `${objLista.grupo_nombre}` || '';
        p_lista.querySelector('.cl_dia_semana').textContent = diaSemana(objLista.fecha) || '';
        p_lista.querySelector('.cl_fecha').textContent = objLista.fecha_ver || '';
        p_lista.querySelector('.cl_notes').textContent = objLista.notes || '';

        //si hay canciones, muestro el numero quitando d_none
        if(objLista.arr_lista.length > 0){
            p_lista.querySelector('.l_num_canciones').textContent = objLista.arr_lista.length;
            p_lista.querySelector('.l_num_canciones').classList.remove('d-none');
        }else{
            p_lista.querySelector('.l_num_canciones').textContent = '';
            p_lista.querySelector('.l_num_canciones').classList.add('d-none');//oculto el numero de canciones
        }

        if(objLista.notes != ''){//muestro
            p_lista.querySelector('.cl_notes').classList.remove('d-none');//quito clase para mostrar nota si la hay
        }else{//oculto
            p_lista.querySelector('.cl_notes').classList.add('d-none');//añado clase para ocultar nota
        }
    }
    
    if(btn_add_lista){        
        //Actualizo datos de tr_lista
        const fecha_lista = btn_add_lista.querySelector('.fecha_lista');
        const title_lista = btn_add_lista.querySelector('.title_lista');
        const grupo_lista = btn_add_lista.querySelector('.grupo_lista');

        if(fecha_lista && title_lista && grupo_lista){
            fecha_lista.innerHTML = `${diaSemana(objLista.fecha)} &nbsp; ${objLista.fecha_ver}`;
            title_lista.textContent = objLista.title || '';
            grupo_lista.textContent = `${objLista.grupo_nombre}` || '';
        }
    }

    // //Actualizo parte derecha
    lista_vista_lista_content.innerHTML = '';//reset

    lista_ul_action.innerHTML = `
        <li class="li_action" onclick="refreshLista();">Actualizar Lista actual</li>
        <li class="li_action" onclick="openModal('full','Lista actual',null,'buildLista',true, 'ver_sm');">Lista actual</li>
        <li class="li_action" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver');">Ver</li>
        <li class="li_action" onclick="openModal('full','Editar lista',null,'buildLista',true, 'editar');">Editar</li>
        <li class="li_action" onclick="openModal('full','Eliminar lista',null,'buildLista',true, 'eliminar');">Eliminar</li>
    `;
    lista_ul_action.onclick = e => close_ul_action(e);


    // Normalizamos palabras
    //const arr_normalized = arr_words_lista.map(normalize);//modo corto de escribir la func abajo
    const arr_normalized = arr_words_lista.map( palabra => {
        return normalize(palabra);
    });
    console.log('arr_normalized: ', arr_normalized);

    // Creamos regex sin acentos
    const regex = new RegExp(`(${arr_normalized.join('|')})`, 'gi');
    console.log('regex: ', regex);


    let cl_campo_title = 'd-none';
    
    let content_id_lista = '';
    let content_title = '';
    let content_fecha = '';
    let content_grupo = '';

    //id lista
    if(objLista.id_lista){
        //Marco en rojo las palabras encontradas en id 
        let id_lista_text_red = objLista.id_lista.toString().replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        const d_id_lista = document.createElement('div');
        d_id_lista.className = 'parte_lista';
        d_id_lista.innerHTML = `
            <p class="p_titulo">Id:</p>
            <p class="texto_norm t_big">${id_lista_text_red}</p>
        `;
        //lista_vista_lista_content.append(d_id_lista);
        content_id_lista = id_lista_text_red;
    }

    //Titulo lista
    if(objLista.title){
        cl_campo_title = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let titulo_text_red = objLista.title.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        const d_titulo = document.createElement('div');
        d_titulo.className = 'parte_lista';
        d_titulo.innerHTML = `
            <p class="p_titulo">Título Lista:</p>
            <p class="texto_norm t_big">${titulo_text_red}</p>
        `;
        //lista_vista_lista_content.append(d_titulo);
        content_title = titulo_text_red;
    }    

    //Fecha
    if(objLista.fecha && objLista.fecha != '0000-00-00'){
        cl_campo_fecha = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        //En BD busco '2025-08-03' 
        //pero como el formato para mostrar es '03/08/2025'
        //convierto '2025-08-03' a '03/08/2025' para luego pintar en rojo la coincidencia
        let validar_partes_fecha = false;//para pintar permito no validar la fecha. puede ser '2025-08', '2025-' 
        const regex_fecha = new RegExp(`(${convertirFecha(arr_normalized.join('|'), 'ver', '/', validar_partes_fecha)})`, 'gi');
        console.log('regex_fecha: ', regex_fecha);

        // let fecha_text_red = convertirFecha(objLista.fecha_ver, 'ver','/');// de '2025-08-03' => '03/08/2025'
        let fecha_text_red = objLista.fecha_ver;// en bd es '2025-08-03'
        fecha_text_red = fecha_text_red.replace(regex_fecha, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        console.log('fecha_text_red: ', fecha_text_red);

        const d_fecha = document.createElement('div');
        d_fecha.className = 'parte_lista';
        d_fecha.innerHTML = `
            <p class="p_titulo">Fecha:</p>
            <p class="texto_norm t_big">${fecha_text_red}</p>
        `;
        //lista_vista_lista_content.append(d_fecha);
        const fecha_html = `
            <span class="wr_dia_y_fecha">
                <span class="cl_dia_semana cl_title_note">${diaSemana(objLista.fecha)}</span>
                <span class="cl_fecha cl_title_note">${fecha_text_red}</span>
            </span>`;
        // content_fecha = diaSemana(objLista.fecha) + ' ' + fecha_text_red;
        content_fecha = fecha_html;
    }

    //Grupo lista
    if(objLista.id_grupo){
        cl_campo_grupo = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let grupo_nombre_text_red = objLista.grupo_nombre.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        const d_titulo = document.createElement('div');
        d_titulo.className = 'parte_lista';
        d_titulo.innerHTML = `
            <p class="p_titulo">Grupo que realiza el evento:</p>
            <p class="texto_norm t_big">${grupo_nombre_text_red}</p>
        `;
        //lista_vista_lista_content.append(d_titulo);
        content_grupo = grupo_nombre_text_red;
    }
    
    //head de lista (titulo y detalles)
    const titulo_detalles = document.createElement('div');
    titulo_detalles.className = 's_detalles';
    titulo_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles');">
            Lista <span class="f_r">${content_id_lista}</span>
        </p>    
        <p id="l_titulo_detalles" class="texto_norm t_big" style="display: block;">
            <span class="detalles_inner">
                <span class="linea_fx ${cl_campo_title}">
                    <span class="cl_campo">Título:</span>
                    <span>${content_title}</span>
                </span>
                <span class="linea_fx ${cl_campo_fecha}">
                    <span class="cl_campo">Fecha:</span>
                    <span>${content_fecha}</span>
                </span>
                <span class="linea_fx ${cl_campo_grupo}">
                    <span class="cl_campo">Grupo:</span>
                    <span>${content_grupo}</span>
                </span>
            </span><!--/.detalles_inner-->
        </p>
    `;

    //Canciones
    const d_canciones_lista = document.createElement('div');
    d_canciones_lista.className = 'd_canciones_lista parte_lista';
    //lista_vista_lista_content.append(d_canciones_lista);    
    
    arr_lista = objLista.arr_lista;//importante. reasigno desde bd
    console.log('arr_lista: ', arr_lista);

    let arr_lista_bd = objLista.arr_lista;
    console.log('despues --- objLista.arr_lista === arr_lista_bd: ', arr_lista_bd);

    buildListaSoloSongs(d_canciones_lista, arr_lista_bd);




    let cl_campo_notes = 'd-none';
    let content_notes = '';

    if(objLista.notes){
        cl_campo_notes = '';//muestro
        //Marco en rojo las palabras encontradas en notes 
        let notas_text_red = objLista.notes.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        const d_notas = document.createElement('div');
        d_notas.className = 'parte_lista';
        d_notas.innerHTML = `
            <p class="p_titulo">Notas:</p>
            <p class="texto_norm">${notas_text_red}</p>
        `;
        //lista_vista_lista_content.append(d_notas);
        content_notes = notas_text_red;
    }

    const notes_detalles = document.createElement('div');
    notes_detalles.className = `s_detalles ${cl_campo_notes}`;
    notes_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('l_notes_detalles');">Notas</p>
        <p id="l_notes_detalles" class="texto_norm t_big" style="display: block;">
            <span class="detalles_inner">            
                <span class="linea_fx ${cl_campo_notes}">
                    <span class="cl_campo">Apuntes:</span>
                    <span>${content_notes}</span>
                </span>
            </span><!--/.detalles_inner-->
        </p>
    `;

    //añado al DOM
    lista_vista_lista_content.append(titulo_detalles);
    lista_vista_lista_content.append(d_canciones_lista);
    lista_vista_lista_content.append(notes_detalles);
}



function showOneSlideFrom(elementClicked = null, index_esquema){
    console.log('=== function showOneSlideFrom() ===');
    console.log('elementClicked: ', elementClicked);

    e = elementClicked;
    currentSlide = Number(index_esquema);
    let add_next_slide = false;//por defecto no, si hay se pone a true

    if(e instanceof Event) {
        console.log("Recibí un evento. e.type: ", e.type);
    }
    else if(e instanceof HTMLElement) {
        console.log("Recibí un elemento HTML. e.tagName: ", e.tagName);
    }
    else{
        console.log("Parámetro desconocido. e: ", e);
        //alert('Parámetro desconocido de e. Return...');
        //return;
    }    

    // if(elementClicked.dataset.titulo === '_titulo_cancion_'){
    //     //return;
    // }

    //const index_esquema = elementClicked.dataset.idx;
    console.log('index_esquema: ', index_esquema);

    const elementBtnSimple = select_slide_wr_vista_btns.querySelector(`.btn_simple[data-idx="${index_esquema}"]`);
    console.log('elementBtnSimple: ', elementBtnSimple);

    const elementFieldset = select_slide_song_bloques.querySelector(`fieldset[data-idx="${index_esquema}"]`);
    console.log('elementFieldset: ', elementFieldset);

    eid_contenedor_prev_inner.innerHTML = '';//reset

    // resetBtnActive(select_slide_wr_vista_btns);//reseteo btn_active de botones en el contenedor
    // elementBtnSimple?.classList.add('btn_active');
    makeBtnActive(select_slide_wr_vista_btns, elementBtnSimple);

    // resetFldActive(select_slide_song_bloques);//reseteo fieldset active de kuplet's a la izda
    // elementFieldset?.classList.add('fld_active');
    makeFldActive(select_slide_song_bloques, elementFieldset);

    if(elementClicked){
        if(elementClicked === elementBtnSimple){
            console.log('es button -> btn_clicked ');
            elementFieldset.scrollIntoView({behavior: 'smooth', block: "center"});//btn clicked -> muevo fildset
            
            if(window.innerWidth < pantallaTabletMinPx){//mobile
                //alert('102. es mobil. muevo btn_simple...');
                elementBtnSimple.scrollIntoView({behavior: 'smooth', block: "center"});//fieldset clicked -> muevo btn
            }
        }else{
            console.log('es fieldset clicked');
            elementBtnSimple.scrollIntoView({behavior: 'smooth', block: "center"});//fieldset clicked -> muevo btn
        }
    }else{//no fue clikeado elementClicked. me muevo a los 2
        elementFieldset?.scrollIntoView({behavior: 'smooth', block: "center"});
        elementBtnSimple?.scrollIntoView({behavior: 'smooth', block: "center"});
    }



    //clono fieldset nuevo para vista en contenedor_prev ya que le cambiaré font-size
    const current_fieldset_cloned = arr_fieldsets[currentSlide].cloneNode(true); // true para clonar hijos
    console.log('current_fieldset_cloned: ', current_fieldset_cloned);

    const next_fieldset_cloned = arr_fieldsets[currentSlide + 1]?.cloneNode(true) || null ;
    console.log('next_fieldset_cloned: ', next_fieldset_cloned);



    eid_titulo_shown.textContent = current_fieldset_cloned.querySelector('legend').textContent;

    //Primer slide
    if( (elementClicked && elementClicked.dataset.titulo === '_titulo_cancion_') || index_esquema == 0){
        current_fieldset_cloned.querySelector('.song_titulo').textContent = '...';//muestro ... en vez del título del slide 1
        eid_titulo_shown.textContent = 'Título canción';
    }

    //Ultimo slide
    if(index_esquema == arr_esquema_bucle.length - 1){
        const p = document.createElement('p');
        p.className = 'tres_estrellas';
        p.textContent = '* * *';
        current_fieldset_cloned.append(p);//muestro ... en vez del título del slide 1
    }



    //Si hay sig kuplet, saco 2 primeras lineas...
    if(next_fieldset_cloned){

        //Todos los hijos directos 'legend' y 'p' de acordes y de texto
        let next_hijos_All = next_fieldset_cloned.querySelectorAll(':scope > *');
        console.log('next_hijos_All: ', next_hijos_All);

        next_fieldset_cloned.classList.add('preview_next');

        //1. elimino los p's dejando solo los 2 primeros
        next_fieldset_cloned.querySelectorAll('p').forEach((el,i) => { 
            if(i >= 2){
                el.remove();
            }
        });

        //2. si hay 2 filas de solo texto, elimino la 2 fila
        let los_p_t = next_fieldset_cloned.querySelectorAll('p.t');
        if(los_p_t.length == 2){
            los_p_t[1].remove();
        }

        add_next_slide = true;
    }




                // eid_contenedor_prev_inner.append(current_fieldset_cloned);
                
                // //Añado next slide si existe 
                // if(add_next_slide){
                //     //2. Añado next Slide (solo 2 lineas) al div si hay... 
                //     eid_contenedor_prev_inner.append(next_fieldset_cloned);
                // }



                // const contenedorSlideView = eid_pantalla_body;

                // ajustarTextoContenedor(contenedorSlideView);

    

    let li_actual;

    //si ya existe el li_actual...
    if(select_slide_ul_action.querySelector('#li_crearSlidesActual') ){
        li_actual = select_slide_ul_action.querySelector('#li_crearSlidesActual');
    }else{
        // creo boton actual
        li_actual = document.createElement('li');
        li_actual.id = 'li_crearSlidesActual';
        li_actual.className = 'li_action';
    }

    if(slideContainer.dataset.id_song == id_song){
        // ya están creados los slides en el contenedor. me muevo al slide actual
        li_actual.textContent = 'Ir al slide (Actual)';
        li_actual.onclick = () => {
            closeAll();//cierro todas las ventanas modales
            scrollToSlide(currentSlide);
        }
    }else{
        // no están creados los slides en el contenedor. los creo
        li_actual.textContent = 'Crear slides (Ver Actual)';
        li_actual.onclick = () => {
            crearSlides(currentSlide);
            closeAll();//cierro todas las ventanas modales
        }
    } 

    select_slide_ul_action.prepend(li_actual);
    make_arr_pantalla(currentSlide);
}






async function make_arr_pantalla(currentSlide){
    console.log('=== function make_arr_pantalla() ===');
    console.log('currentSlide: ',currentSlide);
    console.log('arr_fieldsets: ', arr_fieldsets);
    console.log('arr_esquema_bucle: ',arr_esquema_bucle);
    
    slide_actual = currentSlide;
    console.log('slide_actual: ',slide_actual);

    if(arr_fieldsets.length == 0 || arr_esquema_bucle.length == 0){
        return;
    }
    
    const current_fieldset = arr_fieldsets[currentSlide];
    console.log('current_fieldset: ',current_fieldset);

    const next_fieldset = arr_fieldsets[currentSlide + 1] || null ;
    console.log('next_fieldset: ',next_fieldset);

    //Current
    const current_fieldset_cloned = current_fieldset.cloneNode(true);
    console.log('current_fieldset_cloned: ',current_fieldset_cloned);
    
    //Next
    const next_fieldset_cloned = (next_fieldset) ? next_fieldset.cloneNode(true) : null ;
    console.log('next_fieldset_cloned: ',next_fieldset_cloned);


    objPantalla = {};//reset 
    arr_pantalla = [];//reset   

    let slide_divs = '';

    let count_p_t = 0;//contador de los 'p' de texto
    let count_p_c = 0;//contador de los 'p' de acordes
    let add_next_slide = false;//por defecto no, si hay se pone a true


    //Todos los hijos directos 'legend' y 'p' de acordes y de texto
    let hijos_All = current_fieldset_cloned.querySelectorAll(':scope > *');
    console.log('hijos_All: ', hijos_All);

    //Current element para slide
    const wr_d_line = document.createElement('div');
    wr_d_line.className = 'wr_d_line';
    
    //Next element para slide
    const next_wr_d_line = document.createElement('div');
    next_wr_d_line.className = 'next_wr_d_line';


    hijos_All.forEach((hijo, i, arr) => {
        console.log('hijo: ', hijo); 
        
        const d_line = document.createElement('div');

        if(hijo.tagName === 'LEGEND'){
            if(currentSlide == 0 && hijo.innerHTML == '_titulo_cancion_'){
                d_line.className = `d_line d_legend d-none`;
            }else{
                d_line.className = `d_line d_legend`;
            }
            d_line.innerHTML = `<div>${hijo.innerHTML}</div>`;
        }else{//es 'p'

            if(hijo.className == 'c'){
                count_p_c++;//acorde
            }
            if(hijo.className == 't'){
                count_p_t++;//texto

                //NO HACE FALTA AKI! PERO DEJO COMO EJEMPLO COMO SUSTITUIR
                // hijo.innerHTML = hijo.innerHTML.replace(
                //     /[{}]/g,  //los '{' y los '}'
                //     match => `<span class="llave" en_mmm>${match}</span>` 
                // );
            }
            d_line.className = `d_line ${hijo.className}`;
            d_line.innerHTML = hijo.innerHTML;
        }
        
        wr_d_line.append(d_line);
    });



    //Si hay sig kuplet, saco 2 primeras lineas...
    if(next_fieldset_cloned){

        //Todos los hijos directos 'legend' y 'p' de acordes y de texto
        let next_hijos_All = next_fieldset_cloned.querySelectorAll(':scope > *');
        console.log('next_hijos_All: ', next_hijos_All);

        next_fieldset_cloned.classList.add('preview_next');

        //1. elimino los p's dejando solo los 2 primeros
        next_fieldset_cloned.querySelectorAll('p').forEach((el,i) => { 
            if(i >= 2){
                el.remove();
            }
        });

        //2. si hay 2 filas de solo texto, elimino la 2 fila
        let los_p_t = next_fieldset_cloned.querySelectorAll('p.t');
        if(los_p_t.length == 2){
            los_p_t[1].remove();
        }

        const next_hijos_All_solo2 = next_fieldset_cloned.querySelectorAll(':scope > *');

        next_hijos_All_solo2.forEach((hijo, i, arr) => {
            console.log('hijo: ', hijo); 
            
            const d_line = document.createElement('div');

            if(hijo.tagName === 'LEGEND'){
                d_line.className = `d_line d_legend`;            
                d_line.innerHTML = `<div>${hijo.innerHTML}</div>`;
            }else{
                d_line.className = `d_line ${hijo.className}`;
                d_line.innerHTML = hijo.innerHTML;
            }
            
            next_wr_d_line.append(d_line);
        });

        add_next_slide = true;
    }


    //let p_textAll = current_fieldset_cloned.querySelectorAll('p.t');//solo texto
    //console.log('p_textAll: ', p_textAll);
   
    
    //si es ultimo slide
    if(currentSlide == arr_esquema_bucle.length - 1){
        //slide_html += `<span class="tres_estrellas">* * *</span>`;
        const span_tres_estrellas = document.createElement('span');
        span_tres_estrellas.className = 'tres_estrellas';
        span_tres_estrellas.innerHTML = '* * *';        
        wr_d_line.append(span_tres_estrellas);
    }


    if(count_p_t == 0){//si no se encuentran los 'p', no hago nada
        //alert('no hay texto en la diapositiva seleccionada. pero sigo...');
        let hay_song_titulo = current_fieldset_cloned.querySelector('.song_titulo');
        if(hay_song_titulo){
            const ejemplo = `
                <div class="wr_d_puntos">
                    <p>...</p>
                </div>
            `;
            const div_wr_d_puntos = document.createElement('div');
            div_wr_d_puntos.className = 'wr_d_puntos';
            div_wr_d_puntos.innerHTML = '<p>...</p>';
            wr_d_line.append(div_wr_d_puntos);
        }

        if(count_p_c > 0){
            const ejemplo = `
                <div class="wr_d_music">
                    <img src="images/notas_de_musica_grey.svg">
                </div>
            `;
            const div_wr_d_music = document.createElement('div');
            div_wr_d_music.className = 'wr_d_music';
            div_wr_d_music.innerHTML = '<img src="images/notas_de_musica_grey.svg">';
            wr_d_line.append(div_wr_d_music);
        }
    }

    //1. Añado current Slide al div 
    slide_divs = wr_d_line.outerHTML;

    //Añado next slide si existe 
    if(add_next_slide){
        //2. Añado next Slide (solo 2 lineas) al div si hay... 
        slide_divs += next_wr_d_line.outerHTML;
    }

    let slide_num_text = currentIndexOfArrLista + 1;
    let slide_pos_text = `${currentSlide + 1} / ${arr_fieldsets.length}`;

    const ejemplo_contenedor_prev_head = `
        <div class="contenedor_prev_head">

            <div id="d_esq_state_tap_slide" class="btn_actions" onclick="toggleTapSlide()">
                <img src="images/tap_up_24.png">
            </div>

            <div class="vp_titulo">
                <div id="id_slide_num">8050</div>
                <div id="id_slide_pos">6 / 6</div>
            </div>

            <div id="d_esq_state_fullscreen" class="btn_actions" onclick="toggleFullscreen('#contenedor_prev_inner', this)">
                <img src="images/icon_size_max.svg">
            </div>

        </div>
    `;    
    
    const element_contenedor_prev_head = document.querySelector('.contenedor_prev_head');
    if(!element_contenedor_prev_head){
        const contenedor_prev_head = document.createElement('div');
        contenedor_prev_head.className = 'contenedor_prev_head';
        contenedor_prev_head.innerHTML = `
            <div id="d_esq_state_tap_slide" class="btn_actions">
                <img src="images/tap_up_24.png">
            </div>
            <div id="d_esq_state_fullscreen" class="btn_actions">
                <img src="images/icon_size_max.svg">
            </div>
        `;
        contenedor_prev_head.onclick = (e) => {
            console.log('contenedor_prev_head clicked');

            if(e.target.closest('#d_esq_state_tap_slide')){
                toggleTapSlide();
            }
            else if(e.target.closest('#d_esq_state_fullscreen')){
                toggleFullscreen('#contenedor_prev', e.target);
            }else{
                console.log('clicked ninguno de los botones');
            }
        }

        //añado al DOM 
        eid_contenedor_prev.append(contenedor_prev_head);
    }

    const ejemplo_contenedor_prev_foot = `
        <div class="contenedor_prev_foot">
            <div id="id_slide_num">8050</div>
            <div id="id_slide_pos">6 / 6</div>
        </div>
    `;

    const element_contenedor_prev_foot = document.querySelector('.contenedor_prev_foot');
    if(!element_contenedor_prev_foot){
        const contenedor_prev_foot = document.createElement('div');
        contenedor_prev_foot.className = 'contenedor_prev_foot';
        contenedor_prev_foot.innerHTML = `
            <div id="id_slide_num">${slide_num_text}</div>
            <div id="id_slide_pos">${slide_pos_text}</div>
        `;
        //añado al DOM 
        eid_contenedor_prev.append(contenedor_prev_foot);
    }else{//ya existe, solo actualizo datos de slide        
        element_contenedor_prev_foot.querySelector('#id_slide_num').textContent = slide_num_text;
        element_contenedor_prev_foot.querySelector('#id_slide_pos').textContent = slide_pos_text;
    }


    //debe estar aparte
    const ejemplo_d_tap_over = `
        <div class="d_tap_over"></div>
    `;
    const element_d_tap_over = document.querySelector('.d_tap_over');
    
    if(!element_d_tap_over){
        const d_tap_over = document.createElement('div');
        d_tap_over.className = 'd_tap_over';
        d_tap_over.onclick = () => {
            console.log('d_tap_over clicked');
        }
        //añado al DOM 
        eid_contenedor_prev.append(d_tap_over);
        
        //añado escuchador de click
        listenClickLeftRight(d_tap_over, slideGo);
    }
    



    //===================================================//
    //start - experiment
    //===================================================//
    const miIframeDOM = document.getElementById('miIframe');
    if(miIframeDOM){
        miIframeDOM.remove();
    }

    // 1. Crear el elemento
    miIframe = document.createElement('iframe');
    miIframe.id = "miIframe";

    // 2. Configurar atributos básicos
    miIframe.src = "pantalla.php";
    miIframe.title = "Contenido externo";

    // 3. Aplicar estilos para que ocupe todo el div padre
    //miIframe.style.width = eid_contenedor_prev.offsetWidth + 'px';
    //miIframe.style.height = eid_contenedor_prev.offsetHeight + 'px';
    
    miIframe.style.border = "none";
    miIframe.style.display = "block";

    // 4. Añadir seguridad (opcional pero recomendado)
    miIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    // 5. Insertarlo en un div existente (suponiendo que su id es 'contenedor')
    eid_contenedor_prev_inner.append(miIframe);
    mySizeIframe(eid_contenedor_prev);

    //para el video pelicula
    eid_videoPeliculaHoly = miIframe.contentWindow.document.getElementById('videoPelicula');
    miIframe.onload = () => {
        const videoHoly = miIframe.contentWindow.document.getElementById('videoPelicula');
        if(videoHoly){
            console.log('hago videoHoly muted');
            //alert('videoHoly muted');
            videoHoly.muted = true;
        }
    };

    //===================================================//
    //start - experiment
    //===================================================//


    //creo datos solo para una pantalla...
    una_pantalla_datos = {
        tipo_content: 'es_song_slide',//por ahora solo texto...
        id_song: id_song,
        slide_actual: currentSlide,
        slide_html: slide_divs,
    };
    console.log('una_pantalla_datos: ', una_pantalla_datos);

    arr_pantalla.push(una_pantalla_datos);
    //arr_pantalla.push(una_pantalla_datos);//test
    //arr_pantalla.push(una_pantalla_datos);//test
    console.log('arr_pantalla: ', arr_pantalla);

    arr_pantalla_string = JSON.stringify(arr_pantalla);//es global
    console.log('arr_pantalla_string: ', arr_pantalla_string);

    localStorage.setItem('arr_pantalla',arr_pantalla_string);// para mostrar LOCALMENTE

    let tiempo_ms = Date.now();//tiempo en milisegundos


    //1.1 Objeto para LOCAL
    objPantalla = {
        id_song,
        slide_actual,
        arr_pantalla,
        pantalla_show,
        tiempo_restante_show,
        hora_actual_show,
        show_logo_en_fondo,
        show_imagen_en_fondo,
        tipo_content,
        bg_ruta,
        bg_media_type,
        video_ruta,
        brillo_pantalla,
        show_bible_en_fondo,
        show_black_en_fondo,
        user_view_control,
        show_legend,
        show_acordes,
        show_next_slide,
        show_en_top,
        show_en_parte_top,
        show_en_center,
        tipo_fuente,
        tiempo_ms: 0, //si meto para local, no se ajusta font-size bien
    };
    console.log('(local) --- objPantalla: ', objPantalla);
    
    //1.2 Objeto Params para LOCAL
    objPantallaParams = {
        pantalla_show,
        tiempo_restante_show,
        hora_actual_show,
        show_logo_en_fondo,
        show_imagen_en_fondo,
        tipo_content,
        bg_ruta,
        bg_media_type,
        video_ruta,
        brillo_pantalla,
        show_bible_en_fondo,
        show_black_en_fondo,
        user_view_control,
        show_legend,
        show_acordes,
        show_next_slide,
        show_en_top,
        show_en_parte_top,
        show_en_center,
        tipo_fuente,
        tiempo_ms: 0, //si meto para local, no se ajusta font-size bien
    };
    console.log('(local) --- objPantallaParams: ', objPantallaParams);


    let objPantalla_local = (localStorage.getItem('objPantalla')) ? JSON.parse(localStorage.getItem('objPantalla')) : null ;

    //Si se hace click en el mismo slide porque no se ve bien el texto...
    if( objPantalla_local && 
        id_song == objPantalla_local.id_song &&
        currentSlide == objPantalla_local.slide_actual 
    ){
        //meto el parametro y lo guardo en localStorage para que se ajuste de nuevo el tamaño de fuente         
        //objPantalla.tiempo_ms = tiempo_ms;
        //objPantallaParams.tiempo_ms = tiempo_ms;

        console.log('(meto tiempo_ms en local) --- objPantalla: ', objPantalla);
        console.log('(meto tiempo_ms en local) --- objPantallaParams: ', objPantallaParams);
    }
    
    update_objPantalla();//guardo en localStorage
    update_objPantallaParams();//guardo en localStorage


    //2. Preparo para enviar a BD
    let arr_pantalla_safe = structuredClone(arr_pantalla);
    console.log('antes. clonado --- arr_pantalla_safe: ', arr_pantalla_safe);

    //sanitizo cada item de array metiendo '__||__' en slide_html
    arr_pantalla_safe.forEach((item, i) => {
        console.log('item: ', item);
        item.slide_html = sanitizeHtmlForJson(compactHtml(item.slide_html));
    });        
    console.log('despues. con __||__ --- arr_pantalla_safe: ', arr_pantalla_safe);

    //Objeto para BD. asigno la variable global para enviar al BD
    objPantallaToSendToBd = {
        id_song,
        slide_actual,
        arr_pantalla: arr_pantalla_safe,
        pantalla_show,
        tiempo_restante_show,
        hora_actual_show,
        show_logo_en_fondo,
        show_imagen_en_fondo,
        tipo_content,
        bg_ruta,
        bg_media_type,
        video_ruta,
        brillo_pantalla,
        show_bible_en_fondo,
        show_black_en_fondo,
        user_view_control,
        show_legend,
        show_acordes,
        show_next_slide,
        show_en_top,
        show_en_parte_top,
        show_en_center,
        tiempo_ms,//solo meter en la bd, no en local!
    };
    console.log('objPantallaToSendToBd: ',objPantallaToSendToBd);

    //solo grabo en bd si estan abiertas las pestaña o ventana remotas
    if(miPantallaRemota){
        console.log('grabo en BD...');

        //guardo en la BD
        const result = await guardarArrPantallaEnBd();//se envia objPantallaToSendToBd
        console.log('arr_pantalla: ', arr_pantalla);
        console.log('result: ', result);
    }
    
    actualizarPantallas();

    //buildArrPantallaDesktop(arr_pantalla);//aki no uso esto. muestro el iframe
    
    console.log('fin make_arr_pantalla...');
}


function actualizarPantallas({
    actualizarSlide = true,
    actualizarVista = true
} = {}){
    console.log('=== function actualizarPantallas() ===');

    // Actualizar datos de la hora antes de enviarlos
    objHora.horaInicio = parseInt(eid_horaInicio.value, 10);
    objHora.minutosInicio = parseInt(eid_minutosInicio.value, 10);

    const payload = {
        tipo: 'pantalla_update',

        actualizarSlide,//por defecto es true
        actualizarVista,//por defecto es true

        arr_pantalla,
        objPantallaParams: crearObjPantallaParamsParaPantalla(),

        objTimer, //para temporizador
        objHora,  //para hora actual
        objVideo   //para video
    };
    
    // iframe local
    if(miIframe && miIframe.contentWindow){
        console.log('hay miIframe abierto. envio mensaje...');

        miIframe.contentWindow.postMessage(
            payload,
            window.location.origin
        );
    }
    
    // Elimino referencias cerradas
    limpiarReferenciasCerradas();

    // Todas las pantallas abiertas
    arr_misPantallas.forEach(referencia => {

        try {

            if(!referencia || referencia.closed){
                return;
            }

            const origin = (referencia.location.origin === window.location.origin)
                ? window.location.origin
                : '*';

            referencia.postMessage(
                payload,
                origin
            );

        } catch(error){

            // Si no puedo acceder a location.origin (cross-origin)
            referencia.postMessage(
                payload,
                '*'
            );

        }

    });

    //REVISAR LUEGO!!!
    // pantalla remota
    if (miPantallaRemota && !miPantallaRemota.closed) {
        console.log('hay miPantallaRemota abierta. envio mensaje...');

        pantallaRemota.postMessage(
            payload,
            '*'
        );
    }
}

function enviarMensajeReferencia(referencia, data){
    console.log('=== function enviarMensajeReferencia() ===');

    if(referencia && !referencia.closed){

        referencia.postMessage(
            data,
            window.location.origin
        );
        referencia.focus();

    }else{
        console.log('La referencia está cerrada o no existe');
    }
}
//no se usa todavia
// function enviarAccionPantalla(tipo){

//     enviarMensajeReferencia(
//         miPantallaLocal,
//         { tipo }
//     );

// }


async function showTipoContent(btn, param){
    console.log('=== function showTipoContent() ===');
    
    
    if(!param || !btn) return;

    if(btn.classList.contains('opt_fondo')){
        const contenedor = eid_block_esquema.querySelector('.wr_opt_fondo');
        if(contenedor){
            resetBtnActive(contenedor);
            show_logo_en_fondo = 0;//reset
            show_imagen_en_fondo = 0;//reset
            tipo_content = '';//reset
            bg_ruta = '';//reset
            bg_media_type = '';//reset
            video_ruta = '';//reset
            brillo_pantalla = 100;//reset
            show_bible_en_fondo = 0;//reset
            show_black_en_fondo = 0;//reset
            tiempo_restante_show = 0;//reset
            hora_actual_show = 0;//reset

            eid_fondo_body.className = '';//reset
            eid_fondo_body.style = '';//reset
            eid_imagenPersonalizada.classList.remove('d-block');
            eid_imagenPersonalizada.classList.add('d-none');//oculto
            
            //guardo en local
            localStorage.setItem('show_logo_en_fondo', show_logo_en_fondo);
            localStorage.setItem('show_imagen_en_fondo', show_imagen_en_fondo);
            localStorage.setItem('tipo_content', tipo_content);
            localStorage.setItem('bg_ruta', bg_ruta);
            localStorage.setItem('bg_media_type', bg_media_type);
            localStorage.setItem('video_ruta', video_ruta);
            localStorage.setItem('brillo_pantalla', brillo_pantalla);
            localStorage.setItem('show_bible_en_fondo', show_bible_en_fondo);
            localStorage.setItem('show_black_en_fondo', show_black_en_fondo);
            localStorage.setItem('tiempo_restante_show', tiempo_restante_show);
            localStorage.setItem('hora_actual_show', hora_actual_show);
        }
    }

    //todos los parametros de ajuste de pantalla como letras
    switch (param) {
        case 'i'://iglesia => mostrar logotipo de la iglesia en el fondo (cuando no se ve el slide)
            if(show_logo_en_fondo == 1){
                show_logo_en_fondo = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_logo_en_fondo = 1;//next action
                btn.classList.add('btn_active');
            }
            eid_fondo_body.className = '';//reset
            eid_fondo_body.classList.add('logo_en_fondo');
            localStorage.setItem('show_logo_en_fondo', show_logo_en_fondo);
            break;

        case 'g'://imagen de letra 'g' => mostrar imagen personalizada en el fondo (cuando no se ve el slide)
            if(show_imagen_en_fondo == 1){
                show_imagen_en_fondo = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_imagen_en_fondo = 1;//next action
                btn.classList.add('btn_active');
            }
            eid_fondo_body.className = '';//reset
            eid_fondo_body.classList.add('imagen_en_fondo');
            localStorage.setItem('show_imagen_en_fondo', show_imagen_en_fondo);

            eid_imagenPersonalizada.classList.remove('d-none');//muestro
            eid_imagenPersonalizada.classList.add('d-block');//muestro
            await pintMediaActiveEnFondo();//tiene guardado de bg_ruta en localStorage

            //pinto las imagenes personalizadas disponibles para elegir
            await pintMediaSubidos();
            break;

        case 'r'://brillo de letra 'r' => brillo de la pantalla (opacity) en fondo y texto
            console.log('aki aplicar brillo...');
            break;

        case 'b'://bible => mostrar imagen de la biblia abierta en el fondo (cuando no se ve el slide)
            if(show_bible_en_fondo == 1){
                show_bible_en_fondo = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_bible_en_fondo = 1;//next action
                btn.classList.add('btn_active');
            }
            eid_fondo_body.className = '';//reset
            eid_fondo_body.classList.add('bible_en_fondo');
            localStorage.setItem('show_bible_en_fondo', show_bible_en_fondo);
            break;

        case 'f'://fondo => mostrar fondo black en el fondo (cuando no se ve el slide)
            if(show_black_en_fondo == 1){
                show_black_en_fondo = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_black_en_fondo = 1;//next action
                btn.classList.add('btn_active');
            }
            eid_fondo_body.className = '';//reset
            eid_fondo_body.classList.add('black_en_fondo');
            localStorage.setItem('show_black_en_fondo', show_black_en_fondo);
            break;

        case 'u'://user => usuario puede controlar que mostrar en la vista de slide: legend, acordes, next_slide 
            if(user_view_control == 1){
                user_view_control = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                user_view_control = 1;//next action
                btn.classList.add('btn_active');
            }
            localStorage.setItem('user_view_control', user_view_control);
            break;            


        //Control por usuario    
        case 'l'://legend => mostrar títulos de bloques, legend de fieldset
            if(show_legend == 1){
                show_legend = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_legend = 1;//next action
                btn.classList.add('btn_active');
            }
            localStorage.setItem('show_legend', show_legend);
            break;

        case 'c'://chords => acordes
            if(show_acordes == 1){
                show_acordes = 0;//next action
                btn.classList.remove('btn_active');
                ocultarAcordes('#block_esquema_body');
            }else{
                show_acordes = 1;//next action
                btn.classList.add('btn_active');
                mostrarAcordes('#block_esquema_body');
            }
            localStorage.setItem('show_acordes', show_acordes);
            break;

        case 'n'://next slide => mostrar 2 lineas de sig slide
            if(show_next_slide == 1){
                show_next_slide = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_next_slide = 1;//next action
                btn.classList.add('btn_active');
            }
            localStorage.setItem('show_next_slide', show_next_slide);
            break;


        //mostrar el slide en el top con: justify-content: flex-start   
        case 't'://top => mostrar en el top
            if(show_en_top == 1){
                show_en_top = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_en_top = 1;//next action
                btn.classList.add('btn_active');

                show_en_center = 0;//deshabilito
                eid_btn_show_en_center.classList.remove('btn_active');
                localStorage.setItem('show_en_center', show_en_center);
            }
            localStorage.setItem('show_en_top', show_en_top);
            break;

        case 'z'://center la 'c' está ocupada para acordes 'chords' por eso => 'z'
            if(show_en_center == 1){
                show_en_center = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_en_center = 1;//next action
                btn.classList.add('btn_active');

                show_en_top = 0;//deshabilito
                eid_btn_show_en_top.classList.remove('btn_active');
                localStorage.setItem('show_en_top', show_en_top);
            }
            localStorage.setItem('show_en_center', show_en_center);
            break; 
            
        //new    
        case 'x'://top => mostrar en la parte top (50% de arriba de la pantalla)
            if(show_en_parte_top == 1){
                show_en_parte_top = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_en_parte_top = 1;//next action
                btn.classList.add('btn_active');
            }
            localStorage.setItem('show_en_parte_top', show_en_parte_top);
            break;
            
        //new    
        case 'w'://w => mostrar el tiempo restante hasta el inicio del culto en la hora actual
            if(tiempo_restante_show == 1){
                tiempo_restante_show = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                tiempo_restante_show = 1;//next action
                btn.classList.add('btn_active');
            }
            check_tiempo_restante_show();
            localStorage.setItem('tiempo_restante_show', tiempo_restante_show);
            break;
            
        //new    
        case 'h'://h => mostrar la hora actual del culto
            if(hora_actual_show == 1){
                hora_actual_show = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                hora_actual_show = 1;//next action
                btn.classList.add('btn_active');
            }
            check_hora_actual_show();
            localStorage.setItem('hora_actual_show', hora_actual_show);
            break;
            
    
        default:
            break;
    }

    await guardarEnLocalAndBd(param);
}


async function guardarEnLocalAndBd(param){
    console.log('=== function guardarEnLocalAndBd() ===');
    console.log('param:', param);

    //Admin control
    //p -> (pantalla) -> pantalla_show
    //w -> (w una letra disponible) -> tiempo_restante_show
    //h -> (hora)     -> hora_actual_show
    //i -> (iglesia)  -> show_logo_en_fondo
    //g -> (imagen)  -> show_imagen_en_fondo
    //b -> (bible)    -> show_bible_en_fondo
    //f -> (fondo)    -> show_black_en_fondo
    //u -> (user)     -> user_viev_control
    
    //User control si (user_viev_control == true)
    //l -> (legend)   -> user_viev_control
    //c -> (chords)   -> show_acordes
    //n -> (next)     -> show_next_slide
    //t -> (top)      -> show_en_top
    //z -> (center)   -> show_en_center
    //r -> (brillo)   -> brillo_pantalla
    //x -> (parte top) -> show_en_parte_top

    if(['p','w','h',  'i','g','b','f','u',   'l','c','n',  't','z',   'r', 'x'].includes(param)){
        
        //1. asigno la variable global para localStorage
        objPantallaParams = {
            pantalla_show,
            tiempo_restante_show,
            hora_actual_show,
            show_logo_en_fondo,
            show_imagen_en_fondo,
            tipo_content,
            bg_ruta,
            bg_media_type,
            video_ruta,
            brillo_pantalla,
            show_bible_en_fondo,
            show_black_en_fondo,
            user_view_control,
            show_legend,
            show_acordes,
            show_next_slide,
            show_en_top,
            show_en_parte_top,
            show_en_center,
            tipo_fuente
        };
        console.log('objPantallaParams: ',objPantallaParams);
        
        //guardo en localStorage
        objPantallaParams_str = JSON.stringify(objPantallaParams);
        localStorage.setItem('objPantallaParams', objPantallaParams_str);


        //2. asigno la variable global para enviar al BD
        objPantallaParamsToSendToBd = {
            id_song,
            pantalla_show,
            tiempo_restante_show,
            hora_actual_show,
            show_logo_en_fondo,
            show_imagen_en_fondo,
            tipo_content,
            bg_ruta,
            bg_media_type,
            video_ruta,
            brillo_pantalla,
            show_bible_en_fondo,
            show_black_en_fondo,
            user_view_control,
            show_legend,
            show_acordes,
            show_next_slide,
            show_en_top,
            show_en_parte_top,
            show_en_center,
            tipo_fuente
        };
        console.log('objPantallaParamsToSendToBd: ',objPantallaParamsToSendToBd);        
        
        //actualizo en BD SOLO los parametros de vista. No datos del arr_pantalla
        const resultParams = await guardarPantallaParamsEnBd();//objPantallaParamsToSendToBd es global
        console.log('resultParams: ', resultParams);

        //guardo en localStorage
        objPantallaParamsToSendToBd_str = JSON.stringify(objPantallaParamsToSendToBd);
        localStorage.setItem('objPantallaParamsToSendToBd', objPantallaParamsToSendToBd_str);

        //actualizo solo vista, no arr_pantalla
        actualizarPantallas({
            actualizarSlide: false,
            actualizarVista: true
        });
    }
}


/*
//no se usan en hs.
function enableDisablePantallaShow(){//muestra o oculta
    if(pantallaShow){
        pantallaShow = 0;//siguiente accion
    }else{        
        pantallaShow = 1;//siguiente accion
    }
    check_pantallaShow();
}
function check_pantallaShow(){
    console.log('=== function check_pantallaShow() ===');
    console.log('pantallaShow: ', pantallaShow);

    if(pantallaShow){
        mostrar_pantallaShow();
    }else{
        ocultar_pantallaShow();
    }
}
function mostrar_pantallaShow(){   
    // eid_btn_pantallaShow.classList.add('btn_active');
    eid_vklad_btn_pantallaShow.classList.add('btn_active');
    eid_contenedor_prev.classList.add('shown');
    //eid_fondo_body.classList.add('fondo_black');

    localStorage.setItem('pantallaShow','1');
    make_arr_pantalla(currentSlide);//dentro hay pantallaShow
}

function ocultar_pantallaShow(){
    // eid_btn_pantallaShow.classList.remove('btn_active');
    eid_vklad_btn_pantallaShow.classList.remove('btn_active');
    eid_contenedor_prev.classList.remove('shown');
    //eid_fondo_body.classList.remove('fondo_black');
    
    localStorage.setItem('pantallaShow','0');
    make_arr_pantalla(currentSlide);//dentro hay pantallaShow
}
*/


function toggle_ajustes_pers(){//muestra o oculta
    if(ajustes_pers){
        ajustes_pers = 0;//siguiente accion
    }else{        
        ajustes_pers = 1;//siguiente accion
    }
    check_ajustes_pers();
}
function check_ajustes_pers(){
    console.log('=== function check_ajustes_pers() ===');
    console.log('ajustes_pers: ', ajustes_pers);

    if(ajustes_pers){
        mostrar_ajustes_pers();
    }else{
        ocultar_ajustes_pers();
    }
}
function mostrar_ajustes_pers(){//es lo mismo que deshabilitar
    const d_ajustes_pers = eid_block_cancion.querySelector('#d_ajustes_pers');
    d_ajustes_pers.classList.add('active');
    d_ajustes_pers.querySelector('span').textContent = 'Deshabilitar ajustes personalizados';//next action
    eid_block_cancion.querySelector('#head_pers_shapka').innerHTML = 'Ajustes personalizados <b>HABILITADOS</b>';
    eid_block_cancion.querySelector('#wr_form_detalles_pers').style.display = 'block';

    //deshabilito inputs de ajustes generales
    document.querySelectorAll('.aj_general').forEach(el => {
        el.classList.add('desactivado');
        if(el.type == 'input'){
            el.disabled = true;
        }
    });

    const tipo_acorde_pers_input = eid_block_cancion.querySelector('#tipo_acorde_pers_hidden');
    const eid_tune_transpose_pers = eid_block_cancion.querySelector('#tune_transpose_pers');
    const eid_capo_pers = eid_block_cancion.querySelector('#capo_pers');

    const transpose_pers_val = Number(eid_tune_transpose_pers.value);
    const capo_pers_val = Number(eid_capo_pers.value);

    const transpose_val_new = getTransposeFromCapo(transpose_pers_val, capo_pers_val);        
    handleFormTranspose(transpose_val_new);
    handleFormTipoAcorde(tipo_acorde_pers_input.value);//para cambiar tipo acorde    
}
function ocultar_ajustes_pers(){//es lo mismo que deshabilitar
    const d_ajustes_pers = eid_block_cancion.querySelector('#d_ajustes_pers');
    d_ajustes_pers.classList.remove('active');
    d_ajustes_pers.querySelector('span').textContent = 'Habilitar ajustes personalizados';//next action
    eid_block_cancion.querySelector('#head_pers_shapka').innerHTML = 'Ajustes personalizados <b>DESHABILITADOS</b>';
    eid_block_cancion.querySelector('#wr_form_detalles_pers').style.display = 'none';

    //habilito inputs de ajustes generales
    document.querySelectorAll('.aj_general').forEach(el => {
        el.classList.remove('desactivado');
        if(el.type == 'input'){
            el.disabled = false;
        }
    });

    const tipo_acorde_input = eid_block_cancion.querySelector('#tipo_acorde_hidden');
    const eid_tune_transpose = eid_block_cancion.querySelector('#tune_transpose');

    handleFormTipoAcorde(tipo_acorde_input.value);//para cambiar tipo acorde
    handleFormTranspose(Number(eid_tune_transpose.value));//para transponer al cargar 
}





function toggle_pantalla_show(){//muestra o oculta
    if(pantalla_show){
        pantalla_show = 0;//siguiente accion
    }else{        
        pantalla_show = 1;//siguiente accion
    }
    check_pantalla_show();
}
function check_pantalla_show(){
    console.log('=== function check_pantalla_show() ===');
    console.log('pantalla_show: ', pantalla_show);

    if(pantalla_show){
        mostrar_pantalla_show();
    }else{
        ocultar_pantalla_show();
    }
}
function mostrar_pantalla_show(){   
    // eid_btn_pantallaShow.classList.add('btn_active');
    eid_vklad_btn_pantallaShow.classList.add('btn_active');
    eid_contenedor_prev.classList.add('shown');
    eid_pantalla_body.classList.add('shown');

    localStorage.setItem('pantalla_show','1');
    make_arr_pantalla(currentSlide);//dentro hay pantallaShow

    aplicarBrillo(brillo_pantalla);
}
async function ocultar_pantalla_show(){
    // eid_btn_pantallaShow.classList.remove('btn_active');
    eid_vklad_btn_pantallaShow.classList.remove('btn_active');
    eid_contenedor_prev.classList.remove('shown');
    eid_pantalla_body.classList.remove('shown');
    
    localStorage.setItem('pantalla_show','0');
    await pintMediaActiveEnFondo();
    
    aplicarBrillo(brillo_pantalla);
    await guardarEnLocalAndBd('p');//solo actualizo params de vista
}



function toggle_tiempo_restante_show(){
    if(tiempo_restante_show){
        tiempo_restante_show = 0;//siguiente accion
    }else{        
        tiempo_restante_show = 1;//siguiente accion
    }
    check_tiempo_restante_show();
}
function check_tiempo_restante_show(){
    console.log('=== function check_tiempo_restante_show() ===');
    console.log('tiempo_restante_show: ', tiempo_restante_show);

    if(tiempo_restante_show){
        mostrar_tiempo_restante_show();
    }else{
        ocultar_tiempo_restante_show();
    }
}
async function mostrar_tiempo_restante_show(){   
    eid_btn_tiempo_restante_show.classList.add('btn_active');
    eid_horaRestanteHoly.classList.add('shown');
    mostrarHoraRestante();    
    
    localStorage.setItem('tiempo_restante_show','1');
    await guardarEnLocalAndBd('w');//solo actualizo params de vista
}
async function ocultar_tiempo_restante_show(){
    eid_btn_tiempo_restante_show.classList.remove('btn_active');
    eid_horaRestanteHoly.classList.remove('shown');
    ocultarHoraRestante();
    
    localStorage.setItem('tiempo_restante_show','0');
    await guardarEnLocalAndBd('w');//solo actualizo params de vista
}


//hora_actual_show
function toggle_hora_actual_show(){
    if(hora_actual_show){
        hora_actual_show = 0;//siguiente accion
    }else{        
        hora_actual_show = 1;//siguiente accion
    }
    check_hora_actual_show();
}
function check_hora_actual_show(){
    console.log('=== function check_hora_actual_show() ===');
    console.log('hora_actual_show: ', hora_actual_show);

    if(hora_actual_show){
        mostrar_hora_actual_show();
    }else{
        ocultar_hora_actual_show();
    }
}
async function mostrar_hora_actual_show(){   
    console.log('=== function mostrar_hora_actual_show() ===');

    eid_horaHoly.classList.remove('grey');
    eid_horaHoly.classList.add('azul');

    makeBtnActive(eid_horaControlVista, eid_btn_mostrarHora);
    
    hora_actual_show = 1;
    localStorage.setItem('hora_actual_show','1');
    await guardarEnLocalAndBd('h');//solo actualizo params de vista
            //make_arr_pantalla(currentSlide);//dentro hay pantallaShow REVISAR SI HACE FALTA!!!
}
async function ocultar_hora_actual_show(){
    console.log('=== function ocultar_hora_actual_show() ===');

    eid_horaHoly.classList.remove('azul');
    eid_horaHoly.classList.add('grey');

    if(horaHolyInterval){
        // Sigue calculando la hora y el tiempo restante.
        // Sólo cambia el aspecto.
    } else {
        // No hay render: mostrar placeholders.
        eid_horaActualHoly.textContent = '--:--:--';
        eid_horaRestanteHoly_text.textContent = 'Годинник не увімкнено...';
        eid_horaRestanteHoly_time.textContent = '--:--';
    }

    makeBtnActive(eid_horaControlVista, eid_btn_ocultarHora);
    
    hora_actual_show = 0;
    localStorage.setItem('hora_actual_show','0');
    await guardarEnLocalAndBd('h');//solo actualizo params de vista
}



function check_fondo_body(){
    console.log('=== function check_fondo_body() ===');

    eid_fondo_body.className = '';//reset

    if(show_logo_en_fondo == 1){
        eid_fondo_body.classList.add('logo_en_fondo');
    }else if(show_imagen_en_fondo == 1){
        eid_fondo_body.classList.add('imagen_en_fondo');
    } else if(show_bible_en_fondo == 1){
        eid_fondo_body.classList.add('bible_en_fondo');
    } else if(show_black_en_fondo == 1){
        eid_fondo_body.classList.add('black_en_fondo');
    } else{
        eid_fondo_body.classList.add('bible_en_fondo');//bible
    }
}

function check_show_logo_en_fondo(){
    console.log('=== function check_show_logo_en_fondo() ===');
    console.log('show_logo_en_fondo: ', show_logo_en_fondo);
    
    if(show_logo_en_fondo){
        eid_btn_show_logo_en_fondo.classList.add('btn_active');
    }else{
        eid_btn_show_logo_en_fondo.classList.remove('btn_active');
    }
}


async function check_show_imagen_en_fondo(){
    console.log('=== function check_show_imagen_en_fondo() ===');
    console.log('show_imagen_en_fondo: ', show_imagen_en_fondo);
    
    if(show_imagen_en_fondo){
        eid_btn_show_imagen_en_fondo.classList.add('btn_active');
        await pintMediaActiveEnFondo();//tiene guardado de bg_ruta en localStorage
    }else{
        eid_btn_show_imagen_en_fondo.classList.remove('btn_active');
    }
}


async function check_brillo_pantalla(){
    console.log('=== function check_brillo_pantalla() ===');
    console.log('brillo_pantalla: ', brillo_pantalla);
    
    if(brillo_pantalla >= 10 && brillo_pantalla <= 100 ){
        pintBrillo(brillo_pantalla);
        aplicarBrillo(brillo_pantalla);
    }
}

function check_show_bible_en_fondo(){
    console.log('=== function check_show_bible_en_fondo() ===');
    console.log('show_bible_en_fondo: ', show_bible_en_fondo);
    
    if(show_bible_en_fondo){
        eid_btn_show_bible_en_fondo.classList.add('btn_active');
    }else{
        eid_btn_show_bible_en_fondo.classList.remove('btn_active');
    }
}

function check_show_black_en_fondo(){
    console.log('=== function check_show_black_en_fondo() ===');
    console.log('show_black_en_fondo: ', show_black_en_fondo);
    
    if(show_black_en_fondo){
        eid_btn_show_black_en_fondo.classList.add('btn_active');
    }else{
        eid_btn_show_black_en_fondo.classList.remove('btn_active');
    }
}


function check_user_view_control(){
    console.log('=== function check_user_view_control() ===');
    console.log('user_view_control: ', user_view_control);
    
    if(user_view_control){
        eid_btn_user_view_control.classList.add('btn_active');
    }else{
        eid_btn_user_view_control.classList.remove('btn_active');
    }
}


function check_show_legend(){
    console.log('=== function check_show_legend() ===');
    console.log('show_legend: ', show_legend);
    
    if(show_legend){
        eid_btn_show_legend.classList.add('btn_active');
    }else{
        eid_btn_show_legend.classList.remove('btn_active');
    }
}
function check_show_acordes(){
    console.log('=== function check_show_acordes() ===');
    console.log('show_acordes: ', show_acordes);
    
    if(show_acordes){
        eid_btn_show_acordes.classList.add('btn_active');
        mostrarAcordes('#block_esquema_body');
    }else{
        eid_btn_show_acordes.classList.remove('btn_active');
        ocultarAcordes('#block_esquema_body');
    }
}
function check_show_next_slide(){
    console.log('=== function check_show_next_slide() ===');
    console.log('show_next_slide: ', show_next_slide);
    
    if(show_next_slide){
        eid_btn_show_next_slide.classList.add('btn_active');
    }else{
        eid_btn_show_next_slide.classList.remove('btn_active');
    }
}

function check_show_en_top(){
    console.log('=== function check_show_en_top() ===');
    console.log('show_en_top: ', show_en_top);
    
    if(show_en_top){
        eid_btn_show_en_top.classList.add('btn_active');
    }else{
        eid_btn_show_en_top.classList.remove('btn_active');
    }
}

function check_show_en_parte_top(){
    console.log('=== function check_show_en_parte_top() ===');
    console.log('show_en_parte_top: ', show_en_parte_top);
    
    if(show_en_parte_top){
        eid_btn_show_en_parte_top.classList.add('btn_active');
    }else{
        eid_btn_show_en_parte_top.classList.remove('btn_active');
    }
}

function check_show_en_center(){
    console.log('=== function check_show_en_center() ===');
    console.log('show_en_center: ', show_en_center);
    
    if(show_en_center){
        eid_btn_show_en_center.classList.add('btn_active');
    }else{
        eid_btn_show_en_center.classList.remove('btn_active');
    }
}



function check_vkladActive(){//antes check_sidebarTabActive
    console.log('=== function check_vkladActive() ===');
    if(eid_block_esquema_head.querySelector(`#btn_${vkladActive}`)){
        showVklad(eid_block_esquema_head.querySelector(`#btn_${vkladActive}`), vkladActive);
    }
}


function showVklad(btnElement, param){//antes showSidebarTab()
    console.log('=== function showVklad() ===');

    vkladActive = param;
    update_vkladActive();

    eid_block_esquema_head.querySelectorAll('button').forEach(btn =>{
        //si el boton 'btnElement' no es el boton del bucle
        if(btn == btnElement){
            btn.classList.add('btn_active');            
        }else{
            btn.classList.remove('btn_active');
        }
    });

    eid_block_esquema.querySelectorAll('.vklads').forEach(vklad =>{
        let vklad_act = `vklad_${param}`;
        if(vklad.classList.contains(vklad_act)){
            vklad.style.display = 'block';
        }else{
            vklad.style.display = 'none';
        }
    });

    switch (param) {
        default:
        case 'ver_esquema':
            ver_esquema();
            break;

        case 'crear_esquema':
            crear_esquema();
            break;

        case 'select_slide':
            select_slide();
            //make_arr_pantalla(currentSlide);    
            break;
    }           
}

function update_vkladActive(){
    //console.log('=== function update_vkladActive() ===');    
    localStorage.setItem('vkladActive', vkladActive);

    // obj_ajustes.vkladActive = vkladActive;
    // update_obj_ajustes();
}

function update_objPantalla(){
    //actualizo variable global objPantalla en localStorage
    objPantalla_str = JSON.stringify(objPantalla);
    localStorage.setItem('objPantalla', objPantalla_str);
}

function update_objPantallaParams(){
    //actualizo variable global objPantallaParams en localStorage
    objPantallaParams_str = JSON.stringify(objPantallaParams);
    localStorage.setItem('objPantallaParams', objPantallaParams_str);
}




function hayElementosModalesAbiertos(opciones = { parcial: true }) {
    const modales = document.querySelectorAll('.elementos_modales');

    return [...modales].some(modal => {
        console.log('elemento modal --- modal: ', modal);
        
        // Si tiene la clase 'shown', se considera visible sin más comprobaciones
        if (modal.classList.contains('shown')) {
            console.log('el modal se considera visible ya que tiene class shown. return true.');
            return true;
        }else{
            console.log('el modal NO se considera visible ya que NO tiene class shown: sigo...');
        }

        // Comprobar si está oculto en el DOM
        if (!modal.offsetParent){
            console.log('el modal se considera oculto en el DOM. return false.');
            return false;
        }else{
            console.log('el modal se considera mostrado en el DOM. sigo...');
        }

        // Obtener posición y dimensiones relativas a la ventana
        const rect = modal.getBoundingClientRect();
        console.log('elemento modal rect: ', rect);


        // Comprobar tamaño
        if (rect.width === 0 || rect.height === 0) {
            console.log('el modal tiene ancho y alto = 0. return false.');            
            return false;
        }

        // Verificar visibilidad según la opción parcial o total
        if (opciones.parcial) {
            const condicion_parcial = (
                rect.bottom > 0 &&
                rect.right > 0 &&
                rect.top < window.innerHeight &&
                rect.left < window.innerWidth
            );
            console.log('condicion_parcial: ', condicion_parcial);
            return condicion_parcial;
        } else {
            const condicion_total = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth
            );
            console.log('condicion_total: ', condicion_total);
            return condicion_total;
        }
    });
}
//ejemplos de uso:
//hayElementosModalesAbiertos({ parcial: false });// Exigir que estén totalmente dentro de la ventana
//hayElementosModalesAbiertos();// Permitir modales parcialmente visibles



function esElementoVisible(elemento) {
    if (!elemento) return false; // No existe en el DOM

    // 1. Comprobar si está oculto con display:none o visibility:hidden
    if (!elemento.offsetParent) return false;

    // 2. Comprobar si está dentro del viewport
    const rect = elemento.getBoundingClientRect();
    return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
    );
}




function hideShowBlock(id_div, action = 'toggle'){//action: toggle, show, hide
    console.log('=== function hideShowBlock() ===');
    console.log('id_div: ',id_div);

    let divElement;

    if (typeof id_div === "string") {
        console.log("Es un string");
        divElement = document.getElementById(id_div);
    } else if (id_div instanceof HTMLElement) {
        console.log("Es un elemento HTML");
        divElement = id_div;
    } else {
        console.log("Otro tipo");
        alert('Error: el parámetro debe ser un string o un elemento HTML');
        return;
    }

    const block_css = window.getComputedStyle(divElement);
    const block_display = block_css.display;

    let next_display = '';//para guardar en localStorage

    if(action == 'toggle'){
        if(block_display == 'block'){//si es visible
            next_display = 'none';//oculto
        }else{//muestro
            next_display = 'block';//muestro
        } 
    }else{
        if(action == 'show'){
            next_display = 'block';//muestro
        }
        if(action == 'hide'){
            next_display = 'none';//muestro
        }
    }
 
    //aplico el cambio
    divElement.style.display = next_display;

    //guardo variable en localStorage
    //titulos
    if(id_div == 'title_detalles'){
        display_title_detalles = next_display;
        localStorage.setItem('display_title_detalles',display_title_detalles);
    }

    //detalles de la canción
    if(id_div == 'form_detalles'){
        display_form_detalles = next_display;
        localStorage.setItem('display_form_detalles',display_form_detalles);
    }

    //Ajustes personalizados
    if(id_div == 'form_detalles_pers'){
        display_form_detalles_pers = next_display;
        localStorage.setItem('display_form_detalles_pers',display_form_detalles_pers);
    }  
}



// hideShowSettings('nav');

async function hideShowDiv(id_div){
    console.log('=== function hideShowDiv() ===');
    console.log('id_div: ',id_div);

    const divElement = document.getElementById(id_div);
    const block_css = window.getComputedStyle(divElement);
    const block_display = block_css.display;
   
    if(block_display == 'block'){//si es visible
        closeDiv(divElement);//oculto
    }else{//muestro
        openDiv(divElement);//muestro
    }

    //creo tambien el li para añadir a la lista nueva
    const li_action_btn_add_lista_new = document.createElement('li');
    li_action_btn_add_lista_new.className = 'li_action btn_add_lista_new';
    li_action_btn_add_lista_new.innerHTML = `
        <span>Añadir a una Lista nueva</span>
    `;
    li_action_btn_add_lista_new.onclick = () =>{ 
        addToLista('new')
    };



    let btn_add_lista_inner_html;

    if(Object.keys(objLista).length === 0){//no hay lista activa
        btn_add_lista_inner_html = `
                Añadir a una Lista nueva
        `;
    }else{//hay lista activa
        btn_add_lista_inner_html = `
            <span class="sp_add_a_lista">
                <span>Añadir a la Lista ACTUAL: </span>
                <b class="n_lista">${objLista.id_lista}</b>
            </span>
            <span class="fecha_lista">${diaSemana(objLista.fecha)} &nbsp; ${objLista.fecha_ver}</span>
            <span class="title_lista">${objLista.title}</span>
            <span class="grupo_lista">${objLista.grupo_nombre}</span>
            <span class="wr_canciones">
                <span>Canciones: </span>
                <b class="n_canciones">${objLista.arr_lista.length}</b>
            </span>
        `;        
    }
    
    switch (id_div) {
        case 'bl_actions_buscar':
            if(buscar_ul_action.querySelector('.btn_add_lista')){
                buscar_ul_action.querySelector('.btn_add_lista').innerHTML = btn_add_lista_inner_html;

                const elemento_btn_add_lista_new = buscar_ul_action.querySelector('.btn_add_lista_new');
                if(id_lista){//si hay lista activa 
                    if(!elemento_btn_add_lista_new){//y si no existe el btn para crear lista nueva, lo añado
                        buscar_ul_action.querySelector('.btn_add_lista').after(li_action_btn_add_lista_new);//añado nuevo btn para crear lista nueva
                    }
                }else{
                    if(elemento_btn_add_lista_new){
                        elemento_btn_add_lista_new.remove();//si no hay lista activa y existe el btn para crear lista nueva, lo quito
                    }
                }
            }
            
        case 'bl_actions_cancion':
            if(cancion_ul_action.querySelector('.btn_add_lista')){
                cancion_ul_action.querySelector('.btn_add_lista').innerHTML = btn_add_lista_inner_html;

                const elemento_btn_add_lista_new = cancion_ul_action.querySelector('.btn_add_lista_new');
                if(id_lista){//si hay lista activa 
                    if(!elemento_btn_add_lista_new){//y si no existe el btn para crear lista nueva, lo añado
                        cancion_ul_action.querySelector('.btn_add_lista').after(li_action_btn_add_lista_new);//añado nuevo btn para crear lista nueva
                    }
                }else{
                    if(elemento_btn_add_lista_new){
                        elemento_btn_add_lista_new.remove();//si no hay lista activa y existe el btn para crear lista nueva, lo quito
                    }
                }
            }
            break;
            
        case 'bl_select_slide_settings':
            //imagen/media
            if(show_imagen_en_fondo == 1){
                eid_imagenPersonalizada.classList.remove('d-none');//muestro
                eid_imagenPersonalizada.classList.add('d-block');//muestro
                await pintMediaSubidos();
            }
            check_brillo_pantalla();

            //video/pelicula
            arr_lista_videos = await make_arr_lista_videos();
            await pintVideoSubidos();
            pintVideoActiveEnPlayer();

            break;
    
        default:
            break;
    }
}

function closeDiv(divElement){
    console.log('=== function closeDiv() ===');
    if(!divElement) return;
    
    const bl_set_inner = divElement.querySelector('.bl_set_inner');    
    
    bl_set_inner.classList.remove('bl_opened');
    bl_set_inner.classList.add('bl_closed');
    setTimeout(()=>{
        divElement.style.display = 'none';
    },300);
}

function openDiv(divElement){
    console.log('=== function openDiv() ===');

    const bl_set_inner = divElement.querySelector('.bl_set_inner');
    const inner_content_head = divElement.querySelector('.inner_content_head');
    const inner_content_body = divElement.querySelector('.inner_content_body');

    bl_set_inner.onclick = (e)=>{
        console.log('e.target: ', e.target);
        e.stopPropagation();

        // click fuera de 'inner_content_head_body' pero dentro de 'bl_set_inner' y 'inner_content'
        // si no es cliqueado 'inner_content_head_body' entonces fue clickeado fuera de 'inner_content_head_body'
        // es decir, 'bl_set_inner' o 'inner_content' => hacer closeDiv()
        if(!e.target.closest('.inner_content_head_body') || e.target.className == 'sp_close'){//click en 'X' cerrar
            closeDiv(e.target.closest('.bl_set'));
        }
    }

    divElement.style.display = 'block';
    setTimeout(()=>{//importante para que se ejecute la animación
        bl_set_inner.classList.remove('bl_closed');
        bl_set_inner.classList.add('bl_opened');        
    },3);

    //Para que se abra mas bonito , pongo el sig. código. 
    //No pongo en css 'overflow:auto;' ya que al desplegar el block muestra scroll y luego lo quita, lo que no es bonito
    //con js lo soluciono
    setTimeout(()=>{
        
        let body_max_h = 
          bl_set_inner.offsetHeight 
        - inner_content_head.offsetHeight
        ;
        console.log('body_max_h: ', body_max_h);        
        inner_content_body.style.maxHeight = body_max_h + 'px';

    },4);//300 es 0.3s de transition css
}


function parteCentral(param){
    const parteCentralAll = eid_block_esquema.querySelectorAll('.bl_parte_c');
    parteCentralAll.forEach(parteCentral => {       
        switch (param) {
            default:
            case 'show':
                console.log('lo hago visible...');
                parteCentral.classList.remove('oculto');
                break;
                    
            case 'hide':
                console.log('lo hago oculto...');
                parteCentral.classList.add('oculto');
                break;
        }
    });
}






//ejemplo de uso
//showToast('info', 'Ajustes personalizados aplicados correctamente.', 2000, 'bottom', false, document.querySelector('.vista_fixed_body'));

function showToast(tipo = 'info', mensaje, duration = null, position = 'default', with_head = false, text_head = 'Info', contenedor = null) {//default -> abajo derecha
    //position = 'default'// => abajo derecha
    //position = 'center'// => center y center

    if(!permitirShowToast){
        return;
    }

    let toast_container;
    let inner_position;

    if(!contenedor){//si no se indica el contenedor, cojo el por defecto
        toast_container = eid_toast_container;
        toast_container.innerHTML = '';//reset
        inner_position = 'inner_fixed';
    }else{
        toast_container = contenedor;
        contenedor.querySelector('.toast_container_inner')?.remove();
        inner_position = 'inner_absolute';
    }
   

    // eid_toast_container.innerHTML = '';//reset

    // Crear div outer para cubrir toda la pantalla
    const ecl_toast_container_inner = document.createElement('div');
    ecl_toast_container_inner.className = `toast_container_inner ${position} ${inner_position}`;
    ecl_toast_container_inner.onclick = (e) => {
        console.log('toast_close ecl_toast_container_inner. e.currentTarget: ', e.currentTarget);
        console.log('toast_close ecl_toast_container_inner. e.target: ', e.target);
        e.stopPropagation();

        //click en ecl_toast_container_inner pero fuera del toast, para cerrar el toast
        if(!e.target.closest('.toast')){//si el click es fuera del toast
            closeToastWithFade();
        }
    };


    function closeToastWithFade(duration = 10){//por defecto cerrar inmediatamente (10ms)
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => ecl_toast_container_inner.remove(), 1000);
        }, duration);
    }


    // Crear toast
    const toast = document.createElement('div');
    toast.className = `toast`;

    if(with_head){
        
        toast.innerHTML = `
            <div class="toast_inner">
                <div class="toast_head">
                    <div>${text_head}</div>
                    <!-- aki btn de cerrar toast -->
                </div>
                <div class="toast_body ${tipo}">
                    <div class="toast_mensaje">${mensaje}</div>
                </div>
            </div>
        `;
    
    }else{//default simple

        toast.innerHTML = `
            <div class="toast_body simple ${tipo}">
                <div class="toast_mensaje">${mensaje}</div>
                <!-- aki btn de cerrar toast -->
            </div>
        `;
    }


    //si no hay duration, muestro btn de cerrar
    if(!duration || duration  <= 1000){
        const ejemplo_btn = '<button class="toast_close" onclick="this.parentElement.remove()">×</button>';

        const toast_close = document.createElement('button');
        toast_close.className = 'toast_close';
        toast_close.textContent = '×';
        toast_close.onclick = (e) => {
            console.log('toast_close clicked. e.currentTarget: ', e.currentTarget);
            closeToastWithFade();
        }

        //añado al toast
        if(with_head){
            toast.querySelector('.toast_head').append(toast_close);
        }else{
            toast.querySelector('.toast_body').append(toast_close);
        }
    }

    //Añado al DOM
    // eid_toast_container.appendChild(toast);
    toast_container.appendChild(ecl_toast_container_inner);
    ecl_toast_container_inner.appendChild(toast);
    

    ecl_toast_container_inner.classList.add('show');

    // Forzar reflow para activar transición
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    if(duration > 1000){
       console.log('hay duration: ', duration);
        // Auto eliminar
        closeToastWithFade(duration);
    }
}


function scrollToElement(contenedor, elemento) {
    //const contenedor = document.getElementById("contenedor");
    //const elemento = document.getElementById(id);

    // Calcular posición relativa del elemento dentro del contenedor
    const offsetTop = elemento.offsetTop - contenedor.offsetTop;

    // Ajustar scrollTop del contenedor
    contenedor.scrollTo({
        top: offsetTop,
        behavior: "smooth"
    });
}




/**
 * Hace que un elemento se muestre dentro de su contenedor sin mover el resto de la página
 * @param {HTMLElement} container - Contenedor con overflow scroll/auto
 * @param {HTMLElement} element - Elemento a mostrar
 * @param {boolean} smooth - Si true hace scroll suave
 * @param {string} block - 'top', 'center' hace scroll al top de contenedor o el centro verticalmente
 */
function scrollIntoViewInContainer(container, element, smooth = true, block = 'top') {
    if (!element || !container) return;

    // Posición del elemento relativa al contenedor
    const elementTop = element.offsetTop - container.offsetTop;
    const elementHeight = element.offsetHeight;
    const containerHeight = container.clientHeight;

    let targetScroll;
    let margin_top = 0;

    if (block === 'top') {
        // Scroll para alinear el elemento con la parte superior del contenedor
        targetScroll = elementTop + margin_top;
    } else if (block === 'center') {
        // Scroll para centrar el elemento en el contenedor
        targetScroll = elementTop - (containerHeight / 2) + (elementHeight / 2) + margin_top;
    } else {
        // Por defecto usamos 'top'
        targetScroll = elementTop + margin_top;
    }

    // Evitar scroll negativo
    if (targetScroll < 0) targetScroll = 0 + margin_top;

    // Evitar pasar del máximo scroll
    const maxScroll = container.scrollHeight - containerHeight;
    if (targetScroll > maxScroll) targetScroll = maxScroll;

    // Aplicar scroll
    if (smooth && 'scrollTo' in container) {
        container.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
        container.scrollTop = targetScroll;
    }
}





function hideShowDesktopFilter(contenedor_filtro, sp_icon_filtro){
    if(contenedor_filtro.classList.contains('shown')){//si es mostrado
        hideDesktopFilter(contenedor_filtro, sp_icon_filtro);
    }else{
        showDesktopFilter(contenedor_filtro, sp_icon_filtro);
    }
    mySizeBuscar();   
}

function hideDesktopFilter(contenedor_filtro, sp_icon_filtro){
    contenedor_filtro.classList.remove('shown');//lo oculto
    const sp_filtro_img = sp_icon_filtro.querySelector('img');
    if(sp_filtro_img){
        sp_filtro_img.classList.remove('razv');
    }
    //const el_div = contenedor_filtro.parentElement;
    //getMySizeByDiv(el_div);
}

function showDesktopFilter(contenedor_filtro, sp_icon_filtro){
    contenedor_filtro.classList.add('shown');//lo muestro
    const sp_filtro_img = sp_icon_filtro.querySelector('img');
    if(sp_filtro_img){
        sp_filtro_img.classList.add('razv');
    }
    contenedor_filtro.querySelector('.inpt_vvod').focus();
    //const el_div = contenedor_filtro.parentElement;
    //getMySizeByDiv(el_div);
}






function mySizeBuscar(){
    console.log('=== function mySizeBuscar() ===');

    // Get the height of the element, including margins
    // const sidebarInner_margins_h = 
    // parseInt(sidebarInner_computedStyle.marginTop) + 
    // parseInt(sidebarInner_computedStyle.marginBottom);

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    console.log('window_w: ', window_w);    
    console.log('window_h: ', window_h);
    
    let inner_margins = parseInt(inner_computedStyle.marginTop) + parseInt(inner_computedStyle.marginBottom);//10 * 2;    
    
    let edit_head_h = ecl_edit_head.offsetHeight;
    console.log('edit_head_h: ', edit_head_h);    
    //console.log('ecl_edit_body.offsetHeight: ', ecl_edit_body.offsetHeight);
    
    let bl_head_h = ecl_bl_head.offsetHeight;
    console.log('bl_head_h: ', bl_head_h);    

    let edit_body_h = 
      window_h 
    - ecl_edit_head.offsetHeight 
    ;
    // console.log('edit_body_h: ', edit_body_h);    
    // ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicar

    let bl_body_h = 
      edit_body_h 
    - ecl_bl_head.offsetHeight
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor 
    ;
    console.log('bl_body_h: ', bl_body_h);    
    ecl_bl_body.style.height = bl_body_h + 'px';//comento para no duplicat

    let block_buscar_head_h = eid_block_buscar.querySelector('#block_buscar_head').offsetHeight;
    console.log('block_buscar_head_h: ', block_buscar_head_h);  
    

    //=========================================================================================//
    //bl_parte_l
    //=========================================================================================//    
    let parte_fija_l_h = eid_block_buscar.querySelector('.bl_parte_l .parte_fija').offsetHeight;
    console.log('parte_fija_l_h: ', parte_fija_l_h);

    let parte_variable_l_h = 
      bl_body_h //858
    - block_buscar_head_h //43
    - parte_fija_l_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;

    // if(window.innerWidth < pantallaTabletMinPx){//mobile
    //     alert('1. es mobil. calculo height...');
    //     parte_variable_l_h = parte_variable_l_h / 2;
    // }else{//desktop
    //     alert('1. es desktop. calculo width...');
    // }

    console.log('parte_variable_l_h: ', parte_variable_l_h);    
    eid_block_buscar.querySelector('.bl_parte_l .parte_variable').style.height = parte_variable_l_h + 'px';//comento para no duplicat


    let titulo_tabla_song_h = eid_block_buscar.querySelector('#titulo_tabla_song').offsetHeight;
    let d_filter_results_h = eid_block_buscar.querySelector('#d_filter_results').offsetHeight;
    let wr_tabla_paddings = parseInt(wr_tabla_computedStyle.paddingTop) + parseInt(wr_tabla_computedStyle.paddingBottom);//10 * 2;

    let wr_tabla_inner_h = 
      parte_variable_l_h //645
    - titulo_tabla_song_h //38
    - d_filter_results_h //0
    - wr_tabla_paddings //20
    ;
    console.log('wr_tabla_inner_h: ', wr_tabla_inner_h); 
    
    
    // if(window.innerWidth < pantallaTabletMinPx){//mobile
    //     alert('2. es mobil. calculo height...');
    //     wr_tabla_inner_h = wr_tabla_inner_h / 2;
    // }else{//desktop
    //     alert('2. es desktop. calculo width...');
    // }

    //pongo max-height para que scroll esté arriba si hay pocos registros 
    eid_block_buscar.querySelector('.bl_parte_l .wr_tabla_inner').style.maxHeight = wr_tabla_inner_h + 'px';//'max-height', no 'height'

    
    //=========================================================================================//
    //bl_parte_r
    //=========================================================================================//
    let parte_fija_r_h = eid_block_buscar.querySelector('.bl_parte_r .parte_fija').offsetHeight;
    console.log('parte_fija_r_h: ', parte_fija_r_h);

    let parte_variable_r_h = 
      bl_body_h //858
    - block_buscar_head_h //43
    - parte_fija_r_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;

    // if(window.innerWidth < pantallaTabletMinPx){//mobile
    //     alert('3. es mobil. calculo height...');
    //     parte_variable_r_h = parte_variable_r_h / 2;
    // }else{//desktop
    //     alert('3. es desktop. calculo width...');
    // }

    console.log('parte_variable_r_h: ', parte_variable_r_h);    
    eid_block_buscar.querySelector('.bl_parte_r .parte_variable').style.height = parte_variable_r_h + 'px';//comento para no duplicat

    console.log('=== end func ===');
}


function mySizeEsquema(){
    console.log('=== function mySizeEsquema() ===');

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    console.log('window_w: ', window_w);    
    console.log('window_h: ', window_h);
    
    let inner_margins = parseInt(inner_computedStyle.marginTop) + parseInt(inner_computedStyle.marginBottom);//10 * 2;    
    
    let edit_head_h = ecl_edit_head.offsetHeight;
    console.log('edit_head_h: ', edit_head_h);    
    //console.log('ecl_edit_body.offsetHeight: ', ecl_edit_body.offsetHeight);
    
    let bl_head_h = ecl_bl_head.offsetHeight;
    console.log('bl_head_h: ', bl_head_h);    

    let edit_body_h = 
      window_h 
    - ecl_edit_head.offsetHeight 
    ;
    // console.log('edit_body_h: ', edit_body_h);    
    // ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicar

    let bl_body_h = 
      edit_body_h 
    - ecl_bl_head.offsetHeight
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor 
    ;
    console.log('bl_body_h: ', bl_body_h);    
    ecl_bl_body.style.height = bl_body_h + 'px';//comento para no duplicat

    let block_esquema_head_h = eid_block_esquema.querySelector('#block_esquema_head').offsetHeight;
    console.log('block_esquema_head_h: ', block_esquema_head_h);
    
    //recorrer todas las 'vklads'
    eid_block_esquema.querySelectorAll('.vklads').forEach((vklad, i)=>{
        if(esElementoVisible(vklad)){
            console.log('vklad es visible. vklad: ', vklad);
            
            const cl_vklad = vklad.classList[0];
            mySizeEsquemaByClassVklad(cl_vklad, bl_body_h, block_esquema_head_h, inner_margins);
        }
    });

    console.log('=== end func ===');
}


function mySizeEsquemaByClassVklad(cl_vklad, bl_body_h, block_esquema_head_h, inner_margins){
    console.log('=== function mySizeEsquemaByClassVklad() ===');

    //=========================================================================================//
    //bl_parte_l
    //=========================================================================================//    
    let parte_fija_l_h = eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_l .parte_fija`).offsetHeight;
    console.log('parte_fija_l_h: ', parte_fija_l_h);

    let parte_variable_l_h = 
      bl_body_h //858
    - block_esquema_head_h //43
    - parte_fija_l_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_l_h: ', parte_variable_l_h);    
    eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_l .parte_variable`).style.height = parte_variable_l_h + 'px';

    //si hay parte CENTRAL
    if( eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_c`) ){
        //=========================================================================================//
        //bl_parte_c
        //=========================================================================================//    
        let parte_fija_c_h = eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_c .parte_fija`).offsetHeight;
        console.log('parte_fija_c_h: ', parte_fija_c_h);
    
        let parte_variable_c_h = 
          bl_body_h //858
        - block_esquema_head_h //43
        - parte_fija_c_h //150
        - inner_margins //margin-top y margin-bottom de '.inner' contenedor
        ;
        console.log('parte_variable_c_h: ', parte_variable_c_h);    
        eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_c .parte_variable`).style.height = parte_variable_c_h + 'px';
    }

    
    //=========================================================================================//
    //bl_parte_r
    //=========================================================================================//
    let parte_fija_r_h = eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_r .parte_fija`).offsetHeight;
    console.log('parte_fija_r_h: ', parte_fija_r_h);

    let parte_variable_r_h = 
      bl_body_h //858
    - block_esquema_head_h //43
    - parte_fija_r_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_r_h: ', parte_variable_r_h);    
    eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_r .parte_variable`).style.height = parte_variable_r_h + 'px';

}


function mySizeCancion(){
    console.log('=== function mySizeCancion() ===');

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    console.log('window_w: ', window_w);    
    console.log('window_h: ', window_h);
    
    let inner_margins = parseInt(inner_computedStyle.marginTop) + parseInt(inner_computedStyle.marginBottom);//10 * 2;    
    
    let edit_head_h = ecl_edit_head.offsetHeight;
    console.log('edit_head_h: ', edit_head_h);    
    //console.log('ecl_edit_body.offsetHeight: ', ecl_edit_body.offsetHeight);
    
    let bl_head_h = ecl_bl_head.offsetHeight;
    console.log('bl_head_h: ', bl_head_h);    

    let edit_body_h = 
      window_h 
    - ecl_edit_head.offsetHeight 
    ;
    // console.log('edit_body_h: ', edit_body_h);    
    // ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicar

    let bl_body_h = 
      edit_body_h 
    - ecl_bl_head.offsetHeight
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor 
    ;
    console.log('bl_body_h: ', bl_body_h);    
    ecl_bl_body.style.height = bl_body_h + 'px';//comento para no duplicat

    let block_cancion_head_h = eid_block_cancion.querySelector('#block_cancion_head').offsetHeight;
    console.log('block_cancion_head_h: ', block_cancion_head_h);  
    

    //=========================================================================================//
    //bl_parte_l
    //=========================================================================================//    
    let parte_fija_l_h = eid_block_cancion.querySelector('.bl_parte_l .parte_fija').offsetHeight;
    console.log('parte_fija_l_h: ', parte_fija_l_h);

    let parte_variable_l_h = 
      bl_body_h //858
    - block_cancion_head_h //43
    - parte_fija_l_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_l_h: ', parte_variable_l_h);    
    eid_block_cancion.querySelector('.bl_parte_l .parte_variable').style.height = parte_variable_l_h + 'px';//comento para no duplicat


    // let titulo_tabla_song_h = eid_block_cancion.querySelector('#titulo_tabla_song').offsetHeight;
    // let d_filter_results_h = eid_block_cancion.querySelector('#d_filter_results').offsetHeight;
    // let wr_tabla_paddings = parseInt(wr_tabla_computedStyle.paddingTop) + parseInt(wr_tabla_computedStyle.paddingBottom);//10 * 2;

    // let wr_tabla_inner_h = 
    //   parte_variable_l_h //645
    // - titulo_tabla_song_h //38
    // - d_filter_results_h //0
    // - wr_tabla_paddings //20
    // ;
    // console.log('wr_tabla_inner_h: ', wr_tabla_inner_h); 

    // //pongo max-height para que scroll esté arriba si hay pocos registros 
    // eid_block_cancion.querySelector('.bl_parte_l .wr_tabla_inner').style.maxHeight = wr_tabla_inner_h + 'px';//'max-height', no 'height'

    
    //=========================================================================================//
    //bl_parte_r
    //=========================================================================================//
    let parte_fija_r_h = eid_block_cancion.querySelector('.bl_parte_r .parte_fija').offsetHeight;
    console.log('parte_fija_r_h: ', parte_fija_r_h);

    let parte_variable_r_h = 
      bl_body_h //858
    - block_cancion_head_h //43
    - parte_fija_r_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_r_h: ', parte_variable_r_h);    
    eid_block_cancion.querySelector('.bl_parte_r .parte_variable').style.height = parte_variable_r_h + 'px';//comento para no duplicat

    console.log('=== end func ===');
}


function mySizeEjemplo(){
    console.log('=== function mySizeEjemplo() ===');

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    console.log('window_w: ', window_w);    
    console.log('window_h: ', window_h);
    
    let inner_margins = parseInt(inner_computedStyle.marginTop) + parseInt(inner_computedStyle.marginBottom);//10 * 2;    
    
    let edit_head_h = ecl_edit_head.offsetHeight;
    console.log('edit_head_h: ', edit_head_h);    
    //console.log('ecl_edit_body.offsetHeight: ', ecl_edit_body.offsetHeight);
    
    let bl_head_h = ecl_bl_head.offsetHeight;
    console.log('bl_head_h: ', bl_head_h);    

    let edit_body_h = 
      window_h 
    - ecl_edit_head.offsetHeight 
    ;
    // console.log('edit_body_h: ', edit_body_h);    
    // ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicar

    let bl_body_h = 
      edit_body_h 
    - ecl_bl_head.offsetHeight
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor 
    ;
    console.log('bl_body_h: ', bl_body_h);    
    ecl_bl_body.style.height = bl_body_h + 'px';//comento para no duplicat

    let block_ejemplo_head_h = eid_block_ejemplo.querySelector('#block_ejemplo_head').offsetHeight;
    console.log('block_ejemplo_head_h: ', block_ejemplo_head_h);  
    

    //=========================================================================================//
    //bl_parte_l
    //=========================================================================================//    
    let parte_fija_l_h = eid_block_ejemplo.querySelector('.bl_parte_l .parte_fija').offsetHeight;
    console.log('parte_fija_l_h: ', parte_fija_l_h);

    let parte_variable_l_h = 
      bl_body_h //858
    - block_ejemplo_head_h //43
    - parte_fija_l_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_l_h: ', parte_variable_l_h);    
    eid_block_ejemplo.querySelector('.bl_parte_l .parte_variable').style.height = parte_variable_l_h + 'px';//comento para no duplicat

    
    //=========================================================================================//
    //bl_parte_r
    //=========================================================================================//
    let parte_fija_r_h = eid_block_ejemplo.querySelector('.bl_parte_r .parte_fija').offsetHeight;
    console.log('parte_fija_r_h: ', parte_fija_r_h);

    let parte_variable_r_h = 
      bl_body_h //858
    - block_ejemplo_head_h //43
    - parte_fija_r_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_r_h: ', parte_variable_r_h);    
    eid_block_ejemplo.querySelector('.bl_parte_r .parte_variable').style.height = parte_variable_r_h + 'px';//comento para no duplicat

    console.log('=== end func ===');
}



function mySizeLista(){
    console.log('=== function mySizeLista() ===');

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    console.log('window_w: ', window_w);    
    console.log('window_h: ', window_h);
    
    let inner_margins = parseInt(inner_computedStyle.marginTop) + parseInt(inner_computedStyle.marginBottom);//10 * 2;    
    
    let edit_head_h = ecl_edit_head.offsetHeight;
    console.log('edit_head_h: ', edit_head_h);    
    //console.log('ecl_edit_body.offsetHeight: ', ecl_edit_body.offsetHeight);
    
    let bl_head_h = ecl_bl_head.offsetHeight;
    console.log('bl_head_h: ', bl_head_h);    

    let edit_body_h = 
      window_h 
    - ecl_edit_head.offsetHeight 
    ;
    // console.log('edit_body_h: ', edit_body_h);    
    // ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicar

    let bl_body_h = 
      edit_body_h 
    - ecl_bl_head.offsetHeight
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor 
    ;
    console.log('bl_body_h: ', bl_body_h);    
    ecl_bl_body.style.height = bl_body_h + 'px';//comento para no duplicat

    let block_lista_head_h = eid_block_lista.querySelector('#block_lista_head').offsetHeight;
    console.log('block_lista_head_h: ', block_lista_head_h);  
    

    //=========================================================================================//
    //bl_parte_l
    //=========================================================================================//    
    let parte_fija_l_h = eid_block_lista.querySelector('.bl_parte_l .parte_fija').offsetHeight;
    console.log('parte_fija_l_h: ', parte_fija_l_h);

    let parte_variable_l_h = 
      bl_body_h //858
    - block_lista_head_h //43
    - parte_fija_l_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_l_h: ', parte_variable_l_h);    
    eid_block_lista.querySelector('.bl_parte_l .parte_variable').style.height = parte_variable_l_h + 'px';//comento para no duplicat


    let titulo_tabla_lista_h = eid_block_lista.querySelector('#titulo_tabla_lista').offsetHeight;
    let d_filter_results_h = eid_block_lista.querySelector('#d_filter_results_lista').offsetHeight;
    let wr_tabla_paddings = parseInt(wr_tabla_computedStyle.paddingTop) + parseInt(wr_tabla_computedStyle.paddingBottom);//10 * 2;

    let wr_tabla_inner_h = 
      parte_variable_l_h //645
    - titulo_tabla_lista_h //38
    - d_filter_results_h //0
    - wr_tabla_paddings //20
    ;
    console.log('wr_tabla_inner_h: ', wr_tabla_inner_h); 

    //pongo max-height para que scroll esté arriba si hay pocos registros 
    eid_block_lista.querySelector('.bl_parte_l .wr_tabla_inner').style.maxHeight = wr_tabla_inner_h + 'px';//'max-height', no 'height'

    
    //=========================================================================================//
    //bl_parte_r
    //=========================================================================================//
    let parte_fija_r_h = eid_block_lista.querySelector('.bl_parte_r .parte_fija').offsetHeight;
    console.log('parte_fija_r_h: ', parte_fija_r_h);

    let parte_variable_r_h = 
      bl_body_h //858
    - block_lista_head_h //43
    - parte_fija_r_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_r_h: ', parte_variable_r_h);    
    eid_block_lista.querySelector('.bl_parte_r .parte_variable').style.height = parte_variable_r_h + 'px';//comento para no duplicat

    console.log('=== end func ===');
}


function mySizeIframe(contenedorDimenciones){
    console.log('=== function mySizeIframe() ===');

    const miIframe = document.getElementById('miIframe');
    if(!miIframe){
        console.log('no hay miIframe. return...');
        return;
    }

    //ajusto tamaño del iframe al contenedor
    miIframe.style.width = contenedorDimenciones.offsetWidth + 'px';
    miIframe.style.height = contenedorDimenciones.offsetHeight + 'px';
}



function checkAllCboxes(id_contenedor){
    console.log('=== function checkAllCboxes() ===');
    const contenedor = document.getElementById(id_contenedor);
    if(!contenedor) return;

    cboxesAll = contenedor.querySelectorAll('input[type="checkbox"]');
    cboxesAll.forEach(cbox => {
        cbox.checked = true;
        handleCheckbox(cbox);
    });
}

function uncheckAllCboxes(id_contenedor){
    console.log('=== function uncheckAllCboxes() ===');
    const contenedor = document.getElementById(id_contenedor);
    if(!contenedor) return;

    cboxesAll = contenedor.querySelectorAll('input[type="checkbox"]');
    cboxesAll.forEach(cbox => {
        cbox.checked = false;
        handleCheckbox(cbox);
    });
}

function handleCheckbox(cbox){//cbox es element
    if(!cbox) return;

    //const cbox = e.currentTarget.querySelector('input[type="checkbox"]');
    const int_val = Number(cbox.value);

    if(cbox.checked){
        if(!arr_songbooks.includes(int_val)){
            arr_songbooks.push(int_val);
        }
    }else{
        const index = arr_songbooks.indexOf(int_val);
        if (index !== -1) {
            arr_songbooks.splice(index, 1); // Elimina 1 elemento en esa posición
        }
    }
    check_arr_songbooks();
}
















// function check_sidebarShow(){//solo pinto el botón
//     //console.log('=== function check_sidebarShow() ===');
//     //console.log('sidebarShow: ', sidebarShow);

//     if(sidebarShow){
//         //console.log('sidebarShow == true. marco como activo');
//         mostrar_sidebar();
//     }else{
//         //console.log('sidebarShow == false. marco como INactivo');        
//         ocultar_sidebar();
//     }
// }



function hideShowPanel(id_contenedor, panelSideParam, esquema_vklad = null){ 
    console.log('=== function hideShowPanel()===');

    const contenedor = document.getElementById(id_contenedor);//'block_buscar', 'block_esquema'
    if(!contenedor) return;

    let btnSideElement;//'.dbtn_panel_l' o '.dbtn_panel_r'
    let panelSideElement;//'.bl_parte_l' o '.bl_parte_r'
    
    if(id_contenedor == 'block_esquema' && esquema_vklad){
        switch (esquema_vklad) {
            default:
            case 'ver_esquema':
                btnSideElement = contenedor.querySelector(`#${id_contenedor}_head .vklad_ver_esquema .dbtn_panel_${panelSideParam}`);
                panelSideElement = contenedor.querySelector(`#${id_contenedor}_body .vklad_ver_esquema .bl_parte_${panelSideParam}`);
                break;
                
            case 'crear_esquema':
                btnSideElement = contenedor.querySelector(`#${id_contenedor}_head .vklad_crear_esquema .dbtn_panel_${panelSideParam}`);
                panelSideElement = contenedor.querySelector(`#${id_contenedor}_body .vklad_crear_esquema .bl_parte_${panelSideParam}`);
                break;
                
            case 'select_slide':
                btnSideElement = contenedor.querySelector(`#${id_contenedor}_head .vklad_select_slide .dbtn_panel_${panelSideParam}`);
                panelSideElement = contenedor.querySelector(`#${id_contenedor}_body .vklad_select_slide .bl_parte_${panelSideParam}`);
                break;        
        }
    }else{
        btnSideElement = contenedor.querySelector(`#${id_contenedor}_head .dbtn_panel_${panelSideParam}`);//'#block_buscar_head .dbtn_panel_l'
        panelSideElement = contenedor.querySelector(`#${id_contenedor}_body .bl_parte_${panelSideParam}`);//'#block_buscar_body .bl_parte_l'
    }
    
    if(!btnSideElement || !panelSideElement){
        alert('no existe btnSideElement o panelSideElement');
        return;
    } 

    let partesAll = contenedor.querySelectorAll('.partes');
    let count_partes_visibles = 0;
    partesAll.forEach(parte => {
        if(esElementoVisible(parte)){
            count_partes_visibles++;
        }
    });


    let disp = panelSideElement.style.display;
    if(disp != 'none' || panelSideElement.offsetWidth > 0 ){//si se ve y hay mas de 1 parte visible
        if(count_partes_visibles > 1){
            //alert('se ve y hay mas de 1 parte visible. lo oculto');
            ocultar_panel(btnSideElement, panelSideElement);
        }else{
            //alert('se ve PERO hay SOLO 1 parte visible. no hago nada...');

            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No se puede ocultar la uníca parte visible. Debe ser vista al menos una.</p>
            `;
            openModal('center','Aviso Ocultar Partes',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_lista
        }
    }else{// si no se ve
        mostrar_panel(btnSideElement, panelSideElement);
    }
}

function mostrar_panel(btnSideElement, panelSideElement){
    console.log('=== function mostrar_panel() ===');

    //estado -> ocultado
    panelSideElement.style.display = 'block';
    btnSideElement.classList.remove('inactive');
    btnSideElement.classList.add('active');

    //sidebarShow = true;
    //mySizeWindow();

    // localStorage.setItem('sidebarShow', sidebarShow);
    // obj_ajustes.sidebarShow = sidebarShow;
    // update_obj_ajustes();
}

function ocultar_panel(btnSideElement, panelSideElement){
    console.log('=== function ocultar_panel() ===');
    
    //estado -> ocultado
    panelSideElement.style.display = 'none';
    btnSideElement.classList.remove('active');
    btnSideElement.classList.add('inactive');

    //sidebarShow = false;
    //mySizeWindow();

    //localStorage.setItem('sidebarShow', sidebarShow);
    //obj_ajustes.sidebarShow = sidebarShow;
    //update_obj_ajustes();
}











function ajustarAnchoMaximo(selectorElemento) {
    const bloques = document.querySelectorAll(selectorElemento);//'.tema_black fieldset'
    let maxWidth = 0;

    // resetear antes de medir
    bloques.forEach(b => b.style.width = "auto");

    bloques.forEach(b => {
        if (b.offsetWidth > maxWidth) maxWidth = b.offsetWidth;
    });

    bloques.forEach(b => b.style.width = maxWidth + "px");
}
//ejemplos de uso:
// ajustarAnchoMaximo('.tema_black fieldset');
// ajustarAnchoMaximo('.tema_white fieldset');


function resetAnchoMaximo(selectorElemento) {
    const bloques = document.querySelectorAll(selectorElemento);//'.tema_black fieldset'

    // resetear antes de medir
    bloques.forEach(b => b.removeAttribute('style'));
}


function copyTextFromVista(selectorFieldset){
    console.log('=== function copyTextFromVista() ==='); 

    let text = ''; 

    const fieldsetAll = document.querySelectorAll(selectorFieldset);//'.tema_white fieldset', '.tema_black fieldset'

    fieldsetAll.forEach(f => { 
        Array.from(f.children).forEach(line => { 
            //console.log('line: ', line);

            if(line.tagName === 'LEGEND'){
                if(text == ''){//si es la primera vez
                    text += line.innerText;
                }else{
                    text += '\n\n\n\n' + line.innerText; 
                }                
            }else if(line.tagName === 'P'){
                text += '\n' + line.innerText; 
            }else{
                return;//continue
            }
        });
        //console.log('text: ', text); 
    });

    console.log('abajo --- todo text: '); 
    console.log(text);

    copyTextToClibboard(text);
}
//ejemplo de uso:
//copyTextFromVista('.tema_black fieldset');


async function copyTextToClibboard(text = null) {  
    if(text != null){
        
        // Verifica si la API de portapapeles está disponible
        if(navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    //console.log('[copyTextToClibboard()] --- [navigator.clipboard] --- Texto copiado al portapapeles con éxito');
                    //console.log('El texto copiado: \n', text);
                    showToast('ok', 'Texto copiado al portapapeles', 2000);
                })
                .catch(error => {
                    console.error('[copyTextToClibboard()] --- Error al copiar el texto al portapapeles:', error);
                    showToast('error', 'Error al copiar el texto', 3000);
                });
        } else {
            //console.log('[copyTextToClibboard()] --- La API de portapapeles no está disponible en este navegador. Intento copiar con document.execCommand(copy)');

            const areaTexto = document.createElement('textarea');
            areaTexto.style.position = 'fixed';
            areaTexto.style.top = '-9999px';
            areaTexto.style.left = '-9999px';
            document.body.appendChild(areaTexto);
            areaTexto.value = text;
            areaTexto.select();
            document.execCommand('copy');
            document.body.removeChild(areaTexto);
            //console.log('[copyTextToClibboard] --- El texto copiado: \n', text);
            showToast('ok', '(areaTexto.) Texto copiado al portapapeles', 2000);
        }

    }else{
        console.error('[copyTextToClibboard()] --- El texto no se ha copiado porque no está seleccionado.');
        showToast('error', 'El texto no se ha copiado porque no está seleccionado.', 3000);
    }    
}


function copiarConFormato(selectorContenedor) {
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'

    const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.querySelectorAll('fieldset').forEach( (f,i) => {
        if(i > 0){
            f.outerHTML = '<br><br>' + f.outerHTML;
        }
    });

    contenedor.querySelectorAll('p').forEach(p => {
        p.innerHTML = reemplazarEspacios(p.innerText);
    });

    // Crear un rango que abarque el contenido
    const rango = document.createRange();
    rango.selectNode(contenedor);

    // Limpiar selección previa
    const seleccion = window.getSelection();
    seleccion.removeAllRanges();
    seleccion.addRange(rango);

    // Ejecutar el comando copiar (copia con formato)
    document.execCommand("copy");

    // Limpiar selección
    seleccion.removeAllRanges();

    alert("Contenido copiado con formato ✅");

    contenedor.replaceWith(clone);//reemplazo con el contenido original
}

function copiarSinAcordesConFormato(selectorContenedor) {
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'

    const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.querySelectorAll('fieldset').forEach( (f,i) => {
        if(i > 0){
            f.outerHTML = '<br><br>' + f.outerHTML;
        }
    });

    contenedor.querySelectorAll('p').forEach(p => {
        if(!p.classList.contains('t')){//si no es texto, lo elimino
            p.remove();//elimino las líneas de acordes
            return;
        }
        //p.innerHTML = reemplazarEspacios(p.innerText);
    });

    let resultado = Array.from(contenedor.querySelectorAll('p')).filter(p => {
        if(p.classList.contains('t')){
            return true;
        }
    });
    
    console.log('resultado: ', resultado);

    // Crear un rango que abarque el contenido
    const rango = document.createRange();
    rango.selectNode(contenedor);

    // Limpiar selección previa
    const seleccion = window.getSelection();
    seleccion.removeAllRanges();
    seleccion.addRange(rango);

    // Ejecutar el comando copiar (copia con formato)
    document.execCommand("copy");

    // Limpiar selección
    seleccion.removeAllRanges();

    alert("Contenido copiado con formato ✅");

    contenedor.replaceWith(clone);//reemplazo con el contenido original
}

function ocultarAcordes(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('mostrar_acordes');
    contenedor.classList.add('ocultar_acordes');
}

function mostrarAcordes(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('ocultar_acordes');
    contenedor.classList.add('mostrar_acordes');
}



function ocultarTexto(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('mostrar_texto');
    contenedor.classList.add('ocultar_texto');
}

function mostrarTexto(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('ocultar_texto');
    contenedor.classList.add('mostrar_texto');
}



function aplicarContenidoWidth(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('contenido_width_off');
    contenedor.classList.add('contenido_width_on');
}

function quitarContenidoWidth(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('contenido_width_on');
    contenedor.classList.add('contenido_width_off');
}


function aplicarSongPartsBgColored(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'

    contenedor.classList.remove('song_parts_bg_off');
    contenedor.classList.add('song_parts_bg_on');
}

function quitarSongPartsBgColored(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'

    contenedor.classList.remove('song_parts_bg_on');
    contenedor.classList.add('song_parts_bg_off');
}




function reemplazarEspacios(texto) {
    return texto.replace(/ /g, '&nbsp;');
}

function pantallaCompleta(selectorElement) {
    const element = document.querySelector(selectorElement);

    // const dbtn_fullscreen = document.createElement('div');
    // dbtn_fullscreen.className = 'dbtn_fullscreen';
    // dbtn_fullscreen.innerHTML = `
    //     <img src="/song/images/fullscreen_adentro.png">
    // `;
    // dbtn_fullscreen.onclick = (e)=> {
    //     e.stopPropagation();
    //     salirPantallaCompleta();
    // }

    element.prepend(dbtn_fullscreen);

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } 
    else if (element.webkitRequestFullscreen) { // Safari
        element.webkitRequestFullscreen();
    } 
    else if (element.msRequestFullscreen) { // IE/Edge antiguo
        element.msRequestFullscreen();
    }
}

function salirPantallaCompleta() {
    document.querySelector('.dbtn_fullscreen')?.remove();
    
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

let btnFullscreenActive = null;

function toggleFullscreen(selectorElementContenedor, btnElement) {
    //const element = document.body;
    const contenedor = document.querySelector(selectorElementContenedor);
    //const btn_fullscreen = document.querySelector(selectorElementBtn);

    btnFullscreenActive = btnElement;
    console.log('ttt. btnFullscreenActive: ', btnFullscreenActive);

    if (!document.fullscreenElement) {//si no hay ningún elemento en pantalla completa, entro en pantalla completa
        
        // Entrar en pantalla completa
        if (contenedor.requestFullscreen) {
            contenedor.requestFullscreen();
        } 
        else if (contenedor.webkitRequestFullscreen) { // Safari
            contenedor.webkitRequestFullscreen();
        } 
        else if (contenedor.msRequestFullscreen) { // IE/Edge
            contenedor.msRequestFullscreen();
        }
        is_fullscreen = true;
        //btnElement.querySelector('img').src = './images/fullscreen_adentro.png';//sig. action es minimizar

    } else {//algun elemento está en pantalla completa, salgo de pantalla completa
        
        // Salir del modo pantalla completa
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } 
        else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } 
        else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        is_fullscreen = false;
        //btnElement.querySelector('img').src = './images/fullscreen.png';//sig. action es agrandar

    }

    refreshSwipeLayout();

    // NO HACE FALTA: pintBtnFullscreen();    
    console.log('toggle(Fullscreen) --- is_fullscreen: ', is_fullscreen);
}

function pintBtnFullscreen(btnElement) {
    console.log('=== function pintBtnFullscreen() ===');
    console.log('pintBtnFullscreen --- is_fullscreen: ', is_fullscreen);

    //si existe boton de fullscreen en wr_vista_blocks
    if(btnElement){
        if(is_fullscreen){
            btnElement.querySelector('img').src = 'images/fullscreen_adentro.png';
            //sig. action -> minimizar
        }else{
            btnElement.querySelector('img').src = 'images/fullscreen.png';
            //sig. action -> agrandar
        }
    }
}

function pintFlechasFullscreen(divElement) {
    console.log('=== function pintFlechasFullscreen() ===');
    console.log('pintFlechasFullscreen --- is_fullscreen: ', is_fullscreen);

    //si existe div element de fullscreen en vista_fixed
    if(divElement){
        if(is_fullscreen){
            divElement.querySelector('img').src = 'images/icon_size_min.svg';
            //sig. action -> minimizar
        }else{
            divElement.querySelector('img').src = 'images/icon_size_max.svg';
            //sig. action -> agrandar
        }
    }
}


function cambiarTema(selectorElement) {// '.block_cancion .bloques_outer'
    const elem = document.querySelector(selectorElement);

    if (elem.classList.contains("tema_black")) {
        elem.classList.replace("tema_black", "tema_white");
    } else if (elem.classList.contains("tema_white")) {
        elem.classList.replace("tema_white", "tema_black");
    } else {
        // Si no tiene ninguna de las dos, asignamos un valor por defecto
        elem.classList.add("tema_black");
    }
}
//cambiarTema('#tema_block');





   

function addMonospaceFont() {
    ecl_bl_body.classList.add('monospace_font');
    slideContainer.classList.add('monospace_font'); 
}

function removeMonospaceFont() {
    ecl_bl_body.classList.remove('monospace_font');
    slideContainer.classList.remove('monospace_font');   
}


/*
    funciones para manejar una pestaña LOCAL con pantalla
    referencia es:
    - pestaña o ventana  'miPantallaLocal' con nombre_referencia 'miPantallaLocal'
*/
function old_abrirReferencia(referencia) {
    console.log('=== function abrirReferencia() ===');
    
    let nombre_referencia = '';
    
    // Verificar si ya está abierta
    if (referencia && !referencia.closed) {
        console.log(`La ${referencia} ya está abierta`);
        referencia.focus(); // Llevar al frente
        return referencia;
    }

    // Abrir y guardar la referencia en la variable
    switch (referencia) {
        //LOCAL
        case miPantallaLocal:
            nombre_referencia = 'miPantallaLocal';
            referencia = window.open('pantalla.php', nombre_referencia);
            miPantallaLocal = referencia;// Actualizar la variable global
            break;

        //LOCAL 2
        case miPantallaLocal2:
            nombre_referencia = 'miPantallaLocal2';
            referencia = window.open('pantalla.php', nombre_referencia);
            miPantallaLocal2 = referencia;// Actualizar la variable global
            break;

        //REMOTO
        //ruta_screen_pantalla: 'http://show-screen.local/' en localhost
        //ruta_screen_pantalla: 'https://show-screen.com/' en prod 
        case miPantallaRemota:
            nombre_referencia = 'miPantallaRemota';
            referencia = window.open(ruta_screen_pantalla, nombre_referencia);
            miPantallaRemota = referencia;// Actualizar la variable global
            break;
    
        default:
            break;
    }
    
    console.log(`${nombre_referencia} abierta. referencia: `, referencia);

    eid_videoFondo_body.load();
    return referencia;
}
function old_recargarReferencia(referencia) {
    // Usar la variable que contiene la referencia
    if (referencia && !referencia.closed) {
        referencia.location.reload();
        referencia.focus();
    } else {
        console.log('La referencia está cerrada o no existe');
    }
}
function old_enfocarReferencia(referencia) {
    // Usar la variable que contiene la referencia
    if (referencia && !referencia.closed) {
        referencia.focus();
    } else {
        console.log('La referencia está cerrada o no existe');
    }
}
function old_cerrarReferencia(referencia) {
    if (referencia && !referencia.closed) {
        referencia.close();
    }
    referencia = null; // Limpiar la referencia
}
function old_enfocarReferenciaOCrear(referencia){  
    console.log('=== function enfocarReferenciaOCrear() ===');

    if (referencia && !referencia.closed) {
        referencia.focus();
    } else {
        abrirReferencia(referencia);
    }
}
function old_recargarReferenciaOCrear(referencia){
    console.log('=== function recargarReferenciaOCrear() ===');

    if (referencia && !referencia.closed) {
        recargarReferencia(referencia);
        eid_videoFondo_body.load();
    } else {
        abrirReferencia(referencia);
    }
}


//=============================================//
// start - Nuevas funciones de pantalla
//=============================================//
function abrirReferencia(url, nombre_referencia){
    console.log('=== function abrirReferencia() ===');

    const referencia = window.open(url, nombre_referencia);
    
    if(!referencia){
        console.warn('No se pudo abrir la ventana.');
        return null;
    }

    if(referencia){
        eid_videoFondo_body.load();
        referencia.focus();
        console.log(`${nombre_referencia} abierta.`, referencia);
    }

    return referencia;
}


function abrirPantalla(numero){
    console.log('=== function abrirPantalla() ===');
    
    let indice;

    switch(numero){
        case 1:
            indice = INDICE_PANTALLA_1;
            break;

        case 2:
            indice = INDICE_PANTALLA_2;
            break;

        case 3:
            indice = INDICE_PANTALLA_3;
            break;

        default:
            console.warn('Número de pantalla no válido:', numero);
            return;
    }

    // Limpio referencias cerradas
    limpiarReferenciasCerradas();

    // Si esa pantalla ya existe, la enfoco
    const referenciaExistente = arr_misPantallas[indice];

    if(referenciaExistente && !referenciaExistente.closed){
        referenciaExistente.focus();
        return;
    }

    let str_get_param = '';
    if(numero == 1){//pantalla escena
        //t = parametro get, 
        //'z' - //mostrar el slide en el center con: justify-content: center 
        //'y' - //mostrar el timer 
        //'w' - //mostrar el tiempo restante 
        //'h' - //mostrar la hora actiual 
        str_get_param = '?t=zwh';
    }
    if(numero == 2){
        //t = parametro get, 
        //'z' - //mostrar el slide en el center con: justify-content: center 
        //'y' - //mostrar el timer 
        //'w' - //mostrar el tiempo restante 
        //'h' - //mostrar la hora actiual 
        str_get_param = '?t=zywh';
    }

    const referencia = abrirReferencia(
        `pantalla.php${str_get_param}`,
        `PantallaLocal${numero}`
    );

    if(referencia){
        arr_misPantallas[indice] = referencia;

        // Solo ahora empieza a actualizar el display de Holy Songs
        iniciarRenderTimerHoly();
    }
}

function abrirVentanaBiblia(){
    console.log('=== function abrirVentanaBiblia() ===');

    // Si Bible Text ya está abierto, enfocarlo
    if(miVentanaBiblia && !miVentanaBiblia.closed){
        miVentanaBiblia.focus();
        return;
    }

    let url_bible_text = (esProduccion) 
        ? 'https://bible-text.com/bible' //prod
        : 'http://bible-text.local/bible' ;//local

    miVentanaBiblia = window.open(
        url_bible_text,
        'BibleTextControl'
    );

    if(!miVentanaBiblia){
        console.warn('El navegador bloqueó la apertura de Bible Text.');
    }
}

function enfocarReferencia(numero){

    const indice = numero - 1;

    if(indice < 0){
        return;
    }

    limpiarReferenciasCerradas();

    let referencia = arr_misPantallas[indice];

    // Si no existe o está cerrada, la creo
    if(!referencia || referencia.closed){

        referencia = abrirReferencia(
            'pantalla.php',
            `PantallaLocal${numero}`
        );

        if(referencia){
            arr_misPantallas[indice] = referencia;
        }

        return;
    }

    referencia.focus();
}


function recargarReferencia(numero){

    const indice = numero - 1;
    if(indice < 0){
        return;
    }

    limpiarReferenciasCerradas();

    let referencia = arr_misPantallas[indice];

    //si no existe o está cerrada, la creo
    if(!referencia || referencia.closed){
        console.log('La referencia está cerrada o no existe. la creo...');

        referencia = abrirReferencia(
            'pantalla.php',
            `PantallaLocal${numero}`
        );

        if(referencia){
            arr_misPantallas[indice] = referencia;
        }

        return;
    }

    //si ya existe, la recargo y enfoco
    referencia.location.reload();
    referencia.focus();
}


function cerrarReferencia(numero){

    const indice = numero - 1;
    if(indice < 0){
        return;
    }

    const referencia = arr_misPantallas[indice];

    if(referencia && !referencia.closed){
        referencia.close();
    }

    arr_misPantallas[indice] = null;

    limpiarReferenciasCerradas();
}


function enfocarMisReferenciasOCrear(){
    console.log('=== function enfocarMisReferenciasOCrear() ===');

    // Elimino referencias cerradas
    limpiarReferenciasCerradas();

    const hayPantallasAbiertas = arr_misPantallas.some(
        referencia => referencia && !referencia.closed
    );

    if(!hayPantallasAbiertas){// Si no hay ninguna abierta, creo una
        abrirPantalla(1);
    }else{//si ya hay. // Enfoco todas las abiertas
        arr_misPantallas.forEach(referencia => {
            if(referencia && !referencia.closed){
                referencia.focus();
            }
        });
    }

}


function recargarMisReferenciasOCrear(){
    console.log('=== function recargarMisReferenciasOCrear() ===');

    // Elimino referencias cerradas
    limpiarReferenciasCerradas();

    const hayPantallasAbiertas = arr_misPantallas.some(
        referencia => referencia && !referencia.closed
    );

    if(!hayPantallasAbiertas){// Si no hay ninguna abierta, creo una
        abrirPantalla(1);
    }else{//si ya hay. // Enfoco todas las abiertas
        arr_misPantallas.forEach(referencia => {
            if(referencia && !referencia.closed){
                referencia.location.reload();
                referencia.focus();
                eid_videoFondo_body.load();
            }
        });
    }

}

function recargarPantallasAbiertas(){
    console.log('=== function recargarPantallasAbiertas() ===');

    limpiarReferenciasCerradas();

    arr_misPantallas.forEach(referencia => {

        if(!referencia || referencia.closed){
            return;
        }

        referencia.location.reload();
        referencia.focus();
        eid_videoFondo_body.load();
    });

}


function limpiarReferenciasCerradas(){

    arr_misPantallas = arr_misPantallas.map(ref => {
        return (ref && !ref.closed)
            ? ref
            : null;
    });

    const hayPantallasAbiertas = arr_misPantallas.some(
        ref => ref && !ref.closed
    );

    if(!hayPantallasAbiertas){
        pararRenderTimerHoly();
    }
}

//=============================================//
// end - Nuevas funciones de pantalla
//=============================================//


/*
// no se usa. dejo como ejemplo...
function fullscreenReferenciaOCrear(referencia){
    console.log('=== function fullscreenReferenciaOCrear() ===');

    if (referencia && !referencia.closed) {
        enviarAccionPantalla('fullscreen');
        referencia.focus();
    } else {
        referencia = abrirReferencia(referencia);
        // Esperar a que cargue la nueva ventana
        referencia.addEventListener('load', () => {
            enviarAccionPantalla('fullscreen');
        }, { once: true });
    }
}
*/

function normalizeSearchText(text) {
    return text
        // 1) minúsculas
        .toLowerCase()

        // 2) normalizar Unicode
        .normalize('NFD')

        // 3) eliminar diacríticos SOLO de letras latinas
        .replace(/(?<=\p{Script=Latin})\p{Mn}+/gu, '')

        // 4) recomponer Unicode
        .normalize('NFC')

        // 5) proteger apóstrofe entre letras
        .replace(/(\p{L})'(\p{L})/gu, '$1§§§$2')

        // 6) eliminar puntuación y símbolos
        .replace(/[^\p{L}\p{N}§ ]+/gu, ' ')

        // 7) restaurar apóstrofe
        .replace(/§§§/g, "'")

        // 8) normalizar espacios
        .replace(/\s+/g, ' ')
        .trim();
}


function makeColumns(num){
    if(num > 4 || num < 1) return;
    
    currentNumColumns = num;//actualizo variable global para luego mostrar en el toast
    eid_block_cancion.querySelector('.contenedor').style.columnCount = currentNumColumns;
    
    showToast('info', `Columnas: ${currentNumColumns}`, 2000, 'bottom', false,'', document.querySelector('.vista_fixed_body'));

    refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
}

function aplicarFontSize(val){
    if(!val) return;

    currentFontSize = Number(val);//actualizo variable global para luego mostrar en el toast

    eid_block_cancion.querySelector('.vista_fixed .contenedor').style.fontSize = currentFontSize + 'px';
    
    showToast('info', `Fuente aplicado: ${currentFontSize}px`, 2000, 'bottom', false,'', document.querySelector('.vista_fixed_body'));

    //setTimeout(()=>{
        refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
    //},10);
}

function aplicarNumColumns(val){
    if(!val) return;

    makeColumns(val);
    
    showToast('info', `Numero columnas aplicado: ${val}`, 2000, 'bottom', false,'', document.querySelector('.vista_fixed_body'));

    //setTimeout(()=>{
        refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
    //},10);
}

function aplicarAcordesVisible(val){
    
    acordesVisible = !val;//hago esto para luego aplicar toggleAcordes
    toggleAcordes();//hace siguiente accion -> ocultar o mostrar acordes
}

function aplicarTextoVisible(val){
    
    textoVisible = !val;//hago esto para luego aplicar toggleAcordes
    toggleTexto();//hace siguiente accion -> ocultar o mostrar acordes
}

function aplicarContenidoWidthBd(val){
    
    contenidoWidth = !val;//hago esto para luego aplicar toggleAcordes
    toggleContenidoWidth();//hace siguiente accion -> ocultar o mostrar acordes
}

function aplicarSongPartsBgColoredBd(val){
    
    songPartsBgColored = !val;//hago esto para luego aplicar toggleAcordes
    toggleSongPartsBgColored();//hace siguiente accion -> ocultar o mostrar acordes
}


function changeFontSize(step) {
    step = parseInt(step, 10);

    const elementSelectors = `
        /*#cancion_song_bloques, #block_cancion, .wr_vista_blocks .contenedor,*/ .vista_fixed .contenedor
    `;

    let curFont_show = '';

    const elementsAll = document.querySelectorAll(elementSelectors);
    elementsAll.forEach(el => {
        console.log('el: ', el);
        if(step == 0){
            currentFontSize = fontSizeDef;
            curFont_show = currentFontSize + 'px';
            el.style.fontSize = curFont_show;//vuelvo al tamaño original quitando el style
        }else{
            currentFontSize = (currentFontSize + step);
            curFont_show = currentFontSize + 'px';
            el.style.fontSize = curFont_show;
        }
        //console.log('fin el: ', el);
    });

    showToast('info', `Fuente: ${curFont_show}`, 2000, 'bottom', false, '', document.querySelector('.vista_fixed_body'));

    refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
}


function contarLineasVisuales(elemento) {
    const estilos = window.getComputedStyle(elemento);

    let lineHeight = estilos.lineHeight;

    // Si line-height es "normal", lo estimamos
    if (lineHeight === "normal") {
        lineHeight = parseFloat(estilos.fontSize) * 1.2;
    } else {
        lineHeight = parseFloat(lineHeight);
    }

    const altura = elemento.getBoundingClientRect().height;

    return Math.round(altura / lineHeight);
}

function contarLineasReales(elemento) {
    const range = document.createRange();
    range.selectNodeContents(elemento);

    const rects = Array.from(range.getClientRects())
        .filter(r => r.height > 0); // ignorar rects raros

    const tops = rects
        .map(r => r.top)
        .sort((a, b) => a - b);

    const tolerancia = 2; // píxeles (clave)
    const lineas = [];

    tops.forEach(top => {
        const existe = lineas.some(t => Math.abs(t - top) < tolerancia);
        if (!existe) {
            lineas.push(top);
        }
    });

    return lineas.length;
}


function getDeviceData(){

    const min = Math.min(screen.width, screen.height);
    const max = Math.max(screen.width, screen.height);

    const deviceResolution = `${min}x${max}`;//425x900

    const orientation =
        window.innerWidth > window.innerHeight
        ? 'landscape'
        : 'portrait';

    return {
        deviceResolution,
        orientation
    };
}


function manejarLogin(){
    console.log('=== function manejarLogin() ===');

    if(hay_usuario_logueado){
        let aviso_html = `
            <h3>Bienvenido de nuevo, ${username}!</h3>
            <p>${email}</p>
            <p>Puedes crear canciones, listas y  guardar tus ajustes personales.</p>
            <div class="wr_btns_vertical">
                <button class="btn" onclick="window.location.href = '/home';">Inicio</button>            
                <button class="btn" onclick="window.location.href = '/login';">Login</button>            
                <button class="btn" onclick="window.location.href = '/logout';">Cerrar sesión</button>            
            </div>
        `;

        showToast('ok', aviso_html, 1000, 'center', true, 'Sesión iniciada correctamente.');
        return;
    }else{
        //alert('no hay_usuario_logueado');
        window.location.href = '/login';//redirecciono a login para que se loguee y luego vuelva a la pantalla
    }
}

function limpiarInput(selectorInput){
    const input = document.querySelector(selectorInput);
    if(input){
        input.value = '';
        input.focus();
    }
}

function aplicarSongAjustes(){
    console.log('=== function aplicarSongAjustes() ===');

    const {
        deviceResolution,
        orientation
    } = getDeviceData();

    if(esObjeto(objSong) && Object.keys(objSong).length === 0){
        console.log('objSong es vacio, hago return...');
        return;
    }

    const song_ajustes = objSong.ajustes[orientation];
    console.log('song_ajustes: ', song_ajustes);

    if(!objSong.ajustes){
        console.log('no hay objSong.ajustes, hago return...');
        return;
    }
    
    if(song_ajustes){//portrait o landscape

        //permitirShowToast = false;//para no mostrar toast al aplicar cada ajuste

        //font_size
        if(song_ajustes.font_size){
            console.log('hay font_size en song_ajustes, la aplico al cargar el form...');
            aplicarFontSize(song_ajustes.font_size);
        }else{
            console.log('no hay font_size en song_ajustes, aplico valor por defecto...');
            aplicarFontSize(fontSizeDef);
        }

        //num_columns
        if(song_ajustes.num_columns){
            console.log('hay num_columns en song_ajustes, la aplico al cargar el form...');
            aplicarNumColumns(song_ajustes.num_columns);
        }else{
            console.log('no hay num_columns en song_ajustes, aplico valor por defecto...');
            aplicarNumColumns(numColumnsDef);//1
        }

        //acordes_visible
        if(song_ajustes.acordes_visible != null){//1 //true
            if(Number(song_ajustes.acordes_visible)){
                console.log('hay acordes_visible en song_ajustes y es 1, la aplico al cargar el form...');
                aplicarAcordesVisible(true);
            }else{
                console.log('hay acordes_visible en song_ajustes y es 0, la aplico al cargar el form...');
                aplicarAcordesVisible(false);
            }
        }else{
            console.log('no hay acordes_visible en song_ajustes, aplico valor por defecto...');
            aplicarAcordesVisible(acordesVisibleDef);//true
        }

        //texto_visible
        if(song_ajustes.texto_visible != null){
            if(Number(song_ajustes.texto_visible)){
                console.log('hay texto_visible en song_ajustes y es 1, la aplico al cargar el form...');
                aplicarTextoVisible(true);
            }else{
                console.log('hay texto_visible en song_ajustes y es 0, la aplico al cargar el form...');
                aplicarTextoVisible(false);
            }
        }else{
            console.log('no hay texto_visible en song_ajustes, aplico valor por defecto...');
            aplicarTextoVisible(textoVisibleDef);//true
        }

        //contenido_width
        if(song_ajustes.contenido_width != null){
            if(Number(song_ajustes.contenido_width)){
                console.log('hay contenido_width en song_ajustes y es 1, la aplico al cargar el form...');
                aplicarContenidoWidthBd(true);
            }else{
                console.log('hay contenido_width en song_ajustes y es 0, la aplico al cargar el form...');
                aplicarContenidoWidthBd(false);
            }
        }else{
            console.log('no hay texto_visible en song_ajustes, aplico valor por defecto...');
            aplicarContenidoWidthBd(contenidoWidthDef);//false
        }

        //song_parts_bg_colored
        if(song_ajustes.song_parts_bg_colored != null){
            if(Number(song_ajustes.song_parts_bg_colored)){
                console.log('hay song_parts_bg_colored en song_ajustes y es 1, lo aplico al cargar el form...');
                aplicarSongPartsBgColoredBd(true);
            }else{
                console.log('hay song_parts_bg_colored en song_ajustes y es 0, lo aplico al cargar el form...');
                aplicarSongPartsBgColoredBd(false);
            }
        }else{
            console.log('no hay texto_visible en song_ajustes, aplico valor por defecto...');
            aplicarSongPartsBgColoredBd(songPartsBgColoredDef);//true
        }

        setTimeout(()=>{
            permitirShowToast = true;//para mostrar toast 
            //para que no se muestre el ultimo mensaje por showToast(), muestro algo generico
            showToast('info', 'Ajustes personalizados aplicados correctamente.', 2000, 'bottom', false, '', document.querySelector('.vista_fixed_body'));
        },10);

    }

}



function aplicarUsersAjustes(){
    console.log('=== function aplicarUsersAjustes() ===');

    if(esObjeto(objSong) && Object.keys(objSong).length === 0){
        console.log('objSong es vacio, hago return...');
        return;
    }

    const ajustes_pers = Number(objSong.ajustes_pers);
    console.log('ajustes_pers: ', ajustes_pers);

    if(!ajustes_pers){
        console.log('no hay objSong.ajustes_pers, hago return...');
        return;
    }
    
    if(ajustes_pers){//hay datos de ajustes personalizados

        //transponer o capo - capodastr
        if(objSong.tune_transpose_pers || objSong.capo_pers){
            console.log('hay tune_transpose_pers o capo_pers en users_ajustes, la aplico al cargar el form...');

            const tune_transpose_pers_val = Number(objSong.tune_transpose_pers);
            const capo_pers_val = Number(objSong.capo_pers);

            const transpose_val_new = getTransposeFromCapo(tune_transpose_pers_val, capo_pers_val);        
            console.log('transpose_val: ', transpose_val_new);

            handleFormTranspose(transpose_val_new);

        }else{
            console.log('no hay tune_transpose_pers o capo_pers en users_ajustes, aplico valor por defecto...');
        }


        setTimeout(()=>{
            permitirShowToast = true;//para mostrar toast 
            //para que no se muestre el ultimo mensaje por showToast(), muestro algo generico
            showToast('info', 'Ajustes personalizados de Usuario aplicados correctamente.', 2000, 'bottom', false, '', document.querySelector('.vista_fixed_body'));
        },10);

    }

}

function getTransposeFromCapo(transpose_val, capo_val){
    console.log('=== function getTransposeFromCapo() ===');

    transpose_val = Number(transpose_val);
    capo_val = Number(capo_val);

    //si no es un numero
    if(isNaN(transpose_val) || isNaN(capo_val) ){
        transpose_val = 0;
        return transpose_val;
    }
    
    const transpose_val_new = transpose_val - capo_val;
    console.log('transpose_val_new: ', transpose_val_new);

    return Number(transpose_val_new);    
}







// Subir MUCHAS imagenes/videos MEDIA
async function subirMedia(){
    console.log(' === function subirMedia() === ');    
    
    if (!selectedFiles.length === 0) {
        alert('Seleccione una o varias imágenes o vídeos.');
        return;
    }

    for(const file of selectedFiles){

        if(file.type.startsWith('image/')){
            if(file.size > MAX_IMAGE_SIZE){
                alert(
                    `"${file.name}" supera los 200 MB permitidos para imágenes. El tamaño total de las imágenes seleccionadas supera el límite permitido de 200 MB. Esto puede deberse a que has seleccionado demasiadas imágenes o a que alguna de ellas tiene un tamaño muy grande. Por favor, reduce la cantidad de imágenes, selecciona imágenes más ligeras o realiza la subida en varias operaciones.`
                );    
                return;
            }
        }
        else if(file.type.startsWith('video/')){
            if(file.size > MAX_VIDEO_SIZE){
                alert(
                    `"${file.name}" supera los 200 MB permitidos para vídeos. El tamaño total de los vídeos seleccionados supera el límite permitido de 200 MB. Esto puede deberse a que has seleccionado demasiados vídeoss o a que alguno de ellos tiene un tamaño muy grande. Por favor, reduce la cantidad de vídeos, selecciona vídeos más ligeros o realiza la subida en varias operaciones.`
                );    
                return;
            }
        }    
    }


    const formData = new FormData();

    selectedFiles.forEach(file => {
        formData.append('media[]', file);
    });


    try {

        const response = await fetch('../song/php/upload_media.php',
            {
                method: 'POST',
                body: formData
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error upload_imagenes.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                //desactivo boton y preview
                eid_btnUploadMedia.classList.add('d-none');
                eid_previewContainer.innerHTML = '';//reset
                eid_mediaFileInput.value = '';//reset
                

                await pintMediaSubidos();//pinto todas las imagenes disponibles
                await pintMediaActiveEnFondo();//aplico la imagen de fondo seleccionada

                showToast(
                    'ok',
                    data.mensaje,
                    2000
                );   
                
            } else {

                showToast(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en upload_imagen.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en upload_imagen.php',
                { cause: error }
            );
        }       

    }
    catch (error) {
        console.error('subirMedia. error: ',error);
    }

}


// Subir MUCHOS videos Película
async function subirVideo(){
    console.log(' === function subirVideo() === ');    
    
    const file = eid_videoFileInput.files[0];
    const title = eid_videoTitle.value.trim();
    const note = eid_videoNote.value.trim();

    if(!file){
        alert('Seleccione un vídeo.');
        return;
    }

    if(!file.type.startsWith('video/')){
        alert(
            `"${file.name}" no es un vídeo válido.`
        );    
        return;
    }

    if(file.size > MAX_VIDEO_SIZE){
        alert(
            `"${file.name}" con el tamaño ${file.size} supera los 200 MB permitidos. Por favor, reduce el tamaño del fichero.`
        );    
        return;
    }

    if(title === ''){
        alert('Introduzca un título.');
        eid_videoTitle.focus();
        return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('note', note);

    try {

        const response = await fetch('../song/php/upload_video.php',
            {
                method: 'POST',
                body: formData
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error upload_video.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                //desactivo boton y preview
                eid_btnUploadVideo.classList.add('d-none');
                eid_previewContainerVideo.innerHTML = '';//reset
                eid_videoFileInput.value = '';//reset
                eid_videoTitle.value = '';//reset
                eid_videoNote.value = '';//reset

                if(data.video.duplicado){
                    showToast(
                        'info',
                        data.video.mensaje,
                        null,
                        'center',
                        true,
                        'Info'
                    );
                    return; 
                }
                
                arr_lista_videos = await make_arr_lista_videos();
                await pintVideoSubidos();//pinto todos los videos disponibles
                pintVideoActiveEnPlayer();
                await pintVideoActiveEnFondo();//aplico el vídeo seleccionado

                showToast(
                    'ok',
                    data.video.mensaje,
                    2000
                );   
                
            } else {

                showToast(
                    'error',
                    data.video.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en upload_video.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en upload_video.php',
                { cause: error }
            );
        }       

    }
    catch (error) {
        console.error('subirVideo. error: ',error);
    }

}

async function pintMediaActiveEnFondo(){
    console.log('=== function pintMediaActiveEnFondo() ===');

    try {
        
        const data = await getMediaActive();
        console.log('2. data:', data);

        if (data.success) {
            
            bg_media_type = data.media.media_type;// o 'image' o 'video'
            console.log('bg_media_type: ', bg_media_type);
            localStorage.setItem('bg_media_type', bg_media_type);

            if(data.media.media_type === 'image'){
                //saco la ruta del fondo
                video_ruta = '';//reset
                bg_ruta = data.media.filepath;
                console.log('bg_ruta: ', bg_ruta);
                localStorage.setItem('bg_ruta', bg_ruta);

                //quitar video
                eid_videoFondo_body.classList.remove('shown');//oculto
                eid_videoFondo_body.src = '';//reset
                
                // Aplicar inmediatamente el fondo
                eid_fondo_body.style.backgroundImage = `url(.${bg_ruta})`;//aki obligatorio
                await guardarEnLocalAndBd('g');//g = guardar fondo
    
                showToast(
                    'ok',
                    'imagen personalizada cargada correctamente',
                    2000
                );

            }
            
            if(data.media.media_type === 'video'){
                //saco la ruta del video
                bg_ruta = '';//reset
                video_ruta = `.${data.media.filepath}`;
                console.log('video_ruta: ', video_ruta);
                localStorage.setItem('video_ruta', video_ruta);

                // Aplicar inmediatamente el video en el fondo
                eid_videoFondo_body.classList.add('shown');//muestro
                eid_videoFondo_body.src = video_ruta;//aki obligatorio

                await guardarEnLocalAndBd('g');//g = guardar fondo

                showToast(
                    'ok',
                    'Fichero media personalizado cargado correctamente',
                    2000
                );
            }
            
            return true;  
            
        } else {

            showToast(
                'error',
                data.error,
                null,
                'center',
                true,
                'Error'
            );
            return false;             

        }

    } catch (error) {
        
        console.error('Error al cargar el fichero de fondo:',error);

        showToast(
            'error',
            `1. Error al cargar el fichero de fondo: ${error}`,
            null,
            'center',
            true,
            'Error'
        );
        return false;
    } 

}


async function pintVideoActiveEnFondo(){
    console.log('=== function pintVideoActiveEnFondo() ===');

    try {
        
        const data = await getVideoActive();
        console.log('52. data:', data);

        if (data.success) {
            
            //saco la ruta del video
            // bg_ruta = '';//reset
            // video_ruta = `.${data.media.filepath}`;
            // console.log('video_ruta: ', video_ruta);
            // localStorage.setItem('video_ruta', video_ruta);

            // Aplicar inmediatamente el video en el fondo
            // eid_videoFondo_body.classList.add('shown');//muestro
            // eid_videoFondo_body.src = video_ruta;//aki obligatorio

            //await guardarEnLocalAndBd('g');//g = guardar fondo

            showToast(
                'ok',
                'Fichero de vídeo cargado correctamente',
                2000
            );
            return true;  
            
        } else {

            showToast(
                'error',
                data.error,
                null,
                'center',
                true,
                'Error'
            );
            return false;             

        }

    } catch (error) {
        
        console.error('Error al cargar el fichero de vídeo:',error);

        showToast(
            'error',
            `1. Error al cargar el fichero de vídeo: ${error}`,
            null,
            'center',
            true,
            'Error'
        );
        return false;
    } 

}


async function pintMediaSubidos(){
    console.log('=== function pintMediaSubidos() ===');

    try {

        const data = await getMediaAll();
        console.log('3. data:', data);

        eid_imagenesContainer.innerHTML = '';//reset

        if (data.success) {

            if(data.media.length > 0){

                data.media.forEach(item => {
                    
                    const media_item = document.createElement('div');
                    media_item.className = (item.is_active == 1) ? 'media_item active' : 'media_item' ;
                    media_item.dataset.id_media = item.id_media;
                    media_item.dataset.media_type = item.media_type;

                    if(item.media_type == 'image'){
                        media_item.innerHTML = `
                            <div class="d_delete">
                                <img class="d_delete_img" src="images/delete.png">
                            </div>
                            <img class="media_item_img" src=".${item.filepath}" alt="Imagen de fondo">
                        `;
                    }else if(item.media_type == 'video'){
                        media_item.innerHTML = `
                            <div class="d_delete">
                                <img class="d_delete_img" src="images/delete.png">
                            </div>
                            <video class="media_item_video" src=".${item.filepath}" autoplay muted loop playsinline>
                        `;
                    }
                    media_item.onclick = async (e) => {
                        
                        if(e.target.closest('.d_delete')){
                            await deleteMedia(item.id_media);
                        }else{
                            eid_fondo_body.style.backgroundImage = `url(.${item.filepath})`;//aki obligatorio
                            console.log('item.id_media: ', item.id_media);
    
                            await updateMediaActive(item.id_media);
                        }
                        
                    }
                    //añado al DOM
                    eid_imagenesContainer.append(media_item);
                });

            }else{
                const div = document.createElement('div');
                div.className = 'no_imagen';
                div.innerHTML = `
                    <p>No hay imágenes o vídeos subidos.</p>
                `;
                eid_imagenesContainer.append(div);
            }                  
            
        } else {

            const div = document.createElement('div');
            div.className = 'no_imagen';
            div.innerHTML = `
                <p class="prim">No hay imágenes o vídeos subidos.</p>
            `;
            eid_imagenesContainer.append(div);

            return;             

        }

    } catch (error) {
        
        console.error('Error al cargar media de fondo:',error);

        showToast(
            'error',
            data.error,
            null,
            'center',
            true,
            'Error'
        );
        return false;
    } 
}


async function pintVideoSubidos(){
    console.log('=== function pintVideoSubidos() ===');

    try {

        const data = await getVideoAll();
        console.log('3. data:', data);

        eid_videosContainer.innerHTML = '';//reset

        if (data.success) {

            if(data.video.length > 0){

                data.video.forEach(item => {
                    
                    const video_item = document.createElement('div');
                    video_item.className = (item.is_active == 1) ? 'video_item active' : 'video_item' ;
                    video_item.dataset.id_video = item.id_video;
                    video_item.dataset.id_media = item.id_media;
                    video_item.dataset.media_type = item.media_type;                    
                    video_item.innerHTML = `
                        <div class="d_delete">
                            <img class="d_delete_img" src="images/delete.png">
                        </div>

                        <video class="video_item_video" src=".${item.filepath}" autoplay muted loop playsinline></video>
                        
                        <div class="video_item_info">
                            <div>${item.id_video}</div>
                            <div>${item.title}</div>
                            <div>${item.note}</div>
                        </div>
                    `;
                    video_item.onclick = async (e) => {
                        
                        if(e.target.closest('.d_delete')){
                            await deleteVideo(item.id_video);
                        }else{
                            //eid_fondo_body.style.backgroundImage = `url(.${item.filepath})`;//aki obligatorio
                            console.log('item.id_video: ', item.id_video);
    
                            await updateVideoActive(item.id_video);
                        }
                        
                    }
                    //añado al DOM
                    eid_videosContainer.append(video_item);
                });

            }else{
                const div = document.createElement('div');
                div.className = 'no_video';
                div.innerHTML = `
                    <p>1. No hay vídeos subidos.</p>
                `;
                eid_videosContainer.append(div);
            }                  
            
        } else {

            const div = document.createElement('div');
            div.className = 'no_video';
            div.innerHTML = `
                <p class="prim">2. No hay vídeos subidos.</p>
            `;
            eid_videosContainer.append(div);

            return;             

        }

    } catch (error) {
        
        console.error('Error al cargar vídeo como película:',error);

        showToast(
            'error',
            data.error,
            null,
            'center',
            true,
            'Error'
        );
        return false;
    } 
}


async function make_arr_lista_videos(){
    console.log('=== function make_arr_lista_videos() ===');

    try {

        const data = await getVideoAll();
        console.log('3. data:', data);

        eid_videosContainer.innerHTML = '';//reset
        
        if (data.success) {
            
            if(data.video.length > 0){
                
                arr_lista_videos = [];//reset
                
                data.video.forEach((item,i) => {
                    
                    if(item.is_active){
                        index_video_actual = i;
                        console.log('hago index_video_actual el vídeo que en la bd is_active == 1. index_video_actual: ', index_video_actual);
                        
                        id_video = item.id_video;
                        console.log('id_video: ', id_video);
                    }

                    //reasigno valores de bd
                    arr_lista_videos[i] = {
                        id_video: item.id_video,
                        id_media: item.id_media,
                        title: item.title,
                        note: item.note,
                        ruta: '.' + item.filepath,
                        is_active: item.is_active
                    }
                    console.log('arr_lista_videos: ', arr_lista_videos);

                });
                
                //reasigno
                src_video_actual = arr_lista_videos[index_video_actual].ruta;
                console.warn('src_video_actual: ', src_video_actual);

                return arr_lista_videos;

            }else{
                
                showToast(
                    'info',
                    'no hay vídeos subidos para poder crear una lista de reproducción.',
                    null,
                    'center',
                    true,
                    'Info'
                );
            }                  
            
        } else {

            const div = document.createElement('div');
            div.className = 'no_video';
            div.innerHTML = `
                <p class="prim">No hay vídeos subidos.</p>
            `;
            eid_videosContainer.append(div);

            return;             

        }

    } catch (error) {
        
        console.error('Error al cargar vídeo como película:',error);

        showToast(
            'error',
            data.error,
            null,
            'center',
            true,
            'Error'
        );
        return false;
    } 
}


async function updateMediaActive(id_media){
    console.log('=== function updateMediaActive() ===');

    if(!id_media){
        console.error('id_media no válido:', id_media);
        return;
    }

    try {

        const response = await fetch('../song/php/update_media_active.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_media: id_media
                })
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error update_imagen_active.php) ${response.status}`);
        }



        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                //actualizo HTML DOM
                marcarMediaActiveEnDOM(data.id_media);//marcar en rojo la imagen en el modal
                await pintMediaActiveEnFondo();//aplico la imagen de fondo seleccionada

                showToast(
                    'ok',
                    data.mensaje,
                    2000
                );                  
                
            } else {

                showToast(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en update_imagen_active.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en update_imagen_active.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al actualizar la imagen de fondo:',
            error
        );

    }
}


async function updateVideoActive(id_video_val){
    console.log('=== function updateVideoActive() ===');

    if(!id_video_val){
        console.error('id_video_val no válido:', id_video_val);
        return;
    }

    try {

        const response = await fetch('../song/php/update_video_active.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_video: id_video_val
                })
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error update_video_active.php) ${response.status}`);
        }



        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                id_video = data.id_video;//reasigno id_video global para luego usarlo en el player
                update_objVideoActual();

                //actualizo HTML DOM
                pintVideoActiveEnPlayer();//poner datos del video en el player
                marcarVideoActiveEnDOM(id_video);//marcar en rojo el vídeo en el modal
                await pintVideoActiveEnFondo();//aplico el vídeo seleccionado

                showToast(
                    'ok',
                    data.mensaje,
                    2000
                );                  
                
            } else {

                showToast(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en update_video_active.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en update_video_active.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al actualizar el vídeo:',
            error
        );

    }
}


async function deleteMedia(id_media){
    console.log('=== function deleteMedia() ===');

    if(!id_media){
        console.error('id_media no válido:', id_media);
        return;
    }

    //averiguo si es imagen o vídeo
    //let palabra_tipo = () ? : ;


    const respuesta = confirm(`¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE esta imagen? \n\nEsta acción no se podrá deshacer.`);
    if(respuesta){
        console.log('sigo adelante para eliminar la imagen...'); //clic en "Aceptar"
        if(promtConClaveSecreta()){
            console.log('Clave secreta correcta. Procedo a eliminar la imagen.');
        }else{
            return;
        }
    } else {
        //console.log("7755. Cancelar..."); //clic en "Cancelar"
        return;
    }

    try {

        const response = await fetch('../song/php/delete_media.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_media: id_media
                })
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error delete_imagen.php) ${response.status}`);
        }



        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                //elimino del DOM la imagen eliminada
                eid_imagenesContainer.querySelector(`.media_item[data-id_media="${id_media}"]`).remove();
                eid_fondo_body.style = '';//quito el fondo para evitar que quede la imagen rota 
                bg_ruta = '';//quito la ruta del fondo 
                bg_media_type = '';//quito tipo de media. luego lo reasigno 
                video_ruta = '';//quito la ruta del video 

                localStorage.setItem('bg_ruta', '');//quito la ruta del fondo del localStorage
                localStorage.setItem('bg_media_type', '');//quito tipo de media del fondo del localStorage
                localStorage.setItem('video_ruta', '');//quito la ruta del video del localStorage
                await guardarEnLocalAndBd('g');//g = guardar fondo

                //si hay nueva imagen activa la aplico en el fondo
                if(data.new_id_media_active){
                    //actualizo HTML DOM
                    marcarMediaActiveEnDOM(data.new_id_media_active);//marcar en rojo la imagen en el modal
                    await pintMediaActiveEnFondo();//aplico la imagen de fondo seleccionada
                }

                showToast(
                    'ok',
                    data.mensaje,
                    2000
                );                  
                
            } else {

                showToast(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en delete_media.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en delete_media.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al actualizar el fichero de fondo:',
            error
        );

    }
}


async function deleteVideo(id_video_val){
    console.log('=== function deleteVideo() ===');

    if(!id_video_val){
        console.error('id_video_val no válido:', id_video_val);
        return;
    }

    //averiguo si es imagen o vídeo
    //let palabra_tipo = () ? : ;


    const respuesta = confirm(`¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE este vídeo? \n\nEsta acción no se podrá deshacer.`);
    if(respuesta){
        console.log('sigo adelante para eliminar el vídeo...'); //clic en "Aceptar"
        if(promtConClaveSecreta()){
            console.log('Clave secreta correcta. Procedo a eliminar el vídeo.');
        }else{
            return;
        }
    } else {
        //console.log("7755. Cancelar..."); //clic en "Cancelar"
        return;
    }

    try {

        const response = await fetch('../song/php/delete_video.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_video: id_video_val
                })
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error delete_imagen.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                //elimino del DOM la imagen eliminada
                eid_videosContainer.querySelector(`.video_item[data-id_video="${id_video}"]`).remove();

                //si hay un nuevo vídeo activo lo aplico en el DOM
                if(data.new_id_media_active){
                    id_video = data.new_id_video_active;
                    
                    //actualizo HTML DOM
                    pintVideoActiveEnPlayer();//poner datos del video en el player
                    marcarVideoActiveEnDOM(data.new_id_media_active);//marcar en rojo el video en el modal
                    await pintVideoActiveEnFondo();//aplico el vídeo seleccionado
                }

                showToast(
                    'ok',
                    data.mensaje,
                    2000
                );                  
                
            } else {

                showToast(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en delete_video.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en delete_video.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al actualizar el vídeo:',
            error
        );

    }
}


function marcarMediaActiveEnDOM(id_media){
    if(!id_media){
        return;
    }

    Array.from(eid_imagenesContainer.querySelectorAll('.media_item')).forEach(item => {
        if(item.dataset.id_media == id_media){
            item.classList.add('active');
        }else{
            item.classList.remove('active');
        }
    });
}

function marcarVideoActiveEnDOM(id_video){
    if(!id_video){
        return;
    }

    Array.from(eid_videosContainer.querySelectorAll('.video_item')).forEach(item => {
        if(item.dataset.id_video == id_video){
            item.classList.add('active');
        }else{
            item.classList.remove('active');
        }
    });
}

function getIndexVideoActual(id_video){
    console.log('=== function getIndexVideoActual() ===');

    //busco datos del video seleccionado en el arr_lista_videos
    const indexVideo = arr_lista_videos.findIndex(
        v => v.id_video == id_video
    );
    
    if(indexVideo === -1){
        return false;
    }
    
    return indexVideo;
}

function pintVideoActiveEnPlayer(){
    console.log('=== function pintVideoActiveEnPlayer() ===');  
    
    if(!id_video){
        //alert('no hay id_video');
        console.warn('no hay id_video');
        return;
    }    
    
    index_video_actual = getIndexVideoActual(id_video);
    
    objVideoActual = arr_lista_videos[index_video_actual];

    if(objVideoActual){
        eid_d_id_video.textContent = objVideoActual.id_video;
        eid_d_title_video.textContent = objVideoActual.title;
        eid_d_note_video.textContent = objVideoActual.note;
    }

    update_objVideoActual();
}

function update_objVideoActual(){
    console.log('=== function update_objVideoActual() ===');

    if(!id_video){
        // alert('no hay id_video');
        console.warn('no hay id_video');
        return;
    } 

    index_video_actual = getIndexVideoActual(id_video);
    
    objVideoActual = arr_lista_videos[index_video_actual];

    src_video_actual = objVideoActual.ruta;
}


async function getMediaActive(){
    console.log('=== function getMediaActive() ===');

    try {

        const response = await fetch('../song/php/get_media_active.php',
            {
                method: 'POST'
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error get_imagen_active.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            return data;

        } catch (error) {
            
            console.error('❌ JSON inválido en get_media_active.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en get_media_active.php',
                { cause: error }
            );
        } 

    } catch (error) {
        console.error('Error al cargar el fichero media de fondo:', error);
    }
}


async function getVideoActive(){
    console.log('=== function getVideoActive() ===');

    try {

        const response = await fetch('../song/php/get_video_active.php',
            {
                method: 'POST'
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error get_video_active.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            return data;

        } catch (error) {
            
            console.error('❌ JSON inválido en get_video_active.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en get_video_active.php',
                { cause: error }
            );
        } 

    } catch (error) {
        console.error('Error al cargar el fichero de vídeo:', error);
    }
}


async function getMediaAll(){
    console.log('=== function getMediaAll() ===');

    try {

        const response = await fetch('../song/php/get_media_all.php',
            {
                method: 'POST'
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error get_media_all.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
            
            return data;

        } catch (error) {
            
            console.error('❌ JSON inválido en get_media_all.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en get_media_all.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al cargar las imágenes o vídeos de fondo:',
            error
        );

    }
}


async function getVideoAll(){
    console.log('=== function getVideoAll() ===');

    try {

        const response = await fetch('../song/php/get_video_all.php',
            {
                method: 'POST'
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error get_video_all.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
            
            return data;

        } catch (error) {
            
            console.error('❌ JSON inválido en get_video_all.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en get_videoall.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al cargar el vídeo:',
            error
        );

    }
}



function pintarTimerHoly(){
    console.log('=== function pintarTimerHoly() ===');
    console.log('Holy:', Date.now());

    console.log(Date.now());
    console.log(objTimer.endTime); 
    
    const tiempoPausadoActualMs = obtenerTiempoPausadoActualMs();

    const timerState = calcularEstadoTimer();
    eid_timerTextHoly.innerHTML = timerState.texto;

    let textoEstado = timerState.status;

    if(objTimer.status === 'SUMADO'){
        const minutosSumados = Math.floor(objTimer.tiempoSumadoMs / 60000);    
        textoEstado = `SUMADO TOTAL: +${minutosSumados} min.`;
    }
    else if(objTimer.status === 'RESTADO'){
        const minutosRestados = Math.floor(objTimer.tiempoRestadoMs / 60000);    
        textoEstado = `RESTADO TOTAL: -${minutosRestados} min.`;
    }

    eid_estadoTimerHoly.textContent = textoEstado;

    eid_timerPausadoHoly.textContent = `Tiempo en pausa: ${formatearTiempoTimer(tiempoPausadoActualMs)}`;
    eid_timerRestadoHoly.textContent = `Total restado: ${formatearTiempoTimer(objTimer.tiempoRestadoMs)}`;
    eid_timerSumadoHoly.textContent  = `Total sumado: ${formatearTiempoTimer(objTimer.tiempoSumadoMs)}`;

    eid_timerDisplay.classList.remove(
        'verde',
        'amarillo',
        'rojo',
        'rojo_blink',
        'grey'
    );

    if(!objTimer.visible){
        eid_timerDisplay.classList.add('grey');
    }else{
        eid_timerDisplay.classList.add(timerState.clase);
    }
}


function identificarPantallas(){
    console.log('=== function identificarPantallas() ===');

    limpiarReferenciasCerradas();

    arr_misPantallas.forEach((pantalla, i) => {

        if(pantalla && !pantalla.closed){

            pantalla.postMessage({
                tipo: 'identificar_pantalla',
                numero: i + 1
            }, window.location.origin);

        }

    });
}



function actualizarIframePantalla(){
    console.log('=== function actualizarIframePantalla() ===');

    if(!miIframe || !miIframe.contentWindow){
        return;
    }

    const payload = {
        tipo: 'pantalla_update',
        actualizarSlide: true,
        actualizarVista: true,
        arr_pantalla,
        objPantallaParams,
        objTimer,
        objHora
    };

    miIframe.contentWindow.postMessage(
        payload,
        window.location.origin
    );
}

function crearPayloadPantalla({
    actualizarSlide = true,
    actualizarVista = true
} = {}){
    return {
        tipo: 'pantalla_update',
        actualizarSlide,
        actualizarVista,
        arr_pantalla,
        objPantallaParams,
        objTimer,
        objHora
    };
}

function actualizarIframePantalla(){
    if(!miIframe || !miIframe.contentWindow){
        return;
    }

    miIframe.contentWindow.postMessage(
        crearPayloadPantalla(),
        window.location.origin
    );
}

function actualizarReferenciaPantalla(referencia){
    if(!referencia || referencia.closed){
        return;
    }

    referencia.postMessage(
        crearPayloadPantalla(),
        window.location.origin
    );
}


function makeBtnActive(contenedor, btn){
    console.log('=== function makeBtnActive() ===');

    if(!contenedor || !btn){
        return;
    }

    resetBtnActive(contenedor);//reseteo btn_active de botones en el contenedor
    btn.classList.add('btn_active');
}


function makeFldActive(contenedor, fld){
    console.log('=== function makeFldActive() ===');

    if(!contenedor || !fld){
        return;
    }

    resetFldActive(contenedor);//reseteo fld_active de fieldset's en el contenedor
    fld.classList.add('fld_active');
}


function goToLinkById(idElement){
    console.log('=== function goToLinkById() ===');

    if(!idElement){
        return;
    }

    const element = document.getElementById(idElement);
    const url = element ? element.value.trim() : null;
    if(element && url){
        window.open(url, '_blank');
    }
}

