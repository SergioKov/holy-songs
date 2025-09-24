//============================================================//
//aki nuevas funciones
//============================================================//


function pintSongActive(){//click en tr de la tabla de canciones
    console.log('=== function pintSongActive(e) === ');

    console.log('asignado global --- id_song: ', id_song);

    resetTrSelected(tbody);
    tbody.querySelector(`.tr_song[data-id="${id_song}"]`).classList.add('selected');

    mostrarPrim = false;
    ocultarElementosPrimEn(buscar_option_inner);
    mostrarElementosEditablesEn(buscar_option_inner);
    mySizeBuscar();//importante después de quitar opt_prim y mostrar opt_edit 

    //song_text
    buscar_vista_song_content.innerHTML = '';//reset

    buscar_ul_action.innerHTML = `
        <div class="razdel">Lista:</div>
        <li class="li_action" onclick="addToLista();">Añadir a la Lista</li>

        <div class="razdel">Esquema:</div>
        <li class="li_action" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); select_slide();">Select slide</li>
        
        <div class="razdel">Canción:</div>
        <li class="li_action" onclick="showBlockName('cancion'); ver_song();">Ver canción</li>
        <li class="li_action" onclick="showBlockName('cancion'); editar_song();">Editar canción</li>
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

    //comprobar si existe tr_lista de lalista activa
    const tr_song = tbody.querySelector(`.tr_song[data-id="${objSong.id_song}"]`);
    console.log('tr_song: ', tr_song);
    
    if(!tr_song){
        //alert('no hay tr_song');
        console.log('no hay tr_song. no actualizo tr_song...');
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


    //actualizo datos de tr_song
    tr_song.querySelector('.td_numero').textContent = objSong.song_number || '';
    tr_song.querySelector('.td_titulo').textContent = objSong.title || '';
    tr_song.querySelector('.td_esquema').textContent = hay_esquema_texto;
    
    tr_song.querySelector('.td_category').dataset.category = objSong.category || '';
    tr_song.querySelector('.td_category').innerHTML = category_name_text;

    tr_song.querySelector('.td_songbook').dataset.songbook = objSong.songbook || '';
    tr_song.querySelector('.td_songbook').innerHTML = songbook_title_text;

    tr_song.querySelector('.td_idioma').textContent = lang_name_text;
    tr_song.querySelector('.td_tonalidad').textContent = objSong.tune || '';
   

   // Normalizamos palabras de 'arr_words' (global)
    //const arr_normalized = arr_words.map(normalize);//modo corto de escribir la func abajo
    const arr_normalized = arr_words.map( palabra => {
        return normalize(palabra);
    });
    console.log('arr_normalized: ', arr_normalized);
        
    const regex = new RegExp(`(${arr_normalized.join('|')})`, 'gi');//busco las palabras del input
    console.log('regex: ', regex);

    let vista_html = '';

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

    if(objSong.id_song){
        //Marco en rojo las palabras encontradas en title 
        let id_song_text_red = objSong.id_song.toString().replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });

        vista_html += `
            <p class="p_titulo">Id:</p>
            <p class="texto_norm t_big">${id_song_text_red}</p>
        `;
    }

    if(objSong.song_number){
        //Marco en rojo las palabras encontradas en title 
        let song_number_text_red = objSong.song_number.toString().replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });

        vista_html += `
            <p class="p_titulo">Número:</p>
            <p class="texto_norm t_big">${song_number_text_red}</p>
        `;
    }

    if(objSong.category_name){
        //Marco en rojo las palabras encontradas en title 
        let category_name_text_red = objSong.category_name.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        vista_html += `
            <p class="p_titulo">Categoría:</p>
            <p class="texto_norm t_big">${objSong.category + '. ' + category_name_text_red}</p>
        `;
    }

    if(objSong.songbook_title){
        //Marco en rojo las palabras encontradas en title 
        let songbook_title_text_red = objSong.songbook_title.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        vista_html += `
            <p class="p_titulo">Songbook:</p>
            <p class="texto_norm t_big">${objSong.songbook + '. ' + songbook_title_text_red}</p>
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

    //añado contenedor para d_esquema
    vista_html += `
        <div class="d_esquema_titulos"></div>
    `;

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


    // if(objSong.arr_esquema.length > 0){
    //     vista_html += `
    //         <p class="p_titulo">Esquema:</p>
    //     `;
    //     objSong.arr_esquema.forEach( (item, i)=>{
    //         if(i != 0){
    //             vista_html += `
    //                 <p class="texto_norm linea">
    //                     <span class="titulo">(${item.nombre})</span> 
    //                     ${ (item.veces > 1) ?  '<span class="puntos"></span> <span class="veces">(x' + item.veces + ')</span>' : '' }
    //                 </p>
    //             `;
    //         }
    //     });
    // }else{
    //     vista_html += `
    //         <p class="p_titulo">Esquema:</p>
    //         <p class="texto_norm">No</p>
    //     `;
    // }

    buscar_vista_song_content.innerHTML = vista_html;

    //Construllo titulos de esquema después de añadir vista_html al DOM
    buildEsquemaSoloTitulos(buscar_vista_song_content.querySelector('.d_esquema_titulos'), objSong.arr_esquema);
}



function pintListaActive(){
    console.log('=== function pintListaActive(e) === ');
        
    console.log('asignado global --- id_lista: ', id_lista);

    resetTrSelected(tbody_lista);
    tbody_lista.querySelector(`.tr_lista[data-id="${id_lista}"]`).classList.add('selected');
    
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

    //comprobar si existe tr_lista de lalista activa
    const tr_lista = tbody_lista.querySelector(`.tr_lista[data-id="${objLista.id_lista}"]`);
    console.log('tr_lista: ', tr_lista);
    
    if(tr_lista){
        //alert('no hay tr_lista');
        //return;
        
        //Actualizo datos de tr_lista
        tr_lista.querySelector('.td_titulo').textContent = objLista.title || '';
        tr_lista.querySelector('.td_dia_semana').textContent = diaSemana(objLista.fecha) || '';
        tr_lista.querySelector('.td_fecha').textContent = objLista.fecha_ver || '';
        tr_lista.querySelector('.td_lista').textContent = (objLista.arr_lista.length > 0) ? `Sí (${objLista.arr_lista.length})` :  '';
    }

    // //Actualizo parte derecha
    lista_vista_lista_content.innerHTML = '';//reset

    lista_ul_action.innerHTML = `
        <li class="li_action" onclick="openModal('full','Ver lista (SM)',null,'buildLista',true, 'ver_sm');">Ver (SM)</li>
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

    //Titulo lista
    if(objLista.title){
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
        lista_vista_lista_content.append(d_titulo);
    }

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
        lista_vista_lista_content.append(d_id_lista);
    }    

    //Fecha
    if(objLista.fecha && objLista.fecha != '0000-00-00'){
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
        lista_vista_lista_content.append(d_fecha);
    }

    //Canciones
    const d_canciones_lista = document.createElement('div');
    d_canciones_lista.className = 'd_canciones_lista parte_lista';
    lista_vista_lista_content.append(d_canciones_lista);    
    
    arr_lista = objLista.arr_lista;//importante. reasigno desde bd
    console.log('arr_lista: ', arr_lista);

    let arr_lista_bd = objLista.arr_lista;
    console.log('despues --- objLista.arr_lista === arr_lista_bd: ', arr_lista_bd);

    buildListaSoloSongs(d_canciones_lista, arr_lista_bd);

    if(objLista.notes){
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
        lista_vista_lista_content.append(d_notas);
    }
}



function showOneSlideFrom(elementClicked = null, index_esquema){
    console.log('=== function showOneSlideFrom() ===');
    console.log('elementClicked: ', elementClicked);

    e = elementClicked;

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

    resetBtnActive(select_slide_wr_vista_btns);//reseteo btn_active de botones en el contenedor
    elementBtnSimple?.classList.add('btn_active');

    resetFldActive(select_slide_song_bloques);//reseteo fieldset active de kuplet's a la izda
    elementFieldset?.classList.add('fld_active');

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
    const el_fieldset_cloned = arr_fieldsets[index_esquema].cloneNode(true); // true para clonar hijos

    eid_titulo_shown.textContent = el_fieldset_cloned.querySelector('legend').textContent;

    //Primer slide
    if( (elementClicked && elementClicked.dataset.titulo === '_titulo_cancion_') || index_esquema == 0){
        el_fieldset_cloned.querySelector('.song_titulo').textContent = '...';//muestro ... en vez del título del slide 1
        eid_titulo_shown.textContent = 'Título canción';
    }

    //Ultimo slide
    if(index_esquema == arr_esquema_bucle.length - 1){
        const p = document.createElement('p');
        p.className = 'tres_estrellas';
        p.textContent = '* * *';
        el_fieldset_cloned.append(p);//muestro ... en vez del título del slide 1
    }

    eid_contenedor_prev_inner.append(el_fieldset_cloned);

    const contenedorSlideView = eid_pantalla_body;

    ajustarTextoContenedor(contenedorSlideView);

    currentSlide = Number(index_esquema);

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

    if(arr_fieldsets.length == 0 || arr_esquema_bucle.length == 0){
        return;
    }
    
    const current_fieldset = arr_fieldsets[currentSlide];
    console.log('current_fieldset: ',current_fieldset);

    const current_fieldset_cloned = current_fieldset.cloneNode(true);
    console.log('current_fieldset_cloned: ',current_fieldset_cloned);

    arr_pantalla = [];//reset   
    objPantalla = {};//reset 

    let slide_text = '';
    let arr_p_text = [];
    let arr_p = [];

    let add_tres_estrellas = false;
    let add_d_puntos = false;
    let add_d_music = false;


    let p_All = current_fieldset_cloned.querySelectorAll('p');//todos los 'p' de acordes y de texto
    console.log('p_All: ', p_All);

    p_All.forEach((p, i, arr) => {
        console.log('p: ', p);

        slide_text += p.innerHTML;
        if(i != arr.length - 1){
            slide_text += '<br>';
        }
        const p_obj = {
            class: p.className,
            content: p.textContent,
            content_html: p.innerHTML,
        }
        // arr_p.push(p_obj);
        arr_p.push(p);
    });    

    let p_textAll = current_fieldset_cloned.querySelectorAll('p.t');//solo texto
    console.log('p_textAll: ', p_textAll);

    p_textAll.forEach((p, i, arr) => {
        console.log('p: ', p);
        slide_text += p.innerHTML;
        if(i != arr.length - 1){
            slide_text += '<br>';
        }
        //arr_p_text.push(p.textContent);
    });

    
    
    //si es ultimo slide
    if(currentSlide == arr_esquema_bucle.length - 1){
        //slide_text += `<span class="tres_estrellas">* * *</span>`;
        const tres_estrellas = document.createElement('span');
        tres_estrellas.className = 'tres_estrellas';
        tres_estrellas.innerHTML = '* * *';
        current_fieldset_cloned.append(tres_estrellas);

        add_tres_estrellas = true;
    }


    if(p_textAll.length == 0){//si no se encuentra el verse, no hago nada
        //alert('no hay texto en la diapositiva seleccionada. pero sigo...');
        let hay_song_titulo = current_fieldset_cloned.querySelector('.song_titulo');
        if(hay_song_titulo){
            // slide_text += `
            //     <div class="wr_d_puntos">
            //         <p>...</p>
            //     </div>
            // `;
            const wr_d_puntos = document.createElement('div');
            wr_d_puntos.className = 'wr_d_puntos';
            wr_d_puntos.innerHTML = '<p>...</p>';
            current_fieldset_cloned.append(wr_d_puntos);

            add_d_puntos = true;
        }

        let p_acordeAll = current_fieldset_cloned.querySelectorAll('p.c');
        if(p_acordeAll.length > 0){
            // slide_text += `
            //     <div class="wr_d_music">
            //         <img src="images/notas_de_musica_grey.svg">
            //     </div>
            // `;
            const wr_d_music = document.createElement('div');
            wr_d_music.className = 'wr_d_music';
            wr_d_music.innerHTML = '<img src="images/notas_de_musica_grey.svg">';
            current_fieldset_cloned.append(wr_d_music);

            add_d_music = true;
        }
    }

    let fieldset_html_safe = sanitizeHtmlForJson(compactHtml(current_fieldset_cloned.outerHTML));
    console.log('fieldset_html_safe: ', fieldset_html_safe);


    objPantalla = {
        tipo_content: 'slide_text',
        //arr_p_text: arr_p_text,
        //arr_p: arr_p,
        fieldset_html: fieldset_html_safe,//se pasa como string
        id_song: id_song,
        slide_actual: currentSlide,
        slide_text: slide_text,
        //slide_text: 'de momento nada...',
        add_tres_estrellas,
        add_d_puntos,
        add_d_music,
        pantalla_show: pantallaShow,
    };
    console.log('objPantalla: ', objPantalla);

    arr_pantalla.push(objPantalla);
    console.log('arr_pantalla: ', arr_pantalla);

    arr_pantalla_string = JSON.stringify(arr_pantalla);//es global
    console.log('arr_pantalla_string: ', arr_pantalla_string);

    localStorage.setItem('arr_pantalla',arr_pantalla_string);





    // //1.------------------------
    // const objPantallaToSend = {
    //     id_song: id_song,
    //     slide_actual: currentSlide,
    //     slide_text: 'bd. de momento nada...',
    //     arr_pantalla: arr_pantalla,
    // };
    // console.log('objPantallaToSend: ',objPantallaToSend);

    // const objPantallaToSend_str = JSON.stringify(objPantallaToSend);
    // console.log('objPantallaToSend_str: ', objPantallaToSend_str);

    // const response = await fetch('insertar_arr_pantalla.php', {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: objPantallaToSend_str
    // });

    // if (!response.ok) {
    //     throw new Error('Error al obtener datos');
    // }
    
    // let data;
    // if(debug){
    //     data = await response.text();//test
    // }else{
    //     data = await response.json();
    // }
    // console.log('data: ',data); 




















    // const result = await guardarSongPantallaEnBd();//objPantalla es global
    // console.log('arr_pantalla: ', arr_pantalla);
    // console.log('result: ', result);
    
    const result2 = await guardarArrPantallaEnBd();//objPantalla es global
    console.log('arr_pantalla: ', arr_pantalla);
    console.log('result2: ', result2);
    
    console.log('fin make_arr_pantalla...');

    //buildArrPantallaDesktop(arr_pantalla);
}


function enableDisablePantallaShow(){//muestra o oculta
    if(pantallaShow){
        pantallaShow = false;//siguiente accion
    }else{        
        pantallaShow = true;//siguiente accion
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
    eid_fondo_body.classList.add('fondo_black');

    localStorage.setItem('pantallaShow','true');
    make_arr_pantalla(currentSlide);//dentro hay pantallaShow
}

function ocultar_pantallaShow(){
    // eid_btn_pantallaShow.classList.remove('btn_active');
    eid_vklad_btn_pantallaShow.classList.remove('btn_active');
    eid_contenedor_prev.classList.remove('shown');
    eid_fondo_body.classList.remove('fondo_black');
    
    localStorage.setItem('pantallaShow','false');
    make_arr_pantalla(currentSlide);//dentro hay pantallaShow
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




function hayElementosModalesAbiertos(opciones = { parcial: true }) {
    const modales = document.querySelectorAll('.elementos_modales');

    return [...modales].some(modal => {
        // Si tiene la clase 'shown', se considera visible sin más comprobaciones
        if (modal.classList.contains('shown')) {
            return true;
        }

        // Comprobar si está oculto en el DOM
        if (!modal.offsetParent) return false;

        // Obtener posición y dimensiones relativas a la ventana
        const rect = modal.getBoundingClientRect();

        // Comprobar tamaño
        if (rect.width === 0 || rect.height === 0) return false;

        // Verificar visibilidad según la opción parcial o total
        if (opciones.parcial) {
            return (
                rect.bottom > 0 &&
                rect.right > 0 &&
                rect.top < window.innerHeight &&
                rect.left < window.innerWidth
            );
        } else {
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth
            );
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








// hideShowSettings('nav');

function hideShowDiv(id_div){
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








function showToast(tipo = 'info', mensaje, duration = null) {
    
    // Crear toast
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `
      <div class="toast_mensaje">${mensaje}</div>
      <!-- aki btn de cerrar toast -->
    `;

    //si no hay duration, muestro btn de cerrar
    if(!duration || duration  <= 1000){
        let ejemplo_btn = '<button class="toast_close" onclick="this.parentElement.remove()">×</button>';

        const toast_close = document.createElement('button');
        toast_close.className = 'toast_close';
        toast_close.textContent = '×';
        toast_close.onclick = (e) =>{
            e.currentTarget.parentElement.remove();
        }
        //añado al toast
        toast.append(toast_close);
    }

    //Añado al DOM
    eid_toast_container.appendChild(toast);

    // Forzar reflow para activar transición
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    if(duration > 1000){
       console.log('hay duration: ', duration);
        // Auto eliminar
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 1000);
        }, duration);
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