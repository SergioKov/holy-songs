const eid_style_imagen_en_fondo = document.getElementById('style_imagen_en_fondo');
const eid_fondo = document.getElementById('fondo');
const eid_videoFondo = document.getElementById('videoFondo');//para video
const eid_contenedor = document.getElementById('contenedor');

let arr_pantalla = [];
let delay_fn = 200;//200 por defecto
let count_intentos = 0;


let objPantalla = {};
let debug = false;
//debug = true;

//Vars para formar tipo de contenido por defecto
//Admin control
// let pantalla_show = 0;
// let show_logo_en_fondo = 0;
// let show_imagen_en_fondo = 0;
// let bg_ruta = '';
// let bg_media_type = '';
// let video_ruta = '';
// let brillo_pantalla = 100;//default
// let show_bible_en_fondo = 0;
// let show_black_en_fondo = 0;
// let user_view_control = 0;
// //User control
// let show_legend = 0;
// let show_acordes = 0;
// let show_next_slide = 0;
// let show_en_top = 0;
// let show_en_parte_top = 0;
// let show_en_center = 0;


//Vars para formar tipo de contenido por defecto en Pantalla
//igual como 'is_fon_shown' 
// (pantalla_show == 1) => mostrar slide con texto; 
// (pantalla_show == 0) => ocultar slide y mostrar fondo con la biblia abierta
let pantalla_show = JSON.parse(localStorage.getItem('pantalla_show') ?? '0');//por defecto pantalla no se ve;

// (show_logo_en_fondo = true) => mostrar el logotipo de la iglesia cuando el fondo esta mostrado con (pantalla_show = false)
let show_logo_en_fondo = JSON.parse(localStorage.getItem('show_logo_en_fondo') ?? '0');// def false;
let show_imagen_en_fondo = JSON.parse(localStorage.getItem('show_imagen_en_fondo') ?? '0');// def false;
let bg_ruta = localStorage.getItem('bg_ruta') ?? '';// def false;
let bg_media_type = localStorage.getItem('bg_media_type') ?? 'image';// def image;
let video_ruta = localStorage.getItem('video_ruta') ?? '';// def false;
let brillo_pantalla = JSON.parse(localStorage.getItem('brillo_pantalla') ?? '100');// def false;

// (show_bible_en_fondo = true) => mostrar la imagen de la biblia abierta cuando el fondo esta mostrado con (pantalla_show = false)
let show_bible_en_fondo = JSON.parse(localStorage.getItem('show_bible_en_fondo') ?? '0');//def false

// (show_black_en_fondo = true) => mostrar el fondo black cuando el fondo esta mostrado con (pantalla_show = false)
let show_black_en_fondo = JSON.parse(localStorage.getItem('show_black_en_fondo') ?? '0');//def false

// usuario puede/no puede elegir qué mostrar en el slide: legend, acordes, next_slide
let user_view_control = JSON.parse(localStorage.getItem('user_view_control') ?? '0');// def false;

//mostrar/no mostrar legend en slide de pantalla.php
let show_legend = JSON.parse(localStorage.getItem('show_legend') ?? '0');// def false;

//mostrar acordes en slide de pantalla.php
let show_acordes = JSON.parse(localStorage.getItem('show_acordes') ?? '0');// def false;

//mostrar las 2 primeras lineas del siguiente slide (kuplet) de pantalla.php
let show_next_slide = JSON.parse(localStorage.getItem('show_next_slide') ?? '0');// def false;
let show_en_top = JSON.parse(localStorage.getItem('show_en_top') ?? '0');// def false;
let show_en_parte_top = JSON.parse(localStorage.getItem('show_en_parte_top') ?? '0');// def false;
let show_en_center = JSON.parse(localStorage.getItem('show_en_center') ?? '0');// def false;

//mostrar las 2 primeras lineas del siguiente slide (kuplet) de pantalla.php
let tipo_fuente = localStorage.getItem('tipo_fuente') ?? 'm';// def m = monospace;

let arr_pantalla_str_old = '';
let arr_pantalla_str_new = '';


let objPantallaParams_def = {
    pantalla_show,
    show_logo_en_fondo,
    show_imagen_en_fondo,
    bg_ruta,
    bg_media_type,
    video_ruta,
    brillo_pantalla,
    show_bible_en_fondo,
    show_black_en_fondo,
    user_view_control,
    show_legend,
    show_acordes,
    show_next_slide,
    show_en_top,
    show_en_parte_top,
    show_en_center,
    tipo_fuente,
}
// localStorage.setItem('objPantallaParams', JSON.stringify(objPantallaParams) );//IMPORTANTE!

let objPantallaParams_str_new = '';
let objPantallaParams_str_old = '';

let objPantallaParams = JSON.parse(localStorage.getItem('objPantallaParams')) || objPantallaParams_def;

//tokenes
let resizeToken = 0;//para construirElementosYAppend()
let resizeTimeout;//para lanzar mySizePantallaShow(); solo cuando el usuario deje de hacer resize
let transitionToken = 0;//para mostrarSlide(), mostrarFondo(), cambiarSlideConTransicion()
let sizeCalcToken = 0;// para mySizePantallaShow() 




//==================================================================================//
// F U N C I O N E S
//==================================================================================//

//si se abre este ficheo , añado la info de esto en localStorage
localStorage.setItem('pantalla_abierta','true');

//cuando se cargue el documento
document.addEventListener('DOMContentLoaded', () => {
        cargarEstadoInicial();
    }
);

//escuchador de postMessage
window.addEventListener('message', async (event) => {

    // seguridad
    if (
        // event.origin !== 'http://holy-songs.local' &&
        // event.origin !== 'http://bible-text.local' &&
        // event.origin !== 'https://holy-songs.com' &&
        // event.origin !== 'https://bible-text.com' &&
        event.origin !==  window.location.origin
    ) {
        return;
    }

    const data = event.data;

    if (!data){
        return;
    }

    switch(data.tipo){

        case 'pantalla_update':
            if (data.arr_pantalla) {
                arr_pantalla = data.arr_pantalla;
            }        
            if (data.objPantallaParams) {
                objPantallaParams = data.objPantallaParams;
            }        
            if (data.actualizarVista) {
                console.log(' llamo --- aplicarVista()');
                aplicarVista();
            }        
            if (data.actualizarSlide) {
                console.log(' llamo --- construirElementosYAppend()');
                //construirElementosYAppend();//tiene aplicarVista() dentro
                cambiarSlideConTransicion();//tiene dentro construirElementosYAppend() y este tiene aplicarVista() dentro
            }            
            break;

        //dejo como ejemplo
        //no funciona como quiero yo
        //solo con 'F11' o boton de extension 'fullscreen'    
        case 'fullscreen':
            try{
                await document.documentElement.requestFullscreen();
            }catch(e){
                console.error(e);
            }
            break;

        case 'exit_fullscreen':
            if(document.fullscreenElement){
                try{
                    await document.exitFullscreen();
                }catch(e){
                    console.error(e);
                }
            }
            break;

        case 'toggle_fullscreen':
            try{
                if(document.fullscreenElement){
                    await document.exitFullscreen();
                }else{
                    await document.documentElement.requestFullscreen();
                }
            }catch(e){
                console.error(e);
            }
            break;
    }

});

//cambio de tamaño de la pestaña/ventana
window.addEventListener('resize',() => {
    
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        //console.log('resize - window.innerWidth: ', window.innerWidth);
        mySizePantallaShow();
    }, 300);    
});


/*
function antes_lanzarIntentos(){
    //console.log('=== function lanzarIntentos() ===');
        
    arr_pantalla_str_old = localStorage.getItem('arr_pantalla');
    //console.log('arr_pantalla_str_old: ', arr_pantalla_str_old);

    objPantallaParams_str_old = localStorage.getItem('objPantallaParams');
    //console.log('objPantallaParams_str_old: ', objPantallaParams_str_old);


    if(arr_pantalla_str_old){
        //arr_pantalla_str_old = arr_pantalla_str_old.replaceAll('<br>','');//en song es importante <br>. no lo quito
    }else{
        //console.log('localStorage no existe. espero 1 seg y vuelvo a comprobar');
        setTimeout(()=>{
            count_intentos++;
            //si pasab 5min sin datos en localStorage recargo pantalla
            if(count_intentos == 60*15){// 15min
                console.error('localStorage no existe. recargo window.');
                window.location.reload;
            }
            lanzarIntentos();
        },delay_fn);
        return;
    }

    arr_pantalla = JSON.parse(arr_pantalla_str_old);
    objPantallaParams = JSON.parse(objPantallaParams_str_old);
    //console.log('old --- arr_pantalla: ', arr_pantalla);


    //si el contenedor está vacío, lo construyo
    if(arr_pantalla && eid_contenedor && eid_contenedor.querySelector('.trad') == null ){
        //console.log('el contenedor está vacío, lo construyo...');

        aplicarVista();//importante al cargar por primera vez
        construirElementosYAppend();
    
    }else{//el contenedor ya existe
        //console.log('el contenedor YA EXISTE, no lo construyo de nuevo... lo relleno si ha cambiado localStorage');

        // EN TEST - COMENTAR, SE CARGARÁ 1 VEZ AL RECARGAR CADA SLIDE CON F5.  
        // EN PROD - DESCOMENTAR!!!
        lanzarIntentosConDelay();
    }
}
function antes_lanzarIntentosConDelay(){
    
    //lanzo intenos cada 0.2 seg para comprobar si ha cambiado localStorage
    //si ha cambiado, actualizo arr_pantalla y reconstruyo el contenedor
    setTimeout(()=>{//COMENTAR PARA TEST
        
        arr_pantalla_str_new = localStorage.getItem('arr_pantalla');
        //console.log('arr_pantalla_str_new: ', arr_pantalla_str_new);

        objPantallaParams_str_new = localStorage.getItem('objPantallaParams');
        //console.log('objPantallaParams_str_new: ', objPantallaParams_str_new);
        
        //1. Params de Slide
        objPantallaParams = JSON.parse(objPantallaParams_str_new);
        //console.log('nuevo objPantallaParams: ', objPantallaParams);

        //si ha cambiado algo en los parametros de pantalla de localStorage, reviso que mostrar/ocultar
        if(objPantallaParams_str_old !== objPantallaParams_str_new){
            // let aviso = '1. objPantallaParams old y new SON DISTINTOS. hago cosas...';
            // console.log('aviso: ', aviso);
            // alert('aviso: ', aviso);

            aplicarVista();

            //solo calculo fontSize si hay que mostrar el slide...
            if(pantalla_show){
                mySizePantallaShow();//importante!
            }
        }

        //2. Datos de Slide
        arr_pantalla = JSON.parse(arr_pantalla_str_new);
        //console.log('nuevo arr_pantalla: ', arr_pantalla);        

        //si ha cambiado la longitud de localStorage, construyo nuevos versículos
        if(arr_pantalla_str_old !== arr_pantalla_str_new){
            // let aviso = '2. arr_pantalla old y new SON DISTINTOS. hago cosas...';
            // console.log('aviso: ', aviso);
            // alert('aviso: ', aviso);

            if(eid_contenedor){ 
                aplicarVista(); 
                construirElementosYAppend();//siempre construyo
            }
        }

        lanzarIntentos();//COMENTAR PARA TEST

    },delay_fn);//COMENTAR PARA TEST        

}
*/

function cargarEstadoInicial(){
    console.log('=== function cargarEstadoInicial() ==='); 

    const arr_pantalla_str = localStorage.getItem('arr_pantalla');
    const objPantallaParams_str = localStorage.getItem('objPantallaParams');

    if(!arr_pantalla_str || !objPantallaParams_str){
        return;
    }

    arr_pantalla = JSON.parse(arr_pantalla_str);
    objPantallaParams = JSON.parse(objPantallaParams_str);

    aplicarVista();//primero
    construirElementosYAppend();//segundo
}


function mostrarSlide(){
    console.log('=== function mostrarSlide() ===');
    const token = ++transitionToken;

    // Caso carga inicial:
    // el fondo ya está oculto
    if(!eid_fondo.classList.contains('shown')){
        console.log('en mostrarSlide() - Caso carga inicial - eid_contenedor.classList.add shown -> fade in slide');

        requestAnimationFrame(() => {
            if(token !== transitionToken){
                return;
            }
            eid_contenedor.classList.add('shown');
            console.log('en mostrarSlide() - eid_contenedor.classList.add shown -> fade in slide');
        });
        return;
    }
    
    // fade out fondo
    eid_fondo.classList.remove('shown');
    console.log('remove fondo shown', performance.now() );
    console.log('en mostrarSlide() - eid_fondo.classList.remove shown -> fade out fondo');

    const onTransitionEnd = (event) => {
        console.log('TRANSITION END SLIDE');

        if(event.target !== eid_fondo){
            return;
        }

        if(token !== transitionToken){
            return;
        }
        
        // fondo ya es negro aquí
        // fade in slide inmediatamente
        requestAnimationFrame(() => {
            if(token !== transitionToken){
                return;
            }
            eid_contenedor.classList.add('shown');
            console.log('add slide shown', performance.now());
            console.log('en mostrarSlide() - eid_contenedor.classList.add shown - > fade in slide');
        });
    };

    eid_fondo.addEventListener(
        'transitionend',
        onTransitionEnd,
        { once: true }
    );

}


function mostrarFondo(){
    console.log('=== function mostrarFondo() ===');
    const token = ++transitionToken;

    if(!eid_contenedor.classList.contains('shown')){
        console.log('en mostrarSlide() - Caso carga inicial - eid_contenedor.classList.add shown -> fade in fondo');
        
        requestAnimationFrame(() => {
            if(token !== transitionToken){
                return;
            }
            eid_fondo.classList.add('shown');
            console.log('en mostrarFondo() - Caso carga inicial - eid_fondo.classList.add shown -> fade in fondo');
        });
        return;
    }

    // fade out slide
    eid_contenedor.classList.remove('shown');
    console.log('en mostrarFondo() - eid_contenedor.classList.remove shown - > fade out slide');
    
    const onTransitionEnd = (event) => {
        console.log('TRANSITION END FONDO');

        if(event.target !== eid_contenedor){
            return;
        }

        if(token !== transitionToken){
            return;
        }

        // fade in fondo inmediatamente
        requestAnimationFrame(() => {
            if(token !== transitionToken){
                return;
            }
            eid_fondo.classList.add('shown');
            console.log('en mostrarFondo() - eid_fondo. add shown -> fade in fondo');
        });
    };

    eid_contenedor.addEventListener(
        'transitionend',
        onTransitionEnd,
        { once: true }
    );
}


function cambiarSlideConTransicion(){

    const token = ++transitionToken;

    // Si el texto no está visible,
    // solo actualizo el HTML interno
    if(!pantalla_show){
        console.log('estoy dentro de cambiarSlideConTransicion() --- pantalla_show == 0 --- llamo construirElementosYAppend');
        construirElementosYAppend();
        return;
    }

    // Si ya está oculto, no espero transitionend
    if(!eid_contenedor.classList.contains('shown')){

        console.log('contenedor ya oculto -> construirElementosYAppend()');
        construirElementosYAppend();

        requestAnimationFrame(() => {
            if(token !== transitionToken){
                return;
            }
            eid_contenedor.classList.add('shown');
        });
        return;
    }

    // Fade out
    eid_contenedor.classList.remove('shown');
    console.log('dentro de cambiarSlideConTransicion() -> hago fade out');

    const onTransitionEnd = (event) => {

        // Ignorar eventos de hijos
        if(event.target !== eid_contenedor){
            return;
        }

        // Hay una transición más reciente
        if(token !== transitionToken){
            return;
        }

        construirElementosYAppend();
        console.log('transitionend -> construirElementosYAppend()');

        // Fade in
        requestAnimationFrame(() => {

            if(token !== transitionToken){
                return;
            }

            eid_contenedor.classList.add('shown');
            console.log('transitionend -> requestAnimationFrame() -> fade in');
        });

    };

    eid_contenedor.addEventListener(
        'transitionend',
        onTransitionEnd,
        { once: true }
    );

}


//========================================================================================//
// B O T H
//========================================================================================//
//========================================================================================//
//aki el codigo que se usa con ambos (both) local 'pantall.js' y remoto 'screen_pantalla.js'
//========================================================================================//


/**
 * eid_contenedor es global
 * objPantallaParams es global
 */
function aplicarVista(){
    //console.log('=== function aplicarVista() ===');

    //Admin control
    pantalla_show = (objPantallaParams.pantalla_show == '1') ? 1 : 0;
    show_logo_en_fondo = (objPantallaParams.show_logo_en_fondo == '1') ? 1 : 0;
    show_imagen_en_fondo = (objPantallaParams.show_imagen_en_fondo == '1') ? 1 : 0;
    bg_ruta = (objPantallaParams.bg_ruta != '') ? objPantallaParams.bg_ruta : '';
    bg_media_type = (objPantallaParams.bg_media_type != '') ? objPantallaParams.bg_media_type : 'image';
    video_ruta = (objPantallaParams.video_ruta != '') ? objPantallaParams.video_ruta : '';
    brillo_pantalla = (objPantallaParams.brillo_pantalla != '100') ? objPantallaParams.brillo_pantalla : 100;//? revisar!
    show_bible_en_fondo = (objPantallaParams.show_bible_en_fondo == '1') ? 1 : 0;
    show_black_en_fondo = (objPantallaParams.show_black_en_fondo == '1') ? 1 : 0;
    user_view_control = (objPantallaParams.user_view_control == '1') ? 1 : 0;
    
    //User control
    show_legend = (objPantallaParams.show_legend == '1') ? 1 : 0;
    show_acordes = (objPantallaParams.show_acordes == '1') ? 1 : 0;
    show_next_slide = (objPantallaParams.show_next_slide == '1') ? 1 : 0;
    show_en_top = (objPantallaParams.show_en_top == '1') ? 1 : 0;
    show_en_parte_top = (objPantallaParams.show_en_parte_top == '1') ? 1 : 0;
    show_en_center = (objPantallaParams.show_en_center == '1') ? 1 : 0;
    tipo_fuente = (objPantallaParams.tipo_fuente == 'm') ? 'm' : 'a';

    // si hay contenedor...
    if(eid_contenedor){
        
        //Admin control
        if(pantalla_show){//muestro texto
            console.log('if -  muestro el slide');
            
            mostrarSlide();

        }else{//muestro fondo            
            console.log('else - oculto el texto - muestro el fondo');
            
            mostrarFondo();


            //diferentes parametros
            if(show_logo_en_fondo){
                document.body.classList.add('logo_en_fondo');
            }else{
                document.body.classList.remove('logo_en_fondo');
            }

            if(show_imagen_en_fondo){
                document.body.classList.add('imagen_en_fondo');

                //IMAGEN
                if(bg_media_type === 'image'){
                    //aki pongo la ruta de imagen de fondo
                    if(bg_ruta != ''){
                        eid_videoFondo.classList.remove('shown');//aki oculto video
                        eid_videoFondo.src = '';//aki reset la ruta de video
                        eid_style_imagen_en_fondo.innerHTML = `
                            .imagen_en_fondo #fondo {
                                background-image: url(.${bg_ruta});
                            }
                        `;
                    }else{
                        eid_style_imagen_en_fondo.innerHTML = '';
                    }
                }
                
                //VIDEO
                if(bg_media_type === 'video'){
                    //aki pongo la ruta de video de fondo
                    if(video_ruta != ''){
                        eid_style_imagen_en_fondo.innerHTML = '';//reset
                        eid_videoFondo.classList.add('shown');
                        eid_videoFondo.src = `${video_ruta}`;
                    }else{
                        eid_style_imagen_en_fondo.innerHTML = '';
                        eid_videoFondo.classList.remove('shown');//? revisar si hace falta...
                    }
                }

            }else{
                document.body.classList.remove('imagen_en_fondo');
                eid_style_imagen_en_fondo.innerHTML = '';//quito la ruta de imagen de fondo
                eid_videoFondo.classList.remove('shown');//? revisar si hace falta...
            }

            if(show_bible_en_fondo){
                document.body.classList.add('bible_en_fondo');
            }else{
                document.body.classList.remove('bible_en_fondo');
            }

            if(show_black_en_fondo){
                document.body.classList.add('black_en_fondo');
            }else{
                document.body.classList.remove('black_en_fondo');
            }

        }//din de - muestro fondo 


        //User control
        if(show_acordes){
            eid_contenedor.classList.add('show_acordes');
            if(tipo_fuente == 'm'){
                eid_contenedor.classList.add('monospace_font');//siempre asi si hay show_acordes
            }else{
                eid_contenedor.classList.remove('monospace_font');
            } 
        }else{
            eid_contenedor.classList.remove('show_acordes');
            eid_contenedor.classList.remove('monospace_font');//siempre quito monospace aki
        }

        if(show_legend){
            eid_contenedor.classList.add('show_legend');
        }else{
            eid_contenedor.classList.remove('show_legend');
        }

        if(show_next_slide){
            eid_contenedor.classList.add('show_next_slide');
        }else{
            eid_contenedor.classList.remove('show_next_slide');
        }

        if(show_en_top){
            eid_contenedor.classList.add('show_en_top');
        }else{
            eid_contenedor.classList.remove('show_en_top');
        }

        if(show_en_parte_top){
            //calculo la mitad de la pantalla para restarla en mySizePantalla()
        }

        if(show_en_center){
            eid_contenedor.classList.add('show_en_center');
        }else{
            eid_contenedor.classList.remove('show_en_center');
        }

        aplicarBrilloPantalla(brillo_pantalla);//la comprobacion del rango (10-100) tengo dentro

        // if(tipo_fuente == 'm'){
        //     eid_contenedor.classList.add('monospace_font');
        // }else{
        //     eid_contenedor.classList.remove('monospace_font');
        // }        
    }

    //si está permitido para el usuario controlar la vista, ...
    if(user_view_control){
        //console.log('aplico vista usuario...');
        aplicarVistaUsuario();
    }

}//end function aplicarVista()


async function aplicarVistaUsuario(){
    //console.log('=== function aplicarVistaUsuario() ===');

    // Obtiene toda la parte de la URL actual
    const params = new URLSearchParams(window.location.search);

    // Leer un parámetro específico
    const id = params.get("id");   // "8050"
    const t  = params.get("t"); 

    //si no hay parametro, no hago nada.
    if(!t){
        return;
    }

    //Todos los GET parametros de ajuste de pantalla permitidos
    //case 'i'://iglesia => mostrar logotipo de la iglesia en el fondo (cuando no se ve el slide)
    //case 'g'://imagen de letra 'g' => mostrar imagen personalizada en el fondo (cuando no se ve el slide)
    //case 'r'://brillo de letra 'r' => brillo de la pantalla (opacity) en fondo y texto
    //case 'b'://bible => mostrar imagen de la biblia abierta en el fondo (cuando no se ve el slide)
    //case 'f'://fondo => mostrar fondo black en el fondo (cuando no se ve el slide)
    //case 'u'://user => usuario puede controlar que mostrar en la vista de slide: legend, acordes, next_slide
    //case 'l'://legend => mostrar títulos de bloques, legend de fieldset
    //case 'c'://chords => acordes
    //case 'n'://next slide => mostrar 2 lineas de sig slide
    //case 't'://top => mostrar en el top
    //case 'z'://center la 'c' está ocupada para acordes 'chords' por eso => 'z'
    //case 'x'://top => mostrar en la parte top (50% de arriba de la pantalla)


    //parametro GET 't' de 'tipo de letra'
    if(t){

        //case 'i'://iglesia => mostrar logotipo de la iglesia en el fondo (cuando no se ve el slide)
        if(t.includes('i')){
            show_logo_en_fondo = 1;
            document.body.className = '';//reset
            document.body.classList.add('logo_en_fondo');
        }else{
            show_logo_en_fondo = 0;
            document.body.classList.remove('logo_en_fondo');
        }

        //case 'g'://imagen de letra 'g' => mostrar imagen personalizada en el fondo (cuando no se ve el slide)
        if(t.includes('g')){
            show_imagen_en_fondo = 1;
            document.body.className = '';//reset
            document.body.classList.add('imagen_en_fondo');

            await pintMediaActiveEnFondoPantalla();//pinta la imagen del fondo sin tener en cuenta el fondo elegido en select_slide()            

        }else{
            show_imagen_en_fondo = 0;
            document.body.classList.remove('imagen_en_fondo');
            eid_style_imagen_en_fondo.innerHTML = '';//reset
        }

        //case 'r'://brillo de letra 'r' => brillo de la pantalla (opacity) en fondo y texto
        //aki no se controla este parametro por el usuario

        //case 'b'://bible => mostrar imagen de la biblia abierta en el fondo (cuando no se ve el slide)
        if(t.includes('b')){
            show_bible_en_fondo = 1;
            document.body.className = '';//reset
            document.body.classList.add('bible_en_fondo');
        }else{
            show_bible_en_fondo = 0;
            document.body.classList.remove('bible_en_fondo');
        }

        //case 'f'://fondo => mostrar fondo black en el fondo (cuando no se ve el slide)
        if(t.includes('f')){
            show_black_en_fondo = 1;
            document.body.className = '';//reset
            document.body.classList.add('black_en_fondo');
        }else{
            show_black_en_fondo = 0;
            document.body.classList.remove('black_en_fondo');
        }

        //case 'u'://user => usuario puede controlar que mostrar en la vista de slide: legend, acordes, next_slide 
        //aki no se controla este parametro por el usuario.


        //referente a la visualización de slide
        //legend
        //case 'l'://legend => mostrar títulos de bloques, legend de fieldset
        if(t.includes('l')){
            show_legend = 1;
            eid_contenedor.classList.add('show_legend');
        }else{
            show_legend = 0;
            eid_contenedor.classList.remove('show_legend');
        }

        //acordes
        //case 'c'://chords => acordes
        if(t.includes('c')){
            show_acordes = 1;
            eid_contenedor.classList.add('show_acordes');
        }else{
            show_acordes = 0;
            eid_contenedor.classList.remove('show_acordes');
        }

        //next_slide.  2 lineas del sig kuplet si hay
        //case 'n'://next slide => mostrar 2 lineas de sig slide
        if(t.includes('n')){
            show_next_slide = 1;
            eid_contenedor.classList.add('show_next_slide');
        }else{
            show_next_slide = 0;
            eid_contenedor.classList.remove('show_next_slide');
        }
        
        //mostrar el slide en el top con: justify-content: flex-start   
        //case 't'://top => mostrar en el top
        if(t.includes('t')){
            show_en_top = 1;
            show_en_center = 0;//deshabilito
            eid_contenedor.classList.add('show_en_top');
        }else{
            show_en_top = 0;
            eid_contenedor.classList.remove('show_en_top');
        }

        //mostrar el slide en el center con: justify-content: center   
        //case 'z'://center la 'c' está ocupada para acordes 'chords' por eso => 'z'
        if(t.includes('z')){
            show_en_center = 1;
            show_en_top = 0;//deshabilito
            eid_contenedor.classList.add('show_en_center');
        }else{
            show_en_center = 0;
            eid_contenedor.classList.remove('show_en_center');
        }

        //parte 50% de arriba
        //case 'x'://top => mostrar en la parte top (50% de arriba de la pantalla)
        if(t.includes('x')){//show_en_parte_top
            //calculo la mitad de la pantalla para restarla en mySizePantalla()
            show_en_parte_top = 1;
        }else{
            show_en_parte_top = 0;
        }

        //tipo_fuente.  monospace/arial
        if(t.includes('m')){
            tipo_fuente = 'm';
            eid_contenedor.classList.add('monospace_font');
        }else{
            tipo_fuente = 'a';
            eid_contenedor.classList.remove('monospace_font');
        }
    }
}


/**
 * eid_contenedor es global
 * arr_pantalla es global
 */
function construirElementosYAppend(){
    //console.log('=== function construirElementosYAppend() ===');

    resizeToken++;
    const currentToken = resizeToken;

    eid_contenedor.innerHTML = '';//reset

    if(arr_pantalla.length > 0){                
        arr_pantalla.forEach( (pant, i) => {
            
            const trad = document.createElement('div');
            trad.id = 'trad' + i;
            trad.className = 'trad';

            //Reasigno el HTML segun el tipo de mostrar
            trad.innerHTML = `
                <div class="trad_inner">
                    <div class="verse">
                        ${arr_pantalla[i].slide_html}
                    </div>
                </div>
            `;
            
            eid_contenedor.append(trad);
        });

    }else{

        const p = document.createElement('p');
        p.textContent = 'No hay datos que mostrar';
        eid_contenedor.append(p);
        
    }

    //cuando el navegador pinte el DOM se llama mySizePantallaShow() para ajustar el fontSize de 'trad' a todo ancho y alto
    lanzarResize(currentToken);

}//end function construirElementosYAppend()


function lanzarResize(currentToken, intentos = 0){
    const MAX_INTENTOS = 5;

    //cuando el navegador pinte el DOM se llama mySizePantallaShow() para ajustar el fontSize de 'trad' a todo ancho y alto
    requestAnimationFrame( async () => {
        
        // Hay un resize más reciente
        if(currentToken !== resizeToken){
            return;
        }
        
        // El contenedor aún no tiene tamaño
        if(eid_contenedor.offsetWidth === 0 || eid_contenedor.offsetHeight === 0){

            if(intentos >= MAX_INTENTOS){
                console.warn('lanzarResize(): máximo de intentos alcanzado');
                return;
            }
            console.log(`lanzarResize(): intento ${intentos + 1}/${MAX_INTENTOS}`);

            //vuelvo a llamar
            lanzarResize(currentToken, intentos + 1);    
            return;
        }

        // Ajustar tamaño del texto
        await mySizePantallaShow();

        //si al haber cambiado el slide no existe el contenedor, salgo de la función.
        if(!eid_contenedor.isConnected){
            return;
        }


        // Mientras esperaba apareció otro resize
        if(currentToken !== resizeToken){
            return;
        }

        const trads = eid_contenedor.querySelectorAll('.trad');

        if(trads.length === 0){
            return;
        }

        // Altura total ocupada por todos los .trad
        const alturaTotal = trads[0].offsetHeight * trads.length;

        const diferencia = Math.abs(
            alturaTotal - eid_contenedor.offsetHeight
        );

        // Si el ajuste no ha quedado bien, volver a calcular
        if(diferencia > 2){

            if(intentos >= MAX_INTENTOS){
                console.warn('lanzarResize(): máximo de intentos alcanzado (fontSize)');
                return;
            }

            console.log(`Recalculando fontSize (${intentos + 1}/${MAX_INTENTOS})`);
            console.log(
                'alturaTotal:',
                alturaTotal,
                'contenedor:',
                eid_contenedor.offsetHeight
            );

            lanzarResize(currentToken, intentos + 1);
            return;
        }

    });
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function nextFrame() {
    return new Promise(requestAnimationFrame);
}


/**
 * Ajusta el font-size de `trad` para que su .verse quepa en maxW x maxH.
 * Usa búsqueda binaria para hacerlo rápido y requestAnimationFrame para mediciones correctas.
 */
async function ajustarFuenteBinaria(trad, maxW, maxH, min = 5, max = 300) {
    let lo = min, hi = max, best = min;

    //const { width: trad_width, height: trad_height } = trad.getBoundingClientRect();
    //console.log('trad_width: ', trad_width);
    //console.log('trad_height: ', trad_height);

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        trad.style.fontSize = mid + 'px';

        // Espera que el navegador pinte y calcule layout
        await nextFrame();//cuando lo quito animacion es mejor!
        //await sleep(100);//cuando lo quito animacion es mejor!

        const verse = trad.querySelector('.verse');
        if (!verse) break; // por seguridad

        const { width: verse_width, height: verse_height } = verse.getBoundingClientRect();
        //console.log('verse_width: ', verse_width);
        //console.log('verse_height: ', verse_height);

        if (verse_width <= maxW && verse_height <= maxH) {
            best = mid;      // cabe → probamos más grande
            lo = mid + 1;
        } else {
            hi = mid - 1;    // no cabe → probamos más pequeño
        }
    }

    trad.style.fontSize = best + 'px';
    //console.log("dentro de func ajustarFuenteBinaria --- FontSize final:", best);

    return best;
}



async function mySizePantallaShow() {//new como ajustarTexto()
    //console.log('=== function mySizePantallaShow() ===');


    if(eid_contenedor.offsetWidth === 0 || eid_contenedor.offsetHeight === 0){
        console.warn('contenedor aún sin layout');
        requestAnimationFrame(() => {
            mySizePantallaShow();
        });
        return;
    }


    const token = ++sizeCalcToken;
        
    const tradAll = document.querySelectorAll('.trad');
    let count_trad = tradAll.length;//en caso de song es 1

    //Maxima width y Height permitidos. si se exede, el fontSize deja de aumentarse
    let maxW;
    let maxH;

    let parte_a_restar = (show_en_parte_top == 1) ? (window.innerHeight / 2) : 0 ;
    console.log('parte_a_restar: ', parte_a_restar);

    if(window.innerWidth < 768){//es mobile
        // dejo 10px de padding entre el border de pantalla y el texto
        maxW = window.innerWidth / count_trad - 10;
        maxH = (window.innerHeight - parte_a_restar) / count_trad - 10;
    }else{//es tablet o desktop
        // dejo 32px de padding entre el border de pantalla y el texto
        maxW = window.innerWidth / count_trad - 32;
        maxH = (window.innerHeight - parte_a_restar) / count_trad - 32;        
    }


    //nueva forma. for() espera el resultado de await; forEach() no espera. AKI USAR FOR()!!! 
    for (const trad of tradAll){
        //console.log('trad: ', trad);

        if(!trad.isConnected){
            console.warn('trad eliminado');
            continue;
        }

        if(pantalla_show){
            trad.style.visibility = 'hidden';//IMPORTANTE PARA QUE NO SE VEA COMO CAMBIA EL TAMAÑO DEL DIV 'TRAD'
        }

        const trad_inner = trad.querySelector('.trad_inner');
        //console.log('trad_inner: ', trad_inner);

        trad_inner.removeAttribute('style');//reset


        const clone_contenedor = eid_contenedor.cloneNode(true);
        clone_contenedor.style.position = 'relative';
        clone_contenedor.style.visibility = 'hidden';
        clone_contenedor.style.left = '-9999px';
        document.body.appendChild(clone_contenedor);


        try{

            const clone = trad.cloneNode(true);        
            clone_contenedor.appendChild(clone);

            /*
                console.log(
                    'isConnected:',
                    trad.isConnected
                );

                console.log(
                    'CONTENEDOR',
                    eid_contenedor.offsetWidth,
                    eid_contenedor.offsetHeight
                );
                
                console.log(
                    'TRAD',
                    trad.offsetWidth,
                    trad.offsetHeight
                );
                
                console.log(
                    'TRAD PARENT',
                    trad.parentElement.offsetWidth,
                    trad.parentElement.offsetHeight
                );


                console.log(
                    'MEDICION',
                    clone_contenedor.offsetWidth,
                    clone_contenedor.offsetHeight
                );

                console.log(
                    getComputedStyle(clone_contenedor).width,
                    getComputedStyle(clone_contenedor).height
                );



                console.log(
                    trad.className
                );
                
                console.log(
                    clone.className
                );

                console.log(
                    getComputedStyle(trad).display,
                    getComputedStyle(clone).display
                );
                
                console.log(
                    getComputedStyle(trad).position,
                    getComputedStyle(clone).position
                );
                
                console.log(
                    getComputedStyle(trad).flex,
                    getComputedStyle(clone).flex
                );

                console.log(
                    'REAL',
                    trad.offsetWidth,
                    trad.offsetHeight
                );
                
                console.log(
                    'CLONE',
                    clone.offsetWidth,
                    clone.offsetHeight
                );

                console.log(
                    'REAL parent',
                    trad.parentElement.offsetWidth,
                    trad.parentElement.offsetHeight
                );
                
                console.log(
                    'CLONE parent',
                    clone.parentElement.offsetWidth,
                    clone.parentElement.offsetHeight
                );




                console.log(
                    getComputedStyle(trad).fontSize
                );
                
                console.log(
                    getComputedStyle(clone).fontSize
                );

                console.log(
                    getComputedStyle(trad).width,
                    getComputedStyle(trad).height
                );
                
                console.log(
                    getComputedStyle(clone).width,
                    getComputedStyle(clone).height
                );
            */            
            
            let fontSize_new = await ajustarFuenteBinaria(clone, maxW, maxH);
            //console.log("FontSize final. fontSize_new:", fontSize_new);
        
            if(token !== sizeCalcToken || !trad.isConnected){
                return;
            }
        
            trad.style.fontSize = fontSize_new + 'px';
        
            //...
            let trad_h = window.innerHeight / count_trad ;
            //console.log('trad_h: ', trad_h);
    
            // si quero mostrar en varias columnas, divido entre count_trad
            // si solo en rows => no divido, sino 
            // let trad_w = window.innerWidth / count_trad;
            let trad_w = window.innerWidth;// muestro en rows
            //console.log('trad_w: ', trad_w);
    
            trad_inner.style.height = trad_h + 'px';
            trad_inner.style.width = trad_w + 'px'; 
    
            if(pantalla_show){
                trad.style.visibility = 'visible';//IMPORTANTE PARA QUE NO SE VEA COMO CAMBIA EL TAMAÑO DEL DIV 'TRAD'
            }       
                   
        }
        finally{
            if(clone_contenedor.isConnected){
                clone_contenedor.remove();
            }
        }        
       
    }
    
    //aplicarVista(); //antes estaba. ahora comento
}


function esString(valor) {
    return typeof valor === "string";
}

/**
 * Limpia un HTML reemplazando comillas dobles (") en todo html por '__||__'
 * Limpia un HTML reemplazando comillas simples (') en todo html por '__|__'
 * para que sea seguro guardar en JSON en BD.
 * @param {string} html - El HTML completo.
 * @returns {string} HTML seguro para JSON/BD.
 */
function sanitizeHtmlForJson(html) {
    return html
        .replace(/"/g, '__||__')   // reemplaza todas las comillas dobles " por '__||__'
        .replace(/'/g, '__|__');   // reemplaza todas las comillas simples ' por '__|__'
}



/**
 * Revertir HTML sanitizado reemplazando '__||__' y '__|__' por comillas dobles y simples.
 * @param {string} sanitizedHtml - HTML con '__||__' y ''__|__' en todo.
 * @returns {string} HTML original con comillas dobles y simples.
 */
function restoreHtmlFromSanitized(sanitizedHtml) {
    return sanitizedHtml
        .replace(/__\|\|__/g, '"')  // reemplaza __||__ por "
        .replace(/__\|__/g, "'");   // reemplaza __|__ por '
}

function aplicarBrilloPantalla(valor) {
    console.log("Brillo en pantalla aplicado al soltar: " + valor + "%");
    
    if(valor < 10 || valor > 100){
        return;
    }

    const opacity_val = valor * 0.01;
    
    //el slide de la pestaña o ventana en 'pantalla.php'
    document.body.style.opacity = opacity_val;
}



/* aki no se usan pero las dejo como ejemplo */
async function toggleFullscreen(){
    console.log('=== function toggleFullscreen() ===');
    console.trace('toggleFullscreen');

    try{

        if(document.fullscreenElement){
            await document.exitFullscreen();
        }else{
            await document.documentElement.requestFullscreen();
        }

    }catch(error){
        console.error(error);
    }
}


async function salirFullscreen(){
    console.log('=== function salirFullscreen() ===');

    if(!document.fullscreenElement){
        return;
    }

    try{
        await document.exitFullscreen();
    }catch(error){
        console.error(error);
    }

}


async function entrarFullscreen(){
    console.log('=== function entrarFullscreen() ===');

    if(document.fullscreenElement){
        return;
    }

    try{
        await document.documentElement.requestFullscreen();
    }catch(error){
        console.error(error);
    }

}



async function pintMediaActiveEnFondoPantalla(){
    console.log('=== function pintMediaActiveEnFondoPantalla() ===');

    try {
        
        const data = await getMediaActivePantalla();
        console.log('2. data:', data);

        if (data.success) {

            let mediaType = data.media.media_type;
            let ruta = data.media.filepath;

            aplicarMediaFondo(mediaType, ruta);
            return true;  
            
        } else {

            console.error('error en pintMediaActiveEnFondo(). error: ', data.error);
            return false;             

        }

    } catch (error) {
        
        console.error('Error al cargar el fichero de fondo:',error);
        return false;
    } 

}


async function getMediaActivePantalla(){//aunque es la misma funcion la nombro distinta para no confundirme
    console.log('=== function getMediaActivePantalla() ===');

    try {

        const response = await fetch('../song/php/get_media_active.php',
            {
                method: 'POST'
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error get_media_active.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            return data;

        } catch (error) {
            
            console.error('❌ JSON inválido en get_media_active.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en get_imagen_active.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error('Error al cargar el fichero media de fondo:', error);

    }
}


function aplicarMediaFondo(mediaType, ruta){
    console.log('=== function aplicarMediaFondo() ===');

    if(mediaType === 'image'){

        //1. quito el video
        eid_videoFondo.pause();
        eid_videoFondo.removeAttribute('src');
        eid_videoFondo.load();

        //2. saco la ruta del fondo
        bg_ruta = ruta;
        console.log('bg_ruta: ', bg_ruta);
        localStorage.setItem('bg_ruta', bg_ruta);

        //aki pongo la ruta de imagen de fondo
        if(bg_ruta != ''){
            eid_videoFondo.classList.remove('shown');//oculto video
            eid_style_imagen_en_fondo.innerHTML = `
                .imagen_en_fondo #fondo {
                    background-image: url(.${bg_ruta});
                }
            `;
        }else{
            eid_style_imagen_en_fondo.innerHTML = '';//reset
        }
        console.log('imagen personalizada cargada correctamente');
    }
    

    if(mediaType === 'video'){
        
        //1.saco la ruta del video
        video_ruta = `.${ruta}`;
        console.log('video_ruta: ', video_ruta);
        localStorage.setItem('video_ruta', video_ruta);

        //2.aki pongo la ruta de video de fondo
        if(video_ruta != ''){
            eid_style_imagen_en_fondo.innerHTML = '';//reset ?
            eid_videoFondo.classList.add('shown');//muestro video
            eid_videoFondo.src = `${video_ruta}`;
        }else{
            eid_style_imagen_en_fondo.innerHTML = '';//reset
        }
        console.log('video personalizado cargado correctamente');
    }

}