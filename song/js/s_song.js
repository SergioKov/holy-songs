//=================================================================//
// start - F U N C T I O N S  
//=================================================================//

function init() {
    ajustarTexto();
    pintParrafosAcordes();
    pintTipoAcorde();
    transponerTodosLosAcordes(currentTransposition);
    scrollToSlide(currentSlide);

    crear_objSongbooks();
}

async function crear_objSongbooks(){
    console.log('=== function crear_objSongbooks() ===');

    objSongbooks = await getSongbooksFromBd();
    console.log(`objSongbooks: `, objSongbooks);
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

    //si hay. quito el primer elemento que es titulo de la cancion para no mostrarlo en ver_esquema() y crear_esquema()
    if(arr_esquema_bucle[0] == '_titulo_cancion_'){
        //arr_esquema_bucle.splice(0,1);
        console.log('(quitado titulo) --- arr_esquema_bucle (sin titulo cancion): ', arr_esquema_bucle);
    }

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

    if(Object.keys(obj_bloques).length > 0){
        console.log('obj_bloques es correcto y no vacio');
        
    }else{//DORABOTAT!!!
        console.log('obj_bloques es vacio: ');
        alert('obj_bloques es vacio. edita el texto de la cancion para poder separarlo en bloques');
        
        // showEdit('cancion');
        // showBlockName('cancion'); 
        // editar_song('ver');
        // return;

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
    wr_vista_blocks.classList.remove('wr_full_block');
    
    eid_block_esquema.querySelector('.bloques_outer #btn_pantallaShow')?.remove();//quito btn que solo esta en select_slide()
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

            const btn_clicked = e.currentTarget;
            resetBtnActive(wr_vista_btns);//reseteo btn_active de botones en el contenedor
            btn_clicked.classList.add('btn_active');


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

    pintParrafosAcordes();//para pintar barras de acordes como mas finas

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
    wr_vista_blocks.classList.remove('wr_full_block');
    
    eid_block_esquema.querySelector('.bloques_outer #btn_pantallaShow')?.remove();//quito btn que solo esta en select_slide()
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
            
            if(titulo !== '_titulo_cancion_'){//no pinto el titulo de la cancion
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
    
                wr_vista_blocks.append(el_fieldset_cloned);
                el_fieldset_cloned.scrollIntoView({behavior: 'smooth'});
    
                wr_btns_action.innerHTML = `
                    <button id="btn_resetEsquema" class="btn" onclick="resetEsquema()">Reset</button>
                    <button id="btn_guardarEsquema" class="btn" onclick="guardarEsquema()">Guardar</button>
                    <button id="btn_crearSlides_ver" class="btn" onclick="crearSlides(); closeAll()">Ver slides</button>
                    <button id="btn_crearSlides_ver" class="btn" onclick="guardarEsquema(); crearSlides(); closeAll()">Guardar + Ver slides</button>
                `;
    
                wr_vista_btns.append(btn_close);
            }
    
        }// end onclick
        
        song_bloques.append(slide_clone.querySelector('fieldset'));
        
    });

    pintParrafosAcordes();//para pintar barras de acordes como mas finas
}


async function select_slide(){
    console.log('=== function select_slide() ===');

    if(!hay_id_song('select_slide()')){
        return; // <- se detiene aquí si no hay id_song
    }

    console.log('obj_bloques esta vacio, lo creo...');
    obj_bloques = await getSongBlocks();

    console.log('obj_bloques: ', obj_bloques);

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);
    
    song_bloques.innerHTML = '';//reset
    wr_vista_btns.innerHTML = '';//reset
    wr_vista_blocks.innerHTML = '';//reset
    wr_btns_action.innerHTML = '';//reset

    song_bloques.classList.remove('solo_ver');
    wr_vista_blocks.classList.add('wr_full_block');//para que ocupe todo el ancho posible

    eid_block_esquema.querySelector('.bl_parte_l h4').textContent = 'Diapositiva para mostrar:';
    eid_block_esquema.querySelector('.bl_parte_l h5').textContent = 'Selecciona una diapositiva de las disponibles:';
    eid_block_esquema.querySelector('.bl_parte_c h5').textContent = 'Estructura corta:';
    eid_block_esquema.querySelector('.bl_parte_r h5').textContent = 'Diapositiva ACTUAL:';

    //creo el btn de pantallaShow
    const btn_pantallaShow = document.createElement('div');
    btn_pantallaShow.id = 'btn_pantallaShow';
    btn_pantallaShow.className = 'btn';
    btn_pantallaShow.title = 'Mostrar Pantalla';
    btn_pantallaShow.innerHTML = `
        <img src="images/monitor_1_white.png">
    `;
    btn_pantallaShow.onclick = () => { 
        //alert('en sdesarrollo...')
        enableDisablePantallaShow(); 
    };
    eid_block_esquema.querySelector('.bl_parte_r .bloques_outer').append(btn_pantallaShow);

    check_pantallaShow();//reviso si marco en rojo o no
    
    resetBtnActive(eid_block_esquema_head);//reseteo btn_active de botones en el contenedor
    eid_block_esquema_head.querySelector('#btn_select_slide').classList.add('btn_active');

    wr_esquema_actual.style.display = 'none';//oculto el contenedor de esquema actual por no hacer falta (y no duplicar vista de datos)

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

        let titulo_orig = (objSongBd.arr_esquema) ? objSongBd.arr_esquema[i]?.nombre : titulo ;
        let titulo_text = titulo_orig;
        console.log('titulo_text: ', titulo_text); 
        
        let titulo_count_veces = (objSongBd.arr_esquema) ? objSongBd.arr_esquema[i]?.veces : 1 ;
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
            
            showOneSlideFrom(e.currentTarget, arr_esquema_bucle);
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
            
            showOneSlideFrom(e.currentTarget, arr_esquema_bucle);
        }
        
        //añado al DOM
        song_bloques.append(el_fieldset_cloned);
        wr_vista_btns.append(btn_simple);
    });

    wr_btns_action.innerHTML = `
        <button id="btn_crearSlides" class="btn" onclick="crearSlides();">Crear slides</button>
        <button id="btn_crearSlides" class="btn" onclick="window.open('pantalla.php','miPestaña');">Pestaña</button>
        <button id="btn_crearSlides" class="btn" onclick="window.open('pantalla.php','miVentana', 'width=800,height=600,top=100,left=100,resizable=yes,scrollbars=yes');">Ventana</button>
        <button id="btn_crearSlides_ver" class="btn" onclick="crearSlides(); closeAll()">Crear slides + Ver</button>
    `;
    
    pintParrafosAcordes();//para pintar barras de acordes como mas finas
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
    const clone = contenedor.querySelector('.wr_full_block_inner').cloneNode(true);
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
    //             <td class="td_songbook">...</td>
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

    resetBlockEsquemaSoloHTML()

    arr_esquema_obj = [];
    id_song = null;
}

function resetBlockEsquemaSoloHTML(){
    console.log('=== function resetBlockEsquema() ===');

    resetBtnActive(eid_block_esquema_head);//reseteo btn_active de botones en el contenedor

    eid_block_esquema.querySelector('.song_bloques').innerHTML = '...';//reset
    eid_block_esquema.querySelector('.wr_vista_btns').innerHTML = '...';//reset
    eid_block_esquema.querySelector('.wr_vista_blocks').innerHTML = '...';//reset
    eid_block_esquema.querySelector('.wr_btns_action').innerHTML = '...';//reset
    
    eid_block_esquema.querySelector('.wr_esquema_actual').style.display = 'none';//reset
    eid_block_esquema.querySelector('.wr_vista_btns_actual').innerHTML = '...';//reset
    eid_block_esquema.querySelector('.bloques_outer #btn_pantallaShow')?.remove();//quito btn que solo esta en select_slide()

    song_bloques.classList.remove('solo_ver');
    wr_vista_blocks.classList.remove('wr_full_block');
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

    resetBtnActive(eid_block_lista_head);//reseteo btn_active de botones en el contenedor

    lista_wr_vista_song.innerHTML = '...';//reset
    lista_wr_btns_action.innerHTML = '...';//reset  

    console.log('end func');
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
        let songbook = document.getElementById("songbook").value.trim();
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
            songbook: songbook,
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
            console.log(`Error al guardar canción.`);
            
            //"Error al registrar el usuario";
            console.error(data.error);
            console.error(data.dic_code);

            let error_text = 'Error al guardar la canción.';
    
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
        console.log(`Error al eliminar la canción.`);
        
        //"Error al registrar el usuario";
        console.error(data.error);
        console.error(data.dic_code);

        let error_text = 'Error al eliminar la canción.';

        form_mensaje.innerHTML = `<span class="add_result add_error">${error_text}</span>`;
        cancion_song_bloques.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
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

        let arr_lista_str;//debe ser string ya se mete en la bd como string

        if(id_lista == null){
            console.log('es lista NUEVA');
            arr_lista_str = JSON.stringify(arr_lista);

            if(arr_lista.length == 0){
                console.log('es lista NUEVA y el array está vacío');
            }else{
                console.log('es lista NUEVA y el array está lleno');
            }

        }else{
            console.log('es lista EDITADA');
            if(esString(objLista.arr_lista)){
                arr_lista_str = objLista.arr_lista;
            }else{
                arr_lista_str = JSON.stringify(objLista.arr_lista);
            }

            if(objLista.arr_lista.length == 0){
                console.log('es lista EDITADA y el array está vacío');
            }else{
                console.log('es lista EDITADA y el array está lleno');
            }
        }

        console.log('arr_lista_str: ', arr_lista_str);

        const objListaToSend = {
            id_lista: id_lista || null, //ya que se añade una nueva lista, no hay id_lista
            title: title,
            arr_lista: arr_lista_str, //como STRING siempre aki
            fecha: fecha,
            fecha_ver: convertirFecha(fecha, 'ver','/'),
            notes: notes,
        }
        console.log('objListaToSend: ',objListaToSend);
    
        const data = await insertarListaDatos(objListaToSend);
        console.log('data: ',data);

    
        if(data.success){                
            
            let text_show;

            if(data.action == 'is_insert'){
                text_show = 'Lista añadida con éxito.';
            }else if(data.action == 'is_update'){
                text_show = 'Lista actualizada con éxito.';
            }
            console.log(text_show);
    
            form_mensaje_lista.innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
            form_lista.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
            setTimeout(()=>{
                form_mensaje_lista.innerHTML = `
                    <span class="sp_id">
                        <span>Id: <b class="c_green">${data.id_lista}</b></span>
                        <span><b class="guardado">GUARDADO</b></span>
                    </span>
                `;
            }, 2000);
            setTimeout(()=>{
                form_mensaje_lista.querySelector('.guardado').remove();
            }, 4000);

            if(data.id_lista){
                console.log('id_lista: ', data.id_lista);
                id_lista = data.id_lista;//guardo el id de la canción recién creada

                objLista = objListaToSend;//reasigno el objeto lista con los datos del formulario                
                objLista.id_lista = id_lista;//añado el id_lista al objeto lista
                objLista.arr_lista = arr_lista;//formato array correcto
                console.log('objLista: ', objLista);

                //pinto la lista activa en el contenedor de listas sin marcar en rojo el texto
                pintListaActiveSoloDatos(objLista);

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
            console.error(data.error);
            //console.error(data.dic_code);

            let error_text = 'Error al añadir la lista.';
    
            form_mensaje_lista.innerHTML = `<span class="add_result add_error">${error_text}</span>`;
            form_lista.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarLista. error: ',error);
    }

}

async function deleteLista(){
    console.log('=== function deleteLista() ===');

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
        }
        
    }else{
        console.log(`Error al eliminar la lista.`);
        
        //"Error al eliminar la lista";
        console.error(data.error);

        let error_text = 'Error al eliminar la lista.';

        p_mensaje.innerHTML = `<span class="add_result add_error">${error_text}</span>`;
        contenedor_lista_sm.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
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


    let frase = eid_inpt_find.value;
    let modo = eid_modo.value;
    let buscar_en = eid_buscar_en.value;

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
    objFindParams.buscar_en = buscar_en;

    const objData = await getSongTextFromBdByFind(objFindParams);
    console.log('objData: ', objData);

    if(esObjeto(objData) && objData.arr_data.length > 0){
        console.log('hay coincidencias...');

        tbody.innerHTML = '';//reset

        eid_titulo_tabla_song.querySelector('b').style.display = 'inline';
        eid_titulo_tabla_song.querySelector('b').textContent = objData.arr_data.length;

        //Recorrer canciones encontradas...
        objData.arr_data.forEach((el, i, arr) => {
            //console.log('el: ', el);

            const tr = document.createElement('tr');
            tr.className = 'tr_song';
            tr.dataset.id = el.id_song;

            tr.innerHTML = `
                <td class="td_n">${i + 1}</td>
                <td class="td_id_song" data-id_song="${el.id_song}" title="${el.id_song}">${el.id_song}</td>
                <td class="td_numero">${el.song_number || ''}</td>
                <td class="td_titulo">${el.title}</td>
                <td class="td_esquema">${el.arr_esquema?.length ? 'Sí' : ''}</td>            
                <td class="td_category" data-category="${el.category}">${el.category_name || ''}</td>            
                <td class="td_songbook" data-songbook="${el.songbook}">${el.songbook_title || ''}</td>            
                <td class="td_idioma" data-lang_name="${el.lang_name}">${obj_lang_names[el.lang] || el.lang}</td>
                <td class="td_tonalidad">${el.tune}</td>
            `;

            tr.onclick = (e)=>{
                pintSongActive(e, arr, arr_words);//en la ventana a la derecha de la tabla de lista
            }//end - tr.onclick

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

    let frase = eid_inpt_find_lista.value;
    let modo = eid_modo_lista.value;
    let buscar_en = eid_buscar_en_lista.value;

    let words_input = frase.trim();
    if(words_input == ''){
        console.log('21. no has introducido nada....');
        return;
    }

    let arr_words = [];    
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
    objFindListaParams.buscar_en = buscar_en;


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
            tr.className = 'tr_lista';
            tr.dataset.id = el.id_lista;

            let fecha_str = (el.fecha && el.fecha !== '0000-00-00') ? el.fecha : '' ;
            let diaSemana_val = '';
            let fecha_val = '';

            if(fecha_str){
                diaSemana_val = diaSemana(fecha_str);
                fecha_val = convertirFecha(fecha_str, 'ver', '/');
            }

            tr.innerHTML = `
                <td class="td_n">${i + 1}</td>
                <td class="td_id_lista" data-id_lista="${el.id_lista}" title="${el.id_lista}">${el.id_lista}</td>
                <td class="td_titulo">${el.title}</td>
                <td class="td_dia_semana">${diaSemana_val}</td>            
                <td class="td_fecha">${fecha_val}</td>            
                <td class="td_lista">${(el.arr_lista) ? 'Sí' : ''}</td>
            `;

            tr.onclick = (e) => {                
                pintListaActive(e, arr, arr_words);//en la ventana a la derecha de la tabla de lista
            }//end - tr.onclick

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

    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_btns_action.innerHTML = '...';//reset 
    
    pintSongbooksOptions(cancion_form_container.querySelector('#songbook'));

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

    pintSongbooksOptions(cancion_form_container.querySelector('#songbook'));   

    cancion_song_bloques.classList.add('solo_ver');
    
    cancion_song_bloques.querySelector('.puntos_def').style.display = 'none';//oculto '...'
    cancion_form_container.style.display = 'block';//mostrar formulario de canción

    cancion_form_container.querySelector('form').reset();//reseteo formulario    
    
    cancion_form_container.querySelector('#title').value = objSong.title || '';
    cancion_form_container.querySelector('#category').value = objSong.category || '';
    cancion_form_container.querySelector('#songbook').value = objSong.songbook || '';
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