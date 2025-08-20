//=================================================================//
// start - variables  
//=================================================================//

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


const eid_titulo_tabla_song = document.getElementById('titulo_tabla_song');
const eid_titulo_tabla_lista = document.getElementById('titulo_tabla_lista');

const song_bloques = eid_block_esquema.querySelector('.song_bloques');
const wr_vista_btns = eid_block_esquema.querySelector('.wr_vista_btns');
const wr_esquema_actual = eid_block_esquema.querySelector('.wr_esquema_actual');
const wr_vista_btns_actual = eid_block_esquema.querySelector('.wr_vista_btns_actual');
const wr_vista_blocks = eid_block_esquema.querySelector('.wr_vista_blocks');
const wr_btns_action = eid_block_esquema.querySelector('.wr_btns_action');

const cancion_song_bloques = eid_block_cancion.querySelector('.song_bloques');
const cancion_wr_vista_blocks = eid_block_cancion.querySelector('.wr_vista_blocks');
const cancion_wr_btns_action = eid_block_cancion.querySelector('.wr_btns_action');
const cancion_form_container = eid_block_cancion.querySelector('.form_container');

const form_mensaje = cancion_form_container.querySelector('form .mensaje');

const ejemplo_song_bloques = eid_block_ejemplo.querySelector('.song_bloques');
const ejemplo_wr_vista_blocks = eid_block_ejemplo.querySelector('.wr_vista_blocks');
const ejemplo_form_container = eid_block_ejemplo.querySelector('.form_container');

const form = eid_block_cancion.querySelector('form');
const form_ejemplo = eid_block_ejemplo.querySelector('form');

const eid_song_text = document.getElementById('song_text');
const eid_song_text_ejemplo = document.getElementById('song_text_ejemplo');



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



let arr_esquema_obj = [];//array de objetos

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
    'Структура',
    'Схема',

];

//obtener datos de los ficheros json o de la base de datos
//let modo_get_song = 'from_json';
let modo_get_song = 'from_bd';
let objSongBd = {};//datos de bd de song

let obj_bloques = {};//elementos html de slides: kuplet, pripev bridge sin repetirse
let arr_esquema_bucle = [];//array de objetos con los bloques de esquema, sin repetirse

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


//=================================================================//
// end - variables  
//=================================================================//