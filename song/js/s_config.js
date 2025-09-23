
//en Header
const header = document.querySelector('header');
const barra_estado = document.querySelector('.barra_estado');
const stepsContainer = document.querySelector('.steps_container');
const hamburger = document.getElementById('hamburger');
const puntosMenu = document.getElementById('puntosMenu');

//En Carousel
const carousel = document.getElementById('carousel');
const slideContainer = carousel.querySelector('.slide_container');
const slides = slideContainer.children;

const calculando = document.getElementById('calculando');

let totalSlides = slides.length;
let currentSlide = parseInt(localStorage.getItem('currentSlide')) || 0;

//'-1' significa que no se encuentra el index en arr_lita. 
// esto es para luego buscar index de objSong por su id_song de la canción actual en la lista
let currentIndexOfArrLista = -1;//index de la canción actual en la lista. por defecto (no hay en la lista)
let nextIndexOfArrLista = -1;//index de la canción siguiente en la lista. por defecto (no hay en la lista)
let prevIndexOfArrLista = -1;//index de la canción previa en la lista. por defecto (no hay en la lista)

let id_song_next = null;//id_song de la canción siguiente en arr_lista
let id_song_prev = null;//id_song de la canción previa en  arr_lista

let go_to_last_slide_of_prev_song = true;//[true,false]//para pasar a la siguiente canción de la lista automáticamente al llegar al final de los slides

let slideModo;//'smooth','instant','fast'//
//slideModo = 'smooth';//suave
//slideModo = 'instant';//inmediato
slideModo = 'fast';//personalizado con CSS y rápido

//Transponer Acordes
let currentTransposition = parseInt(localStorage.getItem('currentTransposition')) || 0;
let tipoAcorde = localStorage.getItem('tipoAcorde') || 'diez';//'diez' o 'bemol'//diez por defecto
const d_currentTipoAcorde = document.getElementById('d_currentTipoAcorde');

const btn_menu = document.getElementById('btn_menu');
const menu_contenido = document.getElementById('menu_contenido');
const eid_puntosMenu = document.getElementById('puntosMenu');


const d_currentTransposition = document.getElementById('d_currentTransposition');
const btn_diez = document.getElementById('btn_diez');
const btn_bemol = document.getElementById('btn_bemol');

//==================================================================//
//edit
//==================================================================//
const eid_edit_contenido = document.getElementById('edit_contenido');
const eid_edit_contenido_inner = document.getElementById('edit_contenido_inner');

const ecl_edit_head = eid_edit_contenido.querySelector('.edit_head');
const ecl_edit_body = eid_edit_contenido.querySelector('.edit_body');

const ecl_bl_head = eid_edit_contenido.querySelector('.bl_head');
const ecl_bl_body = eid_edit_contenido.querySelector('.bl_body');

const eid_block_buscar = document.getElementById('block_buscar');
const eid_block_esquema = document.getElementById('block_esquema');
const eid_block_cancion = document.getElementById('block_cancion');
const eid_block_ejemplo = document.getElementById('block_ejemplo');
const eid_block_lista = document.getElementById('block_lista');




//========================================================//
//start - block_buscar
//========================================================//
const eid_block_buscar_head = document.getElementById('block_buscar_head');
const eid_block_buscar_body = document.getElementById('block_buscar_body');

//edit_blocks_head
const buscar_option_inner = eid_block_buscar.querySelector('.wr_block_option_inner');
const buscar_ul_action = eid_block_buscar.querySelector('.ul_action');

//bl_parte_l
const eid_inpt_find = document.getElementById('inpt_find');
const eid_modo = document.getElementById('modo');
const eid_buscar_en = document.getElementById('buscar_en');

const eid_d_sel_songbooks = document.getElementById('d_sel_songbooks');
const eid_bl_songbook_search = document.getElementById('bl_songbook_search');
const eid_wr_sb_checkboxes = document.getElementById('wr_sb_checkboxes');
const btn_songbook_search = document.getElementById('btn_songbook_search');

const eid_sp_icon_filtro = document.getElementById('sp_icon_filtro');
const eid_d_filter_results = document.getElementById('d_filter_results');
const eid_inpt_filter = document.getElementById('inpt_filter');

const eid_titulo_tabla_song = document.getElementById('titulo_tabla_song');
const tbody = eid_block_buscar.querySelector('.wr_tabla table tbody');

//bl_parte_r
const buscar_vista_song_content = eid_block_buscar.querySelector('.vista_song_content');
//========================================================//
//end - block_buscar
//========================================================//


//========================================================//
//start - block_esquema
//========================================================//
const eid_block_esquema_head = document.getElementById('block_esquema_head');
const ecl_block_esquema_body = document.getElementById('block_esquema_body');

//edit_blocks_head
const esquema_option_inner = eid_block_esquema.querySelector('.wr_block_option_inner');
const ver_esquema_ul_action = eid_block_esquema.querySelector('.vklad_ver_esquema .ul_action');
const crear_esquema_ul_action = eid_block_esquema.querySelector('.vklad_crear_esquema .ul_action');
const select_slide_ul_action = eid_block_esquema.querySelector('.vklad_select_slide .ul_action');

//bl_parte_l
const ver_esquema_song_bloques = eid_block_esquema.querySelector('.vklad_ver_esquema .song_bloques');
//bl_parte_c
const ver_esquema_wr_vista_btns = eid_block_esquema.querySelector('.vklad_ver_esquema .wr_vista_btns');
//bl_parte_r
const ver_esquema_wr_vista_blocks = eid_block_esquema.querySelector('.vklad_ver_esquema .wr_vista_blocks');
//--------------------------------------------------------------------------//
//bl_parte_l
const crear_esquema_song_bloques = eid_block_esquema.querySelector('.vklad_crear_esquema .song_bloques');
//bl_parte_c
const crear_esquema_wr_vista_btns = eid_block_esquema.querySelector('.vklad_crear_esquema .wr_vista_btns');
const crear_esquema_wr_vista_btns_actual = eid_block_esquema.querySelector('.vklad_crear_esquema .wr_vista_btns_actual');
const crear_esquema_wr_esquema_actual = eid_block_esquema.querySelector('.vklad_crear_esquema .wr_esquema_actual');//en crear_esquema
//bl_parte_r
const crear_esquema_wr_vista_blocks = eid_block_esquema.querySelector('.vklad_crear_esquema .wr_vista_blocks');
//--------------------------------------------------------------------------//
//bl_parte_l
const select_slide_song_bloques = eid_block_esquema.querySelector('.vklad_select_slide .song_bloques');
//bl_parte_c
const select_slide_wr_vista_btns = eid_block_esquema.querySelector('.vklad_select_slide .wr_vista_btns');
//bl_parte_r
const select_slide_wr_vista_blocks = eid_block_esquema.querySelector('.vklad_select_slide .wr_vista_blocks');

const eid_contenedor_nav_pantalla = document.getElementById('contenedor_nav_pantalla');//aki se coloca div 'wr_btns_pantalla'
const eid_pantalla_body = document.getElementById('pantalla_body');//para slide en select_slide()
const eid_fondo_body = document.getElementById('fondo_body');//para slide en select_slide()
const eid_contenedor_prev = document.getElementById('contenedor_prev');//para slide en select_slide()
const eid_contenedor_prev_inner = document.getElementById('contenedor_prev_inner');//para slide en select_slide()
const eid_vklad_btn_pantallaShow = document.getElementById('vklad_btn_pantallaShow');
const eid_titulo_shown = document.getElementById('titulo_shown');
//========================================================//
//end - block_esquema
//========================================================//



//========================================================//
//start - block_cancion
//========================================================//
const eid_block_cancion_head = document.getElementById('block_cancion_head');
const eid_block_cancion_body = document.getElementById('block_cancion_body');

//edit_blocks_head
const cancion_option_inner = eid_block_cancion.querySelector('.wr_block_option_inner');
const cancion_ul_action = eid_block_cancion.querySelector('.ul_action');

//bl_parte_l
const cancion_song_bloques = eid_block_cancion.querySelector('.song_bloques');
const cancion_form_container = eid_block_cancion.querySelector('.form_container');
const form = eid_block_cancion.querySelector('form');

//bl_parte_r
const cancion_wr_vista_blocks = eid_block_cancion.querySelector('.wr_vista_blocks');
//========================================================//
//end - block_cancion
//========================================================//



//========================================================//
//start - block_ejemplo
//========================================================//
const eid_block_ejemplo_head = document.getElementById('block_ejemplo_head');
const eid_block_ejemplo_body = document.getElementById('block_ejemplo_body');

//edit_blocks_head
const ejemplo_option_inner = eid_block_ejemplo.querySelector('.wr_block_option_inner');
const ejemplo_ul_action = eid_block_ejemplo.querySelector('.ul_action');

//bl_parte_l
const ejemplo_song_bloques = eid_block_ejemplo.querySelector('.song_bloques');

//bl_parte_r
const ejemplo_wr_vista_blocks = eid_block_ejemplo.querySelector('.wr_vista_blocks');
//========================================================//
//end - block_ejemplo
//========================================================//




//========================================================//
//start - block_lista
//========================================================//
const eid_block_lista_head = document.getElementById('block_lista_head');
const eid_block_lista_body = document.getElementById('block_lista_body');

//edit_blocks_head
const lista_option_inner = eid_block_lista.querySelector('.wr_block_option_inner');
const lista_ul_action = eid_block_lista.querySelector('.ul_action');

//bl_parte_l
const eid_inpt_find_lista = document.getElementById('inpt_find_lista');
const eid_modo_lista = document.getElementById('modo_lista');
const eid_buscar_en_lista = document.getElementById('buscar_en_lista');

const eid_sp_icon_filtro_lista = document.getElementById('sp_icon_filtro_lista');
const eid_d_filter_results_lista = document.getElementById('d_filter_results_lista');
const eid_inpt_filter_lista = document.getElementById('inpt_filter_lista');

const eid_titulo_tabla_lista = document.getElementById('titulo_tabla_lista');
const tbody_lista = eid_block_lista.querySelector('.wr_tabla table tbody');

//bl_parte_r
const lista_vista_lista_content = eid_block_lista.querySelector('.vista_lista_content');
//========================================================//
//end - block_lista
//========================================================//



//==================================================================//
//start - modal.js
//==================================================================//
const eid_myModal = document.getElementById('myModal');
const eid_myModalContent = document.getElementById('myModalContent');

const eid_modcont_header = document.getElementById('modcont_header');
const eid_modcont_body = document.getElementById('modcont_body');
const eid_modcont_footer = document.getElementById('modcont_footer');

const eid_bl_modalTop = document.getElementById('bl_modalTop');
const eid_bl_modalCenter = document.getElementById('bl_modalCenter');
const eid_bl_modalBottom = document.getElementById('bl_modalBottom');
const eid_bl_modalFull = document.getElementById('bl_modalFull');

const eid_bl_modalTopInner = document.getElementById('bl_modalTopInner');
const eid_bl_modalCenterInner = document.getElementById('bl_modalCenterInner');
const eid_bl_modalBottomInner = document.getElementById('bl_modalBottomInner');
const eid_bl_modalFullInner = document.getElementById('bl_modalFullInner');

const eid_h4_text = document.getElementById('h4_text');//text en el header de modcont_header
//==================================================================//
//end - modal.js
//==================================================================//


//==================================================================//
//start - toast
//==================================================================//
const eid_toast_container = document.getElementById("toast_container");
//==================================================================//
//end - toast
//==================================================================//



//====================================================//
//Medidas de pantallas para Media Queries - START
//====================================================//

//MOBILE (0px - 767px)
//const pantallaMobileMinPx = 0;//por ahora no lo uso...
//const pantallaMobileMaxPx = 575;//por ahora no lo uso...
const pantallaMobileMaxPx = 767;//por ahora no lo uso...

//TABLET (768px - )
let pantallaTabletMinPx = 768;//valor de tablet y mas (se usa muchisimo!)
//let pantallaTabletMaxPx = 991;//no uso


//let pantallaDesktopSmallMinPx = 992;//no uso
let pantallaTabletMaxPx = 1023;//uso 1 vez!

let pantallaDesktopSmallMinPx = 1024;//uso 1 vez
//let pantallaDesktopSmallMaxPx = 1199;// no uso

//let pantallaDesktopBigMinPx = 1200;//no uso

//Para ver en tablet verticalmente como en móvil
let modoMobile = false;//[true,false]//para ver como si fuera el móvil en tablet 

if(modoMobile){
    pantallaTabletMinPx = 1201;//pongo 1201 y no 1200 ya qye Samsung tab A9+ verticalmente es de 1200
    pantallaTabletMaxPx = 1439;//uso 1 vez
    pantallaDesktopSmallMinPx = 1439;//uso 1 vez
}
//====================================================//
//Medidas de pantallas para Media Queries - END
//====================================================//



// Get the computed style, including margins
const inner_computedStyle = window.getComputedStyle(document.querySelector('.inner'));//margin: 10px;
const wr_tabla_computedStyle = window.getComputedStyle(document.querySelector('.wr_tabla'));//padding: 10px;


const arr_titulos = [ //las palabras clave para separar el texto por bloques en buildSong()
    'Intro',
    'Verse',
    'Pre-Chorus',
    'Pre Chorus',
    'Chorus',
    'Refrain',
    'Interlude',
    'Solo',
    'Pre-Bridge',
    'Pre Bridge',
    'Bridge',
    'Outro',
    'Ending',
    'Coda',
    'Structure',
    'Scheme',

    'Intro',
    'Verso',
    'Estrofa',
    'Coro',
    'Pre-Estribillo',
    'Pre Estribillo',
    'Preestribillo',
    'Estribillo',
    'Interludio',
    'Solo',
    'Pre-Puente',
    'Pre Puente',
    'Puente',
    'Outro',
    'Final',
    'Finalización',
    'Coda',
    'Estructura',
    'Esquema',
    
    'Інтро',
    'Куплет',
    'Перед Приспів',
    'Передприспів',
    'Приспів',
    'Програш',
    'Перед Брідж',
    'Брідж',
    'Кінцівка',
    'Кода',
    'Закінчення:',
    'Структура',
    'Схема',
    
    'Інтро',
    'Куплет',
    'Пред Припев',
    'Предприпев',
    'Припев',
    'Проигрыш',
    'Пред Бридж',
    'Бридж',
    'Концовка',
    'Кода',
    'Окончание',
    'Структура',
    'Схема',

];

const arr_titulos_coro = [ //las palabras clave de Pripev o Coro para separar el texto por bloques en buildSong()
    'Pre-Chorus',
    'Pre Chorus',
    'Chorus',
    'Refrain',

    'Coro',
    'Pre-Estribillo',
    'Pre Estribillo',
    'Preestribillo',
    'Estribillo',
    
    'Перед Приспів',
    'Передприспів',
    'Приспів',
    
    'Пред Припев',
    'Предприпев',
    'Припев',
];

const arr_titulos_coda = [ //las palabras clave para separar el texto por bloques en buildSong()
    'Outro',
    'Ending',
    'Coda',

    'Outro',
    'Final',
    'Finalización',
    'Coda',
    
    'Кінцівка',
    'Кода',
    'Закінчення:',
    
    'Концовка',
    'Кода',
    'Окончание',
];

const arr_pages = [ //las palabras clave para separar el texto por bloques en buildSong()
    'Page',

    'Pagina',
    
    'Сторінка',
    
    'Страница',
];

//obtener datos de los ficheros json o de la base de datos
//let modo_get_song = 'from_json';
let modo_get_song = 'from_bd';

let objDataSongsBd = {};//objeto con datos de BD de todas las canciones encontradas en 'Buscar' 
let objDataSongs = {};//objeto con datos de todas las canciones encontradas en 'Buscar' 

let objDataListasBd = {};//objeto con datos de BD de todas las listas encontradas en 'Lista' 
let objDataListas = {};//objeto con datos de todas las listas encontradas en 'Lista' 

let objSongBd = {};//datos de bd de song

let obj_bloques = {};//elementos html de slides: kuplet, pripev bridge (SIN REPETIRSE)
let obj_pages = {};//elementos html de slides: kuplet, pripev bridge todo juntos para el texto maximo en una hoja

let arr_esquema_obj = [];//array de objetos temporal para guardar el esquema creada en crear_esquema()
let arr_esquema_bucle = [];//array de objetos con los bloques de esquema, sin repetirse
let arr_esquema_bd = [];//array de objetos de BD
let arr_esquema_titlulos = [];// solo titulos ['Intro'], no obj {nombre: 'Intro', veces:2} 

let arr_fieldsets = [];//todos los html slides// se asigna al crearSlides() y select_slide()

let objSongDemo = {
    id_song: 1351,
    song_number: 777,
    title: 'Es song test insertar',
    category: 888,
    song_text: 'tralala tralala song_text',
    arr_esquema: null,
    tune: 'Em',
    notes: 'es una demo song',
    count: 33,
};

let objSong = {};
let id_song = null;//id de la canción actual

let objLista = {};
let id_lista = null;//id de la lista actual
let lista_id_song = null;//id de song clicked de la lista actual

let objSongbooksBd = {};//datos de BD de todos songbooks
let objSongbooks = {};//datos de todos songbooks


let obj_lang_names = {
    'ua': 'Укр.',
    'ru': 'Рус.',
    'en': 'Eng.',
    'es': 'Esp.',
    'pt': 'Port.',
    'fr': 'Fran.',
    'de': 'Deut.',
    'it': 'It.',
    'pl': 'Pol.',
    // Agrega más idiomas según sea necesario
};

let objFindParams = {
    words_input: '',
    lang: '',//idioma de la canción
    buscar_en: '',// campos para buscar en
};

let objFindListaParams = {
    words_input: '',
    buscar_en: '',// campos para buscar en
};

// let arr_lista = JSON.parse(localStorage.getItem('arr_lista')) || [] ;
let arr_lista = [];
let arr_lista_ids = [];//[8051,8052] - solo los id_song



let made_draggable_once = false;

let arr_pantalla;

let pantallaShow = JSON.parse(localStorage.getItem('pantallaShow') ?? 'false');//por defecto pantalla no se ve
//pantallaShow = true;//test
//pantallaShow = localStorage.setItem('pantallaShow', true);

let vkladActive = localStorage.getItem('vkladActive') || 'ver_esquema';//[ver_esquema, crear_esquema, select_slide]
//obj_ajustes.sidebarTabActive = sidebarTabActive;


let debug = false;//hacer test


let arr_words = [];//para buscar cancion en pestaña 'buscar'
let arr_words_lista = [];//para buscar lista en pestaña 'lista'

//let pageActiveBuscar = null;
let pageActiveEsquema = null;
let pageActiveCancion = null;
let pageActiveEjemplo = null;
//let pageActiveLista = null;

let mostrarPrim = true;