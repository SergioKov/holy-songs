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




    // 3. Clic general: avanzar o retroceder
    const half = window.innerWidth / 2;
    if (e.clientX > half && currentSlide < totalSlides - 1) {
        currentSlide++;
    } else if (e.clientX <= half && currentSlide > 0) {
        currentSlide--;
    }
    scrollToSlide(currentSlide);
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
        slideGo('prev');
    }
    if(e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        slideGo('next');
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

    //arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    //console.log('hendleFormInput() --- arr_esquema_bucle: ', arr_esquema_bucle);

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
