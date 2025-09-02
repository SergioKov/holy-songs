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
        <button class="btn btn_big" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</button>
        <button class="btn btn_big" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</button>
        <button class="btn btn_big" onclick="showBlockName('cancion'); editar_song('ver');">Ver canción</button>
        <button class="btn btn_big" onclick="showBlockName('cancion'); editar_song('editar');">Editar canción</button>
        <button class="btn btn_big" onclick="showBlockName('cancion'); eliminar_song();">Eliminar canción</button>
        <button class="btn btn_big" onclick="crearSlides()">Crear slides</button>
        <button class="btn btn_big" onclick="crearSlides(); closeAll()">Crear slides + Ver</button>
        <button class="btn btn_big" onclick="addToLista();">Añadir a la Lista</button>
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

    let btn_actual;

    //si ya existe el btn_actual...
    if(select_slide_wr_btns_action.querySelector('#btn_crearSlidesActual')){
        btn_actual = select_slide_wr_btns_action.querySelector('#btn_crearSlidesActual');
    }else{
        // creo boton actual
        btn_actual = document.createElement('button');
        btn_actual.id = 'btn_crearSlidesActual';
        btn_actual.className = 'btn btn_big';
    }

    if(slideContainer.dataset.id_song == id_song){
        // ya están creados los slides en el contenedor. me muevo al slide actual
        btn_actual.textContent = 'Mostrar slide (Actual)';
        btn_actual.onclick = () => {
            closeAll();//cierro todas las ventanas modales
            scrollToSlide(currentSlide);
        }
    }else{
        // no están creados los slides en el contenedor. los creo
        btn_actual.textContent = 'Crear slides (Ver Actual)';
        btn_actual.onclick = () => {
            crearSlides(currentSlide);
            closeAll();//cierro todas las ventanas modales
        }
    } 

    select_slide_wr_btns_action.prepend(btn_actual);

    make_arr_pantalla(currentSlide/*, el_fieldset_cloned, arr_esquema_bucle*/);
}






function make_arr_pantalla(currentSlide/*, el_fieldset_cloned, arr_esquema_bucle*/){
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