//=================================================================//
// start - F U N C T I O N S  
//=================================================================//

async function init() {
    ajustarTexto();
    pintParrafosAcordes();
    pintTipoAcorde();
    transponerTodosLosAcordes(currentTransposition);
    scrollToSlide(currentSlide);

    await crear_objSongbooks();
    //pintSongbooksOptionsEnBuscar(eid_songbook_search);//relleno select de songbook para buscar en
    pintSongbooksCheckboxEnBuscar(eid_wr_sb_checkboxes);//relleno contenedor de checkboxes
}

async function crear_objSongbooks(){
    console.log('=== function crear_objSongbooks() ===');

    objSongbooks = await getSongbooksFromBd();
    console.log(`objSongbooks: `, objSongbooks);
}


function pintSongbooksOptionsEnBuscar(selectElement){
    console.log('=== function pintSongbooksOptionsEnBuscar() ===');
    
    selectElement.innerHTML = '';//reset
    //Recorrer objSongbooks
    Object.values(objSongbooks).forEach( (songbook, i) => {
        if(i == 0){
            const option_def = document.createElement('option');
            option_def.value = '';
            option_def.innerHTML = `All songbooks`;
            selectElement.append(option_def);
        }

        const option = document.createElement('option');
        option.value = songbook.id_songbook;
        option.innerHTML = `${songbook.id_songbook}. ${songbook.title}`;
        selectElement.append(option);
    });
}

let arr_songbooks = [];

function pintSongbooksCheckboxEnBuscar(divElement){
    console.log('=== function pintSongbooksCheckboxEnBuscar() ===');
    
    divElement.innerHTML = '';//reset
    //Recorrer objSongbooks
    Object.values(objSongbooks).forEach( (songbook, i) => {

        const el_label = document.createElement('label');
        el_label.dataset.id = songbook.id_songbook;
        el_label.innerHTML = `
            <p>
                <input type="checkbox" name="songbooks" value="${songbook.id_songbook}">
                <span class="sp_number">${songbook.id_songbook}. </span>
                <span>${songbook.title}</span>
            </p>
        `;
        el_label.onclick = (e) => {
            const cbox = e.currentTarget.querySelector('input[type="checkbox"]');
            handleCheckbox(cbox);

            // const int_val = Number(e.currentTarget.dataset.id);

            // if(cbox.checked){
            //     if(!arr_songbooks.includes(int_val)){
            //         arr_songbooks.push(int_val);
            //     }
            // }else{
            //     const index = arr_songbooks.indexOf(int_val);
            //     if (index !== -1) {
            //         arr_songbooks.splice(index, 1); // Elimina 1 elemento en esa posición
            //     }
            // }
            // check_arr_songbooks();
        }
        divElement.append(el_label);
    });
}


function check_arr_songbooks(){
    console.log('=== function check_arr_songbooks() ===');
    console.log('arr_songbooks: ', arr_songbooks);

    btn_songbook_search.innerHTML = '';//reset
    
    arr_songbooks = arr_songbooks.sort((a, b) => a - b); // Orden ascendente 1,2,3
    console.log('(sorted) --- arr_songbooks: ', arr_songbooks);
    
    let arr_songbooks_str = arr_songbooks.join(', ');
    console.log('arr_songbooks_str: ', arr_songbooks_str);


    if(arr_songbooks.length > 0){
        btn_songbook_search.innerHTML = `
            Songbooks seleccionados (sólo ids): ${arr_songbooks_str}
        `;
    }else{
        btn_songbook_search.innerHTML = `
            Selecciona songbook:
        `;
    }
}


function scrollToSlide(index) {
    console.log('=== function scrollToSlide() ===');

    if (index < 0 || index >= slides.length) return;
    currentSlide = index;    

    switch (slideModo) {
        case 'smooth':
        case 'instant':
            const offset = index * window.innerWidth;
            carousel.scrollTo({ left: offset, behavior: slideModo });
            break;

        case 'fast':
        default:
            const offset_negativo = -index * window.innerWidth;
            console.log(' me muevo a offset_negativo: ', offset_negativo);

            slideContainer.style.transform = `translateX(${offset_negativo}px)`;//!IMPORTANTE: aki no 'carousel' sino 'slideContainer'
            break;
    }

    localStorage.setItem('currentSlide', index);
    pintSlideActive(index);

}


function scrollToCenter(element, container) {
    console.log('=== function scrollToCenter() ===');

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
  
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
  
    const offsetLeft = elementRect.left - containerRect.left;
    const offsetTop = elementRect.top - containerRect.top;
  
    const centerX = offsetLeft - (container.clientWidth / 2) + (element.clientWidth / 2);
    const centerY = offsetTop - (container.clientHeight / 2) + (element.clientHeight / 2);
  
    container.scrollTo({
      left: scrollLeft + centerX,
      top: scrollTop + centerY,
      behavior: 'smooth'
    });
}


function mostrar_calculando(){
    setTimeout(async ()=>{
        calculando.style.display = 'flex';
    },100);
}

function ocultar_calculando(){
    setTimeout(async ()=>{
        calculando.style.display = 'none';
    },300);
}


function ajustarTexto() {
    console.log('=== function ajustarTexto() ===');
    
    //paso 1
    mostrar_calculando();
    // setTimeout(async ()=>{
    //     calculando.style.display = 'flex';
    // },100);
    
    //paso 2
    setTimeout(async ()=>{
        
        const header = document.querySelector('header');
        const slideAll = document.querySelectorAll('.slide');

        const maxW = window.innerWidth - 32;//32; // padding
        const maxH = (window.innerHeight - 32) - header.offsetHeight;

        const coef_legend = 0.6;// 2/3 del tamaño de la fuente de texto de kuplet
        const legend_fontSize_max = 50;// tamaño maximo de la fuente de legend

        //recorrer...
        slideAll.forEach(slide => {
            //console.log('slide: ', slide);

            const slide_inner = slide.querySelector('.slide_inner');
            //console.log('slide_inner: ', slide_inner);

            const legend = slide.querySelector('legend');
            const legend2 = slide.querySelectorAll('legend')[1];
            //console.log('legend: ', legend);

            let fontSize = 10;
            slide.style.fontSize = fontSize + 'px';

            const clone = slide.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.visibility = 'hidden';
            clone.style.left = '-9999px';
            document.body.appendChild(clone);

            while (fontSize < 500) {//while() es mas rapido que for()
                clone.style.fontSize = fontSize + 'px';
                const { width, height } = clone.getBoundingClientRect();
                if (width > maxW || height > maxH) break;
                fontSize++;
            }

            slide.style.fontSize = (fontSize - 1) + 'px';
            if(legend){
                const legend_fontSize = (fontSize - 1) * coef_legend;
                const legend_fontSize_new = (legend_fontSize > legend_fontSize_max) 
                    ? legend_fontSize_max 
                    : legend_fontSize ;
                legend.style.fontSize = legend_fontSize_new + 'px';

                if(legend2){
                    legend2.style.fontSize = legend_fontSize_new + 'px';
                }
            }
            document.body.removeChild(clone);
        });

    },200);


    //paso 3
    ocultar_calculando();
    // setTimeout(async ()=>{
    //     calculando.style.display = 'none';
    // },300);
}


function pintBarras() {//no se usa...
    console.log('=== function pintBarras() ===');

    document.querySelectorAll('p.c').forEach(linea => {
        console.log('linea: ', linea);

        let linea_str = linea.textContent;
        let linea_new = '';

        if(linea.classList.contains('c')){
            console.log('es linea para acordes', linea);
        }

        // 2. Reemplazar barras "|" por span
        linea_str = linea_str.replace(/([|\/\-\(\)])/g, '<span class="barra">$1</span>');

        linea.innerHTML = linea_new;
    });
}


function pintParrafosAcordes() { 
    console.log('=== function pintParrafosAcordes() ===');

    // Regex para acordes: letra A-H + opcional # o b + opcional sufijo alfanumérico
    const regexAcorde = /([A-H](?:#|b)?\w*)/g;

    document.querySelectorAll('p.c').forEach(p => {
        let textOriginal = p.textContent;

        //const partes = textOriginal.match(/([|\/])|(\s+)|([^\s|\/]+)/g);
        const partes = textOriginal.match(/([|\/\-\(\)])|(\s+)|([^\s|\/\-\(\)]+)/g);


        let resultado = partes.map(parte => {
            if ( parte === '|' || parte === '/' || parte === '-' || parte === '(' || parte === ')' ) {
                return `<span class="barra">${parte}</span>`;
            } else if (parte.trim() === '') {
                return `<span class="espacio" data-length="${parte.length}">${parte}</span>`;
            } else {
                return parte; // acordes u otros caracteres normales
            }
        }).join('');

        //console.log('1. resultado: ',resultado);
        
        resultado = resultado.replace(regexAcorde, (match) => {
            return `<span class="acorde" data-original="${match}">${match}</span>`;
        });
        //console.log('2. resultado: ',resultado);

        p.innerHTML = resultado;
    });
}


function transponerAcorde(acorde, semitonos) {
    const notasConDiez = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'];
    const notasConBemol = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'H'];

    // Regex para extraer nota raíz (letra A-G y opcional # o b)
    const regex = /^([A-H](?:#|b)?)(.*)$/;
    const match = acorde.match(regex);

    if (!match) return acorde; // no es acorde válido, devuelvo igual

    let [_, notaRaiz, sufijo] = match;

    // Determinar índice actual en los arrays, buscando en ambos para hallar nota equivalente
    let idx = notasConDiez.indexOf(notaRaiz);
    let usaBemolEnNotaOriginal = false;

    if (idx === -1) {
        idx = notasConBemol.indexOf(notaRaiz);
        if (idx === -1) {
            // No encontrada, devuelvo acorde original
            return acorde;
        }
        usaBemolEnNotaOriginal = true;
    }

    // Calcula nuevo índice con módulo 12 para la transposición
    let nuevoIdx = (idx + semitonos) % 12;
    if (nuevoIdx < 0) nuevoIdx += 12;

    // Según la preferencia del usuario y la nota original,
    // escoger la notación correcta (bemol o diez)
    let notaTranspuesta;
    
    switch (tipoAcorde) {
        case 'bemol':
            notaTranspuesta = notasConBemol[nuevoIdx];
            break;

        case 'diez':
        default:
            notaTranspuesta = notasConDiez[nuevoIdx];
            break;
    }

    return notaTranspuesta + sufijo;
}


function transponerTodosLosAcordes(semitonos) {
    currentTransposition = semitonos;
    const spans = document.querySelectorAll('span.acorde');
    spans.forEach(span => {
        const acordeOriginal = span.dataset.original;
        const acordeTranspuesto = transponerAcorde(acordeOriginal, semitonos);
        span.textContent = acordeTranspuesto;
    });
    localStorage.setItem('currentTransposition', currentTransposition);
    pintActTranspose(currentTransposition);
    //ajustarTexto();
    ajustarEspacios();
}


function resetTonalidad() {
    currentTransposition = 0;
    const spans = document.querySelectorAll('span.acorde');
    spans.forEach(span => {
        span.textContent = span.dataset.original;
    });
    localStorage.setItem('currentTransposition', currentTransposition);
    pintActTranspose(currentTransposition);
}


function transposeUp(){
    if(currentTransposition == 12) return;
    const value_new = currentTransposition + 1;
    transponerTodosLosAcordes(value_new);
}

function transposeDown(){
    if(currentTransposition == -12) return;
    const value_new = currentTransposition - 1;
    transponerTodosLosAcordes(value_new);
}

function pintActTranspose(valor){
    d_currentTransposition.querySelector('b').textContent = valor;
}


async function slideGo(dir){
    console.log('=== function slideGo() ===');

    //si no es calculado index of arr_lista, lo calculo...
    if(currentIndexOfArrLista === -1){       
        currentIndexOfArrLista = arr_lista.findIndex(item => item.id_song == id_song);
        console.log('currentIndexOfArrLista: ', currentIndexOfArrLista);
    }


    if(dir == 'next'){
        if(currentSlide < (totalSlides - 1) || currentSlide < (arr_esquema_bucle.length - 1) ){
            currentSlide++;
            scrollToSlide(currentSlide);
        }else{//es ultimo slide
            //alert('es ultimo slide');

            if(currentIndexOfArrLista < (arr_lista.length - 1) ){
                nextIndexOfArrLista = currentIndexOfArrLista;
                nextIndexOfArrLista++;

                id_song_next = arr_lista[nextIndexOfArrLista].id_song;
                lista_id_song = id_song_next;
                id_song = id_song_next;

                const p_lista_next = eid_block_lista.querySelector(`.p_lista[data-id_song="${id_song_next}"]`);
                console.log('ir a la canción next de la lista. id_song_next: ', id_song_next);

                if(hayElementosModalesAbiertos()){
                    showEdit('esquema');//para abrir si no se ve
                    showBlockName('esquema');//para abrir si no se ve
                }

                const btnElement = eid_block_esquema.querySelector('#btn_select_slide');
                showVklad(btnElement, param = 'select_slide');//función select_slide() se llama dentro

                await crearSlidesForSongOfLista(p_lista_next, id_song_next, cerrar_modales = false, show_ultimo_slide = false);

                scrollToSlide(currentSlide);
            }
        }        
    }

    if(dir == 'prev'){
        if(currentSlide > 0){
            currentSlide--;
            scrollToSlide(currentSlide);
        }else{//es primer slide

            if(currentIndexOfArrLista != 0 && currentIndexOfArrLista != -1){
                prevIndexOfArrLista = currentIndexOfArrLista;
                prevIndexOfArrLista--;

                id_song_prev = arr_lista[prevIndexOfArrLista].id_song;
                lista_id_song = id_song_prev;
                id_song = id_song_prev;

                const p_lista_prev = eid_block_lista.querySelector(`.p_lista[data-id_song="${id_song_prev}"]`);
                console.log('ir a la canción prev de la lista. id_song_prev: ', id_song_prev);

                if(hayElementosModalesAbiertos()){
                    showEdit('esquema');//para abrir si no se ve
                    showBlockName('esquema');//para abrir si no se ve
                }

                const btnElement = eid_block_esquema.querySelector('#btn_select_slide');
                showVklad(btnElement, param = 'select_slide');//función select_slide() se llama dentro
                
                let show_ultimo_slide;
                if(go_to_last_slide_of_prev_song){
                    show_ultimo_slide = true;//ir al ultimo slide de la cancion previa en modo Musicos
                }else{
                    show_ultimo_slide = false;//ir al primer slide de la cancion previa en modo Musicos
                }

                await crearSlidesForSongOfLista(p_lista_prev, id_song_prev, cerrar_modales = false, show_ultimo_slide);

                scrollToSlide(currentSlide);//ir al seleccionado slide de la cancion previa en modo Musicos
            }
        }
    }

    // const btn_simple = select_slide_wr_vista_btns.querySelector(`.btn[data-idx="${currentSlide}"]`);
    // if(esElementoVisible(btn_simple)){
    //     btn_simple.click();
    // }
    showOneSlideFrom(null, index_esquema = currentSlide);

    if(window.innerWidth < pantallaTabletMinPx){//mobile
        //alert('10. es mobil. hago btn_simple.click()...');
        btn_simple.click();
    }else{//desktop
       // alert('1. es desktop. calculo width...');
    }

}

function showMenu(){
    btn_menu.classList.remove('shown');
    menu_contenido.style.top = -menu_contenido.offsetHeight + 'px';
    menu_contenido.style.top = 0;
}

function hideMenu(){    
    btn_menu.classList.add('shown');    

    if(puntosMenu.classList.contains('shown')){
        closePuntosMenu();
        setTimeout(()=>{
            menu_contenido.style.top = -menu_contenido.offsetHeight + 'px';
        },300);
        setTimeout(()=>{
            menu_contenido.style.top = '-100%';
        },1000);
    }else{
        menu_contenido.style.top = -menu_contenido.offsetHeight + 'px';
        setTimeout(()=>{
            menu_contenido.style.top = '-100%';
        },1000);
    }
}

function hideShowPuntosMenu(){
    if(puntosMenu.classList.contains('shown')){//si es mostrado, lo oculto
        closePuntosMenu();
    }else{//si es oculto, lo muestro
        openPuntosMenu();
    }
}

function openPuntosMenu(){
    puntosMenu.classList.add('shown');//muestro
    puntosMenu.style.top = menu_contenido.offsetHeight + 'px';
    puntosMenu.style.height = (window.innerHeight - menu_contenido.offsetHeight) + 'px';
    hamburger.classList.add('active'); // Cambiar hamburguesa a flecha
}

function closePuntosMenu(){
    puntosMenu.classList.remove('shown');//oculto
    setTimeout(()=>{
        puntosMenu.style.top = -puntosMenu.offsetHeight + 'px';
    },20);
    hamburger.classList.remove('active'); // Cambiar flecha a hamburguesa
}

function closeAll(){
    hideEdit();
    hideMenu();
    closePuntosMenu();
}


function pintSlideActive(index){
    console.log('=== function pintSlideActive() ===');
    
    const slideAll = document.querySelectorAll('.slide');

    const divAll = document.querySelectorAll('.step');
    divAll.forEach((div_step,i) => {
        if(i == index){
            div_step.classList.add('active');
            //div_step.scrollIntoView({behavior: 'smooth'});//funciona ok, pero scrollToCenter() mejor
            
            const element = div_step;
            const container = barra_estado;
            scrollToCenter(element, container);

            slideAll[i].classList.add('active');
        }else{
            div_step.classList.remove('active');
            slideAll[i].classList.remove('active');
        }
    });
}

function pintTipoAcorde(){
    if(tipoAcorde === 'diez'){
        btn_diez.classList.add('btn_active');
        btn_bemol.classList.remove('btn_active');
    }
    else if(tipoAcorde === 'bemol'){
        btn_diez.classList.remove('btn_active');
        btn_bemol.classList.add('btn_active');
    }
}

function changeTipoAcorde(tipo){
    console.log('=== function changeTipoAcorde() ===');    
    if (['diez','bemol'].includes(tipo)) {
        
        tipoAcorde = tipo;
        localStorage.setItem('tipoAcorde', tipoAcorde);
        pintTipoAcorde();

        transponerTodosLosAcordes(currentTransposition);
        console.log(`Clic en .btn de tipo.`);
    }
}

function changeTranspose(direction){
    console.log('=== function changeTranspose() ==='); 
    
    if (['up','down'].includes(direction)) {        
        if(direction === 'up'){
            transposeUp();
        }
        else if(direction === 'down'){
            transposeDown();
        }
        console.log(`Clic en .btn de transpose.`);
    }    
}



function ajustarEspacios(){
    console.log('=== function ajustarEspacios() ===');    

    const pc_All = document.querySelectorAll('p.c');
    pc_All.forEach(p => {
        //console.log('p: ', p);

        p.childNodes.forEach((el, i, arr) => {
            //console.log('el: ', el);

            if(el.className == 'acorde'){
                //console.log('es acorde');

                //miro si su contenido es distinto que data.original
                if(el.dataset.original.length != el.textContent.length){
                    //console.log('es distinta length');

                    //miro si va espacios en el sig elemento
                    if(arr[i+1] && arr[i+1].className == 'espacio'){
                        //console.log('es distinta length.', arr[i+1].textContent.length);

                        let sig_string_length = parseInt(arr[i+1].dataset.length);
                        //console.log('sig_string_length', sig_string_length);
                        let new_string = '';

                        if(el.dataset.original.length > el.textContent.length){
                            //demo sumar un espacio en el siguiente elemento '.espacio'
                            new_string = generarEspacios(sig_string_length + 1);
                            console.log('[if] --- new_string.length', new_string.length);                            
                        }
                        else if(el.dataset.original.length < el.textContent.length){
                            //demo restar un espacio en el siguiente elemento '.espacio'
                            new_string = generarEspacios(sig_string_length - 1);
                            console.log('[else] --- new_string.length', new_string.length); 
                        }
                        arr[i+1].textContent = new_string;
                    }
                }else{//si length de acorde es la de original, pongo los espacios del original
                    //miro si va espacios en el sig elemento
                    if(arr[i+1] && arr[i+1].className == 'espacio'){
                        const length_original = arr[i+1].dataset.length;
                        //console.log('recupero la longitud original de los espacios. length_original', length_original); 
                        arr[i+1].textContent = generarEspacios(length_original);
                    }
                }

            }else{
                //console.log('--- No es acorde');
            }
        });        
    });
}

function generarEspacios(numero){
    if(numero > 0){
        return ' '.repeat(numero);
    }else{
        return '';
    }
}

async function isExistingUrl(url){//bool
    try {        
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            //console.log(`El archivo en la ruta "${url}" EXISTE.`);
            return true;
        } else {
            //console.log(`El archivo en la ruta "${url}" NO EXISTE.`);
            return false;
        }
    } catch (error) {
        console.error(`Error al verificar el archivo: ${error}`);
    }
}

async function fetchDataToJson(url) {
    // const response = await fetch(url);
    // const data = await response.json();
    // return data;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Si el servidor responde con 404, 500, etc.
            return '';
        }
        const data = await response.json();
        return data;
    } catch (error) {
        // Si falla la conexión (red, CORS, etc.)
        return '';
    }
}

async function fetchDataToText(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Si el servidor responde con 404, 500, etc.
            return '';
        }
        const data = await response.text();
        return data;
    } catch (error) {
        // Si falla la conexión (red, CORS, etc.)
        return '';
    }
}

async function getSongTextFromFile(){
    console.log('=== function getSongTextFromFile() ===');

    try {

        if(!hay_id_song('getSongTextFromFile()')){
            return; // <- se detiene aquí si no hay id_song
        } 

    
        let song_file = obj_lista[id_song].fileName;
        //console.log('song_file: ', song_file);
    
        if(!song_file){
            alert('no existe esta cancion en objeto obj_lista');
            return;
        }

        let url = `./song_files/${song_file}`;
        //console.log('url: ', url);

        if(!isExistingUrl(url)){
            alert('no existe esta cancion en objeto obj_lista');
            return;
        }

        const data = await fetchDataToText(url);
        //console.log('data:', data);

        return data;

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('getSongText. error: ',error);
    }
}

async function pintLineasAcordes() {
    console.log('=== function buildSong() ===');

    if(!hay_id_song('pintLineasAcordes()')){
        return; // <- se detiene aquí si no hay id_song
    }
}



async function getSongPages(){
    console.log('=== function getSongPages() ===');

    if(!hay_id_song('getSongPages()')){
        return; // <- se detiene aquí si no hay id_song
    }
       
    objSongBd = await getDataSongFromBd();
    arr_esquema_bd = objSongBd.arr_esquema;
    
    let texto = objSongBd['song_text'];
    //console.log('text:', texto);

    let song_titulo = objSongBd['title'];
    console.log('song_titulo: ', song_titulo);

    const ejemplo_step = `
        <div class="step" data-index="0">Інтро:</div>
    `;
    const ejemplo_step_linea = `
        <div class="linea"><span></span></div>
    `;

    const ejemplo_slide = `
        <div class="slide">
            <div class="slide_inner">
                <fieldset class="kuplet">
                    <legend>Кінцівка:</legend>
                    <p class="c">|D   |F#m |G    |G                  |</p>
                    <p class="b"> ···· ···· ····  ····                </p>
                    <p class="t">                 Слава Богу в вишніх!</p>
                    <p class="c">|Hm  |F#m |G    |G                  |</p>
                    <p class="b"> ···· ···· · ··· ·                   </p>
                </fieldset>
            </div>
        </div>
    `;
    
    const palabrasPages = arr_pages.join('|');//arr_pages en config
    const regexTitulo = make_regex_titulos(palabrasPages);

    obj_pages = {};//reset - elementos html de slides: kuplet, pripev bridge sin repetirse

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

            const slide = document.createElement('div');
            slide.className = 'slide page';
            slide.innerHTML = `
                <div class="slide_inner">
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


                    const palabrasTitulos = arr_titulos.join('|');//arr_titulos en config
                    const regexTitulo = make_regex_titulos(palabrasTitulos);

                    // Obtenemos todas las coincidencias de títulos
                    const matchesTitulos = Array.from(linea.matchAll(regexTitulo));
                    console.log('matchesTitulos: ', matchesTitulos);

                    if(matchesTitulos.length > 0){
                        //hay titulos en la linea
                        console.log('hay titulo en la linea. linea:', linea);

                        let linea_titulo = matchesTitulos[0][1] || matchesTitulos[0][2];
                        linea_titulo = linea_titulo ? linea_titulo.trim() : '';
                        console.log('linea_titulo:', linea_titulo);                        
                        
                    }else{
                        //no hay titulos en la linea
                        console.log('no hay titulo en la linea. linea:', linea);
                    }



                    //con switch es mas limpio...
                    switch (true) {
                        case (matchesTitulos.length > 0):
                            p.className = 'l_titulo';// 'c' => 'legend'
                            break;

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
                
                //añado titulo cancion como primer slide
                if(i == 0){
                    const d_titulo_cancion = document.createElement('div');
                    d_titulo_cancion.className = 'song_titulo';
                    d_titulo_cancion.innerHTML = `<span>${song_titulo}</span>`;

                    const titulo_cancion = '_titulo_cancion_';

                    const step = document.createElement('div');
                    step.className = 'step';
                    step.dataset.index = i;
                    step.textContent = 'titulo cancion';

                    const slide = document.createElement('div');
                    slide.className = 'slide';
                    slide.innerHTML = `
                        <div class="slide_inner">
                            <fieldset class="kuplet fld_song_titulo">
                                <legend>${titulo_cancion}</legend>
                                <!-- aki los p -->
                            </fieldset>
                        </div>
                    `;

                    slide.querySelector('fieldset').append(d_titulo_cancion);

                    obj_pages[titulo_cancion] = {
                        step,
                        slide
                    };
                }

                //relleno objeto con html elementos
                obj_pages[titulo] = {
                    step,
                    slide
                };

                console.log(`obj_pages[${titulo}].step.innerHTML: `, obj_pages[titulo].step.innerHTML);
                console.log(`obj_pages[${titulo}].slide.innerHTML: `, obj_pages[titulo].slide.innerHTML);
                console.log(`obj_pages[${titulo}]: `, obj_pages[titulo]);
            }
        });

    }else{
        
        //no hay ningun separador de texto como: pripev, cuplet, etc..
        //devuelvo el texto tal cual

        const titulo = '---';
        const contenido = objSongBd['song_text'];

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
        slide.className = 'slide page';
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

                const palabrasTitulos = arr_titulos.join('|');//arr_titulos en config
                const regexTitulo = make_regex_titulos(palabrasTitulos);

                // Obtenemos todas las coincidencias de títulos
                const matchesTitulos = Array.from(linea.matchAll(regexTitulo));
                console.log('matchesTitulos: ', matchesTitulos);

                if(matchesTitulos.length > 0){
                    //hay titulos en la linea
                    console.log('hay titulo en la linea. linea:', linea);

                    let linea_titulo = matchesTitulos[0][1] || matchesTitulos[0][2];
                    linea_titulo = linea_titulo ? linea_titulo.trim() : '';
                    console.log('linea_titulo:', linea_titulo);                        
                    
                }else{
                    //no hay titulos en la linea
                    console.log('no hay titulo en la linea. linea:', linea);
                }



                //con switch es mas limpio...
                switch (true) {
                    case (matchesTitulos.length > 0):
                        p.className = 'l_titulo';// 'c' => 'legend'
                        break;

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

            if(true){
                const d_titulo_cancion = document.createElement('div');
                d_titulo_cancion.className = 'song_titulo';
                d_titulo_cancion.innerHTML = `<span>${song_titulo}</span>`;

                const titulo_cancion = '_titulo_cancion_';

                const step = document.createElement('div');
                step.className = 'step';
                step.dataset.index = i;
                step.textContent = 'titulo cancion';

                const slide = document.createElement('div');
                slide.className = 'slide';
                slide.innerHTML = `
                    <div class="slide_inner">
                        <fieldset class="kuplet fld_song_titulo">
                            <legend>${titulo_cancion}</legend>
                            <!-- aki los p -->
                        </fieldset>
                    </div>
                `;

                slide.querySelector('fieldset').append(d_titulo_cancion);

                obj_pages[titulo_cancion] = {
                    step,
                    slide
                };
            }

            //relleno objeto con html elementos
            obj_pages[titulo] = {
                step,
                slide
            };

            console.log(`obj_pages[${titulo}].step.innerHTML: `, obj_pages[titulo].step.innerHTML);
            console.log(`obj_pages[${titulo}].slide.innerHTML: `, obj_pages[titulo].slide.innerHTML);
            console.log(`obj_pages[${titulo}]: `, obj_pages[titulo]);
        }

    }

    console.log('al final. obj_pages: ', obj_pages);

    return obj_pages;    
}

async function getSongBlocks(){
    console.log('=== function getSongBlocks() ===');

    if(!hay_id_song('getSongBlocks()')){
        return; // <- se detiene aquí si no hay id_song
    }
       
    objSongBd = await getDataSongFromBd();
    arr_esquema_bd = objSongBd.arr_esquema;
    
    let texto = objSongBd['song_text'];
    //console.log('text:', texto);

    let song_titulo = objSongBd['title'];
    console.log('song_titulo: ', song_titulo);

    const ejemplo_step = `
        <div class="step" data-index="0">Інтро:</div>
    `;
    const ejemplo_step_linea = `
        <div class="linea"><span></span></div>
    `;

    const ejemplo_slide = `
        <div class="slide">
            <div class="slide_inner">
                <fieldset class="kuplet">
                    <legend>Кінцівка:</legend>
                    <p class="c">|D   |F#m |G    |G                  |</p>
                    <p class="b"> ···· ···· ····  ····                </p>
                    <p class="t">                 Слава Богу в вишніх!</p>
                    <p class="c">|Hm  |F#m |G    |G                  |</p>
                    <p class="b"> ···· ···· · ··· ·                   </p>
                </fieldset>
            </div>
        </div>
    `;
    
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

            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `
                <div class="slide_inner">
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
                
                //añado titulo cancion como primer slide
                if(i == 0){
                    const d_titulo_cancion = document.createElement('div');
                    d_titulo_cancion.className = 'song_titulo';
                    d_titulo_cancion.innerHTML = `<span>${song_titulo}</span>`;

                    const titulo_cancion = '_titulo_cancion_';

                    const step = document.createElement('div');
                    step.className = 'step';
                    step.dataset.index = i;
                    step.textContent = 'titulo cancion';

                    const slide = document.createElement('div');
                    slide.className = 'slide';
                    slide.innerHTML = `
                        <div class="slide_inner">
                            <fieldset class="kuplet fld_song_titulo">
                                <legend>${titulo_cancion}</legend>
                                <!-- aki los p -->
                            </fieldset>
                        </div>
                    `;

                    slide.querySelector('fieldset').append(d_titulo_cancion);

                    obj_bloques[titulo_cancion] = {
                        step,
                        slide
                    };
                }

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
        const contenido = objSongBd['song_text'];

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

    return obj_bloques;    
}


function crear_arr_esquema_bucle(obj_bloques){
    console.log('=== function crear_arr_esquema_bucle() ===');    
    console.log('obj_bloques: ', obj_bloques);

    let arr_esquema = Object.keys(obj_bloques);
    console.log('arr_esquema: ', arr_esquema);
    
    //let arr_esquema_bd;
    //let arr_esquema_titlulos;//es global

    if(objSongBd.arr_esquema && objSongBd.arr_esquema?.length > 0){
        // arr_esquema_bd = objSongBd.arr_esquema.map(el => el.nombre);//desde BD
        arr_esquema_titlulos = objSongBd.arr_esquema.map(el => el.nombre);//desde BD
    }else{
        arr_esquema_titlulos = Object.keys(obj_bloques).map(el => el);
    }
    console.log('arr_esquema_bd: ', arr_esquema_bd);
    console.log('arr_esquema_titlulos: ', arr_esquema_titlulos);



    arr_esquema_titlulos = addCoroAfterVerse();//test



    if(arr_esquema_titlulos.length > 0){
        arr_esquema_bucle = arr_esquema_titlulos;
    }else{
        const arr_obj = arr_esquema.map(el => el = {'nombre': el, veces: 1});//arr_esquema convierto en array de objetos
        arr_esquema_bucle = arr_obj;//lo reasigno
    }
    console.log('return --- arr_esquema_bucle: ', arr_esquema_bucle);

    //si hay. quito el primer elemento que es titulo de la cancion para no mostrarlo en ver_esquema() y crear_esquema()
    if(arr_esquema_bucle[0] == '_titulo_cancion_'){
        //arr_esquema_bucle.splice(0,1);
        console.log('(quitado titulo) --- arr_esquema_bucle (sin titulo cancion): ', arr_esquema_bucle);
    }

    return arr_esquema_bucle;
}

function make_regex_titulos(palabras){
    // regex que captura en grupo (1) palabra entre [] (cualquier palabra)
    // o en grupo (2) palabra del arr_titulos al inicio de línea
    const regexTitulo = new RegExp(
        '^\\s*' +                                                   // ^ → inicio de línea, seguido de posibles espacios en blanco
        '(?:' +                                                     // (?: ...) → grupo sin captura (elegir una de las dos opciones)
            '\\[\\s*(.*?)\\s*\\]' +                                 // opción 1: texto entre corchetes. ej.: [Verso 1]
            '|' +                                                   // o bien
            '((?:\\d+\\s*)?(?:' + palabras + ')[^\\n]*)' +          // opción 2: opcional número + palabra del array hasta el fin de la línea
        ')',                                                        // fin de grupo sin captura. luego va coma ','
        'gim'                                                       // g -> global (se usa con matchAll), i → case-insensitive, m → multiline
    );
    console.log('regexTitulo: ', regexTitulo);

    return regexTitulo;
}

function addCoroAfterVerse(){
    console.log('=== function addCoroAfterVerse() ===');    

    const palabrasTitulosCoro = arr_titulos_coro.join('|');//arr_titulos en config
    const regexTituloCoro = make_regex_titulos(palabrasTitulosCoro);    
    
    const palabrasTitulosCoda = arr_titulos_coda.join('|');//arr_titulos en config
    const regexTituloCoda = make_regex_titulos(palabrasTitulosCoda);

    let arr_titulos_tmp = [];
    let arr_coro = [];
    let coro_i = 0;

    arr_esquema_titlulos.forEach( (item, i, arr ) => {
        console.log('item: ', item);
        console.log('i: ', i);           

        // Obtenemos todas las coincidencias de títulos
        const matchesCoro = Array.from(item.matchAll(regexTituloCoro));
        console.log('matchesCoro: ', matchesCoro);

        if(matchesCoro.length > 0){//es titulo de pripev o coro
            console.log(`item: ${item} coontiene coincidencia con coro. item: `, item);

            arr_coro.push(item);
            coro_i++;

            arr_titulos_tmp.push(item);
            console.log('añado al --- arr_titulos_tmp: ', arr_titulos_tmp);
            
        }else{//no es titulo de pripev o coro
            console.log('--- no contiene coro. item: ', item);
            
            arr_titulos_tmp.push(item);
            console.log('añado al --- arr_titulos_tmp: ', arr_titulos_tmp);

            let item_next = arr[i + 1];
            let item_next_es_kuplet = true;//o es kuplet o es final de cancion...

            if(item_next){
                const matchesCoro_next = Array.from(item_next.matchAll(regexTituloCoro));
                //const matchesCoda_next = Array.from(item_next.matchAll(regexTituloCoda));
                
                if(matchesCoro_next.length > 0 /*|| matchesCoda_next.length > 0*/){
                    item_next_es_kuplet = false;
                    console.log(' ahora item_next_es_kuplet es FALSE. no añado coro. ');
                }else{
                    console.log('item_next_es_kuplet es TRUE. no hago nada. ');
                }
            }else{
                console.log('no hay item_next. reviso si item current es CODA.');

                const matchesCoda_ultimo = Array.from(item.matchAll(regexTituloCoda));
                if(matchesCoda_ultimo.length > 0){
                    item_next_es_kuplet = false;
                    console.log(' ahora item_next_es_kuplet es FALSE. no añado coro ya que es CODA. ');
                }
            }

            if(arr_coro.length > 0 && item_next_es_kuplet){
                arr_titulos_tmp.push(arr_coro[arr_coro.length-1]);
                console.log('2. añado al --- arr_titulos_tmp: ', arr_titulos_tmp);
            }
        }
    });

    console.log('arr_titulos_tmp: ', arr_titulos_tmp);

    return arr_titulos_tmp;
}



async function crearSlides(goToSlide = null){
    console.log('=== function crearSlides() ===');

    if(!hay_id_song('crearSlides()')){
        return; // <- se detiene aquí si no hay id_song
    }

    if(goToSlide){
        currentSlide = goToSlide;//mostrar desde slide seleccionado
    }else{
        currentSlide = 0;//reset al cargar nueva cancion, mostrar desde inicio
    }


    obj_bloques = await getSongBlocks();
    console.log('obj_bloques: ', obj_bloques);

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);

    buildSong();
}

async function crearPages(goToSlide = null){
    console.log('=== function crearSlides() ===');

    if(!hay_id_song('crearPages()')){
        return; // <- se detiene aquí si no hay id_song
    }

    if(goToSlide){
        currentSlide = goToSlide;//mostrar desde slide seleccionado
    }else{
        currentSlide = 0;//reset al cargar nueva cancion, mostrar desde inicio
    }


    // obj_pages = await getSongBlocks();
    obj_pages = await getSongPages();
    console.log('obj_pages: ', obj_pages);

    arr_esquema_bucle = Object.keys(obj_pages);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);

    buildPage();
}


function buildPage(){
    console.log('=== function buildPage() ===');

    console.log('obj_pages: ', obj_pages);
    console.log('arr_esquema_bucle: ', arr_esquema_bucle);

    stepsContainer.innerHTML = '';//reset
    slideContainer.innerHTML = '';//reset
    slideContainer.dataset.id_song = objSongBd.id_song;

    arr_fieldsets = [];//reset    
    totalSlides = arr_esquema_bucle.length;//total de slides a pintar

    if(Object.keys(obj_pages).length > 0){
        console.log('obj_pages es correcto y no vacio');
        
    }else{//DORABOTAT!!!
        console.log('obj_pages es vacio: ');
        let aviso_text = `No sa ha podido dividir el texto de la canción en bloques para mostrarla. Edita el texto de la cancion para poder separarlo en bloques. Mira en la pestaña 'Ejemplo' como hacerlo.`;

        showToast('error', aviso_text);
        
        showEdit('cancion');
        editar_song();
        document.querySelector('#song_text').focus();
        return;
    }

    //recorrer el bucle...
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_pages[titulo]?.slide;//bd
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original?.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);        

        const step = document.createElement('div');
        step.className = 'step';
        step.dataset.index = i;

        let titulo_text;
        titulo_text = titulo;
        step.innerHTML = titulo_text;
        slide_clone.querySelector('legend').innerHTML = titulo_text;
        
        stepsContainer.append(step);

        if(i < (arr.length - 1)){
            const step_linea = document.createElement('div');
            step_linea.className = 'step_linea';
            step_linea.innerHTML = `<span></span>`;
            stepsContainer.append(step_linea);
        }
        
        arr_fieldsets.push(slide_clone.querySelector('fieldset'));
        console.log('crearSlides() --- arr_fieldsets: ', arr_fieldsets);

        slideContainer.append(slide_clone);
    });


    //init();
    ajustarTexto();
    pintParrafosAcordes();
    pintTipoAcorde();
    scrollToSlide(currentSlide);
}


async function buildSong(){
    console.log('=== function buildSong() ===');

    console.log('obj_bloques: ', obj_bloques);
    console.log('arr_esquema_bucle: ', arr_esquema_bucle);

    stepsContainer.innerHTML = '';//reset
    slideContainer.innerHTML = '';//reset
    slideContainer.dataset.id_song = objSongBd.id_song;

    arr_fieldsets = [];//reset    
    totalSlides = arr_esquema_bucle.length;//total de slides a pintar

    if(Object.keys(obj_bloques).length > 0){
        console.log('obj_bloques es correcto y no vacio');
        
    }else{//DORABOTAT!!!
        console.log('obj_bloques es vacio: ');
        let aviso_text = `No sa ha podido dividir el texto de la canción en bloques para mostrarla. Edita el texto de la cancion para poder separarlo en bloques. Mira en la pestaña 'Ejemplo' como hacerlo.`;

        showToast('error', aviso_text);
        
        showEdit('cancion');
        editar_song();
        document.querySelector('#song_text').focus();
        return;
    }

    //recorrer el bucle...
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo]?.slide;//bd
        console.log('slide_original: ', slide_original);

        const slide_original_next = (arr[i+1]) ? obj_bloques[arr[i+1]]?.slide : null ;//bd
        console.log('slide_original_next: ', slide_original_next);
        
        const slide_clone = slide_original?.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);        

        const slide_clone_next = (arr[i+1]) ? slide_original_next?.cloneNode(true) : null ; // true para clonar también hijos 
        console.log('slide_clone_next: ', slide_clone_next);

        const step = document.createElement('div');
        step.className = 'step';
        step.dataset.index = i;

        let titulo_text;
        if(esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0 && objSongBd.arr_esquema[i].veces > 1){//si hay repeticion del titulo
            titulo_text = `${titulo} <span>x${objSongBd.arr_esquema[i].veces}</span>`;
        }else{
            titulo_text = titulo;
        }
        step.innerHTML = titulo_text;
        slide_clone.querySelector('legend').innerHTML = titulo_text;


        if(slide_clone_next){
            let next_legend = slide_clone_next.querySelector('legend').textContent;
            console.log('next_legend: ', next_legend);

            let next_fieldset = slide_clone_next.querySelector('fieldset');
            console.log('next_fieldset: ', next_fieldset);

            next_fieldset.classList.add('preview_next');

            //1. elimino los p's dejando solo los 2 primeros
            next_fieldset.querySelectorAll('p').forEach((el,i) => { 
                if(i >= 2){
                    el.remove();
                }
            });

            //2. si hay 2 filas de solo texto, elimino la 2 fila
            let los_p_t = next_fieldset.querySelectorAll('p.t');
            if(los_p_t.length == 2){
                los_p_t[1].remove();
            }

            slide_clone.querySelector('.slide_inner').append(next_fieldset);
        }

        
        stepsContainer.append(step);

        if(i < (arr.length - 1)){
            const step_linea = document.createElement('div');
            step_linea.className = 'step_linea';
            step_linea.innerHTML = `<span></span>`;
            stepsContainer.append(step_linea);
        }
        
        arr_fieldsets.push(slide_clone.querySelector('fieldset'));
        console.log('crearSlides() --- arr_fieldsets: ', arr_fieldsets);

        slideContainer.append(slide_clone);
    });


    //await guardarSongPantallaEnBd();


    //init();
    ajustarTexto();
    pintParrafosAcordes();
    pintTipoAcorde();
    scrollToSlide(currentSlide);
}

function hay_id_song(func_name = ''){
    console.log('=== function hay_id_song() ===');
    
    if(!id_song){
        console.warn(func_name + ' --- No hay id_song. hago return...');
        alert(func_name + ' --- No hay id_song. hago return...');
        return false;
    }
    console.log(func_name + ' --- id_song: ', id_song);

    return true;  
}

function hay_id_lista(func_name = ''){
    console.log('=== function hay_id_lista() ===');
    
    if(!id_lista){
        console.warn(func_name + ' --- No hay id_lista. hago return...');
        alert(func_name + ' --- No hay id_lista. hago return...');
        return false;
    }
    console.log(func_name + ' --- id_lista: ', id_lista);

    return true;  
}


async function crear_esquema_btns_actual(){//para 'bloques wr_vista_btns_actual'
    console.log('=== function crear_esquema_btns_actual() ===');
    
    if(!hay_id_song('ver_esquema()')){
        return; // <- se detiene aquí si no hay id_song
    }

    console.log('obj_bloques esta vacio, lo creo...');
    obj_bloques = await getSongBlocks();

    console.log('obj_bloques: ', obj_bloques);

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);

    crear_esquema_wr_esquema_actual.style.display = 'block';//muestro el contenedor de esquema actual
    crear_esquema_wr_vista_btns_actual.innerHTML = '';//reset

    // Recorrer el bucle - btns y vista...
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        // const slide_original = obj_bloques[titulo.nombre].slide;//as json
        const slide_original = obj_bloques[titulo].slide;//bd
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone); 

        const el_fieldset_cloned = slide_clone.querySelector('fieldset').cloneNode(true); // true para clonar también hijos
        console.log('el_fieldset_cloned: ', el_fieldset_cloned);
        

        let titulo_orig = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.nombre : titulo ;
        let titulo_text = titulo_orig;
        console.log('titulo_text: ', titulo_text); 
        
        let titulo_count_veces = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.veces : 1 ;
        console.log('before --- titulo_count_veces: ', titulo_count_veces); 
        
        if(titulo_count_veces > 1){//si hay repeticion del titulo
            titulo_text = `${titulo_text} <span>x${titulo_count_veces}</span>`;
        }
        console.log('after --- titulo_text: ', titulo_text); 

        el_fieldset_cloned.dataset.idx_esquema = i;
        el_fieldset_cloned.querySelector('legend').innerHTML = titulo_text;//pongo el titulo en el bloque


        //Creo boton del bloque sin poder cerrarlo con 'X'
        const btn_simple = document.createElement('button');
        btn_simple.className = 'btn btn_simple';
        btn_simple.dataset.titulo = titulo_orig;
        btn_simple.dataset.idx = i;
        btn_simple.innerHTML = `
            <span class="sp_titulo">${titulo_text}</span>
        `;
        
        crear_esquema_wr_vista_btns_actual.append(btn_simple);
    });
}


async function ver_esquema(){
    console.log('=== function ver_esquema() ===');

    if(!hay_id_song('ver_esquema()')){
        mySizeEsquema();
        return; // <- se detiene aquí si no hay id_song
    }

    console.log('obj_bloques esta vacio, lo creo...');
    obj_bloques = await getSongBlocks();

    console.log('obj_bloques: ', obj_bloques);

    let arr_esquema = Object.keys(obj_bloques);

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);
    
    ver_esquema_song_bloques.innerHTML = '';//reset
    ver_esquema_wr_vista_btns.innerHTML = '';//reset
    ver_esquema_ul_action.innerHTML = '';//reset

    ver_esquema_ul_action.innerHTML = '<span class="sp_prim">Para ver la esquema hay que seleccionar antes la canción...</span>';
       
    resetBtnActive(eid_block_esquema_head);//reseteo btn_active de botones en el contenedor
    eid_block_esquema_head.querySelector('#btn_ver_esquema').classList.add('btn_active');
    pageActiveEsquema = 'ver_esquema';

    //Recorrer el bucle - partes de song (SIN REPETIRSE)...
    arr_esquema.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo].slide;
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);  
                
        ver_esquema_song_bloques.append(slide_clone.querySelector('fieldset'));
    });


    // Recorrer el bucle - btns y vista... (CON REPETIRSE)
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo].slide;//bd
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone); 

        const el_fieldset_cloned = slide_clone.querySelector('fieldset').cloneNode(true); // true para clonar también hijos
        console.log('el_fieldset_cloned: ', el_fieldset_cloned);
        

        let titulo_orig = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.nombre : titulo ;
        let titulo_text = titulo_orig;
        console.log('titulo_text: ', titulo_text); 
        
        let titulo_count_veces = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.veces : 1 ;
        console.log('before --- titulo_count_veces: ', titulo_count_veces); 
        
        if(titulo_count_veces > 1){//si hay repeticion del titulo
            titulo_text = `${titulo_text} <span>x${titulo_count_veces}</span>`;
        }
        console.log('after --- titulo_text: ', titulo_text); 

        el_fieldset_cloned.dataset.idx_esquema = i;
        el_fieldset_cloned.querySelector('legend').innerHTML = titulo_text;//pongo el titulo en el bloque


        //Creo boton del bloque sin poder cerrarlo con 'X'
        const btn_simple = document.createElement('button');
        btn_simple.className = 'btn btn_simple';
        btn_simple.dataset.titulo = titulo_orig;
        btn_simple.dataset.idx = i;
        btn_simple.innerHTML = `
            <span class="sp_titulo">${titulo_text}</span>
        `;
        btn_simple.onclick = (e) => {
            console.log('e.currentTarget: ', e.currentTarget);
            console.log('e.target: ', e.target);

            const btn_clicked = e.currentTarget;
            resetBtnActive(ver_esquema_wr_vista_btns);//reseteo btn_active de botones en el contenedor
            btn_clicked.classList.add('btn_active');


            const song_element_legend = [...ver_esquema_song_bloques.querySelectorAll('legend')].find(el => el.textContent.trim() === e.currentTarget.dataset.titulo);
            const song_element_fieldset = song_element_legend.closest('fieldset');
            resetFldActive(ver_esquema_song_bloques);            
            song_element_fieldset.classList.add('fld_active');
            song_element_fieldset.scrollIntoView({behavior: 'smooth'});
            //scrollToElement(document.querySelector('.bl_parte_l .vklad_ver_esquema .bloques_outer'), song_element_fieldset);            
            //scrollIntoViewInContainer(document.querySelector('.bl_parte_l .vklad_ver_esquema .bloques_outer'), song_element_fieldset, true, 'top');            
            
            const element_legend = ver_esquema_wr_vista_blocks.querySelectorAll('legend')[e.currentTarget.dataset.idx];
            const element_fieldset = element_legend.closest('fieldset');
            resetFldActive(ver_esquema_wr_vista_blocks);            
            element_fieldset.classList.add('fld_active');
            element_fieldset.scrollIntoView({behavior: 'smooth'});
            //scrollToElement(document.querySelector('.bl_parte_r .vklad_ver_esquema .bloques_outer'), element_fieldset);
            //scrollIntoViewInContainer(document.querySelector('.bl_parte_r .vklad_ver_esquema .bloques_outer'), element_fieldset, true, 'top');
        }
        
        ver_esquema_wr_vista_btns.append(btn_simple);
        ver_esquema_wr_vista_blocks.append(el_fieldset_cloned);
    });

    ver_esquema_ul_action.innerHTML = `
        <li class="li_action" onclick="crearSlides();">Crear slides</li>
        <li class="li_action" onclick="crearSlides(); closeAll();">Crear slides + Ver</li>
    `;
    ver_esquema_ul_action.onclick = e => close_ul_action(e);

    pintParrafosAcordes();//para pintar barras de acordes como mas finas
    mySizeEsquema();
}


async function crear_esquema(){
    console.log('=== function crear_esquema() ===');

    if(!hay_id_song('crear_esquema()')){
        mySizeEsquema();
        return; // <- se detiene aquí si no hay id_song
    }

    window.arr_temp = [];
    window.titulo_count = 0;
    arr_esquema_obj = [];

    obj_bloques = await getSongBlocks();
    let arr_esquema = Object.keys(obj_bloques);

    console.log('obj_bloques: ', obj_bloques);
    console.log('arr_esquema: ', arr_esquema);

    crear_esquema_song_bloques.innerHTML = '';//reset
    crear_esquema_wr_vista_btns.innerHTML = '';//reset
    crear_esquema_wr_vista_blocks.innerHTML = '';//reset
    crear_esquema_ul_action.innerHTML = '';//reset

    crear_esquema_ul_action.innerHTML = `
        <span class="sp_prim">Las opciones de acción se verán al añadir al menos un bloque de la canción al esquema nuevo...</span>    
        <li id="li_resetEsquema___" class="li_action" onclick="resetEsquema()">Reset</li>
        <li class="li_action" onclick="guardarEsquema()">Guardar</li>
        <li class="li_action" onclick="crearSlides(); closeAll()">Ver slides</li>
        <li class="li_action" onclick="guardarEsquema(); crearSlides(); closeAll()">Guardar + Ver slides</li>
    `;
    crear_esquema_ul_action.onclick = e => close_ul_action(e);

    resetBtnActive(eid_block_esquema_head);//reseteo btn_active de botones en el contenedor
    eid_block_esquema_head.querySelector('#btn_crear_esquema').classList.add('btn_active');
    pageActiveEsquema = 'crear_esquema';

    const sp_prim = document.createElement('span');
    sp_prim.className = 'sp_prim';
    sp_prim.innerHTML = `
        Haz clic en un bloque de la primera columna para añadirlo al esquema de la canción...
    `;

    crear_esquema_wr_vista_btns.append(sp_prim);
    crear_esquema_wr_vista_blocks.append(sp_prim.cloneNode(true));

    //Creo esquema de botones cortos actual
    crear_esquema_btns_actual();

    //Recorrer el bucle...
    arr_esquema.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo].slide;
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);

        const el_fieldset = slide_clone.querySelector('fieldset');

        
        el_fieldset.onclick = (e) => {
            console.log('(text) legend: ', e.currentTarget.querySelector('legend').innerText);
            
            if(titulo !== '_titulo_cancion_'){//no pinto el titulo de la cancion
                crear_esquema_wr_vista_btns.querySelector('.sp_prim')?.remove();
                crear_esquema_wr_vista_blocks.querySelector('.sp_prim')?.remove();
    
                const el_fieldset_cloned = e.currentTarget.cloneNode(true); // true para clonar también hijos 
                el_fieldset_cloned.classList.remove('fld_active');
                
                let titulo = el_fieldset_cloned.querySelector('legend').textContent;
                window.arr_temp.push(titulo);
    
                let titulo_orig = titulo;
                let titulo_text;
                let titulo_count_veces;
    
                //si el titulo que se añade es el mismo que el último añadido...
                if(titulo === window.arr_temp[window.arr_temp.length - 2]) {
                    //es titulo que se repite. calculo cuantas veces...
                    //alert('se repite');
                    window.titulo_count++;
                    
                    //no dejo repetir el bloque mas de 5 veces...
                    if(window.titulo_count >= 4){
                        return;
                    }
    
                    titulo_count_veces = titulo_count + 1;
                    console.log('titulo_count_veces: ', titulo_count_veces);
    
                    titulo_text = `${titulo} <span>x${titulo_count_veces}</span>`;
                    el_fieldset_cloned.querySelector('legend').innerHTML = titulo_text;
    
                    console.log('titulo_count: ', window.titulo_count);
    
                    crear_esquema_wr_vista_btns.lastElementChild?.remove();//elimino el anterior btn
                    crear_esquema_wr_vista_blocks.lastElementChild?.remove();//elimino el anterior bloque
                    arr_esquema_obj.pop();//elimino el último elemento del array
    
                }else{
                    //es nuevo titlulo
                    window.titulo_count = 0;
                    titulo_text = titulo;
                    titulo_count_veces = 1;
                }
    
                let idx_vista_prev = arr_esquema_obj.length;
    
                //creo boton del bloque
                const btn_close = document.createElement('button');
                btn_close.className = 'btn btn_close';
                btn_close.dataset.idx = i;
                btn_close.dataset.idx_esquema = idx_vista_prev;
                btn_close.dataset.titulo = titulo_orig;
                btn_close.innerHTML = `
                    <span class="sp_titulo">${titulo_text}</span>
                    <span class="sp_close">✕</span>
                `;
                btn_close.onclick = (e) => {
                    console.log('e.currentTarget: ', e.currentTarget);
                    console.log('e.target: ', e.target);
    
                    const element_legend = [...crear_esquema_song_bloques.querySelectorAll('legend')].find(el => el.textContent.trim() === e.currentTarget.dataset.titulo);
                    
                    const element_fieldset = element_legend.closest('fieldset');
                    resetFldActive(crear_esquema_song_bloques);
                    
                    element_fieldset.classList.add('fld_active');
                    element_fieldset.scrollIntoView({behavior: 'smooth'});
    
                    if(e.target.className === 'sp_close'){
                        //alert('voy a eliminar este boton...');
                        arr_esquema_obj.splice(e.currentTarget.dataset.idx_esquema, 1);
                        const vista_block_to_remove = [...crear_esquema_wr_vista_blocks.querySelectorAll('fieldset')].find(el => el.dataset.idx_esquema === e.currentTarget.dataset.idx_esquema);
                        vista_block_to_remove?.remove();
                        e.currentTarget.remove();
    
                        if(arr_esquema_obj.length === 0){
                            //si no hay bloques, oculto los botones de acción
                            crear_esquema_ul_action.innerHTML = '...';
                        }
                    }
                }

                //si es vacio, añado _titulo_cancion_ al principio
                if(arr_esquema_obj.length == 0){
                    const obj_titulo = {
                        nombre: '_titulo_cancion_',
                        veces: 1
                    }
                    
                    arr_esquema_obj.push(obj_titulo); 
                    console.log('(con _titulo_cancion_) --- arr_esquema_obj: ', arr_esquema_obj);
                }

    
                const obj_titulo = {
                    nombre: titulo,
                    veces: titulo_count_veces
                }
                
                arr_esquema_obj.push(obj_titulo); 
                console.log('arr_esquema_obj: ', arr_esquema_obj);
    
                el_fieldset_cloned.dataset.idx_esquema = idx_vista_prev;
    
                crear_esquema_wr_vista_blocks.append(el_fieldset_cloned);
                el_fieldset_cloned.scrollIntoView({behavior: 'smooth'});
    
                crear_esquema_ul_action.innerHTML = `
                    <li id="li_resetEsquema" class="li_action" onclick="resetEsquema()">Reset</li>
                    <li class="li_action" onclick="guardarEsquema()">Guardar</li>
                    <li class="li_action" onclick="crearSlides(); closeAll()">Ver slides</li>
                    <li class="li_action" onclick="guardarEsquema(); crearSlides(); closeAll()">Guardar + Ver slides</li>
                `;
                crear_esquema_ul_action.onclick = e => close_ul_action(e);
    
                crear_esquema_wr_vista_btns.append(btn_close);
            }
    
        }// end onclick
        
        crear_esquema_song_bloques.append(slide_clone.querySelector('fieldset'));
        
    });

    pintParrafosAcordes();//para pintar barras de acordes como mas finas
    mySizeEsquema();
}



async function select_slide(){
    console.log('=== function select_slide() ===');

    if(!hay_id_song('select_slide()')){
        mySizeEsquema();
        return; // <- se detiene aquí si no hay id_song
    }

    console.log('obj_bloques esta vacio, lo creo...');
    obj_bloques = await getSongBlocks();

    console.log('obj_bloques: ', obj_bloques);

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);
    
    select_slide_song_bloques.innerHTML = '';//reset
    select_slide_wr_vista_btns.innerHTML = '';//reset
    eid_contenedor_prev_inner.innerHTML = '';//reset
    select_slide_ul_action.innerHTML = '';//reset
    
    arr_fieldsets = [];//reset
    currentSlide = 0;//aki siempre para con click dcho empezar desde inicio de canción

    check_pantallaShow();//reviso si marco en rojo o no
    
    resetBtnActive(eid_block_esquema_head);//reseteo btn_active de botones en el contenedor
    eid_block_esquema_head.querySelector('#btn_select_slide').classList.add('btn_active');
    pageActiveEsquema = 'select_slide';


    // Recorrer el bucle - btns y vista...
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo].slide;//bd
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);

        
        //Clono fieldset del bloque para añadirlo en la parte izda
        const el_fieldset_cloned = slide_clone.querySelector('fieldset').cloneNode(true); // true para clonar también hijos
        console.log('el_fieldset_cloned: ', el_fieldset_cloned);        

        let titulo_orig = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.nombre : titulo ;
        let titulo_text = titulo_orig;
        console.log('titulo_text: ', titulo_text); 
        
        let titulo_count_veces = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.veces : 1 ;
        console.log('before --- titulo_count_veces: ', titulo_count_veces); 
        
        if(titulo_count_veces > 1){//si hay repeticion del titulo
            titulo_text = `${titulo_text} <span>x${titulo_count_veces}</span>`;
        }
        console.log('after --- titulo_text: ', titulo_text); 

        el_fieldset_cloned.dataset.titulo = titulo_orig;
        el_fieldset_cloned.dataset.idx = i;
        el_fieldset_cloned.querySelector('legend').innerHTML = titulo_text;//pongo el titulo en el bloque
        el_fieldset_cloned.onclick = (e) => {
            console.log('e.currentTarget: ', e.currentTarget);
            console.log('e.target: ', e.target);

            const index_esquema = e.currentTarget.dataset.idx;
            console.log('index_esquema: ', index_esquema);
            
            // showOneSlideFrom(e.currentTarget);
            showOneSlideFrom(e.currentTarget, index_esquema);
        }

        //Creo boton del bloque sin poder cerrarlo con 'X'
        const btn_simple = document.createElement('button');
        btn_simple.className = 'btn btn_simple';
        btn_simple.dataset.titulo = titulo_orig;
        btn_simple.dataset.idx = i;
        btn_simple.innerHTML = `
            <span class="sp_titulo">${titulo_text}</span>
        `;
        btn_simple.onclick = (e) => {
            console.log('e.currentTarget: ', e.currentTarget);
            console.log('e.target: ', e.target);

            const index_esquema = e.currentTarget.dataset.idx;
            console.log('index_esquema: ', index_esquema);
            
            // showOneSlideFrom(e.currentTarget);
            showOneSlideFrom(e.currentTarget, index_esquema);
        }

        arr_fieldsets.push(el_fieldset_cloned);
        console.log('crearSlides() --- arr_fieldsets: ', arr_fieldsets);
        
        //añado al DOM
        select_slide_song_bloques.append(el_fieldset_cloned);
        select_slide_wr_vista_btns.append(btn_simple);
    });

    select_slide_ul_action.innerHTML = `
        <li class="li_action" onclick="crearSlides();">Crear slides (Inicio)</li>
        <li class="li_action" onclick="crearSlides(); closeAll();">Crear + Ver slides (inicio)</li>
    `;
    select_slide_ul_action.onclick = e => close_ul_action(e);
    
    pintParrafosAcordes();//para pintar barras de acordes como mas finas
    mySizeEsquema();
}


function ajustarTextoContenedor(contenedor) {
    if (!contenedor) return;

    console.log('=== ajustarTextoContenedor ===');
    console.log('contenedor:', contenedor);

    const maxW = contenedor.clientWidth;
    const maxH = contenedor.clientHeight;
    if (maxW <= 0 || maxH <= 0) return;

    const coef_legend = 0.6;
    const legend_fontSize_max = 25;
    const legend = contenedor.querySelector('legend');

    let fontSizeMin = 16;//para legend
    let fontSize = 16; // Iniciar desde 1 para evitar error inicial

    // Caja oculta para medir
    const box = document.createElement('div');
    box.style.position = 'absolute';
    box.style.left = '-10000px';
    box.style.top = '0';
    box.style.visibility = 'hidden';
    box.style.width = maxW + 'px';
    box.style.boxSizing = 'border-box';
    document.body.appendChild(box);

    // Clon a medir dentro de la caja
    // const clone = contenedor.querySelector('.wr_full_block_inner').cloneNode(true);
    const clone = contenedor.querySelector('#contenedor_prev_inner').cloneNode(true);
    clone.style.margin = '0';
    clone.style.position = 'static';
    box.appendChild(clone);

    // Bucle para ajustar fontSize
    while (fontSize <= 100) {
        clone.style.fontSize = fontSize + 'px';
        //console.log('pongo fontSize: ', fontSize);

        const { width, height } = clone.getBoundingClientRect();
        //console.log('clone width: ', width);
        //console.log('clone height: ', height);

        if (width > maxW || height > maxH) {
            //console.log('break fontSize: ', fontSize);
            break;
        }

        // Comprobamos overflow
        if (clone.scrollWidth > maxW || clone.scrollHeight > maxH) {
            //console.log('overflow break. fontSize: ', fontSize);           
            
            //fontSize -= 3;
            break;
        }

        fontSize++;
        //console.log('aumento. fontSize: ', fontSize);//debuguear  
        //contenedor.style.fontSize = fontSize + 'px';//debuguear
    }

    fontSize -= 3;//reduzco un poco para que no llegue al borde

    // Aplicar al contenedor real
    contenedor.querySelector('fieldset').style.fontSize = fontSize + 'px';
    //console.log('contenedor fieldset. fontSize: ', fontSize);  
    
    //por ahora dejo siempre igual legend
    legend.style.fontSize = fontSizeMin + 'px';//16px minimo para legend

    // Eliminar clon de prueba
    document.body.removeChild(box);
}


async function guardarEsquema(){
    console.log('=== function guardarEsquema() ===');

    id_song = objSong.id_song;
    console.log('id_song: ', id_song);

    if(!id_song){
        alert('id_song no está indicado... hago return.');
    }

    objSong.arr_esquema = arr_esquema_obj;

    const data = await insertarSongDatos(objSong);
    console.log('data: ', data);

    if(data.success){
        
        let text_show;

        switch (data.action_tipo) {
            case 'is_update_arr_esquema_ok':
                text_show = 'El esquema ha sido actualizado con éxito.';
                break;
        
            case 'is_update_arr_esquema_vacio':
                text_show = 'El esquema VACÍO ha sido actualizado con éxito.';
                break;
        
            case 'is_insert_arr_esquema_ok':
                text_show = 'El esquema ha sido añadido con éxito.';
                break;
        
            case 'is_insert_arr_esquema_vacio':
                text_show = 'El esquema VACÍO ha sido añadido con éxito.';
                break;
                
            default:
                text_show = '1. Aquí texto de resultado de guardar...';
                break;
        }
        console.log(text_show);

        showToast('ok', text_show, 5000);

        if(data.id_song){
            console.log('id_song: ', data.id_song);
            id_song = data.id_song;//guardo el id de la canción recién creada

            //Cojo datos de la song de la lista desde BD
            objSong = await getDataSongFromBd();//IMPORTANTE para cojer todos los datos necesarios
            console.log('objSong: ', objSong);

            const itemSongUpdate = objDataSongs.arr_data?.find(item => item.id_song == id_song);
            if (itemSongUpdate) {
                Object.assign(itemSongUpdate, objSong);
                // el objeto dentro de arr_data ya está actualizado
            } else {
                console.warn('No encontrado objSong.id_song en objDataSongs.arr_data');
            }

            //editar_song();

            //Actualizo tr_song 
            pintSongActiveSoloDatos();//en la ventana a la derecha de la tabla de lista
        }
        
    }else{
        console.log(`Error al guardar canción.`);            
        console.error('data.error: ',data.error);

        let text_show = 'Error al guardar la esquema.';

        showToast('error', text_show, 5000);
    }

    crearSlides();
    crear_esquema_btns_actual();//actualizo los botones de esquema actual
}

function resetEsquema(){
    crear_esquema_wr_vista_btns.innerHTML = '';//reset
    crear_esquema_wr_vista_blocks.innerHTML = '';//reset
    crear_esquema_ul_action.innerHTML = 'gggggggggggg';//reset
    
    arr_esquema_obj = [];
    if(objSong.arr_esquema.length > 0){
        objSong.arr_esquema = [];
    }
    
    // crear_esquema_ul_action.innerHTML = `
    //     <span class="sp_prim">Esquema reseteada.</span>
    //     <span class="sp_prim">Haz clic en un bloque de la primera columna para añadirlo al esquema de la canción...</span>
    // `;


    crear_esquema_ul_action.onclick = e => close_ul_action(e);

    const aviso_outer = document.createElement('div');
    aviso_outer.className = 'aviso_outer';
    aviso_outer.innerHTML = `
        <p class="p_aviso">Esquema reseteada.</p>
        <p class="p_aviso">Haz clic en un bloque de la primera columna para añadirlo al esquema de la canción...</p>
    `;
    openModal('center','Aviso Reset Esquema',aviso_outer,'showAviso2');
}


function resetBlockBuscar(){
    console.log('=== function resetBlockBuscar() ===');

    eid_block_buscar.querySelector('.vista_song_content').innerHTML = '(Aquí se mostrará el texto de la canción...)';//reset

    id_song = null;
    resetTrSelected(tbody);//reseteo tr_selected de tbody
}

function resetBlockEsquema(){
    console.log('=== function resetBlockEsquema() ===');

    resetBlockEsquemaSoloHTML();

    arr_esquema_obj = [];
    id_song = null;
}

function resetBlockEsquemaSoloHTML(){
    console.log('=== function resetBlockEsquema() ===');

    resetBtnActive(eid_block_esquema_head);//reseteo btn_active de botones en el contenedor

    //eid_block_esquema.querySelector('.song_bloques').innerHTML = '...';//reset
    ver_esquema_song_bloques.innerHTML = '...';//reset
    crear_esquema_song_bloques.innerHTML = '...';//reset
    select_slide_song_bloques.innerHTML = '...';//reset

    //eid_block_esquema.querySelector('.wr_vista_btns').innerHTML = '...';//reset
    ver_esquema_wr_vista_btns.innerHTML = '...';//reset
    crear_esquema_wr_vista_btns.innerHTML = '...';//reset
    select_slide_wr_vista_btns.innerHTML = '...';//reset

    //eid_block_esquema.querySelector('.wr_vista_blocks').innerHTML = '...';//reset
    ver_esquema_wr_vista_blocks.innerHTML = '...';//reset
    crear_esquema_wr_vista_blocks.innerHTML = '...';//reset
    eid_contenedor_prev_inner.innerHTML = '...';//reset

    ver_esquema_ul_action.innerHTML = '...';//reset
    crear_esquema_ul_action.innerHTML = '...';//reset
    select_slide_ul_action.innerHTML = '...';//reset
    
    crear_esquema_wr_vista_btns_actual.innerHTML = '...';//reset
}

function resetBlockCancion(){
    console.log('=== function resetBlockCancion() ===');

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor

    cancion_song_bloques.innerHTML = '...';//muestro '...'
    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_ul_action.innerHTML = '...';//reset  
}

function resetBlockEjemplo(){
    console.log('=== function resetBlockEjemplo() ===');

    resetBtnActive(eid_block_ejemplo_head);//reseteo btn_active de botones en el contenedor

    ejemplo_song_bloques.innerHTML = '...';//muestro '...'
    ejemplo_wr_vista_blocks.innerHTML = '...';//reset
    ejemplo_ul_action.innerHTML = '...';//reset  
}

function resetBlockLista(){
    console.log('=== function resetBlockLista() ===');

    resetBtnActive(eid_block_lista_head);//reseteo btn_active de botones en el contenedor

    lista_ul_action.innerHTML = '...';//reset  
    lista_vista_lista_content.innerHTML = '...';//reset  
    
    //se resetean en deleteLista()
    //id_lista = null;
    //arr_lista = [];//reset

    resetTrSelected(tbody_lista);//reseteo tr_selected de tbody_lista

    console.log('end func');
}


async function guardarSong(event, id_contenedor, cancion_action){
    console.log('=== function guardarSong() ===');
    event.preventDefault();

    const contenedor = document.getElementById(id_contenedor);

    if(!contenedor){
        alert('no hay contenedor de form. hago return...');
        return;
    }

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `<span>${obj_lang.d315}</span>`;//Si no aceptas cookies no puedes crear una cuenta.
        //     aviso_text += ` <a onclick="showBlockCookies(); closeModal(null,true);">${obj_lang.d316}</a>.`;//Seleccionar Coockies
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        const form = contenedor.querySelector("form");

        let title = form.elements["title"].value.trim();
        let category = form.elements["category"].value.trim();
        let songbook = form.elements["songbook"].value.trim();
        let song_number = form.elements["song_number"].value.trim();
        let tune = form.elements["tune"].value.trim();
        let lang = form.elements["lang"].value.trim();
        let song_text = form.elements["song_text"].value.trim();
        let notes = form.elements["notes"].value.trim();
    
        let errors = [];

        if(title == ''){
            errors.push('título');
        }
        if(song_text == ''){
            errors.push('texto de la canción');
        }
        if(lang == ''){
            errors.push('idioma de la canción');
        }
        // if(!validarEmail(email)){
        //     errors.push(obj_lang.d278);//El email no es válido.
        // }
        // if(!validarPassword(password)){
        //     errors.push(obj_lang.d279);//La contraseña no es válida. Debe tener al menos 6 carácteres.
        // }        
        if(errors.length > 0){
            let error_text = '';
            errors.forEach(error => {
                error_text += ' - ' + error + '<br>';
            });            
            form.querySelector('.mensaje').innerHTML = `<span class="add_result add_error">Por favor, introduce: <br> ${error_text}</span>`;
            // cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
            contenedor.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
            return;
        }
        
        let arr_esquema_guardar = '';

        if(arr_esquema_obj.length > 0){
            console.log('cojo arr_esquema creado nuevo');
            arr_esquema_guardar = arr_esquema_obj;//neuvo arr
        }else{
            //si hay id_song y cancion se edita
            if(id_song && objSong.arr_esquema){
                console.log(' cojo arr_esquema de cancion bd');
                arr_esquema_guardar = objSong.arr_esquema;//de bd
            }else{//se crea nueva cancion con arr_esquema vacio
                console.log(' meto arr_esquema vacio ya que se crea una nueva canción');
                arr_esquema_guardar = [];//vacio
            }
        }
        console.log('arr_esquema_guardar: ', arr_esquema_guardar);

        const objSongToSend = {
            id_song: id_song || null, //ya que se añade una nueva canción, no hay id_song
            song_number: song_number,
            title: title,
            arr_esquema: arr_esquema_guardar, //o '' o arr //new
            category: category,
            songbook: songbook,
            tune: tune,
            lang: lang,
            song_text: song_text,
            notes: notes,
        }
        console.log('objSongToSend: ',objSongToSend);
    
        const data = await insertarSongDatos(objSongToSend);
        console.log('data: ',data);
    
        if(data.success){
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_arr_esquema_ok':
                    text_show = 'Datos de la Canción y su Esquema han sido actualizados con éxito.';
                    break;
            
                case 'is_update_arr_esquema_vacio':
                    text_show = 'Datos de la Canción (SIN SU ESQUEMA) han sido actualizados con éxito.';
                    break;
            
                case 'is_insert_arr_esquema_ok':
                    text_show = 'Datos de la Canción y su Esquema han sido añadidos con éxito.';
                    break;
            
                case 'is_insert_arr_esquema_vacio':
                    text_show = 'Datos de la Canción (SIN SU ESQUEMA) han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '1. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log(text_show);
    
            form.querySelector('.mensaje').innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
            //contenedor.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

            showToast('ok', text_show, 5000);

            if(data.id_song){
                console.log('id_song: ', data.id_song);
                id_song = data.id_song;//guardo el id de la canción recién creada

                //Cojo datos de la song de la lista desde BD
                objSong = await getDataSongFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objSong: ', objSong);

                const itemSongUpdate = objDataSongs.arr_data?.find(item => item.id_song == id_song);
                if (itemSongUpdate) {
                    Object.assign(itemSongUpdate, objSong);
                    // el objeto dentro de arr_data ya está actualizado
                } else {
                    console.warn('No encontrado objSong.id_song en objDataSongs.arr_data');
                }

                form.elements['id_song'].disabled = true;//deshabilito input id_song   
                form.elements['id_song'].value = id_song;

                //si guardo desde el modal, recargo datos de song en el block activo
                // if(contenedor.id == 'bl_modalFullInner' && cancion_song_bloques.querySelector('form')){
                //     alert('voy a actualizar con buildFormCancion()...');
                //     buildFormCancion(cancion_song_bloques, 'editar');//siempre 'editar'!!!
                // }
                editar_song();

                //Actualizo tr_song 
                pintSongActiveSoloDatos();//en la ventana a la derecha de la tabla de lista
            }
           
        }else{
            console.log(`Error al guardar canción.`);            
            console.error('data.error: ',data.error);

            let text_show = 'Error al guardar la canción.';
    
            form.querySelector('.mensaje').innerHTML = `<span class="add_result add_error">${text_show}</span>`;
            //contenedor.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

            showToast('error', text_show, 5000);
        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarSong. error: ',error);
    }

}

async function deleteSong(event, id_contenedor){
    console.log('=== function deleteSong() ===');
    event.preventDefault();

    const contenedor = document.getElementById(id_contenedor);

    if(!contenedor){
        alert('no hay contenedor de form. hago return...');
        return;
    }

    try {
    
        id_song = objSong.id_song;
        console.log('id_song: ', id_song);

        if(!id_song){
            alert('id_song no está indicado... hago return.');
        }

        const respuesta = confirm(`¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE la canción con los siguientes datos? \nID: ${id_song} \ntítulo: '${objSong.title}' \n\nEsta acción no se podrá deshacer.`);
        if(respuesta){
            console.log('sigo adelante para eliminar la canción...'); //clic en "Aceptar"
        } else {
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        const data = await deleteSongFromBd();
        console.log('data: ',data);

        const form = contenedor.querySelector("form");

        if(data.success){
            
            let text_show;
            text_show = 'Canción eliminada con éxito.';
            console.log(text_show);

            form.querySelector('.mensaje').innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
            contenedor.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

            showToast('ok', text_show, 5000);

            if(data.id_song){
                console.log('id_song: ', data.id_song);

                //Elimino elemento tr de la tabla tbody con la cancion eliminada
                tbody.querySelector(`.tr_song[data-id="${id_song}"]`).remove();

                form.elements['id_song'].disabled = true;//deshabilito input id_song   
                form.elements['id_song'].value = id_song;

                resetBlockBuscar();
                resetBlockEsquema();

                pintLineasXinBlock(eid_block_cancion);
                form.querySelector('.wr_btns_eliminar').remove();//elimino botones de 'eliminar'

                cancion_ul_action.innerHTML = `
                    <p class="prim bg_red">Canción eliminada</p>
                    <li class="li_action" onclick="showBlockName('buscar');">Buscar</li>
                `;
                cancion_ul_action.onclick = e => close_ul_action(e);

                id_song = null;
                objSong = {};//reseteo objeto song

                setTimeout(()=>{
                    const aviso_outer = document.createElement('div');
                    aviso_outer.className = 'aviso_outer';
                    aviso_outer.innerHTML = `
                    <p class="p_aviso">${text_show}</p>
                    <p class="p_aviso">Busca una canción según tus criterios en la pestaña <b>Buscar</b>.</p>
                    <button id="btn_lista" class="btn btn_big w_100" onclick="closeModal(null,true); showEdit('buscar');">Buscar</button>
                    `;
                    openModal('center','Aviso Eliminar Canción',aviso_outer,'showAviso2');
                }, 1000);
            }
            
        }else{
            console.log(`Error al eliminar la canción.`);
            
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_show = 'Error al eliminar la canción.';

            form.querySelector('.mensaje').innerHTML = `<span class="add_result add_error">${text_show}</span>`;
            contenedor.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

            showToast('ok', text_show, 5000);
        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteSong. error: ',error);        
    }

}



async function guardarLista(event){
    console.log('=== function guardarLista() ===');
    if(event){
        console.log('hay event. no lo propago...')
        event.preventDefault();
    }

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `<span>${obj_lang.d315}</span>`;//Si no aceptas cookies no puedes crear una cuenta.
        //     aviso_text += ` <a onclick="showBlockCookies(); closeModal(null,true);">${obj_lang.d316}</a>.`;//Seleccionar Coockies
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        const form_lista = document.getElementById('form_lista');
        const form_mensaje_lista = form_lista.querySelector('form .mensaje');

        let title = form_lista.querySelector('#title').value.trim();
        let fecha = form_lista.querySelector('#fecha').value;
        let notes = form_lista.querySelector('#notes').value.trim();
    
        let errors = [];

        if(title == ''){
            errors.push('título de la lista');
        }
        if(fecha == ''){
            errors.push('fecha del evento');
        }
       
        if(errors.length > 0){
            let error_text = '';
            errors.forEach(error => {
                error_text += ' - ' + error + '<br>';
            });            
            form_mensaje_lista.innerHTML = `<span class="add_result add_error">Por favor, introduce: <br> ${error_text}</span>`;
            form_lista.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
            return;
        }

        //Creo array de solo ids de canciones. si arr_lista es vacío, retorna arr_lista_ids vacío
        arr_lista_ids = arr_lista.map(item => parseInt(item.id_song));
        console.log('arr_lista_ids: ', arr_lista_ids);


        let arr_lista_ids_str;//debe ser string ya se mete en la bd como string

        if(id_lista == null){
            console.log('es lista NUEVA');
            arr_lista_ids_str = JSON.stringify(arr_lista_ids);

            if(arr_lista.length == 0){
                console.log('es lista NUEVA y el array está vacío');
            }else{
                console.log('es lista NUEVA y el array está lleno');
            }

        }else{
            console.log('es lista EDITADA');
            if(esString(objLista.arr_lista)){
                arr_lista_ids_str = JSON.stringify(JSON.parse(objLista.arr_lista).map(item => parseInt(item.id_song)));
            }else{
                arr_lista_ids_str = JSON.stringify(objLista.arr_lista.map(item => parseInt(item.id_song)));
            }

            if(objLista.arr_lista.length == 0){
                console.log('es lista EDITADA y el array está vacío');
            }else{
                console.log('es lista EDITADA y el array está lleno');
            }
        }

        console.log('arr_lista_ids_str: ', arr_lista_ids_str);

        const objListaToSend = {
            id_lista: id_lista || null, //ya que se añade una nueva lista, no hay id_lista
            title: title,
            arr_lista_ids: arr_lista_ids_str, //como STRING siempre aki
            fecha: fecha,
            fecha_ver: convertirFecha(fecha, 'ver','/'),
            notes: notes,
        }
        console.log('objListaToSend: ',objListaToSend);
    
        const data = await insertarListaDatos(objListaToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_arr_lista_ok':
                    text_show = 'Datos de la Lista y sus canciones han sido actualizados con éxito.';
                    break;
            
                case 'is_update_arr_lista_vacio':
                    text_show = 'Datos de la Lista (SIN CANCIONES) han sido actualizados con éxito.';
                    break;
            
                case 'is_insert_arr_lista_ok':
                    text_show = 'Datos de la Lista y sus canciones han sido añadidos con éxito.';
                    break;
            
                case 'is_insert_arr_lista_vacio':
                    text_show = 'Datos de la Lista (SIN CANCIONES) han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log(text_show);
    
            form_mensaje_lista.innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
            //form_lista.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
            
            showToast('ok', text_show, 5000);

            setTimeout(()=>{
                form_mensaje_lista.innerHTML = `
                    <span class="sp_id">
                        <span>Id: <b class="c_green">${data.id_lista}</b></span>
                        <span><b class="guardado">GUARDADO</b></span>
                    </span>
                `;
            }, 2000);
            setTimeout(()=>{
                form_mensaje_lista.querySelector('.guardado')?.remove();
            }, 4000);

            if(data.id_lista){
                console.log('id_lista: ', data.id_lista);
                id_lista = data.id_lista;//guardo el id de la canción recién creada

                //Cojo datos de la lista desde BD
                objLista = await getDataListaFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objLista: ', objLista);

                const itemListaUpdate = objDataListas.arr_data?.find(item => item.id_lista == id_lista);
                if (itemListaUpdate) {
                    Object.assign(itemListaUpdate, objLista);
                    // el objeto dentro de arr_data ya está actualizado
                } else {
                    console.warn('No encontrado objlista.id_lista en objDatalistas.arr_data');
                }

                //Actualizo tr_lista 
                pintListaActiveSoloDatos();

                form_lista.querySelector('#btn_ResetForm').removeAttribute('type');
                form_lista.querySelector('#btn_ResetForm').onclick = (e) => {
                    e.preventDefault();
                    
                    //pinto datos de bd
                    form_lista.querySelector('#title').value = objLista.title;
                    form_lista.querySelector('#fecha').value = objLista.fecha;
                    form_lista.querySelector('#notes').value = objLista.notes;
                }
            }
           
        }else{
            console.log(`Error al añadir la lista.`);
            
            //"Error al añadir la lista.";
            console.error('data.error: ', data.error);

            let text_show = 'Error al añadir la lista.';
    
            form_mensaje_lista.innerHTML = `<span class="add_result add_error">${text_show}</span>`;
            //form_lista.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

            showToast('error', text_show, 5000);
        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarLista. error: ',error);
    }

}

async function deleteLista(){
    console.log('=== function deleteLista() ===');

    try {

        id_lista = objLista.id_lista;
        console.log('id_lista: ', id_lista);

        if(!hay_id_lista('deleteLista()')){
            return; // <- se detiene aquí si no hay id_song
        } 


        if(!id_lista){
            alert('id_lista no está indicado... hago return.');
            return;
        }

        const respuesta = confirm(`¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE la lista con los siguientes datos? \nID: ${id_lista} \ntítulo: '${objLista.title}' \n\nEsta acción no se podrá deshacer.`);
        if(respuesta){
            console.log('sigo adelante para eliminar la lista...'); //clic en "Aceptar"
        } else {
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        const data = await deleteListaFromBd();
        console.log('data: ',data);

        const contenedor_lista_sm = document.getElementById('contenedor_lista_sm');
        const p_mensaje = document.createElement('p');
        p_mensaje.className = 'mensaje';

        if(data.success){
            
            let text_show;
            text_show = 'Lista eliminada con éxito.';
            console.log(text_show);

            p_mensaje.innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
            contenedor_lista_sm.prepend(p_mensaje);
            contenedor_lista_sm.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje


            if(data.id_lista){
                console.log('id_lista: ', data.id_lista);

                //Elimino elemento tr de la tabla tbody con la cancion eliminada
                tbody_lista.querySelector(`.tr_lista[data-id="${id_lista}"]`).remove();

                resetBlockLista();
                contenedor_lista_sm.querySelector('.wr_btns_eliminar').remove();
                contenedor_lista_sm.querySelector('.d_canciones_lista').remove();

                id_lista = null;
                objLista = {};//reseteo objeto lista
                arr_lista = [];//reseteo array lista

                setTimeout(()=>{
                    const aviso_outer = document.createElement('div');
                    aviso_outer.className = 'aviso_outer';
                    aviso_outer.innerHTML = `
                    <p class="p_aviso">${text_show}</p>
                    <p class="p_aviso">Busca una lista según tus criterios en la pestaña <b>Lista</b>.</p>
                    <button id="btn_lista" class="btn btn_big w_100" onclick="closeModal(null,true); showEdit('lista');">Buscar Lista</button>
                    `;
                    openModal('center','Aviso Eliminar Lista',aviso_outer,'showAviso2');
                }, 1000);
            }
            
        }else{
            console.log(`Error al eliminar la lista.`);
            
            //"Error al eliminar la lista";
            console.error('data.error: ', data.error);

            let text_show = 'Error al eliminar la lista.';

            p_mensaje.innerHTML = `<span class="add_result add_error">${text_show}</span>`;
            contenedor_lista_sm.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

            showToast('ok', text_show, 5000);
        }
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteSong. error: ',error);        
    }

}




function pintLineasXinBlock(contenedor){
    console.log('=== function pintLineasXinBlock() ===');
    
    const bloques_outerAll = contenedor.querySelectorAll('.bloques_outer');
    bloques_outerAll.forEach(el => {
        el.classList.add('datos_eliminados');//añado lineas rojas en forma de 'X'
    });
}

function resetLineasXinBlock(contenedor){
    console.log('=== function pintLineasXinBlock() ===');
    
    const bloques_outerAll = contenedor.querySelectorAll('.bloques_outer');
    bloques_outerAll.forEach(el => {
        el.classList.remove('datos_eliminados');//quito lineas rojas en forma de 'X'
    });
}



function resetFldActive(contenedor){
    contenedor.querySelectorAll('fieldset').forEach(el => {
        el.classList.remove('fld_active');
    });
}

function resetBtnActive(contenedor){
    contenedor.querySelectorAll('.btn').forEach(el => {
        el.classList.remove('btn_active');
    });
}

function resetTrSelected(contenedor){
    contenedor.querySelectorAll('tr').forEach(el => {
        el.classList.remove('selected');
    });
}

function resetPListaActive() {
    document.querySelectorAll('.p_lista').forEach(p => {
        p.classList.remove('active');
    });
}

function contieneSoloAcordes(str) {// busca ÚNICAMENTE: acordes, barras
    //const regexAcorde = /^(?:\s*\|?\s*[A-H](#|b)?(m|maj7|m7|7|sus|sus2|sus4|dim|aug|add9|2|4|6|9|11|13)?(\/[A-H](#|b)?)?\s*\|?)*$/;
    const regexAcorde = /^(?:\s*[|()\-\s]*[A-H](#|b)?(m|maj7|m7|7|sus|sus2|sus4|dim|dim7|aug|add9|2|4|6|9|11|13)?(\/[A-H](#|b)?)?[|()\-\s]*)*$/;
;
    //'|D      |F#m |G  |G - (Cm7) |' => true;
    //'| Вступ |Dm  |G  |C         |' =>  false (palabra 'Вступ' no es acorde) 
    return regexAcorde.test(str.trim());
}

function contieneAcordes(str) {// busca CUALQUIER acorde , barra y texto
    const regexAcorde = /\b[ABCDEFGH](#|b)?(m|maj7|m7|7|sus|sus2|sus4|dim|dim7|aug|add9|2|4|6|9|11|13)?(\/[ABCDEFGH](#|b)?)?\b/g;
    //'|D      |F#m |G  |G  |'  => true;
    //'| Вступ |Dm  |G  |C  |' =>  true (aunque hay palabra 'Вступ' que no es acorde en el texto hay al menos un acorde) 
    return regexAcorde.test(str);
}

function contieneSoloPuntos(str) {
    const regexPuntos = /^[\s|·.]*$/;// busca ÚNICAMENTE: 'espacios', '|', '·' o '.' repetidos las veces que sean, incluso ninguna (cadena vacía).
    return regexPuntos.test(str.trim());
}

function contienePuntos(str) {
    const regexPuntos = /[·|.]/;// busca CUALQUIER punto medio '·', punto normal '.', '|' barra
    return regexPuntos.test(str.trim());
}

function contieneSoloNota(str) {// antes del '(' pueden haber espacios ' ' y guiones '-'. ej.: '--- (texto nota) ---'
  const regex = /^\s*[-\s]*\(\s*.*\s*\)[-\s]*\s*$/;// busca ÚNICAMENTE cualquier palabra dentro de '()';// '     (modulación +2)     '
  return regex.test(str);
}


function showEdit(blockName = null){
    console.log('=== function showEdit() ===');

    eid_edit_contenido.classList.add('shown');

    if(!blockName){
        console.log('no hay blockName, por defecto pongo editar');
        blockName = 'buscar'; //por defecto
    }
    console.log('blockName: ', blockName);

    showBlockName(blockName);

    mySizeEdit();
}

function showOnlyBlock(blockName){
    ecl_edit_body.querySelectorAll('.bl_body .edit_blocks').forEach(bl =>{
        if(bl.id == `block_${blockName}`){//'block_buscar', 'block_cancion', etc...
            bl.classList.remove('d-none');
            bl.classList.add('d-block');
        }else{
            bl.classList.remove('d-block');
            bl.classList.add('d-none');
        }
    });
}

function showBlockName(blockName){
    console.log('=== function showBlockName() ===');

    ecl_edit_body.querySelectorAll('.bl_head div.dbtn').forEach(dbtn =>{
        if(dbtn.dataset.block_name == blockName){
            dbtn.classList.add('dbtn_active');            
            dbtn.scrollIntoView({behavior: 'smooth'});//hago scroll al boton         
        }else{
            dbtn.classList.remove('dbtn_active');
        }
    });

    const bl_titulo = ecl_edit_head.querySelector('.bl_titulo');

    switch (blockName) {
        default:
        case 'buscar':
            bl_titulo.textContent = 'Buscar canción';
            showOnlyBlock(blockName);
            if(!id_song){//nueva o no hay selecionada id_song
                if(mostrarPrim){
                    mostrarElementosPrimEn(buscar_option_inner);
                }else{
                    ocultarElementosPrimEn(buscar_option_inner);
                }
                ocultarElementosEditablesEn(buscar_option_inner);
            }else{
                ocultarElementosPrimEn(buscar_option_inner);
                mostrarElementosEditablesEn(buscar_option_inner);
            }
            mySizeBuscar();
            break;
        
        case 'esquema':
            bl_titulo.textContent = 'Esquema de la canción';
            showOnlyBlock(blockName);
            if(!id_song){//nueva o no hay selecionada id_song
                mostrarElementosPrimEn(esquema_option_inner);
                ocultarElementosEditablesEn(esquema_option_inner);
            }else{
                ocultarElementosPrimEn(esquema_option_inner);
                mostrarElementosEditablesEn(esquema_option_inner);
            }
            if(id_song && !pageActiveEsquema){
                ver_esquema();
            }
            mySizeEsquema();
            break;
    
        case 'cancion':
            bl_titulo.textContent = 'Crear / Editar canción';
            showOnlyBlock(blockName);
            if(!id_song){//nueva o no hay selecionada id_song
                if(mostrarPrim){
                    mostrarElementosPrimEn(cancion_option_inner);
                }else{
                    ocultarElementosPrimEn(cancion_option_inner);
                }
                ocultarElementosEditablesEn(cancion_option_inner);
            }else{
                ocultarElementosPrimEn(cancion_option_inner);
                mostrarElementosEditablesEn(cancion_option_inner);
            }
            if(id_song && !pageActiveCancion){
                ver_song();
            }
            mySizeCancion();
            break;

        case 'ejemplo':
            bl_titulo.textContent = 'Ejemplo de canción';
            showOnlyBlock(blockName);
            //por defecto todo visible
            if(!pageActiveEjemplo){
                showEjemplo('ua');//por defecto -> ucraniano
            }
            mySizeEjemplo();
            break;

        case 'lista':
            bl_titulo.textContent = 'Buscar lista';
            showOnlyBlock(blockName);
            if(!id_lista){//nueva o no hay selecionada id_song
                if(mostrarPrim){
                    mostrarElementosPrimEn(lista_option_inner);
                }else{
                    ocultarElementosPrimEn(lista_option_inner);
                }
                ocultarElementosEditablesEn(lista_option_inner);
            }else{
                ocultarElementosPrimEn(lista_option_inner);
                mostrarElementosEditablesEn(lista_option_inner);
            }
            //por defecto todo visible
            mySizeLista();
            break;
    }
}

function hideEdit(){
    console.log('=== function hideEdit() ===');

    eid_edit_contenido.classList.remove('shown');
    mySizeEdit();
}

function mySizeEdit(){
    console.log('=== function mySizeEdit() ===');    
    
    let edit_body_h = 
      window.innerHeight 
    - ecl_edit_head.offsetHeight 
    ;

    console.log('edit_body_h: ', edit_body_h);    
    ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicat

    mySizeBuscar();
    mySizeEsquema();
    mySizeCancion();
    mySizeEjemplo();
    mySizeLista();
}




async function findWordsSong(){
    //console.log('=== async function findWordsSong() ===');
    console.time('time_findWordsNew');

    let words_input = eid_inpt_find.value.trim();
    let modo = eid_modo.value;
    let buscar_en = eid_buscar_en.value;
    //console.log('--- words_input: ', words_input);

    if(words_input == ''){
        console.log('1. no has introducido nada....');
        return;
    }

    // 1) Coger todos los checkbox marcados
    const checkboxes = eid_wr_sb_checkboxes.querySelectorAll('input[name="songbooks"]:checked');
    console.log('--- checkboxes: ', checkboxes);

    // 2) Meter los valores en un array
    let arr_songbooks_search = Array.from(checkboxes).map(cb => cb.value);
    console.log('Valores seleccionados. arr_songbooks_search:', arr_songbooks_search);
    
    //reasigno arr_words global
    if(words_input.includes(' ')){
        arr_words = words_input.split(' ');
    }else{
        arr_words = [words_input];
    }

    if(arr_words.length === 0){
        console.log('2. no has introducido nada....');
        return;
    }

    objFindParams.words_input = words_input;
    objFindParams.modo = modo;
    objFindParams.buscar_en = buscar_en;
    objFindParams.arr_songbooks_search = arr_songbooks_search;

    objDataSongsBd = await getDataSongsFromBdByFind(objFindParams);
    console.log('objDataSongsBd: ', objDataSongsBd);

    if(esObjeto(objDataSongsBd) && objDataSongsBd.arr_data.length > 0){
        console.log('hay coincidencias...');
        
        //Clono objeto
        objDataSongs = structuredClone(objDataSongsBd);
        console.log('objDataSongs: ', objDataSongs);

        tbody.innerHTML = '';//reset
        
        eid_titulo_tabla_song.querySelector('b').style.display = 'inline';
        eid_titulo_tabla_song.querySelector('b').textContent = objDataSongs.arr_data.length;        
        
        eid_sp_icon_filtro.classList.remove('d-none');//muestro el boton de filtro

        //Parametros para filtrar resultados de buscar
        const contenedor_filtro = eid_d_filter_results;
        const sp_icon_filtro = eid_sp_icon_filtro;
        const el_input = eid_inpt_filter;
        const selector_items = '.tr_song';//CLASES JUNTOS!. los elementos que se ocultarán, si no cumplen con el filtro
        const arr_spans = [
            '.td_id_song',    
            '.td_numero',    
            '.td_titulo',    
            '.td_esquema',    
            '.td_category',    
            '.td_songbook',    
            '.td_idioma',  
            '.td_tonalidad'
        ];//se buscará texto en cada elemento de estos span's
        addFilterListener(contenedor_filtro, sp_icon_filtro, el_input, selector_items, arr_spans);

        //Recorrer canciones encontradas...
        objDataSongs.arr_data.forEach((el, i, arr) => {
            //console.log('el: ', el);

            const tr_song = document.createElement('tr');
            tr_song.className = 'tr_song';
            tr_song.dataset.id = el.id_song;

            let hay_esquema_texto;

            //convierto arr_esquema (string) en array correcto
            if(esString(el.arr_esquema) && el.arr_esquema != ''){
                el.arr_esquema = JSON.parse(el.arr_esquema);
                hay_esquema_texto = `Sí (${el.arr_esquema.length})`;
            }else{
                el.arr_esquema = [];
                hay_esquema_texto = '';
            }
            console.log('(parseado) --- el.arr_esquema: ', el.arr_esquema);

            let category_name_text = '';
            if(el.category != 0 && el.category_name != null){
                //inportante en una linea
                category_name_text = `<span class="sp_number">${el.category}.</span> <span class="sp_name">${el.category_name}</span>`;
            }

            let songbook_title_text = '';
            if(el.songbook != 0 && el.songbook_title != null){
                //inportante en una linea
                songbook_title_text = `<span class="sp_number">${el.songbook}.</span> <span class="sp_name">${el.songbook_title}</span>`;
            }

            let lang_name_text = '';
            if(el.lang){
                lang_name_text = obj_lang_names[el.lang];
            }

            tr_song.innerHTML = `
                <td class="td_n">${i + 1}</td>
                <td class="td_id_song" data-id_song="${el.id_song}" title="${el.id_song}">${el.id_song}</td>
                <td class="td_numero">${el.song_number || ''}</td>
                <td class="td_titulo">${el.title}</td>
                <td class="td_esquema">${hay_esquema_texto}</td>            
                <td class="td_category" data-category="${el.category || ''}">${category_name_text}</td>            
                <td class="td_songbook" data-songbook="${el.songbook || ''}">${songbook_title_text}</td>            
                <td class="td_idioma" data-lang_name="${el.lang_name}">${lang_name_text}</td>
                <td class="td_tonalidad">${el.tune}</td>
            `;

            tr_song.onclick = (e)=>{
                console.log('e.currentTarget: ', e.currentTarget);

                id_song = e.currentTarget.dataset.id;
                console.log('asigno global --- id_song: ', id_song);               
                
                pintSongActive();//en la ventana a la derecha de la tabla de lista
            }

            tbody.append(tr_song);
        });
    }else{
        console.log('no hay coincidencias...');
        
        eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="td_no_data">
                    <p class="prim">No se encontraron canciones con la frase: "<b>${words_input}</b>"</p>
                </td>
            </tr>
        `;
    }

    console.timeEnd('time_findWordsNew');
}


async function findWordsLista(){
    console.log('=== async function findWordsLista() ===');
    console.time('time_findWordsLista');
    
    let words_input = eid_inpt_find_lista.value.trim();
    let modo = eid_modo_lista.value;
    let buscar_en = eid_buscar_en_lista.value;
    console.log('--- words_input: ', words_input);

    if(words_input == ''){
        console.log('21. no has introducido nada....');
        return;
    }
        
    //reasigno arr_words_lista global
    if(words_input.includes(' ')){
        arr_words_lista = words_input.split(' ');
    }else{
        arr_words_lista = [words_input];
    }

    if(arr_words_lista.length === 0){
        console.log('2. no has introducido nada....');
        return;
    }

    objFindListaParams.words_input = words_input;
    objFindListaParams.modo = modo;
    objFindListaParams.buscar_en = buscar_en;

    objDataListasBd = await getDataListasFromBdByFind(objFindListaParams);
    console.log('objDataListasBd: ', objDataListasBd);

    if(esObjeto(objDataListasBd) && objDataListasBd.arr_data.length > 0){
        console.log('hay coincidencias...');

        //Clono objeto
        objDataListas = structuredClone(objDataListasBd);
        console.log('objDataListas: ', objDataListas);

        tbody_lista.innerHTML = '';//reset

        eid_titulo_tabla_lista.querySelector('b').style.display = 'inline';
        eid_titulo_tabla_lista.querySelector('b').textContent = objDataListas.arr_data.length;


        eid_sp_icon_filtro_lista.classList.remove('d-none');//muestro el boton de filtro

        //Parametros para filtrar resultados de buscar
        const contenedor_filtro = eid_d_filter_results_lista;
        const sp_icon_filtro = eid_sp_icon_filtro_lista;
        const el_input = eid_inpt_filter_lista;
        const selector_items = '.tr_lista';//CLASES JUNTOS!. los elementos que se ocultarán, si no cumplen con el filtro
        const arr_spans = [
            '.td_id_lista',    
            '.td_titulo',    
            '.td_dia_semana',    
            '.td_fecha',    
            '.td_lista'
        ];//se buscará texto en cada elemento de estos span's
        addFilterListener(contenedor_filtro, sp_icon_filtro, el_input, selector_items, arr_spans);




        //Recorrer listas encontradas...
        objDataListas.arr_data.forEach((el, i, arr) => {
            console.log('el: ', el);

            const tr_lista = document.createElement('tr');
            tr_lista.className = 'tr_lista';
            tr_lista.dataset.id = el.id_lista;

            let hay_lista_texto;

            //convierto arr_esquema (string) en array correcto
            if(esString(el.arr_lista) && el.arr_lista != ''){
                el.arr_lista = JSON.parse(el.arr_lista);
                hay_lista_texto = `Sí (${el.arr_lista.length})`;
            }
            else if(esArray(el.arr_lista) && el.arr_lista.length > 0){
                hay_lista_texto = `Sí (${el.arr_lista.length})`;
            }
            else{
                el.arr_lista = [];
                hay_lista_texto = '';
            }
            console.log('(parseado) --- el.arr_lista: ', el.arr_lista);            

            let fecha_str = (el.fecha && el.fecha !== '0000-00-00') ? el.fecha : '' ;
            let diaSemana_val = '';
            let fecha_val = '';

            if(fecha_str){
                diaSemana_val = diaSemana(fecha_str);
                fecha_val = convertirFecha(fecha_str, 'ver', '/');
            }

            tr_lista.innerHTML = `
                <td class="td_n">${i + 1}</td>
                <td class="td_id_lista" data-id_lista="${el.id_lista}" title="${el.id_lista}">${el.id_lista}</td>
                <td class="td_titulo">${el.title}</td>
                <td class="td_dia_semana">${diaSemana_val}</td>            
                <td class="td_fecha">${fecha_val}</td>            
                <td class="td_lista">${hay_lista_texto}</td>
            `;

            tr_lista.onclick = (e) => {                
                console.log('e.currentTarget: ', e.currentTarget);
    
                id_lista = e.currentTarget.dataset.id;
                console.log('asigno global --- id_lista: ', id_lista);                
                
                pintListaActive();//en la ventana a la derecha de la tabla de lista
            }

            tbody_lista.append(tr_lista);
        });
    }else{
        console.log('no hay coincidencias...');

        eid_sp_icon_filtro_lista.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        tbody_lista.innerHTML = `
            <tr>
                <td colspan="6" class="td_no_data">
                    <p class="prim">No se encontraron listas con la frase: "<b>${words_input}</b>"</p>
                </td>
            </tr>
        `;
    }

    console.timeEnd('time_findWordsLista');
}


function esString(valor) {
    return typeof valor === "string";
}

function esObjeto(valor) {
    return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function esArray(valor) {
    return Array.isArray(valor);
}


function clear_inpt(param){
    let thisInpt = document.getElementById(`inpt_${param}`);
    thisInpt.value = '';
    thisInpt.focus();
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

function pintSongbooksOptions(selectElement){
    selectElement.innerHTML = '';//reset
    //Recorrer objSongbooks
    Object.values(objSongbooks).forEach(songbook => {
        const option = document.createElement('option');
        option.value = songbook.id_songbook;
        option.innerHTML = `${songbook.id_songbook}. ${songbook.title}`;
        selectElement.append(option);
    });
}





async function nueva_song(){
    console.log('=== function nueva_song() ===');

    id_song = null;//reset id_song -> ya que es nueva canción

    //reseteo datos de la song anterior para evitar confusión
    resetBlockBuscar();
    resetBlockEsquema();
    resetLineasXinBlock(eid_block_cancion);

    mostrarPrim = false;    
    ocultarElementosPrimEn(cancion_option_inner);
    ocultarElementosEditablesEn(cancion_option_inner);
    mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit 

    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_ul_action.innerHTML = '...';//reset 
    cancion_song_bloques.classList.add('solo_ver');

    buildFormCancion(cancion_song_bloques, cancion_action = 'nueva');

    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Nueva Canción:';

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
    eid_block_cancion_head.querySelector('#btn_song_nueva').classList.add('btn_active');

    cancion_ul_action.innerHTML = `
        <li class="li_action" onclick="showBlockName('buscar');">Buscar</li>
    `;
    cancion_ul_action.onclick = e => close_ul_action(e);
    
    console.log('fin');
}




function ver_song(){
    console.log('=== function ver_song() ===');

    if(!hay_id_song('ver_song()')){
        return; // <- se detiene aquí si no hay id_song
    }

    resetLineasXinBlock(eid_block_cancion);
    
    mostrarPrim = false;
    mostrarElementosEditablesEn(cancion_option_inner);
    mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit

    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Ver canción:';

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
    eid_block_cancion_head.querySelector('#btn_song_ver').classList.add('btn_active');    


    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_ul_action.innerHTML = '...';//reset 
    cancion_song_bloques.classList.add('solo_ver');

    buildFormCancion(cancion_song_bloques, cancion_action = 'ver');//'ver', 'editar'

    cancion_ul_action.innerHTML = `
        <div class="razdel">Lista:</div>
        <li class="li_action" onclick="addToLista();">Añadir a la Lista</li>

        <div class="razdel">Esquema:</div>
        <li class="li_action" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); select_slide();">Select slide</li>
        
        <div class="razdel">Diapositivas:</div>
        <li class="li_action" onclick="crearSlides();">Crear slides</li>
        <li class="li_action" onclick="crearSlides(); closeAll()">Crear slides + Ver</li>
    `;
    cancion_ul_action.onclick = e => close_ul_action(e);

    console.log('fin');    
}


function editar_song(){
    console.log('=== function editar_song() ===');

    if(!hay_id_song('editar_song()')){
        return; // <- se detiene aquí si no hay id_song
    }

    resetLineasXinBlock(eid_block_cancion);

    mostrarPrim = false;
    mostrarElementosEditablesEn(cancion_option_inner);
    mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit

    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Editar canción:';

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
    eid_block_cancion_head.querySelector('#btn_song_editar').classList.add('btn_active');


    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_ul_action.innerHTML = '...';//reset 
    cancion_song_bloques.classList.add('solo_ver');

    buildFormCancion(cancion_song_bloques, cancion_action = 'editar');//'ver', 'editar'

    cancion_ul_action.innerHTML = `
        <div class="razdel">Lista:</div>
        <li class="li_action" onclick="addToLista();">Añadir a la Lista</li>

        <div class="razdel">Esquema:</div>
        <li class="li_action" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); select_slide();">Select slide</li>
        
        <div class="razdel">Diapositivas:</div>
        <li class="li_action" onclick="crearSlides();">Crear slides</li>
        <li class="li_action" onclick="crearSlides(); closeAll()">Crear slides + Ver</li>        
    `;
    cancion_ul_action.onclick = e => close_ul_action(e);

    console.log('fin');    
}




function eliminar_song(){
    console.log('=== function eliminar_song() ===');

    if(!hay_id_song('eliminar_song()')){
        return; // <- se detiene aquí si no hay id_song
    }

    resetLineasXinBlock(eid_block_cancion);

    mostrarPrim = false;
    mostrarElementosEditablesEn(cancion_option_inner);
    mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit

    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Eliminar canción:';

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
    eid_block_cancion_head.querySelector('#btn_song_eliminar').classList.add('btn_active');

    //cancion_wr_vista_blocks.innerHTML = '...';//reset
    //cancion_ul_action.innerHTML = '...';//reset    
    cancion_song_bloques.classList.add('solo_ver');

    buildFormCancion(cancion_song_bloques, cancion_action = 'eliminar');

    cancion_ul_action.innerHTML = `
        <li class="li_action" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</li>                
        <li class="li_action btn_eliminar" onclick="deleteSong(event);">Eliminar Canción DEFINITIVAMENTE</li>                
    `;
    cancion_ul_action.onclick = e => close_ul_action(e);

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
        pageActiveEjemplo = lang;

        ejemplo_ul_action.innerHTML = `
            <li class="li_action" onclick="openModal('full','Ejemplo',null,'buildFormEjemplo',true, '${lang}')">Ejemplo (${obj_lang_names[lang]})</li>
        `;
        ejemplo_ul_action.onclick = e => close_ul_action(e);
        
        const contenedor = ejemplo_song_bloques; 

        buildFormEjemplo(contenedor, lang);
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
        btn_guardar.textContent = 'Guardar Nueva Lista';
        btn_guardar.onclick = () => {
            openModal('full','Guardar Nueva Lista',null,'buildLista',true, 'nueva');
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


async function crearSlidesForSongOfLista(e, lista_id_song, cerrar_modales = true, show_ultimo_slide = false) {
    console.log('=== function crearSlidesForSongOfLista() ===');

    resetBlockBuscar();//quito song anterior si hay
    resetBlockEsquema();
    resetBlockCancion();

    resetPListaActive();

    if(e instanceof Event) {
        console.log("Recibí un evento. e.type: ", e.type);
        e.currentTarget.classList.add('active');
    }
    else if(e instanceof HTMLElement) {
        console.log("Recibí un elemento HTML. e.tagName: ", e.tagName);
        const p_lista_element = e;
        p_lista_element.classList.add('active');
    }
    else{
        console.log("Parámetro desconocido. e: ", e);
        alert('Parámetro desconocido de e. Return...');
        return;
    }

    id_song = lista_id_song;
    console.log('lista_id_song: ', lista_id_song);

    currentIndexOfArrLista = arr_lista.findIndex(item => item.id_song == id_song);
    console.log('currentIndexOfArrLista: ', currentIndexOfArrLista);

    //cojo datos de la song de la lista desde BD
    objSong = await getDataSongFromBd();

    await crearSlides();//no pongo await para no esperar el resultado de ejecusion de crearSlide()

    if(show_ultimo_slide){
        const index_ultimo_item = arr_esquema_bucle.length - 1;
        showOneSlideFrom(null, index_ultimo_item);//marco ultimo slide por defecto...
    }else{//mostrar primer slide
        showOneSlideFrom(null, 0);//marco primer slide por defecto...
    }

    if(cerrar_modales){
        closeAll();
        closeModal(null,true);
    }
}


async function editSongOfLista(e, lista_id_song) {
    console.log('=== function editSongOfLista() ===');

    resetBlockBuscar();//quito song anterior si hay
    resetBlockEsquema();
    resetBlockCancion();

    resetPListaActive();
    e.currentTarget.classList.add('active');

    id_song = lista_id_song;
    console.log('lista_id_song: ', lista_id_song);

    //cojo datos de la song de la lista desde BD
    objSong = await getDataSongFromBd();

    showEdit('cancion');
    editar_song();

    closeModal(null,true);
}





function eliminarSongDeLista(id_song){
    console.log('=== function eliminarSongDeLista() ===');
    console.log('id_song: ', id_song);

    if(!id_song){
        alert('No hay id_song. No se puede eliminar canción de la lista.');
        return;
    }

    //hay 2 modos
    //1. cuando se crea nueva lista y arr_lista tiene datos
    //2. cuando se ve/edita/elimina la lista existente y se modifica arr_lista y objLista.arr_lista
    
    if(id_lista == null){//se crea nueva lista
        console.log('se crea nueva lista');
        
        //Eliminar del arr_lista
        arr_lista = arr_lista.filter(item => item.id_song != id_song);
        console.log('arr_lista actualizado: ', arr_lista);

        let d_canciones_listaAll = document.querySelectorAll(`.d_canciones_lista`);
        console.log('d_canciones_listaAll: ', d_canciones_listaAll);

        //Actualizar el DOM
        d_canciones_listaAll.forEach(contenedor => {
            console.log('contenedor: ', contenedor);
            buildListaSoloSongs(contenedor, arr_lista);//arr_lista global
        });
        
    }else{//se edita lista existente
        console.log('se edita lista existente');

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
            buildListaSoloSongs(contenedor, objLista.arr_lista);//objLista.arr_lista de BD
        });
    }

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

            buildListaSoloSongs(eid_block_lista.querySelector('.vista_lista_content .d_canciones_lista'), arr_lista);           

            const contenedor_pintar_numeros = document.querySelector('.d_canciones_lista #d_canciones_body_drag');
            pintSoloNumerosDeOrden(contenedor_pintar_numeros);
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


function pintSoloNumerosDeOrden(contenedor){
    console.log('=== function pintSoloNumerosDeOrden() ===');
    contenedor.querySelectorAll('.l_n').forEach((item,i) => {
        //console.log('item: ', item);
        //console.log('i: ', i);
        item.textContent = `${i + 1}.`;
    });

}