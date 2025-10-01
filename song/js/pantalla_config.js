const eid_contenedor = document.getElementById('contenedor');
console.log('es pantalla_config.js');

let arr_pantalla = [];
let delay_fn = 200;//200 por defecto
let count_intentos = 0;


let objPantalla = {};
let debug = false;
//debug = true;

//Vars para formar tipo de contenido por defecto
//Admin control
let pantalla_show = false;
let show_logo_en_fondo = false;
let show_bible_en_fondo = false;
let show_black_en_fondo = false;
let user_view_control = false;
//User control
let show_legend = false;
let show_acordes = false;
let show_next_slide = false;

let arr_pantalla_str_old = '';
let arr_pantalla_str_new = '';


let objPantallaParams = {
    pantalla_show,
    show_logo_en_fondo,
    show_bible_en_fondo,
    show_black_en_fondo,
    user_view_control,
    show_legend,
    show_acordes,
    show_next_slide,
}

let objPantallaParams_str_new = '';
let objPantallaParams_str_old = '';