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


function convertirFechaAntes(fechaStr) {// de '01:31:2021' que es 31 de enero de 2021 => '2021-01-31'
    // Separar por ':'
    if(!fechaStr) return;
    const partes = fechaStr.split(':');
    if (partes.length !== 3) return null; // formato no válido

    const dia = partes[1].padStart(2, '0');
    const mes = partes[0].padStart(2, '0');
    const anio = partes[2];

    return `'${anio}-${mes}-${dia}'`;
}


















function nueva_song(){
    console.log('=== function nueva_song() ===');

    id_song = null;//reset id_song -> ya que es nueva canción

    //reseteo datos de la song anterior para evitar confusión
    resetBlockBuscar();
    resetBlockEsquema();
    resetLineasXinBlock(eid_block_cancion);

    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_btns_action.innerHTML = '...';//reset    

    cancion_song_bloques.classList.add('solo_ver');

    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Nueva canción:';
    eid_block_cancion.querySelector('.bl_parte_l h5').textContent = 'Añade los datos de la nueva canción:';
    eid_block_cancion.querySelector('.bl_parte_r h4').textContent = 'Vista previa de la nueva canción:';
    eid_block_cancion.querySelector('.bl_parte_r h5').textContent = 'Estructura (bloques) de la canción:';
    form_mensaje.textContent = 'Rellena los campos del formulario con los datos de la nueva canción.';

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
    eid_block_cancion_head.querySelector('#btn_song_nueva').classList.add('btn_active');

    cancion_song_bloques.querySelector('.puntos_def').style.display = 'none';//oculto '...'
    cancion_form_container.style.display = 'block';//mostrar formulario de canción

    makeInputsDisabled(cancion_form_container, false);
    cancion_form_container.querySelector('form').reset();//reseteo formulario 

    cancion_form_container.querySelector('#id_song').disabled = true;//deshabilito input id_song   
    cancion_form_container.querySelector('.wr_id_song').style.display = 'none';//oculto el wr_id_song

    cancion_wr_btns_action.innerHTML = `
        <button class="btn" onclick="showBlockName('buscar');">Buscar</button>
    `;
    
    console.log('fin');
}



function editar_song(modo){
    console.log('=== function editar_song() ===');

    if(!hay_id_song('editar_song()')){
        return; // <- se detiene aquí si no hay id_song
    }

    resetLineasXinBlock(eid_block_cancion);

    if(modo == 'ver'){
        makeInputsDisabled(cancion_form_container, true);
        //Partes left-right
        eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Ver canción:';
        eid_block_cancion.querySelector('.bl_parte_l h5').textContent = 'Los datos de la canción seleccionada:';
        eid_block_cancion.querySelector('.bl_parte_r h4').textContent = 'Vista previa de la canción seleccionada:';
        eid_block_cancion.querySelector('.bl_parte_r h5').textContent = 'Estructura (bloques) de la canción:';
        form_mensaje.textContent = 'Mira los campos del formulario de la canción.';

        resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
        eid_block_cancion_head.querySelector('#btn_song_ver').classList.add('btn_active');
    }
    else if(modo == 'editar'){
        makeInputsDisabled(cancion_form_container, false);
        //Partes left-right
        eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Editar canción:';
        eid_block_cancion.querySelector('.bl_parte_l h5').textContent = 'Edita los datos de la canción seleccionada:';
        eid_block_cancion.querySelector('.bl_parte_r h4').textContent = 'Vista previa de la canción editada:';
        eid_block_cancion.querySelector('.bl_parte_r h5').textContent = 'Estructura (bloques) de la canción:';
        form_mensaje.textContent = 'Edita los campos del formulario de la canción.';

        resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
        eid_block_cancion_head.querySelector('#btn_song_editar').classList.add('btn_active');
    }


    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_btns_action.innerHTML = '...';//reset    

    cancion_song_bloques.classList.add('solo_ver');
    
    cancion_song_bloques.querySelector('.puntos_def').style.display = 'none';//oculto '...'
    cancion_form_container.style.display = 'block';//mostrar formulario de canción

    cancion_form_container.querySelector('form').reset();//reseteo formulario    
    
    cancion_form_container.querySelector('#title').value = objSong.title || '';
    cancion_form_container.querySelector('#category').value = objSong.category || '';
    cancion_form_container.querySelector('#id_song').value = objSong.id_song;
    cancion_form_container.querySelector('#id_song').disabled = true;//deshabilito input id_song
    cancion_form_container.querySelector('.wr_id_song').style.display = 'block';//muestro el wr_id_song
    cancion_form_container.querySelector('#song_number').value = objSong.song_number || '';
    cancion_form_container.querySelector('#tune').value = objSong.tune || '';
    cancion_form_container.querySelector('#lang').value = objSong.lang;
    cancion_form_container.querySelector('#song_text').value = objSong.song_text || '';
    cancion_form_container.querySelector('#notes').value = objSong.notes || '';

    handleFormInput(cancion_form_container.querySelector('#song_text'), eid_block_cancion);

    cancion_wr_btns_action.innerHTML = `
        <button class="btn" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</button>
        <button class="btn" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</button>
        <button class="btn" onclick="crearSlides();">Crear slides</button>
        <button class="btn" onclick="crearSlides(); closeAll()">Crear slides + Ver</button>
    `;

    
    console.log('fin');    
}



function eliminar_song(){
    console.log('=== function eliminar_song() ===');

    if(!hay_id_song('eliminar_song()')){
        return; // <- se detiene aquí si no hay id_song
    }

    resetLineasXinBlock(eid_block_cancion);

    makeInputsDisabled(cancion_form_container, true);
    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Eliminar canción:';
    eid_block_cancion.querySelector('.bl_parte_l h5').textContent = 'Los datos de la canción para eliminar:';
    eid_block_cancion.querySelector('.bl_parte_r h4').textContent = 'Vista previa de la canción para eliminar:';
    eid_block_cancion.querySelector('.bl_parte_r h5').textContent = 'Estructura (bloques) de la canción:';
    form_mensaje.textContent = 'Revisa los campos del formulario de la canción que se va a eliminar.';

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
    eid_block_cancion_head.querySelector('#btn_song_eliminar').classList.add('btn_active');

    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_btns_action.innerHTML = '...';//reset    

    cancion_song_bloques.classList.add('solo_ver');
    
    cancion_song_bloques.querySelector('.puntos_def').style.display = 'none';//oculto '...'
    cancion_form_container.style.display = 'block';//mostrar formulario de canción

    cancion_form_container.querySelector('form').reset();//reseteo formulario    
    
    cancion_form_container.querySelector('#title').value = objSong.title || '';
    cancion_form_container.querySelector('#category').value = objSong.category || '';
    cancion_form_container.querySelector('#id_song').value = objSong.id_song;
    cancion_form_container.querySelector('#id_song').disabled = true;//deshabilito input id_song
    cancion_form_container.querySelector('.wr_id_song').style.display = 'block';//muestro el wr_id_song
    cancion_form_container.querySelector('#song_number').value = objSong.song_number || '';
    cancion_form_container.querySelector('#tune').value = objSong.tune || '';
    cancion_form_container.querySelector('#lang').value = objSong.lang;
    cancion_form_container.querySelector('#song_text').value = objSong.song_text || '';
    cancion_form_container.querySelector('#notes').value = objSong.notes || '';

    handleFormInput(cancion_form_container.querySelector('#song_text'), eid_block_cancion);

    cancion_wr_btns_action.innerHTML = `
        <button class="btn btn_big" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</button>                
        <button class="btn btn_big btn_eliminar" onclick="deleteSong();">Eliminar Canción DEFINITIVAMENTE</button>                
    `;
    
    console.log('fin');    
}




function makeInputsDisabled(container, param){
    console.log('=== function makeInputsDisabled() ===');
    
    if(param === true){
        container.querySelector('form').querySelectorAll('input, select, textarea').forEach(input => {
            input.disabled = true;
        });
        container.querySelector('.wr_btns_form')?.classList.add('no_visto');//oculto botones de acción del formulario
    }else{
        container.querySelector('form').querySelectorAll('input, select, textarea').forEach(input => {
            input.disabled = false;
        });
        container.querySelector('.wr_btns_form')?.classList.remove('no_visto');//muestro botones de acción del formulario
    }
}


function showEjemplo(lang){
    console.log('=== function showEjemplo() ===');

    if(Object.keys(obj_lang_names).includes(lang)){
        console.log('lang: ', lang);
    
        ejemplo_wr_vista_blocks.innerHTML = '...';//reset
    
        ejemplo_song_bloques.classList.add('solo_ver'); 
        
        resetBtnActive(eid_block_ejemplo_head);//reseteo btn_active de botones en el contenedor
        eid_block_ejemplo_head.querySelector(`#btn_ejemplo_${lang}`).classList.add('btn_active');
        
        ejemplo_song_bloques.querySelector('.puntos_def').style.display = 'none';//oculto '...'
        ejemplo_form_container.style.display = 'block';//mostrar formulario de canción
    
        makeInputsDisabled(ejemplo_form_container, true);//deshabilito los inputs
        ejemplo_form_container.querySelector('form').reset();//reseteo formulario 
        ejemplo_form_container.querySelector('#song_text_ejemplo').disabled = false;//solo habilito song_text

        ejemplo_form_container.querySelector('#song_text_ejemplo').value = obj_ejemplos_song[lang];
        handleFormInput(ejemplo_form_container.querySelector('#song_text_ejemplo'), eid_block_ejemplo);
    }
}


function addToLista(){
    console.log('=== function addToLista() ===');

    if(!hay_id_song('addToLista()')){
        return; // <- se detiene aquí si no hay id_song
    }

    //compruebo si ya está id_song enla lista
    let hay_en_la_lista = arr_lista.some(s => s.id_song == objSong.id_song);



    let aviso_text;
    let text_song_datos = `
        <br>
        <br>id: <b>${objSong.id_song}</b> 
        <br>número: <b>${objSong.song_number}</b> 
        <br>título: <b>${objSong.title}</b>
    `;

    if(hay_en_la_lista){
        aviso_text = `La canción ya está añadida anteriormente. `;
        //alert('ya está añadida anteriormente');
        //return;
    }else{
        const objSongSmall = {
            id_song: objSong.id_song,
            song_number: objSong.song_number,
            title: objSong.title,
            tune: objSong.tune,
        };

        arr_lista.push(objSongSmall);

        aviso_text = `La canción se ha añadido con éxito a la lista ${ (id_lista) ? '<b>ACTUAL</b>' : '<b>NUEVA</b>' } de canciones.`;
    }

    //para VER - SM
    const contenedor_lista_sm = document.createElement('div');
    contenedor_lista_sm.id = 'contenedor_lista_sm';
    contenedor_lista_sm.innerHTML = `
        <div class="parte_lista">
            <p class="p_aviso">${aviso_text}</p>
            <p class="p_aviso d-none">${text_song_datos}</p>
        </div>
        
        <!-- Canciones -->
        <div class="d_canciones_lista parte_lista"></div>

        <!-- botón Guardar nueva lista / Editar lista -->
    `;

    const btn_guardar = document.createElement('button');
    btn_guardar.id = 'btn_guardar';
    btn_guardar.className = 'btn btn_big';

    if(id_lista){
        btn_guardar.textContent = 'Editar lista';
        btn_guardar.onclick = () => {
            openModal('full','Guardar lista editada',null,'buildLista',true, 'editar');
        }
    }else{
        btn_guardar.textContent = 'Guardar nueva lista';
        btn_guardar.onclick = () => {
            openModal('full','Guardar nueva lista',null,'buildLista',true, 'nueva');
        }
    }

    //Añado el botón
    contenedor_lista_sm.append(btn_guardar);

    console.log('arr_lista: ', arr_lista);
    buildListaSoloSongs(contenedor_lista_sm.querySelector('.d_canciones_lista'), arr_lista);

    // openModal('center','Estado de la Lista',aviso_text,'showAviso');//antes    
    openModal('center', 'Estado de la Lista', contenedor_lista_sm, 'showAviso2');
}


function update_arr_lista(){
    console.log('=== function update_arr_lista() ===');
    localStorage.setItem('arr_lista', JSON.stringify(arr_lista));    
    // if(hay_sesion){
    //     guardarEnBd('fav_trans', 'arrFavTrans', arrFavTrans);
    // }
}

function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


function diaSemana(fechaStr) {
    // fechaStr viene en formato "aaaa-mm-dd"
    const fecha = new Date(fechaStr);

    // Días de la semana en castellano
    const dias = [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado"
    ];

    return dias[fecha.getDay()];
}


function convertirFecha(fechaStr, formato, separador = '/', validar_partes_fecha = true) {
    // de 'aaaa-mm-dd' a 'dd/mm/aaaa'
    //formato 'sql': '2025-12-03'
    //formato 'ver': '03/12/2025' '03.12.2025' '03-12-2025'

    const separadores = ['-', '/', '.'];

    if (!fechaStr) return fechaStr;

    // Filtrar los separadores que aparecen en la cadena
    const encontrados = separadores.filter(sep => fechaStr.includes(sep));

    // Si no hay exactamente un separador o hay varios tipos, devolver la fechaStr
    if (encontrados.length !== 1) {
        return fechaStr;
    }

    const separador_encontrado = encontrados[0];
    const partes = fechaStr.split(separador_encontrado);

    if (validar_partes_fecha && partes.length !== 3) {
        alert('no hay tres partes válidas. hago return...');
        return fechaStr; // Si no hay tres partes válidas
    }

    let [p1, p2, p3] = partes;
    if(!p3) p3 = '';//para mostrar en rojo encontrado '/08/2025' en la lista
    if(!p2) p2 = '';

    if(formato == 'sql'){
        if (p1.length === 4) {// p1 = primera_parte = '2025'
            return `${p3}-${p2}-${p1}`;//formato '2025-12-03' SIEMPRE
        }else{
            return `${p1}-${p2}-${p3}`;//formato '2025-12-03' SIEMPRE
        }        
    }
    
    if(formato == 'ver'){
        if (p1.length === 4) {// p1 = primera_parte = '2025'
            return `${p3}${separador}${p2}${separador}${p1}`;//formato '2025/12/03' o '2025-12-03' o '2025.12.03'
        }else{
            return `${p1}${separador}${p2}${separador}${p3}`;//formato '03/12/2025' o '03.12.2025' o '03-12-2025'
        }
    } 
}


async function crearSlidesForSongOfLista(e, lista_id_song) {
    console.log('=== function crearSlidesForSongOfLista() ===');

    resetBlockBuscar();//quito song anterior si hay
    resetBlockEsquema();
    resetBlockCancion();

    resetPListaActive();
    e.currentTarget.classList.add('active');

    id_song = lista_id_song;
    console.log('lista_id_song: ', lista_id_song);

    //cojo datos de la song de la lista desde BD
    objSong = await getSongTextFromBd();

    crearSlides();
    closeAll();
    closeModal(null,true);
}




function pintListaActive(e, arr, arr_words){
    console.log('=== function pintListaActive(e) === ');
    
    console.log('e.currentTarget: ', e.currentTarget);
    id_lista = e.currentTarget.dataset.id;
    console.log('asigno global --- id_lista: ', id_lista);

    resetTrSelected(tbody_lista);
    e.currentTarget.classList.add('selected');

    lista_wr_vista_song.style.gap = '5px';
    lista_wr_vista_song.innerHTML = `
        <div class="vista_song_content">...</div>
    `;//reset. ya que debe existir el 'div.vista_song_content' lo meto de nuevo.

    const vista_song_content = eid_block_lista.querySelector('.vista_song_content');
    vista_song_content.innerHTML = '';//reset

    const wr_btns_action = eid_block_lista.querySelector('.wr_btns_action');
    wr_btns_action.innerHTML = `
        <button class="btn btn_big" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver_sm');">Ver (SM)</button>
        <button class="btn btn_big" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver');">Ver</button>
        <button class="btn btn_big" onclick="openModal('full','Editar lista',null,'buildLista',true, 'editar');">Editar</button>
        <button class="btn btn_big" onclick="openModal('full','Eliminar lista',null,'buildLista',true, 'eliminar');">Eliminar</button>
    `;

    //dejo '==' en vez de '===' porque id_song viene como string "925"
    const objListaBD = arr.find(s => s.id_lista == id_lista);
    console.log('objListaBD: ', objListaBD);                

    // Normalizamos palabras
    const arr_normalized = arr_words.map(normalize);
    console.log('arr_normalized: ', arr_normalized);

    //const regex = new RegExp(`(${arr_words.join('|')})`, 'gi');//antes - busco las palabras del input
    // console.log('regex: ', regex);

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
        vista_song_content.append(d_titulo);
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
        vista_song_content.append(d_fecha);
    }

    // resetBlockLista();
    // resetLineasXinBlock(eid_block_lista);

    //Canciones
    const d_canciones_lista = document.createElement('div');
    d_canciones_lista.className = 'd_canciones_lista parte_lista';
    vista_song_content.append(d_canciones_lista);

    
    console.log('antes --- objListaBD.arr_lista: ', objListaBD.arr_lista);
    objLista = structuredClone(objListaBD);//equivale a JSON.parse(JSON.stringify(objListaBD));
    console.log('ahora --- objLista: ', objLista);

    if(objListaBD.arr_lista == '' || objListaBD.arr_lista == '[]'){
        objLista.arr_lista = [];
    }else{
        objLista.arr_lista = JSON.parse(objListaBD.arr_lista);
    }
    console.log('despues --- objLista.arr_lista: ', objLista.arr_lista);

    
    arr_lista = objLista.arr_lista;//importante. reasigno desde bd

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
        vista_song_content.append(d_notas);
    }

}



function pintListaActiveSoloDatos(objLista){
    console.log('=== function pintListaActiveSoloDatos() === ');

    //comprobar si existe tr_lista de lalista activa
    const tr_lista = tbody_lista.querySelector(`tr[data-id="${objLista.id_lista}"]`);
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
        <div class="vista_song_content">...</div>
    `;//reset. ya que debe existir el 'div.vista_song_content' lo meto de nuevo.

    const vista_song_content = eid_block_lista.querySelector('.vista_song_content');
    vista_song_content.innerHTML = '';//reset

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
        vista_song_content.append(d_titulo);
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
        vista_song_content.append(d_fecha);
    }

    // resetBlockLista();

    //Canciones
    const d_canciones_lista = document.createElement('div');
    d_canciones_lista.className = 'd_canciones_lista parte_lista';
    vista_song_content.append(d_canciones_lista);

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
        vista_song_content.append(d_notas);
    }

}




function eliminarSongDeLista(id_song){
    console.log('=== function eliminarSongDeLista() ===');
    console.log('id_song: ', id_song);
    
    if(!id_lista){
        alert('No hay id_lista. No se puede eliminar canción de la lista.');
        return;
    }
    if(!id_song){
        alert('No hay id_song. No se puede eliminar canción de la lista.');
        return;
    }

    //Eliminar del arr_lista
    arr_lista = arr_lista.filter(item => item.id_song != id_song);
    console.log('arr_lista actualizado: ', arr_lista);

    //Eliminar del objLista.arr_lista
    objLista.arr_lista = objLista.arr_lista.filter(item => item.id_song != id_song);
    console.log('objLista.arr_lista actualizado: ', objLista.arr_lista);
    
    let d_canciones_listaAll = document.querySelectorAll(`.d_canciones_lista`);
    console.log('d_canciones_listaAll: ', d_canciones_listaAll);

    //Actualizar el DOM
    d_canciones_listaAll.forEach(contenedor => {
        console.log('contenedor: ', contenedor);
        buildListaSoloSongs(contenedor, objLista.arr_lista);
    });

    //Actualizar en BD
    //guardarLista(null, true);//true -> solo actualizar lista en bd

    // wr_p_lista = document.querySelector('.d_canciones_lista .wr_p_lista');
    // console.log('wr_p_lista: ', wr_p_lista);

    // //Si la lista queda vacía
    // if(objLista.arr_lista.length == 0){
    //     const p_empty = document.createElement('p');
    //     p_empty.className = 'prim';
    //     p_empty.innerHTML = `
    //         2.No hay canciones 
    //     `;
    //     //wr_p_lista.append(p_empty);
    // }
}


















function makeItemsDraggable(id_contenedor, class_element){
    console.log('=== function makeItemsDraggable() ===');

    if(made_draggable_once){
        console.log('made_draggable_once is true. no dejo continuar.');
        return;
    }else{
        console.log('made_draggable_once is false. sigo...');
    }

    const container = document.getElementById(id_contenedor);
    if (!container) {
        console.error(`No se encontró el contenedor con ID: ${id_contenedor}`);
        return;
    }

    let draggedElement = null;
    let placeholder = null;

    let startY = 0;          // posición inicial del puntero
    let initialTop = 0;      // posición inicial del elemento arrastrado
    let startX = 0;          // posición inicial del puntero
    let initialLeft = 0;     // posición inicial del elemento arrastrado

    // Create a placeholder element
    function createPlaceholder() {
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        return placeholder;
    }

    // Handle drag start
    function startDrag(e) {
        e.preventDefault();

        draggedElement = e.target.closest('.draggable');
        if (!draggedElement) return;

                    const rect_dragged = draggedElement.getBoundingClientRect();

                    // Guardar posición inicial del puntero y del elemento
                    startY = (e.type === 'mousedown') ? e.clientY : e.touches[0].clientY;
                    initialTop = rect_dragged.top - container.getBoundingClientRect().top;        
                    startX = (e.type === 'mousedown') ? e.clientX : e.touches[0].clientX;
                    initialLeft = rect_dragged.left - container.getBoundingClientRect().left;        

        placeholder = createPlaceholder();
        container.insertBefore(placeholder, draggedElement.nextSibling);
        draggedElement.classList.add('dragging');

        // console.log('container: ', container);
        // console.log('draggedElement: ', draggedElement);

        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', moveDrag);
        document.addEventListener('touchend', endDrag);
    }

    // Handle drag move
    function moveDrag(e) {
        //console.log('=== function moveDrag(e) ===');
        
        let y;
        let currentY;//test
        let currentX;//test

        // Determinar las coordenadas iniciales
        if (e.type === 'mousemove') {
            //startX = e.clientX;
            y = e.clientY;
            x = e.clientX;
        } else if (e.type === 'touchmove') {
            //startX = e.touches[0].clientX;
            y = e.touches[0].clientY;
            x = e.touches[0].clientX;
        }
        
                currentY = y;//test
                currentX = x;//test
                // Calcular cuánto se ha movido el puntero
                let deltaY = currentY - startY;
                let deltaX = currentX - startX;

                // Aplicar movimiento relativo al elemento
                //draggedElement.style.position = "absolute";
                //draggedElement.style.width = placeholder.offsetWidth + "px"; // para que no se colapse
                draggedElement.style.top = (initialTop + deltaY) + "px";
                draggedElement.style.left = (initialLeft + deltaX) + "px";

        const elements = [...container.children].filter(el => el !== draggedElement && el !== placeholder);
        //console.log('elements: ', elements);

        const currentElement = elements.find(el => {
            const rect = el.getBoundingClientRect();
            return y > rect.top && y < rect.bottom;
        });


        if (currentElement) {
            const rect = currentElement.getBoundingClientRect();
            console.log('currentElement: ', currentElement);
            console.log('rect: ', rect);

            const mitad = rect.top + rect.height / 2;

            if (y < rect.top + rect.height / 2) {
                console.log('if --- y es menor la MITAD de rect.height. mitad: ', mitad);
                container.insertBefore(placeholder, currentElement);
            } else {
                console.log('else --- y es MAYOR de la mitad de rect.height. mitad: ', mitad);
                container.insertBefore(placeholder, currentElement.nextSibling);
            }
        }
    }

    // Handle drag end
    function endDrag() {
        if (!draggedElement) return;

        container.insertBefore(draggedElement, placeholder);
        draggedElement.classList.remove('dragging');
        draggedElement.removeAttribute('style');//test
        placeholder.remove();

        placeholder = null;
        draggedElement = null;

        //al terminar de mover el elemento, actualizo arr_lista y repinto wr_p_lista
        if(class_element == 'p_drag'){//translations
            make_arrListaFromItems(`.${class_element}`);
            console.log('arr_lista actualizado: ', arr_lista);

            buildListaSoloSongs(document.querySelector('.vista_song_content .d_canciones_lista'), arr_lista);

            // const contenedor_pintar_numeros = document.querySelector('.d_canciones_lista #contenedor_lista_drag');//no funciona
            const contenedor_pintar_numeros = document.querySelector('.d_canciones_lista #d_canciones_body_drag');
            pintarSoloNumerosDeOrden(contenedor_pintar_numeros);
        }

        document.removeEventListener('mousemove', moveDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', moveDrag);
        document.removeEventListener('touchend', endDrag);

        // if(hay_sesion){
        //     guardarEnBd('fav_trans','arrFavTrans',arrFavTrans);
        // }
    }

    // Attach event listeners for drag and drop
    container.addEventListener('mousedown', startDrag); 
    container.addEventListener('touchstart', startDrag); 
    
    //aki pongo que se ha ejecutado ya 1 vez esta función, para que con click sobre sortModule2() no se ejecute 2 vez
    made_draggable_once = true;
}


function make_arrListaFromItems(cl_item){
    //console.log('=== function make_arrFavTransFromItems(e) ===');
    
    const los_items = document.querySelectorAll(cl_item);
    let arr_new = Array.from(los_items).map(item =>{
        const itemSong = arr_lista.find(s => s.id_song == item.dataset.id_song);
        console.log('itemSong: ', itemSong);
        return itemSong;
    });
    console.log('arr_new: ', arr_new);
    
    arr_lista = quitarObjetosDuplicadosDeArray(arr_new);
    if(objLista.arr_lista){
        objLista.arr_lista = arr_new;        
    }
    //update_arr_lista();     

    return arr_new;
}

function quitarObjetosDuplicadosDeArray(arr) {
    const mapa = new Map(
        arr.map(obj => [JSON.stringify(obj), obj])
    );
    return Array.from(mapa.values());
}

function pintarSoloNumerosDeOrden(contenedor){
    console.log('=== function pintarSoloNumerosDeOrden() ===');

    contenedor.querySelectorAll('.l_n').forEach((item,i) => {
        console.log('item: ', item);
        console.log('i: ', i);

        item.textContent = i + 1;
    });

}
