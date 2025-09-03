
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

//edit
const eid_edit_contenido = document.getElementById('edit_contenido');
const eid_edit_contenido_inner = document.getElementById('edit_contenido_inner');
const ecl_edit_head = eid_edit_contenido.querySelector('.edit_head');
const ecl_edit_body = eid_edit_contenido.querySelector('.edit_body');

const eid_block_buscar = document.getElementById('block_buscar');
const eid_block_esquema = document.getElementById('block_esquema');
const eid_block_cancion = document.getElementById('block_cancion');
const eid_block_ejemplo = document.getElementById('block_ejemplo');
const eid_block_lista = document.getElementById('block_lista');

const eid_block_editar = document.getElementById('block_editar');
const eid_block_eliminar = document.getElementById('block_eliminar');

const tbody = eid_block_buscar.querySelector('.wr_tabla table tbody');
const tbody_lista = eid_block_lista.querySelector('.wr_tabla table tbody');

const eid_block_esquema_head = document.getElementById('block_esquema_head');
const eid_block_cancion_head = document.getElementById('block_cancion_head');
const eid_block_ejemplo_head = document.getElementById('block_ejemplo_head');
const eid_block_lista_head = document.getElementById('block_lista_head');

const eid_inpt_find = document.getElementById('inpt_find');
const eid_modo = document.getElementById('modo');
const eid_buscar_en = document.getElementById('buscar_en');

const eid_inpt_find_lista = document.getElementById('inpt_find_lista');
const eid_modo_lista = document.getElementById('modo_lista');
const eid_buscar_en_lista = document.getElementById('buscar_en_lista');


const eid_titulo_tabla_song = document.getElementById('titulo_tabla_song');
const eid_titulo_tabla_lista = document.getElementById('titulo_tabla_lista');


//bl_parte_l
//const song_bloques = eid_block_esquema.querySelector('.song_bloques');//antes
const ver_esquema_song_bloques = eid_block_esquema.querySelector('.vklad_ver_esquema .song_bloques');
const crear_esquema_song_bloques = eid_block_esquema.querySelector('.vklad_crear_esquema .song_bloques');
const select_slide_song_bloques = eid_block_esquema.querySelector('.vklad_select_slide .song_bloques');


//bl_parte_c
const ver_esquema_wr_vista_btns = eid_block_esquema.querySelector('.vklad_ver_esquema .wr_vista_btns');

const crear_esquema_wr_vista_btns = eid_block_esquema.querySelector('.vklad_crear_esquema .wr_vista_btns');
const crear_esquema_wr_vista_btns_actual = eid_block_esquema.querySelector('.vklad_crear_esquema .wr_vista_btns_actual');
const crear_esquema_wr_esquema_actual = eid_block_esquema.querySelector('.vklad_crear_esquema .wr_esquema_actual');//en crear_esquema

const select_slide_wr_vista_btns = eid_block_esquema.querySelector('.vklad_select_slide .wr_vista_btns');

//bl_parte_r
const ver_esquema_wr_vista_blocks = eid_block_esquema.querySelector('.vklad_ver_esquema .wr_vista_blocks');
const ver_esquema_wr_btns_action = eid_block_esquema.querySelector('.vklad_ver_esquema .wr_btns_action');

const crear_esquema_wr_vista_blocks = eid_block_esquema.querySelector('.vklad_crear_esquema .wr_vista_blocks');
const crear_esquema_wr_btns_action = eid_block_esquema.querySelector('.vklad_crear_esquema .wr_btns_action');

const select_slide_wr_vista_blocks = eid_block_esquema.querySelector('.vklad_select_slide .wr_vista_blocks');
const select_slide_wr_btns_action = eid_block_esquema.querySelector('.vklad_select_slide .wr_btns_action');




const eid_contenedor_nav_pantalla = document.getElementById('contenedor_nav_pantalla');//aki se coloca div 'wr_btns_pantalla'
const eid_pantalla_body = document.getElementById('pantalla_body');//para slide en select_slide()
const eid_fondo_body = document.getElementById('fondo_body');//para slide en select_slide()
const eid_contenedor_prev = document.getElementById('contenedor_prev');//para slide en select_slide()
const eid_contenedor_prev_inner = document.getElementById('contenedor_prev_inner');//para slide en select_slide()
//const eid_btn_pantallaShow = document.getElementById('btn_pantallaShow');//luego miro donde colocar...
const eid_vklad_btn_pantallaShow = document.getElementById('vklad_btn_pantallaShow');
const eid_titulo_shown = document.getElementById('titulo_shown');








const cancion_song_bloques = eid_block_cancion.querySelector('.song_bloques');
const cancion_wr_vista_blocks = eid_block_cancion.querySelector('.wr_vista_blocks');
const cancion_wr_btns_action = eid_block_cancion.querySelector('.wr_btns_action');
const cancion_form_container = eid_block_cancion.querySelector('.form_container');

const form_mensaje = cancion_form_container.querySelector('form .mensaje');

const ejemplo_song_bloques = eid_block_ejemplo.querySelector('.song_bloques');
const ejemplo_wr_vista_blocks = eid_block_ejemplo.querySelector('.wr_vista_blocks');
const ejemplo_form_container = eid_block_ejemplo.querySelector('.form_container');

const lista_wr_vista_song = eid_block_lista.querySelector('.wr_vista_song');
const lista_wr_btns_action = eid_block_lista.querySelector('.wr_btns_action');

const form = eid_block_cancion.querySelector('form');
const form_ejemplo = eid_block_ejemplo.querySelector('form');

const eid_song_text = document.getElementById('song_text');
const eid_song_text_ejemplo = document.getElementById('song_text_ejemplo');



const eid_d_sel_songbooks = document.getElementById('d_sel_songbooks');
const eid_bl_songbook_search = document.getElementById('bl_songbook_search');
const eid_wr_sb_checkboxes = document.getElementById('wr_sb_checkboxes');
const btn_sel_sb = document.getElementById('btn_sel_sb');

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

//obtener datos de los ficheros json o de la base de datos
//let modo_get_song = 'from_json';
let modo_get_song = 'from_bd';

let objDataSongsBd = {};//objeto con datos de BD de todas las canciones encontradas en 'Buscar' 
let objDataSongs = {};//objeto con datos de todas las canciones encontradas en 'Buscar' 

let objDataListasBd = {};//objeto con datos de BD de todas las listas encontradas en 'Lista' 
let objDataListas = {};//objeto con datos de todas las listas encontradas en 'Lista' 

let objSongBd = {};//datos de bd de song

let obj_bloques = {};//elementos html de slides: kuplet, pripev bridge (SIN REPETIRSE)

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
let arr_lista = [] ;



let made_draggable_once = false;

let arr_pantalla;

let pantallaShow = JSON.parse(localStorage.getItem('pantallaShow') ?? 'false');//por defecto pantalla no se ve
//pantallaShow = true;//test
//pantallaShow = localStorage.setItem('pantallaShow', true);

let vkladActive = localStorage.getItem('vkladActive') || 'ver_esquema';//[ver_esquema, crear_esquema, select_slide]
//obj_ajustes.sidebarTabActive = sidebarTabActive;


let debug = false;//hacer test