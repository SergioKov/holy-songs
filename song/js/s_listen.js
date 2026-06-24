window.addEventListener('load', (e) => {
    console.log('load - window.innerWidth: ', window.innerWidth);
    ocultar_calculando();
        mySizeEdit();//en test. luego quitar!!!
    init();
});


window.addEventListener('resize',(e) => {
    console.log('resize - window.innerWidth: ', window.innerWidth);
    ajustarTexto();
    scrollToSlide(currentSlide);
    refreshSwipeLayout();//para actualizar layout de swipe táctil al cambiar tamaño de ventana
    mySizeEdit();//en test. luego quitar!!!
    aplicarSongAjustes();
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
            showOneSlideFrom(null, index_esquema = currentSlide);
            console.log(`Clic en .step, salto al slide ${currentSlide}`);
        }
    }
});



//clicks sobre steps y partes de pantalla
//document.addEventListener('click', (e) => {
carousel.addEventListener('click', async (e) => {
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
        if(esElementoVisible(menu_contenido)){
            hideMenu();
        }
        return;
    }



    // 3. Clic general: avanzar o retroceder
    const half = window.innerWidth / 2;

    if (e.clientX > half/* && currentSlide < totalSlides - 1*/) {
        //currentSlide++;
        //scrollToSlide(currentSlide);
        
        await slideGo('next');//DORABOTAT!!!

    } else if (e.clientX <= half /*&& currentSlide > 0*/) {
        //currentSlide--;
        //scrollToSlide(currentSlide);
        
        await slideGo('prev');//DORABOTAT!!!
    }
    console.log(`Clic general, cambio a slide ${currentSlide}`);
});


//al teclear texto en la busqueda de cancion
let timeoutFindSong;

eid_inpt_find.addEventListener('input', (e) => {
    console.log('=== listener --- eid_inpt_find input');

    const input_val = e.currentTarget.value.trim();
    console.log('input_val: ', input_val);

    clearTimeout(timeoutFindSong);

    if(input_val.length < 3){
        return;
    }

    timeoutFindSong = setTimeout(async () => {
        await findWordsSong();
    }, 400);
});



//al teclear texto en la busqueda de lista
let timeoutFindLista;

eid_inpt_find_lista.addEventListener('input', (e) => {
    console.log('=== listener --- eid_inpt_find_lista input');

    const input_val = e.currentTarget.value.trim();
    console.log('input_val: ', input_val);

    clearTimeout(timeoutFindLista);

    if(input_val.length < 3){
        return;
    }

    timeoutFindLista = setTimeout(async () => {
        await findWordsLista();
    }, 400);
});


function listenClickLeftRight(contenedor, funcionGo){
    console.log('=== function listenClickLeftRight(e) ===');
    console.log('contenedor: ', contenedor);
    console.log('funcionGo: ', funcionGo);

    if(!contenedor){
        console.log('No se encontró el contenedor para listenClickLeftRight con selector: ', selectorContenedor);
        return;
    }

    contenedor.addEventListener('click', (e) => {
        console.log('=== listenClickLeftRight --- event click ===');

        const rect = contenedor.getBoundingClientRect();

        // Posición X dentro del contenedor
        const x = e.clientX - rect.left;

        // Mitad del contenedor
        const half = rect.width / 2;

        if (x > half) {
            //listaSongGo('next');
            funcionGo('next');
            console.log('funcionGo NEXT');
        } else {
            //listaSongGo('prev');
            funcionGo('prev');
            console.log('funcionGo PREV');
        }

    });
}

//click en la mitad derecha o izquierda de la pantalla para avanzar o retroceder
// dragOver.addEventListener('click', (e) => {
//     console.log('=== event click ===');

//     const rect = dragOver.getBoundingClientRect();

//     // Posición X dentro del contenedor
//     const x = e.clientX - rect.left;

//     // Mitad del contenedor
//     const half = rect.width / 2;

//     if (x > half) {
//         listaSongGo('next');
//         console.log('NEXT');
//     } else {
//         listaSongGo('prev');
//         console.log('PREV');
//     }

// });


//================================================================================//
// start --- swipe táctil para avanzar/retroceder slides o subir/bajar texto en vista_fixed
//================================================================================//
const dragOver = document.querySelector('.d_drag_over');
const d_contenedor = document.querySelector('.vista_fixed .d_contenedor');

let startX = 0;
let startY = 0;
let startTime = 0;
let mouseDown = false;
let swipeHistory = [];

// ======================
// TOUCH
// ======================

dragOver.addEventListener('touchstart', (e) => {
    console.log('=== event touchstart ===');

    startGesture(
        e.touches[0].clientX,
        e.touches[0].clientY
    );

}, { passive: true });


dragOver.addEventListener('touchend', (e) => {
    console.log('=== event touchend ===');

    endGesture(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
    );

}, { passive: true });


// ======================
// MOUSE
// ======================

dragOver.addEventListener('mousedown', (e) => {
    console.log('=== event mousedown ===');

    mouseDown = true;
    dragOver.classList.add('grabbing');

    startGesture(
        e.clientX,
        e.clientY
    );

});


document.addEventListener('mouseup', (e) => {
    console.log('=== event mouseup ===');

    if (!mouseDown) return;

    mouseDown = false;
    dragOver.classList.remove('grabbing');

    endGesture(
        e.clientX,
        e.clientY
    );

});


// ======================
// FUNCIONES
// ======================

function startGesture(x, y){
    console.log('=== function startGesture() ===');

    startX = x;
    startY = y;

    startTime = Date.now();

}


function endGesture(x, y){
    console.log('=== function endGesture() ===');
    
    const diffX = x - startX;
    const diffY = y - startY;

    const elapsed = Date.now() - startTime;

    const threshold = 60;
    const maxTime = 500;

    // gesto demasiado lento
    if (elapsed > maxTime) {
        console.log('Gesto demasiado lento. elapsed: ', elapsed);
        //return;
    }

    // =========================
    // SWIPE HORIZONTAL
    // =========================

    if (Math.abs(diffX) > Math.abs(diffY) * 1.3) {
        console.log('=== SWIPE HORIZONTAL ===');

        if (diffX > threshold) {
            listaSongGo('prev');
        } else if (diffX < -threshold) {
            listaSongGo('next');
        }

        return;
    }

    // =========================
    // SWIPE VERTICAL
    // =========================

    

    if (Math.abs(diffY) > Math.abs(diffX) * 1.3) {
        console.log('=== SWIPE VERTICAL ===');
                                
                                //--------------------------------- old --------------------------------//
                                //const pageStep = d_contenedor.clientHeight * 0.9;
                                //const pageStep = d_contenedor.clientHeight * 1;

                                // altura real de línea
                                // const lineHeight = parseFloat(
                                //     getComputedStyle(d_contenedor.querySelector('p')).lineHeight
                                // );

                                // avanzar dejando visibles 2 líneas anteriores
                                //const pageStep = d_contenedor.clientHeight - (lineHeight * 2);

                                //console.log(d_contenedor.scrollHeight);
                                //console.log(d_contenedor.clientHeight);

                                //d_contenedor.scrollTop = 233;//test
                                //document.querySelector('.vista_fixed .d_contenedor').scrollTop = 550;//test
                                //return;

                                // // mover dedo hacia abajo
                                // if (diffY > threshold) {
                                //     console.log('=== SWIPE dedo hacia abajo. contenido arriba ===');
                                //     d_contenedor.scrollTop -= pageStep;
                                // }
                                
                                // // mover dedo hacia arriba
                                // else if (diffY < -threshold) {
                                //     console.log('=== SWIPE dedo hacia arriba. contenido abajo ===');
                                //     d_contenedor.scrollTop += pageStep;
                                // }
                                //--------------------------------- old --------------------------------//


                                //--------------------------------- new --------------------------------//
                                
                                
                                const fieldsets = [
                                    ...d_contenedor.querySelectorAll('fieldset.kuplet')
                                ];
                            
                                const containerTop = d_contenedor.scrollTop;
                                const containerBottom =
                                    containerTop + d_contenedor.clientHeight;
                            
                                // ====================================
                                // DEDO SUBE = AVANZAR
                                // ====================================
                            
                                if (diffY < -threshold) {
                            
                                    console.log('=== avanzar ===');
                                    let moved = false;
                                    
                                    // ====================================
                                    // 1. parcialmente visible abajo
                                    // ====================================
                                    for (const fs of fieldsets) {
                            
                                        const fsTop = fs.offsetTop;
                                        const fsBottom = fsTop + fs.offsetHeight;
                            
                                        // parcialmente visible abajo
                                        if (
                                            fsTop < containerBottom &&
                                            fsBottom > containerBottom
                                        ) {
                            
                                            // guardar posición REAL actual
                                            swipeHistory.push(d_contenedor.scrollTop);
                                            console.log('swipeHistory: ', swipeHistory);
                            
                                            // mover al siguiente bloque
                                            d_contenedor.scrollTop = fsTop - 10;//'-10' para que quede un poco visible 

                                            updatePartialFieldsets(); 
                                            moved = true;
                                            break;
                                        }
                            
                                    }
                            

                                    // ====================================
                                    // 2. siguiente bloque completo
                                    // ====================================
    
                                    if (!moved) {
    
                                        for (const fs of fieldsets) {
    
                                            const fsTop = fs.offsetTop;
    
                                            // completamente debajo
                                            if (fsTop > containerBottom) {
    
                                                swipeHistory.push(
                                                    d_contenedor.scrollTop
                                                );
    
                                                console.log(
                                                    'swipeHistory:',
                                                    swipeHistory
                                                );
    
                                                d_contenedor.scrollTop = fsTop;
    
                                                updatePartialFieldsets();
    
                                                break;
                                            }
    
                                        }
    
                                    }
                                
                                }


                                
                            
                                // ====================================
                                // DEDO BAJA = RETROCEDER
                                // ====================================
                            
                                else if (diffY > threshold) {
                            
                                    console.log('=== retroceder ===');
                                    console.log('swipeHistory: ', swipeHistory);
                            
                                    if (swipeHistory.length > 0) {
                            
                                        const prevScrollTop = swipeHistory.pop();
                                        console.log('prevScrollTop:', prevScrollTop);
                            
                                        d_contenedor.scrollTop = prevScrollTop;

                                        updatePartialFieldsets();
                                    }
                                        
                            
                                }

    
    }

}

// ====================================
// OPACITY BLOQUES PARCIALES
// ====================================

function updatePartialFieldsets(){

    const fieldsets = [...d_contenedor.querySelectorAll('fieldset.kuplet')];

    const containerRect = d_contenedor.getBoundingClientRect();

    fieldsets.forEach(fs => {

        const rect = fs.getBoundingClientRect();

        const fullyVisible =
            rect.top >= containerRect.top &&
            rect.bottom <= containerRect.bottom &&
            rect.left >= containerRect.left &&
            rect.right <= containerRect.right;

        fs.classList.toggle('partial', !fullyVisible);

    });

}



// ====================================
// PADDING INFERIOR
// permite subir el último bloque arriba
// ====================================

function old_updateBottomPadding(){

    const fieldsets = [...d_contenedor.querySelectorAll('fieldset.kuplet')];

    const last = fieldsets.at(-1);

    if (!last) return;

                        // const needed =
                        //     d_contenedor.clientHeight - last.offsetHeight;

                        // d_contenedor.style.paddingBottom =
                        //     Math.max(needed, 0) + 'px';

                        // espacio necesario para poder
    // subir el último fieldset arriba
    // const needed =
    // (last.offsetTop + last.offsetHeight)
    // - d_contenedor.clientHeight;

    // scroll máximo actual
    const currentMaxScroll =
        d_contenedor.scrollHeight - d_contenedor.clientHeight;

    // padding faltante
    const extra =
        last.offsetTop - currentMaxScroll;

    d_contenedor.style.paddingBottom =
        Math.max(extra, 0) + 'px';
}

function updateBottomPadding(){
    //alert(updateBottomPadding.name);
    console.warn('=== function updateBottomPadding() === ', updateBottomPadding.name);

    d_contenedor.querySelector('.contenedor').style.paddingBottom = d_contenedor.clientHeight + 'px';
}

//================================================================================//
// end --- swipe táctil para avanzar/retroceder slides o subir/bajar texto en vista_fixed
//================================================================================//


function resetPartialFieldsets(){
    const fieldsets = [
        ...d_contenedor.querySelectorAll('fieldset.kuplet')
    ];

    fieldsets.forEach(fs => {
        fs.classList.remove('partial');
    });
}


function resetBottomPadding(){
    d_contenedor.querySelector('.contenedor').style.paddingBottom = 0;
}


function refreshSwipeLayout(){
    if (!dragSong) return;

    updatePartialFieldsets();
    updateBottomPadding();
}


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

    if (e.key === 'Escape' || e.key === 'Esc') {
        console.log('keydown --- presionado escape');

        if (document.fullscreenElement) {
            console.log('Se pulsó Escape dentro de fullscreen (antes de salir quizá)');
            // no puedes evitar que el navegador salga, pero puedes ejecutar acciones
            //onEscapeWhileFullscreen(ev);
        } else {
            console.log('Se pulsó Escape fuera de fullscreen');
        }
    }

}

let is_fullscreen = false;

// Escuchar cambio de fullscreen (entrar / salir) en togglefullscreen()
document.addEventListener('fullscreenchange', () => {
    console.log('listener --- fullscreenchange');

    if (!document.fullscreenElement) {
        console.log('Se ha salido de pantalla completa');
        //onSalirFullscreen();
        is_fullscreen = false;
        //hago novisible 'x' en vista_fixed por que en desktop con 2 ventanas no hace falta
        document.querySelector('.vista_fixed').classList.remove('fullscreen_active');
    } else {
        console.log('Ahora en pantalla completa:', document.fullscreenElement);
        is_fullscreen = true;
        //hago visible 'x' en vista_fixed para poder cerrar el fullscreen + vista
        document.querySelector('.vista_fixed').classList.add('fullscreen_active');
    }

    //solo aki. en toggleFullscreen() !no hace falta!!!
    pintBtnFullscreen(document.querySelector('#tema_block .dbtn_fullscreen'));
    pintBtnFullscreen(document.querySelector('#block_cancion .bl_parte_l .dbtn_fullscreen'));
    pintFlechasFullscreen(document.querySelector('.vista_fixed #d_state_fullscreen'));//new (flechas diagonales)
    pintFlechasFullscreen(document.querySelector('#d_esq_state_fullscreen'));//new (flechas diagonales)
    
    refreshSwipeLayout();

    console.log('1. is_fullscreen: ', is_fullscreen);
});


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

        closeDiv(document.querySelector('#bl_actions_buscar'));

        closeDiv(document.querySelector('#bl_actions_ver_esquema'));
        closeDiv(document.querySelector('#bl_actions_crear_esquema'));
        closeDiv(document.querySelector('#bl_actions_select_slide'));

        closeDiv(document.querySelector('#bl_actions_cancion'));
        closeDiv(document.querySelector('#bl_actions_ejemplo'));
        
        closeDiv(document.querySelector('#bl_find_lista_settings'));
        closeDiv(document.querySelector('#bl_actions_lista'));
    }

    //click dentro de block de menu .vista_fixed .d_menu_over y
    //click fuera de botones de .vista_fixed .d_menu_over para cerrar d_menu_over
    if(  e.target.closest('.d_menu_over') && 
        !e.target.closest('.wr_btns_actualizar .btn') && 
        !e.target.closest('.wr_btns_next_prev .btn') && 
        !e.target.closest('.wr_btns_f_inner .btn')  
    ){
        console.log('d_menu_over clicked');
        toggleMenuOver();//aki siempre será ocultarMenuOver()                
    }


    if (!eid_edit_contenido_inner.contains(e.target)) {
        // Click fue dentro de eid_edit_contenido pero fuera de eid_edit_contenido_inner
        console.log('click fuera de edit_contenido_inner');
        if( 
            e.target.className != 'sp_close' && 
            e.target.className != 'sp_number' && 
            e.target.className != 'sp_name' && 
            e.target.id != 'li_resetEsquema'
        ){
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



// eid_song_text_ejemplo.addEventListener('input', (e) => {
//     console.log('input en eid_song_text_ejemplo...');
//     handleFormInput(e, eid_block_ejemplo);
// });



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
    const regexTitulo = make_regex_titulos(palabrasTitulos);

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
            titulo = (titulo) ? titulo.trim() : ''; 
            
            // Contenido: desde el final de la línea de título hasta el siguiente título o final
            const contenido = texto.slice(start + match[0].length, end);//sin '.trim()' ya que con trim() elimina el espacio antes del acorde

            let tituloOriginal = titulo;
            let contador = 2;// para añadir (2), (3), etc. si hay títulos repetidos

            while (obj_bloques.hasOwnProperty(titulo)) {
                titulo = `${tituloOriginal} (${contador})`;
                contador++;
            }

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

        let tituloOriginal = titulo;
        let contador = 2;// para añadir (2), (3), etc. si hay títulos repetidos

        while (obj_bloques.hasOwnProperty(titulo)) {
            titulo = `${tituloOriginal} (${contador})`;
            contador++;
        }

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
    // const vista_blocks = container_block.querySelector('.wr_vista_blocks');
    let vista_blocks;
    
    if(container_block == eid_block_cancion){//en cancion hay posibilidad mostrar en varia columnas
        console.log('es este bloque');
        //vista_blocks = container_block.querySelector('.wr_vista_blocks .contenedor');
        vista_blocks = container_block.querySelector('.vista_fixed .d_contenedor .contenedor');
    }else{//otros
        vista_blocks = container_block.querySelector('.wr_vista_blocks');
    }

    vista_blocks.innerHTML = '';//reset
    

    //Recorrer el bucle - partes de song...
    arr_esquema.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo]?.slide;
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);  
                
        vista_blocks.append(slide_clone.querySelector('fieldset'));
        //vista_blocks.querySelector('.contenedor').append(slide_clone.querySelector('fieldset'));
    });

    pintParrafosAcordes();
    pintParrafosLlaves();
    changeTipoAcorde(tipoAcorde);
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

    doMySizeByContenedor(contenedor_filtro);
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

    // buscar varias palabras a la vez separadas por espacio ej:
    // 'titulo autor' y se buscan ambas cosas aunque no estén juntas
    // Evita problemas con espacios dobles.
    let arr_filter = filter.split(/\s+/).filter(Boolean);

    // Obtén todos los elementos 'li' o 'cl_trans' o 'p_lista' de la lista, donde buscar
    let items = document.querySelectorAll(selector_items);//son los 'p' o 'tr' donde está el texto
    //console.log('items: ', items);

    let count_f_result = 0;

    // Recorre todos los elementos 'li' de la lista.
    for (let i = 0; i < items.length; i++) {
        
        let matchFound = false;
        let item = items[i];
        //console.log('an item: ', item);

        const selectorTodosSpans = arr_spans.join(',');//ej: '.sp_titulo, .sp_autor, .sp_otros'
        let spans = item.querySelectorAll(selectorTodosSpans);//elementos de DOM

        // Recorre los spans dentro del 'li'
        for (let j = 0; j < spans.length; j++) {
            // let spanText = spans[j].textContent.toLowerCase();//antes
            let span_buscado = spans[j];//siempre será elemento que existe ya que .querySelectorAll(selectorTodosSpans) me da todos los que existen
            console.log('span_buscado: ', span_buscado);

            let spanText = span_buscado.textContent.toLowerCase();
            
            // ignorar spans vacíos
            if(!spanText){
                continue;
            }
            //console.log('spanText: ', spanText); 
            
            
            // coincidencia OR (cualquiera de las palabras)
            // Si alguno de los span contiene el valor del filtro, muestra el 'li'.
            if (arr_filter.some(word => spanText.includes(word))) {
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

    const ecl_f_num = ecl_filter_result.querySelector('.f_num');
    ecl_f_num.textContent = count_f_result;

    doMySizeByContenedor(contenedor_filtro);
}


function doMySizeByContenedor(contenedor_filtro){
    if(!contenedor_filtro) return;
    switch (contenedor_filtro) {
        case eid_d_filter_results://buscar canción
            mySizeBuscar();
            break;
    
        default:
            break;
    }
}

function close_ul_action(e){
    if(e.target.className == 'li_action'){
        closeDiv(e.target.closest('.bl_set'));
    }
}

// Escucha el movimiento del deslizador de brillo de la pantalla en tiempo real
eid_deslizador.addEventListener('input', (evento) => {
    const valor = evento.target.value;

    pintBrillo(valor);
    eid_contenedorBrillo.style.opacity = valor * 0.01;
});

// 2. Este evento SE ACTIVA SOLO AL SOLTAR el deslizador
eid_deslizador.addEventListener('change', async (evento) => {
    const valor = evento.target.value;

    console.log("change brillo_pantalla: " + valor + "%");
        
    // Aquí invocamos tu función pasándole el número de 0 a 100
    aplicarBrillo(valor); 
    await guardarEnLocalAndBd('r');// 'r' - de brillo
});

function pintBrillo(valor){
    valor = Number(valor);
    
    if(valor < 10 || valor > 100){
        return;
    }
    //pinto en el deslizador (DOM)
    eid_deslizador.value = valor;

    //pinto porcentaje en el visor (DOM)
    eid_valorBrillo.textContent = valor + '%';
}

// Tu función (puedes colocarla donde quieras en tu script)
function aplicarBrillo(valor) {
    console.log("Brillo aplicado al soltar: " + valor + "%");

    valor = Number(valor);
    
    if(valor < 10 || valor > 100){
        return;
    }

    brillo_pantalla = valor;
    localStorage.setItem('brillo_pantalla', brillo_pantalla);

    const opacity_val = valor * 0.01;

    //el contenedor del deslizador
    eid_contenedorBrillo.style.opacity = opacity_val;

    //solo para eid_fondo_body en pestaña esquema/select_slide!
    //en 'pantalla.php' todo funciona ok
    //pero en el iframe no se ve imagen del fondo. por eso lo de abajo es forzar que se vea como debe
    if(pantalla_show){//muestro texto del slide
        eid_fondo_body.style = '';//oculto la imagen de fondo
    }else{//muestro el fondo del slide
        eid_fondo_body.style.opacity = opacity_val;//muesto brillo personalizado de la imagen de fondo
        eid_fondo_body.style.backgroundImage = bg_ruta;
    }
    
    //!en el slide en la pestaña esquema no hace falta aplicar brillo. se ve lo aplicado en el iframe!
}