//============================================================//
//aki nuevas funciones
//============================================================//


function pintSongActive(arr_words){//click en tr de la tabla de canciones
    console.log('=== function pintSongActive(e) === ');

    console.log('asignado global --- id_song: ', id_song);

    resetTrSelected(tbody);
    tbody.querySelector(`.tr_song[data-id="${id_song}"]`).classList.add('selected');

    //song_text
    buscar_vista_song_content.innerHTML = '';//reset

    buscar_ul_action.innerHTML = `
        <li class="li_action" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</li>
        <li class="li_action" onclick="showBlockName('cancion'); editar_song('ver');">Ver canción</li>
        <li class="li_action" onclick="showBlockName('cancion'); editar_song('editar');">Editar canción</li>
        <li class="li_action" onclick="showBlockName('cancion'); eliminar_song();">Eliminar canción</li>
        <li class="li_action" onclick="crearSlides()">Crear slides</li>
        <li class="li_action" onclick="crearSlides(); closeAll()">Crear slides + Ver</li>
        <li class="li_action" onclick="addToLista();">Añadir a la Lista</li>
    `;

    //dejo '==' en vez de '===' porque id_song viene como string "925"
    // objSong = arr.find(s => s.id_song == id_song);
    objSong = objDataSongs.arr_data.find(s => s.id_song == id_song);
    console.log('objSong: ', objSong);

    const regex = new RegExp(`(${arr_words.join('|')})`, 'gi');//busco las palabras del input
    console.log('regex: ', regex);

    let vista_html = '';

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

    //construllo titulos de esquema después de añadir vista_html al DOM
    buildEsquemaSoloTitulos(buscar_vista_song_content.querySelector('.d_esquema_titulos'), objSong.arr_esquema);

    resetBlockEsquemaSoloHTML();
    resetBlockCancion();
    resetLineasXinBlock(eid_block_cancion);
}


function pintListaActive(arr_words){
    console.log('=== function pintListaActive(e) === ');
        
    console.log('asignado global --- id_lista: ', id_lista);

    resetTrSelected(tbody_lista);
    tbody_lista.querySelector(`.tr_lista[data-id="${id_lista}"]`).classList.add('selected');

    lista_wr_vista_song.style.gap = '5px';
    lista_wr_vista_song.innerHTML = `
        <div class="vista_lista_content">...</div>
    `;//reset. ya que debe existir el 'div.vista_song_content' lo meto de nuevo.

    const vista_lista_content = eid_block_lista.querySelector('.vista_lista_content');
    vista_lista_content.innerHTML = '';//reset

    const wr_btns_action = eid_block_lista.querySelector('.wr_btns_action');
    wr_btns_action.innerHTML = `
        <button class="btn btn_big" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver_sm');">Ver (SM)</button>
        <button class="btn btn_big" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver');">Ver</button>
        <button class="btn btn_big" onclick="openModal('full','Editar lista',null,'buildLista',true, 'editar');">Editar</button>
        <button class="btn btn_big" onclick="openModal('full','Eliminar lista',null,'buildLista',true, 'eliminar');">Eliminar</button>
    `;

    //dejo '==' en vez de '===' porque id_song viene como string "925"
    // const objLista = arr.find(s => s.id_lista == id_lista);
    objLista = objDataListas.arr_data.find(s => s.id_lista == id_lista);
    console.log('objLista: ', objLista);                

    // Normalizamos palabras
    const arr_normalized = arr_words.map(normalize);
    console.log('arr_normalized: ', arr_normalized);

    //const regex = new RegExp(`(${arr_words.join('|')})`, 'gi');//antes - busco las palabras del input
    // console.log('regex: ', regex);

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
        vista_lista_content.append(d_titulo);
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
        vista_lista_content.append(d_fecha);
    }

    // resetBlockLista();
    // resetLineasXinBlock(eid_block_lista);

    //Canciones
    const d_canciones_lista = document.createElement('div');
    d_canciones_lista.className = 'd_canciones_lista parte_lista';
    vista_lista_content.append(d_canciones_lista);

    
    console.log('antes --- objLista.arr_lista: ', objLista.arr_lista);
    
    //objLista = structuredClone(objLista);//equivale a JSON.parse(JSON.stringify(objLista));
    console.log('ahora --- objLista: ', objLista);
    
    arr_lista = objLista.arr_lista;//importante. reasigno desde bd

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
        vista_lista_content.append(d_notas);
    }

}


function pintListaActiveSoloDatos(objLista){
    console.log('=== function pintListaActiveSoloDatos() === ');

    //comprobar si existe tr_lista de lalista activa
    const tr_lista = tbody_lista.querySelector(`.tr_lista[data-id="${objLista.id_lista}"]`);
    console.log('tr_lista: ', tr_lista);
    
    if(!tr_lista){
        return;
    }

    //actualizo datos de tr_lista
    tr_lista.querySelector('.td_titulo').textContent = objLista.title || 'kuku';
    tr_lista.querySelector('.td_dia_semana').textContent = diaSemana(objLista.fecha) || '';
    tr_lista.querySelector('.td_fecha').textContent = objLista.fecha_ver || '';
    tr_lista.querySelector('.td_lista').textContent = (objLista.arr_lista.length > 0) ? 'Sí' :  '';

    const objListaBD = structuredClone(objLista);//equivale a JSON.parse(JSON.stringify(objListaBD));
    console.log('objListaBD: ', objListaBD);

    let words_input = eid_inpt_find_lista.value.trim();
    let arr_words = [];
    if(words_input.includes(' ')){
        arr_words = words_input.split(' ');
    }else{
        arr_words = [words_input];
    }

    

    //resetTrSelected(tbody_lista);

    lista_wr_vista_song.style.gap = '5px';
    lista_wr_vista_song.innerHTML = `
        <div class="vista_lista_content">...</div>
    `;//reset. ya que debe existir el 'div.vista_lista_content' lo meto de nuevo.

    const vista_lista_content = eid_block_lista.querySelector('.vista_lista_content');
    vista_lista_content.innerHTML = '';//reset

    const wr_btns_action = eid_block_lista.querySelector('.wr_btns_action');
    wr_btns_action.innerHTML = `
        <button class="btn btn_big" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver');">Ver lista</button>
        <button class="btn btn_big" onclick="openModal('full','Editar lista',null,'buildLista',true, 'editar');">Editar lista</button>
        <button class="btn btn_big" onclick="openModal('full','Eliminar lista',null,'buildLista',true, 'eliminar');">Eliminar lista</button>
    `;


    // Normalizamos palabras
    //const arr_normalized = arr_words.map(normalize);//modo corto de escribir la func abajo
    const arr_normalized = arr_words.map( palabra => {
        return normalize(palabra);
    });
    console.log('arr_normalized: ', arr_normalized);


    // Creamos regex sin acentos
    const regex = new RegExp(`(${arr_normalized.join('|')})`, 'gi');
    console.log('regex: ', regex);

    //Titulo lista
    if(objListaBD.title){
        //Marco en rojo las palabras encontradas en title 
        let titulo_text_red = objListaBD.title.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });

        const d_titulo = document.createElement('div');
        d_titulo.className = 'parte_lista';
        d_titulo.innerHTML = `
            <p class="p_titulo">Título Lista:</p>
            <p class="texto_norm t_big">${titulo_text_red}</p>
        `;
        vista_lista_content.append(d_titulo);
    }

    //Fecha
    if(objListaBD.fecha && objListaBD.fecha != '0000-00-00'){
        //Marco en rojo las palabras encontradas en title 
        //En BD busco '2025-08-03' 
        //pero como el formato para mostrar es '03/08/2025'
        //convierto '2025-08-03' a '03/08/2025' para luego pintar en rojo la coincidencia
        let validar_partes_fecha = false;//para pintar permito no validar la fecha. puede ser '2025-08', '2025-' 
        const regex_fecha = new RegExp(`(${convertirFecha(arr_normalized.join('|'), 'ver', '/', validar_partes_fecha)})`, 'gi');
        console.log('regex_fecha: ', regex_fecha);

        // let fecha_text_red = convertirFecha(objListaBD.fecha_ver, 'ver','/');// de '2025-08-03' => '03/08/2025'
        let fecha_text_red = objListaBD.fecha_ver;// en bd es '2025-08-03'
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
        vista_lista_content.append(d_fecha);
    }

    // resetBlockLista();

    //Canciones
    const d_canciones_lista = document.createElement('div');
    d_canciones_lista.className = 'd_canciones_lista parte_lista';
    vista_lista_content.append(d_canciones_lista);

    let arr_lista_bd = objLista.arr_lista;
    console.log('despues --- objLista.arr_lista === arr_lista_bd: ', arr_lista_bd);

    buildListaSoloSongs(d_canciones_lista, arr_lista_bd);

    if(objListaBD.notes){
        //Marco en rojo las palabras encontradas en notes 
        let notas_text_red = objListaBD.notes.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        const d_notas = document.createElement('div');
        d_notas.className = 'parte_lista';
        d_notas.innerHTML = `
            <p class="p_titulo">Notas:</p>
            <p class="texto_norm">${notas_text_red}</p>
        `;
        vista_lista_content.append(d_notas);
    }

}



function showOneSlideFrom(elementClicked){
    console.log('=== function showOneSlideFrom() ===');
    console.log('elementClicked: ', elementClicked);

    if(elementClicked.dataset.titulo === '_titulo_cancion_'){
        //return;
    }

    const index_esquema = elementClicked.dataset.idx;
    console.log('index_esquema: ', index_esquema);

    const elementBtnSimple = select_slide_wr_vista_btns.querySelector(`.btn_simple[data-idx="${index_esquema}"]`);
    console.log('elementBtnSimple: ', elementBtnSimple);

    const elementFieldset = select_slide_song_bloques.querySelector(`fieldset[data-idx="${index_esquema}"]`);
    console.log('elementFieldset: ', elementFieldset);

    eid_contenedor_prev_inner.innerHTML = '';//reset

    resetBtnActive(select_slide_wr_vista_btns);//reseteo btn_active de botones en el contenedor
    elementBtnSimple.classList.add('btn_active');

    resetFldActive(select_slide_song_bloques);//reseteo fieldset active de kuplet's a la izda
    elementFieldset.classList.add('fld_active');

    if(elementClicked === elementBtnSimple){
        console.log('es button -> btn_clicked ');
        elementFieldset.scrollIntoView({behavior: 'smooth', block: "center"});//btn clicked -> muevo fildset
    }else{
        console.log('es fieldset clicked');
        elementBtnSimple.scrollIntoView({behavior: 'smooth', block: "center"});//fieldset clicked -> muevo btn
    }        

    // const el_fieldset_cloned = select_slide_song_bloques.querySelectorAll('fieldset')[index_esquema].cloneNode(true); // true para clonar hijos
    //clono fieldset nuevo para vista en contenedor_prev ya que le cambiaré font-size
    const el_fieldset_cloned = arr_fieldsets[index_esquema].cloneNode(true); // true para clonar hijos

    eid_titulo_shown.textContent = el_fieldset_cloned.querySelector('legend').textContent;

    //Primer slide
    if(elementClicked.dataset.titulo === '_titulo_cancion_' || index_esquema == 0){
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






function make_arr_pantalla(currentSlide){
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
    let song_text = '';
    let arr_p_text = [];

    let p_textAll = current_fieldset_cloned.querySelectorAll('p.t');//solo texto
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
    if(current_fieldset_cloned.dataset.idx == arr_esquema_bucle.length - 1){
        song_text += `<span class="tres_estrellas">* * *</span>`;
    }

    if(p_textAll.length == 0){//si no se encuentra el verse, no hago nada
        //alert('no hay texto en la diapositiva seleccionada. pero sigo...');
        let hay_song_titulo = current_fieldset_cloned.querySelector('.song_titulo');
        if(hay_song_titulo){
            song_text += `
                <div class="wr_d_puntos">
                    <p>...</p>
                </div>
            `;
        }

        let p_acordeAll = current_fieldset_cloned.querySelectorAll('p.c');
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

    //make_arr_pantalla(act_show_verse);
}

function ocultar_pantallaShow(){
    // eid_btn_pantallaShow.classList.remove('btn_active');
    eid_vklad_btn_pantallaShow.classList.remove('btn_active');
    eid_contenedor_prev.classList.remove('shown');
    eid_fondo_body.classList.remove('fondo_black');
    
    localStorage.setItem('pantallaShow','false');
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


function old_hayElementosModalesAbiertos() {
    return [...document.querySelectorAll('.elementos_modales')]
        .some(modal => {
            if (!modal.offsetParent) return false; // no visible en DOM
            const rect = modal.getBoundingClientRect();
            return rect.width > 0 &&
                   rect.height > 0 &&
                   rect.bottom > 0 &&
                   rect.right > 0 &&
                   rect.top < window.innerHeight &&
                   rect.left < window.innerWidth;
        });
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
   
    if(block_display == 'block'){//oculto
        closeDiv(divElement);
    }else{//muestro
        openDiv(divElement);
    }    
}

function closeDiv(divElement){
    //console.log('=== function closeDiv() ===');
    if(!divElement) return;
    
    const innerElement = divElement.querySelector('.bl_set_inner');    
    
    innerElement.classList.remove('bl_opened');
    innerElement.classList.add('bl_closed');
    setTimeout(()=>{
        divElement.style.display = 'none';
    },300);
}

function openDiv(divElement){
    //console.log('=== function openDiv() ===');

    const innerElement = divElement.querySelector('.bl_set_inner');
    const innerElementContent = divElement.querySelector('.inner_content');

    divElement.style.display = 'block';
    setTimeout(()=>{//importante para que se ejecute la animación
        innerElement.classList.remove('bl_closed');
        innerElement.classList.add('bl_opened');
    },3);

    //Para que se abra mas bonito , pongo el sig. código. 
    //No pongo en css 'overflow:auto;' ya que al desplegar el block muestra scroll y luego lo quita, lo que no es bonito
    //con js lo soluciono
    setTimeout(()=>{
        if(innerElementContent.offsetHeight > innerElement.offsetHeight){
            innerElement.style.overflow = 'auto';//no hago comprobacion si ya esta esto, para no añadir un código mas. lo reescribo y ya está.
        }else{
            innerElement.removeAttribute('style');
        }
    },300);//300 es 0.3s de transition css
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