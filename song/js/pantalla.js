//==================================================================================//
// F U N C I O N E S
//==================================================================================//
console.log('es pantalla.js');

//si se abre este ficheo , añado la info de esto en localStorage
localStorage.setItem('pantalla_abierta','true');

document.addEventListener('DOMContentLoaded', () => {
    //console.log('documento pantalla cargado');    
    lanzarIntentos();// dentro está mySizePantallaShow();
});

//Si HACE FALTA USAR 
window.addEventListener('load',function(d){
    //console.log('load - window.innerWidth: ', window.innerWidth);
    lanzarIntentos();// dentro está mySizePantallaShow();
});

window.addEventListener('resize',function(d){
    //console.log('resize - window.innerWidth: ', window.innerWidth);
    mySizePantallaShow();
});


function lanzarIntentos(){
    //console.log('=== function lanzarIntentos() ===');

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

        aplicarVista();
        construirElementosYAppend();
    
    }else{//el contenedor ya existe
        //console.log('el contenedor YA EXISTE, no lo construyo de nuevo... lo relleno si ha cambiado localStorage');

        // EN TEST - COMENTAR, SE CARGARÁ 1 VEZ AL RECARGAR CADA SLIDE CON F5.  
        // EN PROD - DESCOMENTAR!!!
        lanzarIntentosConDelay();
    }
}


function lanzarIntentosConDelay(){
    
    //lanzo intenos cada 0.2 seg para comprobar si ha cambiado localStorage
    //si ha cambiado, actualizo arr_pantalla y reconstruyo el contenedor
    setTimeout(()=>{//COMENTAR PARA TEST
        
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



