let id_songslide = 1;//solo en pantall_bd
console.log('es pantalla_bd.js');


//==================================================================================//
// F U N C I O N E S
//==================================================================================//

//si se abre este ficheo , añado la info de esto en localStorage
localStorage.setItem('pantalla_abierta','true');

document.addEventListener('DOMContentLoaded', async () => {
    //console.log('documento pantalla cargado');    
    //await cargar_datos_pantalla();
    await lanzarIntentos();// dentro está cargar_datos_pantalla(); y mySizePantallaShow();
});

//Si HACE FALTA USAR 
window.addEventListener('load', async () => {
    //console.log('load - window.innerWidth: ', window.innerWidth);
    await lanzarIntentos();// dentro está mySizePantallaShow();
});

window.addEventListener('resize', async () => {
    //console.log('resize - window.innerWidth: ', window.innerWidth);
    mySizePantallaShow();
});



async function cargar_datos_pantalla(){
    //console.log('=== function cargar_datos_pantalla() ===');

    objPantalla = await getDataPantallaFromBd();//IMPORTANTE para cojer todos los datos necesarios
    //console.log('objPantalla: ', objPantalla);
    //console.log('de bd --- objPantalla.arr_pantalla: ', objPantalla.arr_pantalla);

    objPantalla.arr_pantalla.forEach(item => {
        //console.log('item before: ', item);
        if(item.slide_html){
            item.slide_html = restoreHtmlFromSanitized(item.slide_html);
        }
        //console.log('item after: ', item);
    });
    //console.log('restoreHtmlFromSanitized(objPantalla.arr_pantalla): ', objPantalla.arr_pantalla);

    objPantallaParams = {
        pantalla_show: objPantalla.pantalla_show,
        show_logo_en_fondo: objPantalla.show_logo_en_fondo,
        show_bible_en_fondo: objPantalla.show_bible_en_fondo,
        show_black_en_fondo: objPantalla.show_black_en_fondo,
        user_view_control: objPantalla.user_view_control,
        show_legend: objPantalla.show_legend,
        show_acordes: objPantalla.show_acordes,
        show_next_slide: objPantalla.show_next_slide,
    }
    //console.log('de bd --- objPantallaParams: ', objPantallaParams);

    localStorage.setItem('arr_pantalla', JSON.stringify(objPantalla.arr_pantalla) );//IMPORTANTE!
    localStorage.setItem('objPantallaParams', JSON.stringify(objPantallaParams) );//IMPORTANTE!
}


async function getDataPantallaFromBd(){
    //console.log('=== function getDataPantallaFromBd() ===');

    try {
        
        if(!hay_id_songslide('getDataPantallaFromBd()')){
            return; // <- se detiene aquí si no hay id_song
        } 
               
        const response = await fetch('obtener_pantalla_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_songslide: id_songslide
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }
        
        let data;
        
        if(debug){
            data = await response.text();//test
        }else{
            data = await response.json();
        }
        //console.log('data: ', data);  
        
        if(data.success){
            //console.log('success is true');

            data.arr_pantalla = (esString(data.arr_pantalla) && data.arr_pantalla != '' && data.arr_pantalla.length > 0) ? JSON.parse(data.arr_pantalla) : [] ;//IMPORTANTE!
            //console.log(`parseado data.arr_pantalla: `, data.arr_pantalla);

            return data;

        }else{
            //console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getDataPantallaFromBd(): error.message: ', error.message);
    }
}


async function lanzarIntentos(){
    //console.log('=== function lanzarIntentos() ===');

    await cargar_datos_pantalla();

    //se hace vista de CSS en aplicarVista();
    aplicarVista();   
        
    arr_pantalla_str_old = localStorage.getItem('arr_pantalla');
    //console.log('arr_pantalla_str_old: ', arr_pantalla_str_old);
    
    objPantallaParams_str_old = localStorage.getItem('objPantallaParams');
    //console.log('objPantallaParams_str_old: ', objPantallaParams_str_old);


    if(arr_pantalla_str_old){
        //arr_pantalla_str_old = arr_pantalla_str_old.replaceAll('<br>','');//en song es importante <br>. no lo quito
    }else{
        //console.log('localStorage no existe. espero 1 seg y vuelvo a comprobar');
        setTimeout(async ()=>{
            count_intentos++;
            //si pasab 5min sin datos en localStorage recargo pantalla
            if(count_intentos == 60*15){// 15min
                console.error('localStorage no existe. recargo window.');
                window.location.reload;
            }
            await lanzarIntentos();
        },delay_fn);
        return;
    }

    arr_pantalla = JSON.parse(arr_pantalla_str_old);
    objPantallaParams = JSON.parse(objPantallaParams_str_old);
    //console.log('old --- arr_pantalla: ', arr_pantalla);

    //si el contenedor está vacío, lo construyo
    if(arr_pantalla && eid_contenedor && eid_contenedor.querySelector('.trad') == null ){
        //console.log('el contenedor está vacío, lo construyo...');

        aplicarVista();
        construirElementosYAppend();

    }else{//el contenedor ya existe
        //console.log('el contenedor YA EXISTE, no lo construyo de nuevo... lo relleno si ha cambiado localStorage');

        // EN TEST - COMENTAR, SE CARGARÁ 1 VEZ AL RECARGAR CADA SLIDE CON F5.  
        // EN PROD - DESCOMENTAR!!!
        lanzarIntentosConDelay();
    }
}


async function lanzarIntentosConDelay(){
    
    //lanzo intenos cada 0.2 seg para comprobar si ha cambiado localStorage
    //si ha cambiado, actualizo arr_pantalla y reconstruyo el contenedor
    setTimeout(async ()=>{//COMENTAR PARA TEST
        
        await cargar_datos_pantalla();//new

        arr_pantalla_str_new = localStorage.getItem('arr_pantalla');
        //console.log('arr_pantalla_str_new: ', arr_pantalla_str_new);

        objPantallaParams_str_new = localStorage.getItem('objPantallaParams');
        //console.log('objPantallaParams_str_new: ', objPantallaParams_str_new);
        
            //arr_pantalla_str_new = arr_pantalla_str_new.replaceAll('<br>','');
            //console.log('<br> quitados --- arr_pantalla_str_new: ', arr_pantalla_str_new);
        
        
        //1. Params de Slide
        objPantallaParams = JSON.parse(objPantallaParams_str_new);
        //console.log('nuevo objPantallaParams: ', objPantallaParams);

        //si ha cambiado algo en losparametros de pantalla de localStorage, reviso que mostrar/ocultar
        if(objPantallaParams_str_old !== objPantallaParams_str_new){
            // let aviso = '1. objPantallaParams old y new SON DISTINTOS. hago cosas...';
            // //console.log('aviso: ', aviso);
            // alert('aviso: ' + aviso);

            aplicarVista();
            mySizePantallaShow();//importante!
        }

        //2. Datos de Slide
        arr_pantalla = JSON.parse(arr_pantalla_str_new);
        //console.log('nuevo arr_pantalla: ', arr_pantalla);        

        //si ha cambiado la longitud de localStorage, construyo nuevos versículos
        if(arr_pantalla_str_old !== arr_pantalla_str_new){
            // let aviso = '2. arr_pantalla old y new SON DISTINTOS. hago cosas...';
            // //console.log('aviso: ', aviso);
            // alert('aviso: ' + aviso);

            if(eid_contenedor){                            
                construirElementosYAppend();         
            }
        }       

        lanzarIntentos();//COMENTAR PARA TEST

    },delay_fn);//COMENTAR PARA TEST        

}


