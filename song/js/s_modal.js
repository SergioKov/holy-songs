function openModal(param = null, headerTitle = null, htmlTrans = null, action = null, modalFadeIn = true, args = null){
    console.log('=== function openModal() ===');
    console.log(`param: ${param} --- headerTitle: ${headerTitle}`); 
    console.log(`args:`, args); 
    
    //Reset
    eid_myModalContent.removeAttribute('class');
    eid_myModalContent.classList.add('modal-content');
    eid_modcont_body.removeAttribute('class');//reset    

    if(modalFadeIn){
        eid_myModal.style.display = "block";
        eid_myModal.style.opacity = 0;//start efecto fade
        setTimeout(()=>{
            eid_myModal.style.opacity = 1;//end efecto fade
        },10);
    }else{
        eid_myModal.style.display = "block";
        eid_myModal.style.opacity = 1;//start efecto fade
    }
 
    Array.from(document.querySelectorAll('.body_bls')).forEach((el,i)=>{
        el.style.display = 'none';
    });

    eid_bl_modalCenterInner.innerHTML = '';
    eid_bl_modalBottomInner.innerHTML = '';
    eid_bl_modalFullInner.innerHTML = '';
    //reset_spFiltro();

    mySizeModal();//IMPORTANTE!!! ajusta el modal al tamaño de la pantalla
    


    //Tipos de ModalContent
    switch (param) {

        //Меню
        case 'top':
            eid_modcont_body.style.overflow = 'auto';//habilita scroll  
            eid_modcont_body.classList.add('theme_grey');   
            //eid_h4_text.innerHTML = headerTitle;//'Меню';
            //eid_btn_sp_atras.style.display = 'none'; //mo muestro flecha atras
            eid_myModal.style.paddingTop = '0px';
            eid_myModalContent.classList.add('modalContentTop');
            eid_bl_modalTop.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentTop .wr_modcont').classList.add('mooved');
            },10);

            let eid_topLogin = document.getElementById('topLogin');
            let eid_topMenu = document.getElementById('topMenu');

            switch (action) {
            
                case 'showLogin':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');  
                    eid_h4_text.innerHTML = headerTitle;//'Меню'; 
                    //console.log('aki llamar showLogin()');

                    // eid_topLogin.style.display = 'block';
                    // eid_topMenu.style.display = 'none';

                    //listenLoginFormInput();

                    buildForm();
                    //showLogin(htmlTrans, param);
                    break;

                case 'showMenu':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');  
                    eid_h4_text.innerHTML = headerTitle;//'Меню'; 

                    buildMenu();                   
            
            
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //pendiente de desarrollo
        case 'center':
            eid_h4_text.innerHTML = headerTitle;//'verse Меню';
            //eid_btn_sp_atras.style.display = 'none';//?
            eid_myModal.style.paddingTop = '25vh';
            eid_myModalContent.classList.add('modalContentCenter');
            eid_bl_modalCenter.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentCenter .wr_modcont').classList.add('mooved');
            },10);
            

            switch (action) {
            
                case 'showAviso':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso()');
                    //alert('aki showAviso()');
                    showAviso(htmlTrans, param);//es arr_p_id en este caso
                    break;
                                
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //pendiente de desarrollo
        case 'bottom':
            eid_h4_text.innerHTML = headerTitle;//'verse Меню';
            //eid_btn_sp_atras.style.display = 'none';//?
            eid_myModal.style.paddingTop = '50vh';
            eid_myModalContent.classList.add('modalContentBottom');
            eid_bl_modalBottom.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentBottom .wr_modcont').classList.add('mooved');
            },10);

            switch (action) {
                        
                case 'showAviso':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso()');
                    //alert('aki showAviso()');
                    showAviso(htmlTrans, param);//es arr_p_id en este caso
                    break;
                
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //Выбор модуля Библии из Избранных
        case 'full':
            //eid_btn_sp_atras.style.display = 'block';
            eid_myModal.style.paddingTop = '0vh';
            eid_myModalContent.classList.add('modalContentFull');
            eid_bl_modalFull.style.display = 'block';
            
            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentFull .wr_modcont').classList.add('mooved');
            },10);
            
            switch (action) {
            
                case 'showSong':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar showSong()');
                    //alert('hasta aki...');
                    buildTest();
                    //showSong();
                    break;
            
                case 'buildEsquema':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildEsquema()');
                    //alert('hasta aki...');
                    buildEsquema();
                    break;

                case 'buildLista':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildLista()');
                    // alert('hasta aki...');
                    let lista_action = args;
                    console.log('lista_action:', lista_action);

                    buildLista(lista_action);
                    break;
            
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;


        default:
            //console.log('---case default: nada---');
            break;
    }
}



// When the user clicks on <span> (x), close the eid_myModal
function closeModal(modal_head_text = null, click_fuera_o_x = false) {    
    let actual_h4_text = eid_myModal.querySelector('#h4_text').textContent;
    console.log('actual_h4_text: ',actual_h4_text);
    
    const ecl_mooved = document.querySelector('.mooved');

    if(ecl_mooved){
        let classList_new = Array.from(ecl_mooved.classList).filter(el => el != 'mooved');
        ecl_mooved.className = classList_new.join(' ');
    }

    if(modal_head_text == actual_h4_text || click_fuera_o_x){
        //console.log(`[if]. el titulo es igual. ${modal_head_text} == ${actual_h4_text}. o click_fuera_o_x -> Cierro modal.`);

        eid_myModal.style.opacity = 0;//start efecto fade
        setTimeout(()=>{
            eid_myModal.style.display = "none";
        },400);

    }else{
        //console.log(`[else] --- NO. el titulo no es igual. ${modal_head_text} != ${actual_h4_text}`);
        //no hago nada
    }

}

function mySizeModal(){
    console.log('=== function mySizeModal() ===');
    
    let modcont_body_max_h = 
      window.innerHeight 
    - eid_modcont_header.offsetHeight 
    //- (10 * 2)//10 es margin top y bottom de class '.inner'
    ;
    console.log('modcont_body_max_h: ', modcont_body_max_h);    
    eid_modcont_body.style.maxHeight = modcont_body_max_h + 'px';//comento para no duplicat
}



function buildTest(){
    console.log('=== function buildTest() ===');

    eid_bl_modalFullInner.innerHTML = '';//reset

    const ejemplo_html = `
    
        <div class="wr_show">
            <div class="show_song_head">
                <button class="btn">Nueva canción</button>
                <button class="btn">Editar canción</button>
                <button class="btn">Eliminar canción</button>
                <button class="btn">Crear esquema</button>
            </div>
        </div>      
    `;

    const p = document.createElement('p');
    p.className = '';
    p.innerHTML = songText;

    const d_ejemplo = document.createElement('div');
    d_ejemplo.innerHTML = ejemplo_html;

    //eid_bl_modalFullInner.append(p);
    eid_bl_modalFullInner.append(d_ejemplo);
}


function buildEsquema(){
    console.log('=== function buildEsquema() ===');

    eid_bl_modalFullInner.innerHTML = '';//reset

    const ejemplo_html = `
    
        <div class="wr_show">
            <div class="show_song_head">
                zxcvzxc
            </div>
            <div class="show_song_body">
                <p>algo...</p>                
            </div>
        </div>      
    `;

    const p = document.createElement('p');
    p.className = '';
    p.innerHTML = songText;

    const d_ejemplo = document.createElement('div');
    d_ejemplo.innerHTML = ejemplo_html;

    //eid_bl_modalFullInner.append(p);
    eid_bl_modalFullInner.append(d_ejemplo);
}


function buildLista(lista_action = null){
    console.log('=== function buildLista() ===');
    console.log('lista_action: ', lista_action);
    console.log('objLista: ', objLista);

    eid_bl_modalFullInner.innerHTML = '';//reset

    let id_lista_val = '';
    let title_val = '';
    let diaSemana_val = '';
    let fecha_val = '';
    let notes_val = '';
    let mensaje_html = '';
    let arr_lista_bucle = [];
    let contenedor;//general. se asigna luego
    

    //Nueva lista
    if(lista_action == 'nueva'){
        mensaje_html = `
            <span>Rellena los campos del formulario con los datos de la lista <b class="c_blue">NUEVA</b>.</span>
        `;
        arr_lista_bucle = arr_lista;
        console.log('(nueva) --- arr_lista_bucle: ', arr_lista_bucle);
        id_lista = null;
    }
    

    //Ver lista
    if(lista_action == 'ver'){
        id_lista_val = objLista.id_lista;
        title_val = objLista.title;
        diaSemana_val = diaSemana(objLista.fecha);
        fecha_val = invertirFecha(objLista.fecha);
        notes_val = objLista.notes;

        arr_lista_bucle = objLista.arr_lista;
        console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
    }


    //Editar lista
    if(lista_action == 'editar'){
        mensaje_html = `
            <span>Rellena los campos del formulario con los datos de la lista <b class="c_green">EDITADA</b>.</span>
        `;
        id_lista_val = objLista.id_lista;
        title_val = objLista.title;
        fecha_val = objLista.fecha;
        notes_val = objLista.notes;

        arr_lista_bucle = objLista.arr_lista;
        console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
    }
    
    


    //para VER sm
    const contenedor_lista_sm = document.createElement('div');
    contenedor_lista_sm.id = 'contenedor_lista_sm';
    contenedor_lista_sm.innerHTML = `                    
        <div class="parte_lista">
            <p class="p_sm">Titulo: ${title_val} (id: ${id_lista_val})</p>
            <p class="p_sm">Fecha: ${diaSemana_val} ${fecha_val}</p>
        </div>
        
        <!-- Canciones -->
        <div id="d_canciones_lista"></div>   
        
        <p class="p_sm">Notas: ${notes_val}</p>
    `;

    //para Ver y Editar
    const wr_id_lista = document.createElement('div');
    wr_id_lista.className = 'form_group wr_id_lista';
    wr_id_lista.innerHTML = `
        <input type="number" id="id_lista" name="id_lista" required="" placeholder=" " disabled value="${id_lista_val}">
        <label for="id_lista">Id</label>
    `;    

    //FORMULARIO
    const form_lista = document.createElement('div');
    form_lista.id = 'form_lista';
    form_lista.innerHTML = `
        <div class="form_container">
            <form>
                
                <p class="mensaje" data-dic="">
                    ${mensaje_html}
                </p>

                <div class="wr_group">

                    <div class="form_group wr_title">
                        <input type="text" id="title" name="title" required="" placeholder=" " value="${title_val}">
                        <label for="title">Título de la lista</label>
                    </div>

                    ${(lista_action == 'editar') ? wr_id_lista.outerHTML : ''}

                </div>

                <div class="form_group wr_fecha">
                    <input type="date" id="fecha" name="fecha" required="" placeholder=" " value="${fecha_val}">
                    <label for="title">Fecha del evento</label>
                </div>


                <!-- Canciones -->
                <div id="d_canciones_lista"></div>

                <div class="form_group">
                    <textarea id="notes" name="notes" rows="3" required="" placeholder=" ">${notes_val}</textarea>
                    <label class="lab_textarea" for="notes">Notas (apuntes personales)</label>
                </div>


                <div class="wr_btns_form">
                    <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
                    <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarLista(event)">Guardar</button>
                </div>

            </form>
        </div>     
    `;

    if(lista_action == 'ver'){ 
        contenedor = contenedor_lista_sm;
    }else{
        contenedor = form_lista;
    }


    const wr_p_lista = document.createElement('div');
    wr_p_lista.className = 'wr_p_lista';
    
    if(Array.isArray(arr_lista_bucle) && arr_lista_bucle.length > 0){
        const wr_p_lista = document.createElement('div');
        wr_p_lista.className = 'wr_p_lista';
        
        const d_canciones_head = document.createElement('div');
        d_canciones_head.className = 'canciones_head';
        d_canciones_head.textContent = 'Canciones:';
        wr_p_lista.append(d_canciones_head);

        //Recorrer array
        arr_lista_bucle.forEach((item, i) => {
            console.log('item: ', item);

            const p = document.createElement('p');
            p.className = 'p_lista';
            p.dataset.id_song = item.id_song;
            p.innerHTML = `
                <span class="l_n">${i + 1}.</span>
                <span class="l_title">${item.title}</span>
                <span class="l_tune">${item.tune || '--'}</span>
            `;
            p.onclick = (e) => {
                console.log(e.currentTarget.dataset.id_song);
                let lista_id_song = e.currentTarget.dataset.id_song;

                crearSlidesForSongOfLista(e, lista_id_song);

            }

            wr_p_lista.append(p);
        });

        contenedor.querySelector('#d_canciones_lista').append(wr_p_lista);        

    }else{//lista vacía
            
        const p = document.createElement('p');
        p.className = 'prim';
        p.innerHTML = `
                No hay canciónes 
        `;                       

        wr_p_lista.append(p);
        contenedor.querySelector('#d_canciones_lista').append(wr_p_lista);
    }

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}









async function getSongTextFromBd(){
    console.log('=== function getSongTextFromBd() ===');

    try {
        
        if(!hay_id_song('getSongTextFromBd()')){
            return; // <- se detiene aquí si no hay id_song
        } 
               
        const response = await fetch('obtener_song_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_song: id_song
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');

            let song_title = data.title; 
            let song_text = data.song_text; 
            data.arr_esquema = (data.arr_esquema != '') ? JSON.parse(data.arr_esquema) : data.arr_esquema ; 

            console.log(`id_song: [${id_song}] --- song_title: [${song_title}] --- song_text: [${song_text}] --- data.arr_esquema: `, data.arr_esquema);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getSongById(): error.message: ', error.message);
    }
}





async function getSongTextFromBdByFind(objFindParams){
    console.log('=== function getSongTextFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindParams;

    try {
        
        if(!words_input){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }
               
        const response = await fetch('obtener_song_by_find.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                words_input,
                modo,
                buscar_en
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');

            let arr_data = data.arr_data; 

            console.log(`arr_data: `, arr_data);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getSongTextFromBdByFind(): error.message: ', error.message);
    }
}


async function getListaTextFromBdByFind(objFindListaParams){
    console.log('=== function getListaTextFromBdByFind(objFindListaParams) ===');

    let {words_input, modo, buscar_en} = objFindListaParams;

    try {
        
        if(!words_input){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }
               
        const response = await fetch('obtener_lista_by_find.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                words_input,
                modo,
                buscar_en
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');

            let arr_data = data.arr_data; 

            console.log(`arr_data: `, arr_data);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getListaTextFromBdByFind(): error.message: ', error.message);
    }
}


async function insertarSongDatos(objSong) {
    console.log('=== function insertarSongDatos(objSong) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objSong || Object.keys(objSong).length == 0){
            alert('No hay todos los parametros necesarios de la cancion...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objSong: ',objSong);

        const response = await fetch('insertar_song_datos.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(objSong)
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        console.log('data: ',data); 
        
        return data;

    } catch (error) {
        console.error('Error en la función insertarSongDatos: ', error);
    }
}


async function deleteSongFromBd(){
    console.log('=== function deleteSongFromBd() ===');

    try {
        
        if(!hay_id_song('deleteSongFromBd()')){
            return; // <- se detiene aquí si no hay id_song
        } 
               
        const response = await fetch('eliminar_song_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_song: id_song
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');

            let song_title = data.title; 
            let song_text = data.song_text; 
            data.arr_esquema = (data.arr_esquema != '') ? JSON.parse(data.arr_esquema) : data.arr_esquema ; 

            console.log(`[ELIMINADA] id_song: [${id_song}] --- song_title: [${song_title}] --- song_text: [${song_text}] --- data.arr_esquema: `, data.arr_esquema);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en deleteSongFromBd(): error.message: ', error.message);
    }
}




async function insertarListaDatos(objLista) {
    console.log('=== function insertarListaDatos(objLista) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objLista || Object.keys(objLista).length == 0){
            alert('No hay todos los parametros necesarios de la lista...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objLista: ',objLista);

        const objLista_str = JSON.stringify(objLista);
        console.log('objLista_str: ',objLista_str);

        const response = await fetch('insertar_lista_datos.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objLista_str
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        console.log('data: ',data); 
        
        return data;

    } catch (error) {
        console.error('Error en la función insertarSongDatos: ', error);
    }
}


async function deleteSongFromBd(){
    console.log('=== function deleteSongFromBd() ===');

    try {
        
        if(!hay_id_song('deleteSongFromBd()')){
            return; // <- se detiene aquí si no hay id_song
        } 
               
        const response = await fetch('eliminar_song_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_song: id_song
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');

            let song_title = data.title; 
            let song_text = data.song_text; 
            data.arr_esquema = (data.arr_esquema != '') ? JSON.parse(data.arr_esquema) : data.arr_esquema ; 

            console.log(`[ELIMINADA] id_song: [${id_song}] --- song_title: [${song_title}] --- song_text: [${song_text}] --- data.arr_esquema: `, data.arr_esquema);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en deleteSongFromBd(): error.message: ', error.message);
    }
}



function showAviso(htmlTrans, positionModal){
    console.log('=== showAviso(htmlTrans, param) ===');

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.innerHTML = '';
    }else if(positionModal == 'bottom'){
        eid_bl_modalBottomInner.innerHTML = '';
    }
    
    const p = document.createElement('p');
    p.className = 'p_aviso';
    p.innerHTML = htmlTrans;

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.append(p);    
    }else if(positionModal == 'bottom'){
        eid_bl_modalBottomInner.append(p);
    }

}