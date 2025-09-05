window.addEventListener('load', (e) => {
    console.log('load - window.innerWidth: ', window.innerWidth);
    ocultar_calculando();
        mySizeEdit();//en test. luego quitar!!!
    init();

    // ajustarTexto();
    // pintParrafosAcordes();
    // pintTipoAcorde();
    // transponerTodosLosAcordes(currentTransposition);
    // scrollToSlide(currentSlide);
});


window.addEventListener('resize',(e) => {
    console.log('resize - window.innerWidth: ', window.innerWidth);
    ajustarTexto();
    scrollToSlide(currentSlide);
    mySizeEdit();//en test. luego quitar!!!
});


// When the user clicks anywhere outside of the eid_myModal, close it
window.onclick = (e) =>{
    //console.log('window.onclick on eid_myModal');
    if(e.target == eid_myModal || e.target == eid_myModalContent){
        closeModal(null,true);//click_fuera_o_x
    }
}


header.addEventListener('click', (e) => {
    console.log('=== header click ===');

    const condicion_no_escuchar = (
        e.target.closest('#menu_contenido') || 
        e.target.closest('#puntosMenu') ||
        e.target.closest('#barra_estado') 
    );

    if (condicion_no_escuchar) {
        console.log('Click dentro de condicion_no_escuchar. hago return...');
        return;
    }

    if (e.target.closest('#btn_menu')) {
        console.log('Click dentro de #btn_menu. hago showMenu()...');
        showMenu();
        return;
    } 



    // 1. Si el clic es en un .step (aunque esté dentro de .barra_estado)
    const stepEl = e.target.closest('.step');
    if (stepEl && stepEl.dataset.index !== undefined) {
        const indexSlide = parseInt(stepEl.dataset.index);
        if (!isNaN(indexSlide)) {
            currentSlide = indexSlide;
            scrollToSlide(currentSlide);
            console.log(`Clic en .step, salto al slide ${currentSlide}`);
        }
    }
});



//clicks sobre steps y partes de pantalla
//document.addEventListener('click', (e) => {
carousel.addEventListener('click', (e) => {
    console.log('=== carousel click ===');

    // if (e.target.closest('.public')) {
    //     console.log('Click dentro de .public. hago return...');
    //     return;
    // } 



    // if (e.target.closest('#edit_contenido')) {
    //     console.log('Click dentro de #edit_contenido. hago return...');
    //     return;
    // } 

    // if (e.target.closest('#myModal')) {
    //     console.log('Click dentro de #myModal. hago return...');
    //     if(e.target == eid_myModal || e.target == eid_myModalContent){
    //         closeModal(null,true);//click_fuera_o_x
    //         return;//no dejo que siga para lanzar scrollToSlide(currentSlide);
    //     }else{
    //         return;//no dejo que siga para lanzar scrollToSlide(currentSlide);
    //     }
    // }

    if(hayElementosModalesAbiertos()){
        console.log('hay algun elemento modal abierto. no dejo ir al slide');
        return;
    }



    // 3. Clic general: avanzar o retroceder
    const half = window.innerWidth / 2;
    if (e.clientX > half && currentSlide < totalSlides - 1) {
        currentSlide++;
        scrollToSlide(currentSlide);
        
        //slideGo('next');//DORABOTAT!!!
    } else if (e.clientX <= half && currentSlide > 0) {
        currentSlide--;
        scrollToSlide(currentSlide);
        
        //slideGo('prev');//DORABOTAT!!!
    }
    console.log(`Clic general, cambio a slide ${currentSlide}`);
});


document.addEventListener('keydown', checkKey);


async function checkKey(e) {//funciona .codigo mas limpio aunque .keyCode is deprecated
    console.log('=== function checkKey(e) ===');
    e = e || window.event;
    
    //console.log('e.key: ', e.key);
    //console.log('e.keyCode: ', e.keyCode);
    //console.log('e.code: ', e.code);
    //console.log('e.shiftKey: ', e.shiftKey);
    //console.log('e.ctrlKey: ', e.ctrlKey);

    if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        //slideGo('prev');

        if(hayElementosModalesAbiertos()){
            if(esElementoVisible(select_slide_wr_vista_btns)){
                console.log('en select_slide hago flecha left');
                slideGo('prev');
            }else{
                console.log('fuera de select_slide hago flecha left - no cambio slide');
            }
        }else{
            console.log('en carusel  hago flecha left')
            slideGo('prev');
        }
    }
    if(e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        //slideGo('next');

        if(hayElementosModalesAbiertos()){
            if(esElementoVisible(select_slide_wr_vista_btns)){
                console.log('en select_slide hago flecha right');
                slideGo('next');
            }else{
                console.log('fuera de select_slide hago flecha right - no cambio slide');
            }
        }else{
            console.log('en carusel hago flecha right')
            slideGo('next');
        }        
    }

}



//=== start - Swipe táctil ================================//
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleGesture();
});

function handleGesture() {
    console.log('=== function handleGesture() ===');
    
    const delta = touchStartX - touchEndX;
    const threshold = 50;

    if (delta > threshold && currentSlide < totalSlides - 1) {
        currentSlide++;
    } else if (delta < -threshold && currentSlide > 0) {
        currentSlide--;
    }
    scrollToSlide(currentSlide);
}
//=== end - Swipe táctil ================================//


eid_edit_contenido.addEventListener('click', (e) => {
    console.log('=== eid_edit_contenido click ===');
    console.log('e.currentTarget: ', e.currentTarget);
    console.log('e.target: ', e.target);

    //si es click fuera del block de ajustes de find_settings
    if(!e.target.closest('.bl_set') && !e.target.closest('.btn_set')) {
        //console.log('click en el elemento = e.target: ', e.target);

        //alert('1. click fuera de block bl_songbook_search');
        closeDiv(document.querySelector('#bl_find_settings'));
        closeDiv(document.querySelector('#bl_songbook_search'));
    }

    if (!eid_edit_contenido_inner.contains(e.target)) {
        // Click fue dentro de eid_edit_contenido pero fuera de eid_edit_contenido_inner
        console.log('click fuera de edit_contenido_inner');
        if(e.target.className != 'sp_close' && e.target.id != 'btn_resetEsquema'){
            hideEdit(); // o cualquier lógica de cierre
        }else{
            //no hago nada
        }
    } else {
        // Click dentro de eid_edit_contenido_inner: no hacer nada
        console.log('click dentro de edit_contenido_inner');
    }
});


eid_puntosMenu.addEventListener('click', (e) => {
    console.log('=== eid_puntosMenu click ===');
    console.log('e.currentTarget: ', e.currentTarget);
    console.log('e.target: ', e.target);

    const puntosMenu_ul = eid_puntosMenu.querySelector('ul');

    if (!puntosMenu_ul.contains(e.target)) {
        // Click fue dentro de puntosMenu_ul pero fuera de eid_edit_contenido_inner
        console.log('click fuera de puntosMenu_ul');
        closePuntosMenu();
    } else {
        // Click dentro de eid_edit_contenido_inner: no hacer nada
        console.log('click dentro de puntosMenu_ul');
    }
});


//uso listeners ya que se añaden una vez al cargar la web
eid_song_text.addEventListener('input', (e) => {
    handleFormInput(e, eid_block_cancion);
});

eid_song_text_ejemplo.addEventListener('input', (e) => {
    handleFormInput(e, eid_block_ejemplo);
});


//puedo usar 'oninput' para no duplicar los escuchadores, pero aki no se duplican
//ya que se añade una vez al cargar la web
// eid_song_text.oninput = (e) => {
//     handleFormInput(e, eid_block_cancion);
// };

// eid_song_text_ejemplo.oninput = (e) => {
//     handleFormInput(e, eid_block_ejemplo);
// };



function handleFormInput(e, container_block){
    //e: 'PointerEvent' o 'html_element'
    //container_block: 'eid_block_cancion' o 'eid_block_ejemplo'
    console.log('=== eid_song_text input ===');

    let texto;

    if(e instanceof Event) {
        console.log("Recibí un evento:", e.type);
        const target = e.target;
        texto = target.value;
        console.log('target.value: ', target.value);
        // Aquí puedes usar target.value, etc.
    }
    else if(e instanceof HTMLElement) {
        console.log("Recibí un elemento HTML:", e.tagName);
        texto = e.value;
        console.log('(elemento HTML) e.value: ', e.value)
        // Puedes usar param directamente
    }
    else{
        console.log("Parámetro desconocido. e: ", e);
    }
    //return;

    //console.log('e.target.value: ', e.target.value);
    console.log('texto:', texto);

    let song_titulo = 'testing';
    console.log('song_titulo: ', song_titulo);

    const palabrasTitulos = arr_titulos.join('|');//arr_titulos en config

    // regex que captura en grupo (1) palabra entre [] (cualquier palabra)
    // o en grupo (2) palabra del arr_titulos al inicio de línea
    const regexTitulo = new RegExp(
        '^\\s*' +                                                   // ^ → inicio de línea, seguido de posibles espacios en blanco
        '(?:' +                                                     // (?: ...) → grupo sin captura (elegir una de las dos opciones)
            '\\[\\s*(.*?)\\s*\\]' +                                 // opción 1: texto entre corchetes. ej.: [Verso 1]
            '|' +                                                   // o bien
            '((?:\\d+\\s*)?(?:' + palabrasTitulos + ')[^\\n]*)' +   // opción 2: opcional número + palabra del array hasta el fin de la línea
        ')',                                                        // fin de grupo sin captura. luego va coma ','
        'gim'                                                       // g -> global (se usa con matchAll), i → case-insensitive, m → multiline
    );

    obj_bloques = {};//reset - elementos html de slides: kuplet, pripev bridge sin repetirse


    // Obtenemos todas las coincidencias de títulos
    const matches = Array.from(texto.matchAll(regexTitulo));
    console.log('matches: ', matches);


    //si hay coincidencia con palabras separadores: pripev, kuplet, etc...
    if(matches.length > 0){//hay separador de texto como: pripev, kuplet, etc..
        
        //Recorrer las coincidencias...
        matches.forEach((match, i, arr) => {
            console.log('match: ', match);

            const start = match.index;
            const end = (i + 1 < matches.length) ? matches[i + 1].index : texto.length;

            // match[1]: si era algo dentro de []
            // match[2]: si era palabra del array sin []
            let titulo = match[1] || match[2];
            titulo = titulo ? titulo.trim() : ''; 
            
            // Contenido: desde el final de la línea de título hasta el siguiente título o final
            const contenido = texto.slice(start + match[0].length, end);//sin '.trim()' ya que con trim() elimina el espacio antes del acorde

            console.log(' ');
            console.log('=== BLOQUE ===');
            console.log('titulo:', titulo);
            console.log('contenido:', contenido);

            let arr_lineas = contenido.split(/\r\n|\r|\n/);
            arr_lineas = arr_lineas.filter(el => el !== '');//elimino strings vacias

            const step = document.createElement('div');
            step.className = 'step';
            step.dataset.index = i;
            step.textContent = titulo;

            let div_titulo_cancion = '';
            // if(i == 0){
            //     div_titulo_cancion = `
            //         <div class="song_titulo">
            //             <span>${song_titulo}</span>
            //         </div>
            //     `;
            // }

            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `
                <div class="slide_inner">
                ${div_titulo_cancion}
                    <fieldset class="kuplet">
                        <legend>${titulo}</legend>
                        <!-- aki los p -->
                    </fieldset>
                </div>
            `;            

            if(arr_lineas.length > 0){
                arr_lineas.forEach((linea, i) => {
                    console.log('linea:', linea);
                    const p = document.createElement('p');

                    //con switch es mas limpio...
                    switch (true) {
                        case contieneSoloAcordes(linea):
                            p.className = 'c';// 'c' => 'chord'
                            break;

                        case contieneSoloPuntos(linea):
                            p.className = 'b';// 'b' => 'bola' o punto medio '·' o punto normal '.'
                            break;

                        case contieneSoloNota(linea):
                            p.className = 'n';// 'n' => 'nota' ej.: '     (modulación +2)    '
                            break;

                        default:
                            p.className = 't';// 't' => 'text'
                            break;
                    }

                    p.textContent = linea;
                    slide.querySelector('fieldset').append(p);
                });

                //relleno objeto con html elementos
                obj_bloques[titulo] = {
                    step,
                    slide
                };

                console.log(`obj_bloques[${titulo}].step.innerHTML: `, obj_bloques[titulo].step.innerHTML);
                console.log(`obj_bloques[${titulo}].slide.innerHTML: `, obj_bloques[titulo].slide.innerHTML);
                console.log(`obj_bloques[${titulo}]: `, obj_bloques[titulo]);
            }
        });

    }else{
        
        //no hay ningun separador de texto como: pripev, cuplet, etc..
        //devuelvo el texto tal cual

        const titulo = '---';
        const contenido = texto;

        const step = document.createElement('div');
        step.className = 'step';
        step.dataset.index = 0;
        step.textContent = titulo;

        const div_titulo_cancion = `
            <div class="song_titulo">
                <span>${song_titulo}</span>
            </div>
        `;

        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `
            <div class="slide_inner">
            ${div_titulo_cancion}
                <fieldset class="kuplet">
                    <legend>${titulo}</legend>
                    <!-- aki los p -->
                </fieldset>
            </div>
        `;

        let arr_lineas = contenido.split(/\r\n|\r|\n/);
        arr_lineas = arr_lineas.filter(el => el !== '');//elimino strings vacias

        if(arr_lineas.length > 0){
            arr_lineas.forEach((linea, i) => {
                console.log('linea:', linea);
                const p = document.createElement('p');

                //con switch es mas limpio...
                switch (true) {
                    case contieneSoloAcordes(linea):
                        p.className = 'c';// 'c' => 'chord'
                        break;

                    case contieneSoloPuntos(linea):
                        p.className = 'b';// 'b' => 'bola' o punto medio '·' o punto normal '.'
                        break;

                    case contieneSoloNota(linea):
                        p.className = 'n';// 'n' => 'nota' ej.: '     (modulación +2)    '
                        break;

                    default:
                        p.className = 't';// 't' => 'text'
                        break;
                }

                p.textContent = linea;
                slide.querySelector('fieldset').append(p);
            });

            //relleno objeto con html elementos
            obj_bloques[titulo] = {
                step,
                slide
            };

            console.log(`obj_bloques[${titulo}].step.innerHTML: `, obj_bloques[titulo].step.innerHTML);
            console.log(`obj_bloques[${titulo}].slide.innerHTML: `, obj_bloques[titulo].slide.innerHTML);
            console.log(`obj_bloques[${titulo}]: `, obj_bloques[titulo]);
        }

    }

    console.log('al final. obj_bloques: ', obj_bloques);


    let arr_esquema = Object.keys(obj_bloques);

    //const vista_blocks = eid_block_cancion.querySelector('.wr_vista_blocks');//antes
    const vista_blocks = container_block.querySelector('.wr_vista_blocks');
    vista_blocks.innerHTML = '';//reset


    //Recorrer el bucle - partes de song...
    arr_esquema.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo].slide;
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);  
                
        vista_blocks.append(slide_clone.querySelector('fieldset'));
    });
}







function addFilterListener(contenedor_filtro, sp_icon_filtro, el_input, selector_items, arr_spans){
    console.log('=== function addFilterListener ===');

    // console.log('contenedor_filtro: ', contenedor_filtro);
    // console.log('el_input: ', el_input);
    // console.log('selector_items: ', selector_items);
    // console.log('arr_spans: ', arr_spans);

    //Filtrar resultados de búsqueda
    el_input.onkeyup = (e) => {        
        console.log('el_input.onkeyup --- 2. e.currentTarget', e.currentTarget);
        // console.log('2. e.target', e.target);            
        filtrarLista(contenedor_filtro, sp_icon_filtro, el_input, selector_items, arr_spans);
    }
    contenedor_filtro.onclick = (e) => {
        if(e.target.className == 'clear_inpt'){
            clear_inpt('filter');
            clear_filter_result(contenedor_filtro, sp_icon_filtro, selector_items);
        }
    }
}


function clear_filter_result(contenedor_filtro, sp_icon_filtro, selector_items){
    console.log(' === function onclick_sp_x(e) ===');

    console.log('12. contenedor_filtro', contenedor_filtro);
    console.log('12. selector_items', selector_items);

    sp_icon_filtro.classList.remove('active');//opacity: 0.5; no hay filtro aplicado -> se ve gris

    const el_input = contenedor_filtro.querySelector('input');
    el_input.value = '';//reset campo de input

    const ecl_filter_result = contenedor_filtro.querySelector('.filter_result');
    ecl_filter_result.style.display = 'none'; 

    const ecl_f_num = ecl_filter_result.querySelector('.f_num');
    ecl_f_num.textContent = '...';//reset

    document.querySelectorAll(selector_items).forEach(item => {
        if(item.classList.contains('hidden')){
            item.classList.remove('hidden');
        }
    });

    switch (contenedor_filtro) {
        case eid_d_filter_results://buscar canción
            //mySizeBuscar();
            break;
    
        default:
            break;
    }

}


// filtrar datos en listas de TR.tr_song
function filtrarLista(contenedor_filtro, sp_icon_filtro, el_input, selector_items, arr_spans) {
    console.log('=== function filtrarLista() ===');    
    
    // console.log('contenedor_filtro: ', contenedor_filtro);
    // console.log('el_input: ', el_input);
    // console.log('selector_items: ', selector_items);
    // console.log('arr_spans: ', arr_spans);

    // Obtén el valor del input y conviértelo a minúsculas.
    let filter = el_input.value.toLowerCase().trim();
    console.log('filter: ', filter);


    // Obtén todos los elementos 'li' o 'cl_trans' de la lista, donde buscar
    let items = document.querySelectorAll(selector_items);//son los 'p' o 'tr' donde está el texto
    //console.log('items: ', items);

    let count_f_result = 0;

    // Recorre todos los elementos 'li' de la lista.
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        //console.log('an item: ', item);

        let matchFound = false;

        // Recorre los spans dentro del 'li'
        for (let j = 0; j < arr_spans.length; j++) {
            // let spanText = spans[j].textContent.toLowerCase();//antes
            let span_buscado = item.querySelector(arr_spans[j]);
            if(span_buscado == null){
                continue;
            }
            //console.log(span_buscado);

            let spanText = span_buscado.textContent.toLowerCase();
            //console.log('spanText: ', spanText);                        

            // Si alguno de los span contiene el valor del filtro, muestra el 'li'.
            if (spanText.includes(filter)) {
                matchFound = true;
                //console.log(`[IF] - OK - el texto '${filter}' se ha encontrado en el span_buscado: `, span_buscado);
                break; // Si se encuentra una coincidencia, no es necesario revisar más spans.
            }else{
                //console.log(`[ELSE] --- el texto '${filter}' NO se ha encontrado en el span_buscado: `, span_buscado);
            }
        }

        // Si se encontró una coincidencia, muestra el 'li', de lo contrario, ocúltalo.
        if (matchFound) {
            count_f_result++;
            item.classList.remove("hidden");
        } else {
            item.classList.add("hidden");
        }
    }//end for

    const ecl_filter_result = contenedor_filtro.querySelector('.filter_result');
    
    if(filter == ''){
        ecl_filter_result.style.display = 'none';
        sp_icon_filtro.classList.remove('active');//opacity: 0.5; no hay filtro aplicado -> se ve gris
    }else{
        ecl_filter_result.style.display = 'block';
        sp_icon_filtro.classList.add('active');//opacity: 1; //hay filtro aplicado -> se ve blanco
    }

    switch (contenedor_filtro) {
        case eid_d_filter_results://buscar canción
            //mySizeBuscar();
            break;
    
        default:
            break;
    }

    const ecl_f_num = ecl_filter_result.querySelector('.f_num');
    ecl_f_num.textContent = count_f_result;
}
