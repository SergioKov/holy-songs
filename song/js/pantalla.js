const eid_contenedor = document.getElementById('contenedor');
let arr_pantalla = [];
let delay_fn = 200;//200 por defecto
let count_intentos = 0;

let tipo_content = 'slide_text';//'slide_text' o 'slide_text_y_acordes' o 'slide_fieldset'
//console.log('tipo_content: ', tipo_content);

//si se abre este ficheo , añado la info de esto en localStorage
localStorage.setItem('pantalla_abierta','true');

document.addEventListener('DOMContentLoaded', () => {
    //console.log('documento pantalla cargado');    
    lanzarIntentos();// dentro está mySizePantallaShow();
    //mySizePantallaShow();
});

//Si HACE FALTA USAR 
window.addEventListener('load',function(d){
    //console.log('load - window.innerWidth: '+window.innerWidth);

    lanzarIntentos();// dentro está mySizePantallaShow();
    //mySizePantallaShow();
});

window.addEventListener('resize',function(d){
    //console.log('resize - window.innerWidth: '+window.innerWidth);
    mySizePantallaShow();
});


function lanzarIntentos(){
    //console.log('=== function lanzarIntentos() ===');

    let pantallaShow = localStorage.getItem('pantallaShow');
    if(eid_contenedor){
        if(pantallaShow === 'true'){
            eid_contenedor.classList.add('shown');
        }else{
            eid_contenedor.classList.remove('shown');
        }
    }
    
        
    let arr_pantalla_str_old = localStorage.getItem('arr_pantalla');
    //console.log('arr_pantalla_str_old: ', arr_pantalla_str_old);

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
    //console.log('old --- arr_pantalla: ', arr_pantalla);


    //si el contenedor está vacío, lo construyo
    if(arr_pantalla && eid_contenedor && eid_contenedor.querySelector('.trad') == null ){
        //console.log('el contenedor está vacío, lo construyo...');

        //DESCOMENTAR EN PROD!!!
        //eid_contenedor.classList.remove('shown');//se añade 'shown' en mySizePantallaShow();

        construirElementosYAppend(eid_contenedor, arr_pantalla);
    
    }else{//el contenedor ya existe
        
        console.log('el contenedor YA EXISTE, no lo construyo de nuevo... lo relleno si ha cambiado localStorage');

        // EN TEST - COMENTAR, SE CARGARÁ 1 VEZ AL RECARGAR CADA SLIDE CON F5.  
        // EN PROD - DESCOMENTAR!!!
        //lanzarIntentosConDelay(delay_fn);

        function lanzarIntentosConDelay(delay_fn){
            
            //lanzo intenos cada 0.2 seg para comprobar si ha cambiado localStorage
            //si ha cambiado, actualizo arr_pantalla y reconstruyo el contenedor
            setTimeout(()=>{//COMENTAR PARA TEST
                
                let arr_pantalla_str_new = localStorage.getItem('arr_pantalla');
                //console.log('arr_pantalla_str_new: ', arr_pantalla_str_new);
                
                //arr_pantalla_str_new = arr_pantalla_str_new.replaceAll('<br>','');
                //console.log('<br> quitados --- arr_pantalla_str_new: ', arr_pantalla_str_new);
    
                arr_pantalla = JSON.parse(arr_pantalla_str_new);
                //console.log('nuevo arr_pantalla: ', arr_pantalla);
    
                //si ha cambiado la longitud de localStorage, construyo nuevos versículos
                if(arr_pantalla_str_old !== arr_pantalla_str_new){
                    //console.log('arr_pantalla old y new SON DISTINTOS. hago cosas...');
    
                    if(eid_contenedor){            
                        //DESCOMENTAR EN PROD!!!
                        //eid_contenedor.classList.remove('shown');//se añade 'shown' en mySizePantallaShow();
                        
                        construirElementosYAppend(eid_contenedor, arr_pantalla);         
                    }
                }else{
                    //console.log('arr_pantalla old y new so IGUALES. no hago nada...');
                }
    
                lanzarIntentos();//COMENTAR PARA TEST
    
            },delay_fn);//COMENTAR PARA TEST        

        }

    }
}


function construirElementosYAppend(contenedor, arr_pantalla){

    //eid_contenedor.innerHTML = '';//reset
    contenedor.innerHTML = '';//reset

    //DESCOMENTAR EN PROD!!!
    //eid_contenedor.classList.remove('shown');//se añade 'shown' en mySizePantallaShow();

    if(arr_pantalla.length > 0){                
        arr_pantalla.forEach( (pant, i) => {
            
            let add_slide_html = make_add_slide_html(pant);

            const trad = document.createElement('div');
            trad.id = 'trad' + i;
            trad.className = 'trad';

            let template_html;

            if(tipo_content === 'slide_text'){
                template_html = `
                    <div class="trad_inner">
                        <div class="verse">
                            ${arr_pantalla[i].slide_text}
                            ${add_slide_html}
                        </div>
                    </div>
                `;
            }

            if(tipo_content === 'slide_text_y_acordes'){
                template_html = `
                    <div class="trad_inner">
                        <div class="verse">
                            ${arr_pantalla[i].slide_text}
                            ${add_slide_html}
                        </div>
                    </div>
                `;

            }

            if(tipo_content === 'slide_fieldset'){
                template_html = `
                    <div class="trad_inner">
                        <div class="verse">
                            ${arr_pantalla[i].fieldset_html}
                        </div>
                    </div>
                `;

            }

            //Reasigno el HTML segun el tipo de mostrar
            trad.innerHTML = template_html;

            //DESCOMENTAR EN PROD!!!
            //eid_contenedor.classList.remove('shown');//se añade 'shown' en mySizePantallaShow();
            
            // eid_contenedor.append(trad);
            contenedor.append(trad);
        });

        mySizePantallaShow();
    }else{
        const p = document.createElement('p');
        p.textContent = 'No hay datos que mostrar';
        // eid_contenedor.append(p);
        contenedor.append(p);
    }

}//end function construirElementosYAppend()



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

    const { width: trad_width, height: trad_height } = trad.getBoundingClientRect();
    console.log('trad_width: ', trad_width);
    console.log('trad_height: ', trad_height);

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        trad.style.fontSize = mid + 'px';

        // Espera que el navegador pinte y calcule layout
        await nextFrame();
        //await sleep(100);

        const verse = trad.querySelector('.verse');
        if (!verse) break; // por seguridad

        const { width: verse_width, height: verse_height } = verse.getBoundingClientRect();
        console.log('verse_width: ', verse_width);
        console.log('verse_height: ', verse_height);

        if (verse_width <= maxW && verse_height <= maxH      /*&& verse_width <= trad_width && verse_height <= trad_height*/ ) {
            best = mid;      // cabe → probamos más grande
            lo = mid + 1;
        } else {
            hi = mid - 1;    // no cabe → probamos más pequeño
        }
    }

    trad.style.fontSize = best + 'px';
    console.log("dentro de func ajustarFuenteBinaria --- FontSize final:", best);

    return best;
}


async function mySizePantallaShow() {//new como ajustarTexto()
    //console.log('=== function mySizePantallaShow() ===');
        
    const tradAll = document.querySelectorAll('.trad');
    let count_trad = tradAll.length;//en caso de song es 1

    //Maxima width y Height permitidos. si se exede, el fontSize deja de aumentarse
    let maxW;
    let maxH;

    if(window.innerWidth < 768){//es mobile
        // dejo 10px de padding entre el border de pantalla y el texto
        maxW = window.innerWidth - 10;
        maxH = window.innerHeight - 10;
    }else{//es tablet o desktop
        // dejo 32px de padding entre el border de pantalla y el texto
        maxW = window.innerWidth - 32;
        maxH = window.innerHeight - 32;        
    }

    //recorrer...
    tradAll.forEach( async (trad) => {
        //console.log('trad: ', trad);

        const trad_inner = trad.querySelector('.trad_inner');
        //console.log('trad_inner: ', trad_inner);

        trad_inner.removeAttribute('style');//reset

        let trad_h = window.innerHeight / count_trad;
        //console.log('trad_h: ', trad_h);

        let trad_w = window.innerWidth / count_trad;
        //console.log('trad_w: ', trad_w);

    



        //let finalizado = false;//se pone a true cuando en el while() se detecta que el contenido sobresale
        let fontSize = 10;
        //trad.style.fontSize = fontSize + 'px';

        const clone_contenedor = eid_contenedor.cloneNode(true);
        clone_contenedor.style.position = 'relative';
        clone_contenedor.style.visibility = 'hidden';
        clone_contenedor.style.left = '-9999px';
        document.body.appendChild(clone_contenedor);

        const clone = trad.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.left = '-9999px';
        // document.body.appendChild(clone);
        clone_contenedor.appendChild(clone);

        let fontSize_new = await ajustarFuenteBinaria(trad, /*clone,*/ maxW, maxH);
        console.log("FontSize final. fontSize_new:", fontSize_new);
        //alert('1. sdfgsdg');
        
        trad.style.fontSize = fontSize_new + 'px';
        //alert('2. sdfgsdg');



        // let trad_h = window.innerHeight / count_trad;
        // //console.log('trad_h: ', trad_h);

        // let trad_w = window.innerWidth / count_trad;
        // //console.log('trad_w: ', trad_w);

        trad_inner.style.height = trad_h + 'px';
        trad_inner.style.width = trad_w + 'px';        
        




        // while (fontSize < 300) {//while() es mas rapido que for() 300px es font-size maximo 
        //     console.log('');//para marcar inicio de bucle...
        //     console.log('');

        //     // clone.style.fontSize = fontSize + 'px';
        //     // console.log('clone.style.fontSize: ', fontSize);
            
        //     // //mido el ancho y alto del clone
        //     // const { width, height } = clone.getBoundingClientRect();
        //     // console.log('clone. rect. width: ', width);
        //     // console.log('clone. rect. height: ', height);


        //             // //CLONE_VERSE. mido el ancho y alto del 'verse' dentro del clone
        //             // const { width: clone_verse_width, height: clone_verse_height } = clone.querySelector('.verse').getBoundingClientRect();
        //             // console.log(' --- clone_verse_width: ', clone_verse_width);
        //             // console.log(' --- clone_verse_height: ', clone_verse_height);

        //             // let clone_verse_sobresale = (
        //             //     (clone_verse_width) > maxW || 
        //             //     (clone_verse_height) > maxH
        //             // );
        //             // console.log(' --- clone_verse_sobresale: ', clone_verse_sobresale);

        //             // if(clone_verse_sobresale){
        //             //     console.log(' el contenedor clone_verse_sobresale SOBRESALE');
        //             //     //alert(' sobresale');
        //             // } 

        //     // //si el ancho o alto del clone sobresale, salgo del while()
        //     // if (width > maxW || height > maxH || clone_verse_sobresale /*|| trad_verse_sobresale*/) {
        //     //     console.log(`width o height sobresale. hago break: --- clone.width: [${width}] --- clone.height: [${height}]`);                
        //     //     break;
        //     // }                      
            
            


        //             trad.style.fontSize = fontSize + 'px';//para test en tiempo real ver el cambio
        //             console.log('trad.style.fontSize: ', fontSize);

        //             //await sleep(10); // espera 10 milisegundos para ver el cambio en tiempo real

        //             //mido el ancho y alto del clone
        //             const { width: trad_width, height: trad_height } = trad.getBoundingClientRect();
        //             console.log('trad. rect. width: ', trad_width);
        //             console.log('trad. rect. height: ', trad_height);

        //             //TRAD_VERSE. mido el ancho y alto del 'verse' dentro del clone
        //             const { width: trad_verse_width, height: trad_verse_height } = trad.querySelector('.verse').getBoundingClientRect();
        //             console.log(' --- trad_verse_width: ', trad_verse_width);
        //             console.log(' --- trad_verse_height: ', trad_verse_height);

        //             let trad_verse_sobresale = (
        //                 (trad_verse_width) > maxW || 
        //                 (trad_verse_height) > maxH
        //             );
        //             console.log(' --- trad_verse_sobresale: ', trad_verse_sobresale);

        //             if(trad_verse_sobresale){
        //                 console.log(' el contenedor trad_verse_sobresale SOBRESALE');
        //                 //alert(' sobresale');
        //             }            

        //     //si el ancho o alto del clone sobresale, salgo del while()
        //     if (/*trad_width > maxW || trad_height > maxH ||*/ trad_verse_sobresale /*|| trad_verse_sobresale*/) {
        //         console.log(`width o height sobresale. hago break: --- trad.width: [${trad_width}] --- trad.height: [${trad_height}]`);                
        //         console.log('voy a hacer break... con fontSize: ', fontSize);
        //         alert('voy a hacer break... con fontSize: ', fontSize);
        //         finalizado = true;
        //         trad.style.fontSize = (fontSize - 1) + 'px';
        //         alert('he puesto fontSize: ', fontSize);
        //         break;
        //     }

        //     if(!finalizado){
        //         fontSize++;
        //         console.log('aumento fontSize a 1 mas. ahora aumentado fontSize: ', fontSize);
        //     }else{
        //         alert('--- NO aumento mas fontSize...')
        //     }
        // }
        
        //ya que en el while() el contenido sobresale, debo molver al fontSize anterior de sobresalir
        //por eso debo restar 1px
        //trad.style.fontSize = (fontSize - 1) + 'px';
        
        //da error. se espera pero se vuelve a llamar mySizePantallaShow() y se vuelve a poner font-size: 10px inicial
        // lo quito
        //await sleep(1000*5); // espera 1 segundo 
        
                    // let trad_h = window.innerHeight / count_trad;
                    // //console.log('trad_h: ', trad_h);

                    // let trad_w = window.innerWidth / count_trad;
                    // //console.log('trad_w: ', trad_w);

                    // trad_inner.style.height = trad_h + 'px';
                    // trad_inner.style.width = trad_w + 'px';

        // document.body.removeChild(clone);//ok
        document.body.removeChild(clone_contenedor);//ok

    });

    let pantallaShow = localStorage.getItem('pantallaShow');
    if(eid_contenedor){
        if(pantallaShow === 'true'){
            //console.log('add shown');
            eid_contenedor.classList.add('shown');
        }else{
            //console.log('remove shown');
            eid_contenedor.classList.remove('shown');
        }
    }
}


function make_add_slide_html(pant){
    if(!pant) return;

    let add_slide_html = '';

    if(pant.add_d_puntos){
        add_slide_html += `
            <div class="wr_d_puntos">
                <p>...</p>
            </div>
        `;
    }

    if(pant.add_d_music){
        add_slide_html += `
            <div class="wr_d_music">
                <img src="images/notas_de_musica_grey.svg">
            </div>
        `;
    }

    if(pant.add_tres_estrellas){
        add_slide_html += `
            <span class="tres_estrellas">* * *</span>
        `;
    }    
    return add_slide_html;

}


