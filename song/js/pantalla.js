const eid_contenedor = document.getElementById('contenedor');
let arr_pantalla = [];
let delay_fn = 200;//200 por defecto
let count_intentos = 0;

//si se abre este ficheo , añado la info de esto en localStorage
localStorage.setItem('pantalla_abierta','true');

document.addEventListener('DOMContentLoaded', () => {
    //console.log('documento pantalla cargado');    
    lanzarIntentos();
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

        arr_pantalla.forEach( (pant, i) => {
            
            let add_slide_html = make_add_slide_html(pant);

            const trad = document.createElement('div');
            trad.id = 'trad' + i;
            trad.className = 'trad';
            trad.innerHTML = `
                <div class="trad_inner">
                    <div class="verse">
                        ${arr_pantalla[i].slide_text}
                        ${add_slide_html}
                    </div>
                </div>
            `;
            //test DORABOTAT!!!
            // trad.innerHTML = `
            //     <div class="trad_inner">
            //             ${arr_pantalla[i].fieldset_html}
            //     </div>
            // `;

            eid_contenedor.classList.remove('shown');
            eid_contenedor.append(trad);
        });
        
        mySizePantallaShow();
    }

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
                eid_contenedor.innerHTML = '';//reset
                eid_contenedor.classList.remove('shown');

                if(arr_pantalla.length > 0){                
                    arr_pantalla.forEach( (pant, i) => {
                        
                        let add_slide_html = make_add_slide_html(pant);

                        const trad = document.createElement('div');
                        trad.id = 'trad' + i;
                        trad.className = 'trad';
                        trad.innerHTML = `
                            <div class="trad_inner">
                                <div class="verse">
                                    ${arr_pantalla[i].slide_text}
                                    ${add_slide_html}
                                </div>
                            </div>
                        `;
                        //DORABOTAT!!!
                        // trad.innerHTML = `
                        //     <div class="trad_inner">
                        //             ${arr_pantalla[i].fieldset_html}
                        //     </div>
                        // `;
                        eid_contenedor.classList.remove('shown');
                        eid_contenedor.append(trad);
                    });

                    mySizePantallaShow();
                }
            }
        }else{
            //console.log('arr_pantalla old y new so IGUALES. no hago nada...');
        }

        lanzarIntentos();//COMENTAR PARA TEST

    },delay_fn);//COMENTAR PARA TEST
}



window.addEventListener('load',function(d){
    //console.log('load - window.innerWidth: '+window.innerWidth);
    mySizePantallaShow();
});

window.addEventListener('resize',function(d){
    //console.log('resize - window.innerWidth: '+window.innerWidth);
    mySizePantallaShow();
});



function mySizePantallaShow() {//new como ajustarTexto()
    //console.log('=== function mySizePantallaShow() ===');
        
    const tradAll = document.querySelectorAll('.trad');
    let count_trad = tradAll.length;//en caso de song es 1

    const maxW = window.innerWidth - 32;//32; // padding
    const maxH = window.innerHeight - 32;

    //recorrer...
    tradAll.forEach(trad => {
        //console.log('trad: ', trad);

        const trad_inner = trad.querySelector('.trad_inner');
        //console.log('trad_inner: ', trad_inner);

        trad_inner.removeAttribute('style');//reset

        let fontSize = 10;
        trad.style.fontSize = fontSize + 'px';

        const clone = trad.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.left = '-9999px';
        document.body.appendChild(clone);

        while (fontSize < 500) {//while() es mas rapido que for()
            clone.style.fontSize = fontSize + 'px';
            //console.log('clone.style.fontSize: ', fontSize);
            
            const { width, height } = clone.getBoundingClientRect();
            //console.log('clone. rect. width: ', width);
            //console.log('clone. rect. height: ', height);

            if (width > maxW || height > maxH) {
                //console.log('width o height sobresale. hago break: ', width, height);                
                break;
            }
            fontSize++;
        }

        trad.style.fontSize = (fontSize - 1) + 'px';

        let trad_h = window.innerHeight / count_trad;
        //console.log('trad_h: ', trad_h);

        let trad_w = window.innerWidth / count_trad;
        //console.log('trad_w: ', trad_w);

        trad_inner.style.height = trad_h + 'px';
        trad_inner.style.width = trad_w + 'px';

        document.body.removeChild(clone);
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
