//=================================================================//
// start - F U N C T I O N S  
//=================================================================//

function init() {
    ajustarTexto();
    pintParrafosAcordes();
    pintTipoAcorde();
    transponerTodosLosAcordes(currentTransposition);
    scrollToSlide(currentSlide);
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
        linea_new = linea_str.replace(/([|/])/g, '<span class="barra">$1</span>');

        linea.innerHTML = linea_new;

    });
}


function pintParrafosAcordes() { 
    console.log('=== function pintParrafosAcordes() ===');

    // Regex para acordes: letra A-H + opcional # o b + opcional sufijo alfanumérico
    const regexAcorde = /([A-H](?:#|b)?\w*)/g;

    document.querySelectorAll('p.c').forEach(p => {
        let textOriginal = p.textContent;

        const partes = textOriginal.match(/([|\/])|(\s+)|([^\s|\/]+)/g);

        let resultado = partes.map(parte => {
            if (parte === '|' || parte === '/') {
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


function slideGo(dir){
    if(dir == 'next'){
        if(currentSlide < totalSlides - 1){
            currentSlide++;
            scrollToSlide(currentSlide);
        }
    }

    if(dir == 'prev'){
        if(currentSlide > 0){
            currentSlide--;
            scrollToSlide(currentSlide);
        }
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

let songText = localStorage.getItem('songText') || 'no hay songText...';


async function make_songText() {
    console.log('=== function make_songText() ===');

    if(!hay_id_song('make_songText()')){
        return; // <- se detiene aquí si no hay id_song
    }

    songText = await getSongTextFromFile();
    console.log('songText:', songText);

    localStorage.setItem('songText', songText);
}


function editTipoLinea(){
    console.log('=== function make_songText() ===');

    const editContainer = document.querySelector('.edit_body');
    editContainer.innerHTML = '';//reset

    const arr_lineas = songText.split(/\r\n|\r|\n/);
    console.log('arr_lineas:', arr_lineas);

    const tabla = document.createElement('table');
    editContainer.append(tabla);

    arr_lineas.forEach((linea, i) => {
        console.log('linea:', linea);

        const fila = document.createElement('tr');

        const p = document.createElement('p');
        p.className = 'p_edit';

        const match_titulo = linea.match(/^\[(.*?)\]\s*([\s\S]*)$/);//busco: [pripev]
        console.log('match_titulo: ', match_titulo);

        if (match_titulo || linea == ''){//es titlulo o linea vacia
            //let titulo = match_titulo[1].trim();
            //console.log('titulo: ', titulo);

            fila.innerHTML = `
                <td>línea ${i}</td>
                <td></td>
                <td>${linea}</td>
            `;

        }else{//es acorde o texto

            fila.innerHTML = `
                <td>línea ${i}</td>
                <td><button class="btn_es_acorde btn">es Acorde</button></td>
                <td>${linea}</td>
            `;
            fila.onclick = (e) =>{
                if(e.target.classList.contains('btn_es_acorde')){
                    fila.querySelector('.btn_es_acorde').classList.add('btn_active');
                }

                if(e.target.classList.contains('btn_es_texto')){
                    fila.querySelector('.btn_es_acorde').classList.remove('btn_active');
                }
            }
            
        }        

        tabla.append(fila);
    });
}


async function getSongBlocks(){
    console.log('=== function getSongBlocks() ===');

    if(!hay_id_song('getSongBlocks()')){
        return; // <- se detiene aquí si no hay id_song
    }
       
    objSongBd = await getSongTextFromBd();
    
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
            if(i == 0){
                div_titulo_cancion = `
                    <div class="song_titulo">
                        <span>${song_titulo}</span>
                    </div>
                `;
            }

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
    
    let arr_esquema_bd;

    if(objSongBd.arr_esquema && objSongBd.arr_esquema?.length > 0){
        arr_esquema_bd = objSongBd.arr_esquema.map(el => el.nombre)
    }else{
        arr_esquema_bd = Object.keys(obj_bloques).map(el => el);
    }
    console.log('arr_esquema_bd: ', arr_esquema_bd);


    if(arr_esquema_bd){
        arr_esquema_bucle = arr_esquema_bd;
    }else{
        const arr_obj = arr_esquema.map(el => el = {'nombre': el, veces: 1});//arr_esquema convierto en array de objetos
        arr_esquema_bucle = arr_obj;//lo reasigno
    }
    console.log('return --- arr_esquema_bucle: ', arr_esquema_bucle);

    return arr_esquema_bucle;
}


async function crearSlides(){
    console.log('=== function crearSlides() ===');

    if(!hay_id_song('crearSlides()')){
        return; // <- se detiene aquí si no hay id_song
    }

    obj_bloques = await getSongBlocks();
    console.log('obj_bloques: ', obj_bloques);

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);

    buildSong();
}


function buildSong(){
    console.log('=== function buildSong() ===');

    console.log('obj_bloques: ', obj_bloques);
    console.log('arr_esquema_bucle: ', arr_esquema_bucle);

    stepsContainer.innerHTML = '';//reset
    slideContainer.innerHTML = '';//reset
    currentSlide = 0;//reset al cargar nueva cancion
    totalSlides = arr_esquema_bucle.length;//total de slides a pintar

    //recorrer el bucle...
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo].slide;//bd
        console.log('slide_original: ', slide_original);

            const slide_original_next = (arr[i+1]) ? obj_bloques[arr[i+1]].slide : null ;//bd
            console.log('slide_original_next: ', slide_original_next);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);        

            const slide_clone_next = (arr[i+1]) ? slide_original_next.cloneNode(true) : null ; // true para clonar también hijos 
            console.log('slide_clone_next: ', slide_clone_next);

        const step = document.createElement('div');
        step.className = 'step';
        step.dataset.index = i;

        let titulo_text;
        if(esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema[i].veces > 1){//si hay repeticion del titulo
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
        
        slideContainer.append(slide_clone);
    });


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

    wr_esquema_actual.style.display = 'block';//muestro el contenedor de esquema actual
    wr_vista_btns_actual.innerHTML = '';//reset

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
        

        let titulo_orig = (objSongBd.arr_esquema) ? objSongBd.arr_esquema[i]?.nombre : titulo ;
        let titulo_text = titulo_orig;
        console.log('titulo_text: ', titulo_text); 
        
        let titulo_count_veces = (objSongBd.arr_esquema) ? objSongBd.arr_esquema[i]?.veces : 1 ;
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
        
        wr_vista_btns_actual.append(btn_simple);
    });
}


async function ver_esquema(){
    console.log('=== function ver_esquema() ===');

    if(!hay_id_song('ver_esquema()')){
        return; // <- se detiene aquí si no hay id_song
    }

    console.log('obj_bloques esta vacio, lo creo...');
    obj_bloques = await getSongBlocks();

    console.log('obj_bloques: ', obj_bloques);

    let arr_esquema = Object.keys(obj_bloques);

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);
    
    song_bloques.innerHTML = '';//reset
    wr_vista_btns.innerHTML = '';//reset
    wr_vista_blocks.innerHTML = '';//reset
    wr_btns_action.innerHTML = '';//reset

    song_bloques.classList.add('solo_ver');

    eid_block_esquema.querySelector('.bl_parte_l h4').textContent = 'Ver esquema de la canción:';
    eid_block_esquema.querySelector('.bl_parte_l h5').textContent = 'Bloques con las que se construyó la canción:';
    eid_block_esquema.querySelector('.bl_parte_c h5').textContent = 'Estructura corta:';
    eid_block_esquema.querySelector('.bl_parte_r h5').textContent = 'Estructura de la canción:';
    
    resetBtnActive(eid_block_esquema_head);//reseteo btn_active de botones en el contenedor
    eid_block_esquema_head.querySelector('#btn_ver_esquema').classList.add('btn_active');

    wr_esquema_actual.style.display = 'none';//oculto el contenedor de esquema actual por no hacer falta (y no duplicar vista de datos)


    //Recorrer el bucle - partes de song...
    arr_esquema.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo].slide;
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);  
                
        song_bloques.append(slide_clone.querySelector('fieldset'));
    });


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
        

        let titulo_orig = (objSongBd.arr_esquema) ? objSongBd.arr_esquema[i]?.nombre : titulo ;
        let titulo_text = titulo_orig;
        console.log('titulo_text: ', titulo_text); 
        
        let titulo_count_veces = (objSongBd.arr_esquema) ? objSongBd.arr_esquema[i]?.veces : 1 ;
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

            const song_element_legend = [...song_bloques.querySelectorAll('legend')].find(el => el.textContent.trim() === e.currentTarget.dataset.titulo);
            const song_element_fieldset = song_element_legend.closest('fieldset');
            resetFldActive(song_bloques);            
            song_element_fieldset.classList.add('fld_active');
            song_element_fieldset.scrollIntoView({behavior: 'smooth'});            
            
            const element_legend = wr_vista_blocks.querySelectorAll('legend')[e.currentTarget.dataset.idx];
            const element_fieldset = element_legend.closest('fieldset');
            resetFldActive(wr_vista_blocks);            
            element_fieldset.classList.add('fld_active');
            element_fieldset.scrollIntoView({behavior: 'smooth'});
        }
        
        wr_vista_btns.append(btn_simple);
        wr_vista_blocks.append(el_fieldset_cloned);
    });

    wr_btns_action.innerHTML = `
        <button id="btn_crearSlides" class="btn" onclick="crearSlides();">Crear slides</button>
        <button id="btn_crearSlides_ver" class="btn" onclick="crearSlides(); closeAll()">Crear slides + Ver</button>
    `;

}


async function crear_esquema(){
    console.log('=== function crear_esquema() ===');

    if(!hay_id_song('crear_esquema()')){
        return; // <- se detiene aquí si no hay id_song
    }

    window.arr_temp = [];
    window.titulo_count = 0;
    arr_esquema_obj = [];

    obj_bloques = await getSongBlocks();
    let arr_esquema = Object.keys(obj_bloques);

    console.log('obj_bloques: ', obj_bloques);
    console.log('arr_esquema: ', arr_esquema);

    song_bloques.innerHTML = '';//reset
    wr_vista_btns.innerHTML = '';//reset
    wr_vista_blocks.innerHTML = '';//reset
    wr_btns_action.innerHTML = '';//reset

    song_bloques.classList.remove('solo_ver');

    eid_block_esquema.querySelector('.bl_parte_l h4').textContent = 'Crear esquema de la canción:';
    eid_block_esquema.querySelector('.bl_parte_l h5').textContent = 'Bloques con las que se construye la canción:';
    eid_block_esquema.querySelector('.bl_parte_c h5').textContent = 'Nueva estructura corta:';
    eid_block_esquema.querySelector('.bl_parte_r h5').textContent = 'Nueva estructura de la canción';

    resetBtnActive(eid_block_esquema_head);//reseteo btn_active de botones en el contenedor
    eid_block_esquema_head.querySelector('#btn_crear_esquema').classList.add('btn_active');

    const sp_prim = document.createElement('span');
    sp_prim.className = 'sp_prim';
    sp_prim.innerHTML = `
        Haz clic en un bloque para añadirlo al esquema de la canción...
    `;

    wr_vista_btns.append(sp_prim);
    wr_vista_blocks.append(sp_prim.cloneNode(true));

    //creo esquema de botones cortos actual
    crear_esquema_btns_actual();
    wr_esquema_actual.style.display = 'block';//muestro el contenedor de esquema actual

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
            
            wr_vista_btns.querySelector('.sp_prim')?.remove();
            wr_vista_blocks.querySelector('.sp_prim')?.remove();

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

                wr_vista_blocks.lastElementChild?.remove();//elimino el anterior bloque
                wr_vista_btns.lastElementChild?.remove();//elimino el anterior btn
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

                const element_legend = [...song_bloques.querySelectorAll('legend')].find(el => el.textContent.trim() === e.currentTarget.dataset.titulo);
                
                const element_fieldset = element_legend.closest('fieldset');
                resetFldActive(song_bloques);
                
                element_fieldset.classList.add('fld_active');
                element_fieldset.scrollIntoView({behavior: 'smooth'});

                if(e.target.className === 'sp_close'){
                    //alert('voy a eliminar este boton...');
                    arr_esquema_obj.splice(e.currentTarget.dataset.idx_esquema, 1);
                    const vista_block_to_remove = [...wr_vista_blocks.querySelectorAll('fieldset')].find(el => el.dataset.idx_esquema === e.currentTarget.dataset.idx_esquema);
                    vista_block_to_remove?.remove();
                    e.currentTarget.remove();

                    if(arr_esquema_obj.length === 0){
                        //si no hay bloques, oculto los botones de acción
                        wr_btns_action.innerHTML = '';
                    }
                }
            }

            const obj_titulo = {
                nombre: titulo,
                veces: titulo_count_veces
            }
            
            arr_esquema_obj.push(obj_titulo); 
            console.log('arr_esquema_obj: ', arr_esquema_obj);

            el_fieldset_cloned.dataset.idx_esquema = idx_vista_prev;

            wr_vista_blocks.append(el_fieldset_cloned);
            el_fieldset_cloned.scrollIntoView({behavior: 'smooth'});

            wr_btns_action.innerHTML = `
                <button id="btn_resetEsquema" class="btn" onclick="resetEsquema()">Reset</button>
                <button id="btn_guardarEsquema" class="btn" onclick="guardarEsquema()">Guardar</button>
                <button id="btn_crearSlides_ver" class="btn" onclick="guardarEsquema(); crearSlides(); closeAll()">Guardar + Ver slides</button>
            `;

            wr_vista_btns.append(btn_close);

        }        
        
        song_bloques.append(slide_clone.querySelector('fieldset'));
    });
}


async function guardarEsquema(){
    console.log('=== function guardarEsquema() ===');

    id_song = objSong.id_song;
    console.log('id_song: ', id_song);

    if(!id_song){
        alert('id_song no está indicado... hago return.');
    }

    //obj_lista[id_song].arr_esquema = arr_esquema_obj;
    objSong.arr_esquema = arr_esquema_obj;

    const result = await insertarSongDatos(objSong);
    console.log('result: ', result);

    crearSlides();
    crear_esquema_btns_actual();//actualizo los botones de esquema actual
}

function resetEsquema(){
    const wr_vista_btns = document.querySelector('.wr_vista_btns');
    wr_vista_btns.innerHTML = '';//reset

    const wr_vista_blocks = document.querySelector('.wr_vista_blocks');
    wr_vista_blocks.innerHTML = '';//reset

    const wr_btns_action = eid_block_esquema.querySelector('.wr_btns_action');
    wr_btns_action.innerHTML = '';//reset

    arr_esquema_obj = [];
}


function resetBlockBuscar(){
    console.log('=== function resetBlockBuscar() ===');

    // tbody.innerHTML = `
    //             <td class="td_n">...</td>
    //             <td class="td_id_song">...</td>
    //             <td class="td_numero">...</td>
    //             <td class="td_titulo">...</td>
    //             <td class="td_esquema">...</td>
    //             <td class="td_category">...</td>
    //             <td class="td_idioma">...</td>
    //             <td class="td_tonalidad">...</td>
    // `;

    eid_block_buscar.querySelector('.wr_btns_action').innerHTML = '...';//reset
    eid_block_buscar.querySelector('.vista_song_content').innerHTML = '(Aquí se mostrará el texto de la canción...)';//reset

    id_song = null;
    resetTrSelected(tbody);//reseteo tr_selected de tbody
}

function resetBlockEsquema(){
    console.log('=== function resetBlockEsquema() ===');

    resetBtnActive(eid_block_esquema_head);//reseteo btn_active de botones en el contenedor

    eid_block_esquema.querySelector('.song_bloques').innerHTML = '...';//reset
    eid_block_esquema.querySelector('.wr_vista_btns').innerHTML = '...';//reset
    eid_block_esquema.querySelector('.wr_vista_blocks').innerHTML = '...';//reset
    eid_block_esquema.querySelector('.wr_btns_action').innerHTML = '...';//reset
    
    eid_block_esquema.querySelector('.wr_esquema_actual').style.display = 'none';//reset
    eid_block_esquema.querySelector('.wr_vista_btns_actual').innerHTML = '...';//reset

    arr_esquema_obj = [];
    id_song = null;
}

function resetBlockCancion(){
    console.log('=== function resetBlockCancion() ===');

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor

    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_btns_action.innerHTML = '...';//reset  
    
    cancion_song_bloques.querySelector('.puntos_def').style.display = 'block';//muestro '...'
    cancion_form_container.style.display = 'none';//oculto formulario de canción

    cancion_form_container.querySelector('form').reset();//reseteo formulario
}

function resetBlockLista(){
    console.log('=== function resetBlockLista() ===');

    // resetBtnActive(eid_block_lista_head);//reseteo btn_active de botones en el contenedor

    // lista_wr_vista_blocks.innerHTML = '...';//reset
    // lista_wr_btns_action.innerHTML = '...';//reset  
    
    // lista_song_bloques.querySelector('.puntos_def').style.display = 'block';//muestro '...'
    // lista_form_container.style.display = 'none';//oculto formulario de canción

    // lista_form_container.querySelector('form').reset();//reseteo formulario
}


async function guardarSong(event){
    console.log('=== function guardarSong() ===');
    event.preventDefault();

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `<span>${obj_lang.d315}</span>`;//Si no aceptas cookies no puedes crear una cuenta.
        //     aviso_text += ` <a onclick="showBlockCookies(); closeModal(null,true);">${obj_lang.d316}</a>.`;//Seleccionar Coockies
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        let title = document.getElementById("title").value.trim();
        let category = document.getElementById("category").value.trim();
        let song_number = document.getElementById("song_number").value.trim();
        let tune = document.getElementById("tune").value.trim();
        let lang = document.getElementById("lang").value.trim();
        let song_text = document.getElementById("song_text").value.trim();
        let notes = document.getElementById("notes").value.trim();
    
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
            form_mensaje.innerHTML = `<span class="add_result add_error">Por favor, introduce: <br> ${error_text}</span>`;
            cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
            return;
        }

        const objSongToSend = {
            id_song: id_song || null, //ya que se añade una nueva canción, no hay id_song
            song_number: song_number,
            title: title,
            arr_esquema: '', //no hay esquema al crear/editar una canción. se guarda en guardarEsquema()
            category: category,
            tune: tune,
            lang: lang,
            song_text: song_text,
            notes: notes,
        }
        console.log('objSongToSend: ',objSongToSend);
    
        const data = await insertarSongDatos(objSongToSend);;
        console.log('data: ',data);         

    
        if(data.success){                
            
            let text_show;

            if(data.action == 'is_insert'){
                text_show = 'Canción añadida con éxito.';
            }else if(data.action == 'is_update'){
                text_show = 'Canción actualizada con éxito.';
            }
            console.log(text_show);
    
            form_mensaje.innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
            cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

            if(data.id_song){
                console.log('id_song: ', data.id_song);
                id_song = data.id_song;//guardo el id de la canción recién creada
                objSong = objSongToSend;//reasigno el objeto song con los datos del formulario
                objSong.id_song = id_song;//añado el id_song al objeto song

                cancion_form_container.querySelector('#id_song').disabled = true;//deshabilito input id_song   
                cancion_form_container.querySelector('#id_song').value = id_song;

                cancion_wr_btns_action.innerHTML = `
                    <button class="btn" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</button>
                    <button class="btn" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</button>
                    <button class="btn" onclick="crearSlides(); closeAll()">Crear slides + Ver</button>
                `;
            }
           
        }else{
            console.log(`Error al añadir la canción.`);
            
            //"Error al registrar el usuario";
            console.error(data.error);
            console.error(data.dic_code);

            let error_text = 'Error al añadir la canción.';
    
            form_mensaje.innerHTML = `<span class="add_result add_error">${error_text}</span>`;
            cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarSong. error: ',error);
    }

    //crearSlides();
    //crear_esquema_btns_actual();//actualizo los botones de esquema actual
}

async function deleteSong(){
    console.log('=== function deleteSong() ===');

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

    if(data.success){
        
        let text_show;
        text_show = 'Canción eliminada con éxito.';
        console.log(text_show);

        form_mensaje.innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
        cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

        if(data.id_song){
            console.log('id_song: ', data.id_song);

            //Elimino elemento tr de la tabla tbody con la cancion eliminada
            tbody.querySelector(`.tr_song[data-id="${id_song}"]`).remove();

            cancion_form_container.querySelector('#id_song').disabled = true;//deshabilito input id_song   
            cancion_form_container.querySelector('#id_song').value = id_song;

            resetBlockBuscar();
            resetBlockEsquema();

            pintLineasXinBlock(eid_block_cancion);

            // eid_block_cancion.querySelector('bl_parte_l .bloques_outer').classList.add('datos_eliminados');
            // eid_block_cancion.querySelector('bl_parte_r .bloques_outer').classList.add('datos_eliminados');

            cancion_wr_btns_action.innerHTML = `
                <p class="prim bg_red">Canción eliminada</p>
                <button class="btn" onclick="showBlockName('buscar');">Buscar</button>
            `;

            id_song = null;
            objSong = {};//reseteo objeto song
        }
        
    }else{
        console.log(`Error al añadir la canción.`);
        
        //"Error al registrar el usuario";
        console.error(data.error);
        console.error(data.dic_code);

        let error_text = 'Error al añadir la canción.';

        form_mensaje.innerHTML = `<span class="add_result add_error">${error_text}</span>`;
        cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
    }
}



async function guardarLista(event){
    console.log('=== function guardarLista() ===');
    event.preventDefault();

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `<span>${obj_lang.d315}</span>`;//Si no aceptas cookies no puedes crear una cuenta.
        //     aviso_text += ` <a onclick="showBlockCookies(); closeModal(null,true);">${obj_lang.d316}</a>.`;//Seleccionar Coockies
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        let title = document.getElementById("title").value.trim();
        let category = document.getElementById("category").value.trim();
        let song_number = document.getElementById("song_number").value.trim();
        let tune = document.getElementById("tune").value.trim();
        let lang = document.getElementById("lang").value.trim();
        let song_text = document.getElementById("song_text").value.trim();
        let notes = document.getElementById("notes").value.trim();
    
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
            form_mensaje.innerHTML = `<span class="add_result add_error">Por favor, introduce: <br> ${error_text}</span>`;
            cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
            return;
        }

        const objSongToSend = {
            id_song: id_song || null, //ya que se añade una nueva canción, no hay id_song
            song_number: song_number,
            title: title,
            arr_esquema: '', //no hay esquema al crear/editar una canción. se guarda en guardarEsquema()
            category: category,
            tune: tune,
            lang: lang,
            song_text: song_text,
            notes: notes,
        }
        console.log('objSongToSend: ',objSongToSend);
    
        const data = await insertarSongDatos(objSongToSend);;
        console.log('data: ',data);         

    
        if(data.success){                
            
            let text_show;

            if(data.action == 'is_insert'){
                text_show = 'Canción añadida con éxito.';
            }else if(data.action == 'is_update'){
                text_show = 'Canción actualizada con éxito.';
            }
            console.log(text_show);
    
            form_mensaje.innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
            cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

            if(data.id_song){
                console.log('id_song: ', data.id_song);
                id_song = data.id_song;//guardo el id de la canción recién creada
                objSong = objSongToSend;//reasigno el objeto song con los datos del formulario
                objSong.id_song = id_song;//añado el id_song al objeto song

                cancion_form_container.querySelector('#id_song').disabled = true;//deshabilito input id_song   
                cancion_form_container.querySelector('#id_song').value = id_song;

                cancion_wr_btns_action.innerHTML = `
                    <button class="btn" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</button>
                    <button class="btn" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</button>
                    <button class="btn" onclick="crearSlides(); closeAll()">Crear slides + Ver</button>
                `;
            }
           
        }else{
            console.log(`Error al añadir la canción.`);
            
            //"Error al registrar el usuario";
            console.error(data.error);
            console.error(data.dic_code);

            let error_text = 'Error al añadir la canción.';
    
            form_mensaje.innerHTML = `<span class="add_result add_error">${error_text}</span>`;
            cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarSong. error: ',error);
    }

    //crearSlides();
    //crear_esquema_btns_actual();//actualizo los botones de esquema actual
}

async function deleteLista(){
    console.log('=== function deleteSong() ===');

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

    if(data.success){
        
        let text_show;
        text_show = 'Canción eliminada con éxito.';
        console.log(text_show);

        form_mensaje.innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
        cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

        if(data.id_song){
            console.log('id_song: ', data.id_song);

            //Elimino elemento tr de la tabla tbody con la cancion eliminada
            tbody.querySelector(`.tr_song[data-id="${id_song}"]`).remove();

            cancion_form_container.querySelector('#id_song').disabled = true;//deshabilito input id_song   
            cancion_form_container.querySelector('#id_song').value = id_song;

            resetBlockBuscar();
            resetBlockEsquema();

            pintLineasXinBlock(eid_block_cancion);

            // eid_block_cancion.querySelector('bl_parte_l .bloques_outer').classList.add('datos_eliminados');
            // eid_block_cancion.querySelector('bl_parte_r .bloques_outer').classList.add('datos_eliminados');

            cancion_wr_btns_action.innerHTML = `
                <p class="prim bg_red">Canción eliminada</p>
                <button class="btn" onclick="showBlockName('buscar');">Buscar</button>
            `;

            id_song = null;
            objSong = {};//reseteo objeto song
        }
        
    }else{
        console.log(`Error al añadir la canción.`);
        
        //"Error al registrar el usuario";
        console.error(data.error);
        console.error(data.dic_code);

        let error_text = 'Error al añadir la canción.';

        form_mensaje.innerHTML = `<span class="add_result add_error">${error_text}</span>`;
        cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
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

function contieneSoloAcordes(str) {// busca ÚNICAMENTE: acordes, barras
    const regexAcorde = /^(?:\s*\|?\s*[A-H](#|b)?(m|maj7|m7|7|sus|sus2|sus4|dim|aug|add9|2|4|6|9|11|13)?(\/[A-H](#|b)?)?\s*\|?)*$/;
    //'|D      |F#m |G  |G  |'  => true;
    //'| Вступ |Dm  |G  |C  |' =>  false (palabra 'Вступ' no es acorde) 
    return regexAcorde.test(str.trim());
}

function contieneAcordes(str) {// busca CUALQUIER acorde , barra y texto
    const regexAcorde = /\b[ABCDEFGH](#|b)?(m|maj7|m7|7|sus|sus2|sus4|dim|aug|add9|2|4|6|9|11|13)?(\/[ABCDEFGH](#|b)?)?\b/g;
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
        case 'buscar':
            bl_titulo.textContent = 'Buscar canción';
            showOnlyBlock(blockName);
            break;
        
        case 'esquema':
            bl_titulo.textContent = 'Esquema de la canción';
            showOnlyBlock(blockName);
            break;
    
        case 'cancion':
            bl_titulo.textContent = 'Crear / Editar canción';
            showOnlyBlock(blockName);
            break;

        case 'ejemplo':
            bl_titulo.textContent = 'Ejemplo de canción';
            showOnlyBlock(blockName);
            break;

        case 'lista':
            bl_titulo.textContent = 'Buscar lista';
            showOnlyBlock(blockName);
            break;
        
        default:
            bl_titulo.textContent = 'Buscar canción';
            showOnlyBlock('buscar');
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
    
    let edit_body_max_h = 
      window.innerHeight 
    - ecl_edit_head.offsetHeight 
    ;

    console.log('edit_body_max_h: ', edit_body_max_h);    
    ecl_edit_body.style.maxHeight = edit_body_max_h + 'px';//comento para no duplicat
}




async function findWordsSong(){
    //console.log('=== async function findWordsSong(frase) ===');
    //console.log('--- frase: ', frase);
    console.time('time_findWordsNew');

    const eid_inpt_find = document.getElementById('inpt_find');
    const eid_modo = document.getElementById('modo');

    let frase = eid_inpt_find.value;
    let modo = eid_modo.value;

    let words_input = frase.trim();
    if(words_input == ''){
        console.log('1. no has introducido nada....');
        return;
    }

    let arr_words;    
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


    const objData = await getSongTextFromBdByFind(objFindParams);
    console.log('objData: ', objData);


    if(esObjeto(objData) && objData.arr_data.length > 0){
        console.log('hay coincidencias...');

        tbody.innerHTML = '';//reset

        eid_titulo_tabla_song.querySelector('b').style.display = 'inline';
        eid_titulo_tabla_song.querySelector('b').textContent = objData.arr_data.length;

        //Recorrer canciones encontradas...
        objData.arr_data.forEach((el, i, arr) => {
            console.log('el: ', el);

            const tr = document.createElement('tr');
            tr.className = 'tr_song';
            tr.dataset.id = el.id_song;

            tr.innerHTML = `
                <td class="td_n">${i + 1}</td>
                <td class="td_id_song" data-id_song="${el.id_song}" title="${el.id_song}">${el.id_song}</td>
                <td class="td_numero">${el.song_number}</td>
                <td class="td_titulo">${el.title}</td>
                <td class="td_esquema">${el.arr_esquema?.length ? 'Sí' : ''}</td>            
                <td class="td_category" data-category="${el.category}">${el.category_name || ''}</td>            
                <td class="td_idioma">${obj_lang_names[el.lang] || el.lang}</td>
                <td class="td_tonalidad">${el.tune}</td>
            `;

            tr.onclick = (e)=>{
                console.log('e.currentTarget: ', e.currentTarget);
                id_song = e.currentTarget.dataset.id;
                console.log('asigno global --- id_song: ', id_song);

                resetTrSelected(tbody);
                e.currentTarget.classList.add('selected');

                const vista_song_content = document.querySelector('.vista_song_content');
                vista_song_content.innerHTML = '';//reset

                const wr_btns_action = document.querySelector('.wr_btns_action');
                wr_btns_action.innerHTML = `
                    <button class="btn" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</button>
                    <button class="btn" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</button>
                    <button class="btn" onclick="showBlockName('cancion'); editar_song('ver');">Ver canción</button>
                    <button class="btn" onclick="showBlockName('cancion'); editar_song('editar');">Editar canción</button>
                    <button class="btn" onclick="showBlockName('cancion'); eliminar_song();">Eliminar canción</button>
                    <button class="btn" onclick="crearSlides()">Crear slides</button>
                    <button class="btn" onclick="crearSlides(); closeAll()">Crear slides + Ver</button>
                    <button class="btn" onclick="addToLista();">Añadir a la Lista</button>
                `;

                //dejo '==' en vez de '===' porque id_song viene como string "925"
                objSong = arr.find(s => s.id_song == id_song);
                console.log('objSong: ', objSong);

                const regex = new RegExp(`(${arr_words.join('|')})`, 'gi');//busco las palabras del input
                console.log('regex: ', regex);

                let song_text_red = objSong.song_text.replace(regex, (x) => {
                    return `<b class="c_red">${x}</b>`;
                });

                vista_song_content.innerHTML = song_text_red;

                resetBlockCancion();
                resetLineasXinBlock(eid_block_cancion);
            }

            tbody.append(tr);
        });
    }else{
        console.log('no hay coincidencias...');
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="td_no_data">
                    <p class="prim">No se encontraron canciones con la frase: "<b>${frase}</b>"</p>
                </td>
            </tr>
        `;
    }
}


async function findWordsLista(){
    console.log('=== async function findWordsLista() ===');
    //console.log('--- frase: ', frase);
    //console.time('time_findWordsNew');

    const eid_inpt_find_lista = document.getElementById('inpt_find_lista');
    const eid_modo_lista = document.getElementById('modo_lista');

    let frase = eid_inpt_find_lista.value;
    let modo = eid_modo_lista.value;

    let words_input = frase.trim();
    if(words_input == ''){
        console.log('21. no has introducido nada....');
        return;
    }

    let arr_words;    
    if(words_input.includes(' ')){
        arr_words = words_input.split(' ');
    }else{
        arr_words = [words_input];
    }

    if(arr_words.length === 0){
        console.log('2. no has introducido nada....');
        return;
    }

    objFindListaParams.words_input = words_input;
    objFindListaParams.modo = modo;


    const objData = await getListaTextFromBdByFind(objFindListaParams);
    console.log('objData: ', objData);


    if(esObjeto(objData) && objData.arr_data.length > 0){
        console.log('hay coincidencias...');

        tbody_lista.innerHTML = '';//reset

        eid_titulo_tabla_lista.querySelector('b').style.display = 'inline';
        eid_titulo_tabla_lista.querySelector('b').textContent = objData.arr_data.length;

        //Recorrer canciones encontradas...
        objData.arr_data.forEach((el, i, arr) => {
            console.log('el: ', el);

            const tr = document.createElement('tr');
            tr.className = 'tr_list';
            tr.dataset.id = el.id_lista;

            tr.innerHTML = `
                <td class="td_n">${i + 1}</td>
                <td class="td_id_lista" data-id_lista="${el.id_lista}" title="${el.id_lista}">${el.id_lista}</td>
                <td class="td_titulo">${el.title}</td>
                <td class="td_fecha">${el.fecha || '---'}</td>            
                <td class="td_creado">${el.created_at || '---'}</td>
                <td class="td_actualizado">${el.updated_at || '---'}</td>
            `;

            tr.onclick = (e)=>{
                console.log('e.currentTarget: ', e.currentTarget);
                id_lista = e.currentTarget.dataset.id;
                console.log('asigno global --- id_lista: ', id_lista);

                resetTrSelected(tbody_lista);
                e.currentTarget.classList.add('selected');

                const wr_vista_song = eid_block_lista.querySelector('.wr_vista_song');
                wr_vista_song.style.gap = '5px';
                wr_vista_song.innerHTML = `
                    <div class="vista_song_content">...</div>
                `;//reset. ya que debe existir el 'div.vista_song_content' lo meto de nuevo.

                const vista_song_content = eid_block_lista.querySelector('.vista_song_content');
                vista_song_content.innerHTML = '';//reset

                const wr_btns_action = eid_block_lista.querySelector('.wr_btns_action');
                wr_btns_action.innerHTML = `
                    <button class="btn" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</button>
                    <button class="btn" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</button>
                    <button class="btn" onclick="showBlockName('cancion'); editar_song('ver');">Ver canción</button>
                    <button class="btn" onclick="showBlockName('cancion'); editar_song('editar');">Editar canción</button>
                    <button class="btn" onclick="showBlockName('cancion'); eliminar_song();">Eliminar canción</button>
                    <button class="btn" onclick="crearSlides()">Crear slides</button>
                    <button class="btn" onclick="crearSlides(); closeAll()">Crear slides + Ver</button>
                    <button class="btn" onclick="addToLista();">Añadir a la Lista</button>
                `;

                //dejo '==' en vez de '===' porque id_song viene como string "925"
                objLista = arr.find(s => s.id_lista == id_lista);
                console.log('objLista: ', objLista);
                
                

                

                // Normalizamos palabras
                const arr_normalized = arr_words.map(normalize);
                console.log('arr_normalized: ', arr_normalized);

                //const regex = new RegExp(`(${arr_words.join('|')})`, 'gi');//busco las palabras del input
                // console.log('regex: ', regex);

                // Creamos regex sin acentos
                const regex = new RegExp(`(${arr_normalized.join('|')})`, 'gi');
                console.log('regex: ', regex);

                let lista_text_red = objLista.title.replace(regex, (x) => {
                    return `<b class="c_red">${x}</b>`;
                });

                vista_song_content.innerHTML = lista_text_red;

                // resetBlockLista();
                // resetLineasXinBlock(eid_block_lista);






                let arr_lista_bd = JSON.parse(objLista.arr_lista);
                console.log('arr_lista_bd: ', arr_lista_bd);

                if(Array.isArray(arr_lista_bd) && arr_lista_bd.length > 0){

                    arr_lista_bd.forEach((item, i) => {
                        console.log('item: ', item);

                        const p = document.createElement('p');
                        p.className = 'p_list';
                        p.dataset.id_song = item.id_song;
                        p.innerHTML =`
                            <span class="l_n">${i + 1}.</span>
                            <span class="l_title">${item.title}</span>
                            <span class="l_tune">${item.tune || '--'}</span>
                        `;
                        p.onclick = (e) => {
                            console.log(e.currentTarget.dataset.id_song);
                            let este_id_song = e.currentTarget.dataset.id_song;

                            alert(este_id_song);
                        }

                        wr_vista_song.append(p);
                    });

                }


            }

            tbody_lista.append(tr);
        });
    }else{
        console.log('no hay coincidencias...');
        tbody_lista.innerHTML = `
            <tr>
                <td colspan="6" class="td_no_data">
                    <p class="prim">No se encontraron listas con la frase: "<b>${frase}</b>"</p>
                </td>
            </tr>
        `;
    }
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

