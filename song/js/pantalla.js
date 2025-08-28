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
    console.log('=== function lanzarIntentos() ===');

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

        arr_pantalla.forEach((pant, i)=>{
                    
            const trad = document.createElement('div');
            trad.id = 'trad' + i;
            trad.className = 'trad';
            trad.innerHTML = `
                <div class="trad_inner">
                    <div class="verse">
                        ${arr_pantalla[i].song_text}
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
                    arr_pantalla.forEach((pant, i)=>{
                        
                        const trad = document.createElement('div');
                        trad.id = 'trad' + i;
                        trad.className = 'trad';
                        trad.innerHTML = `
                            <div class="trad_inner">
                                <div class="verse">
                                    ${arr_pantalla[i].song_text}
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



function old_mySizePantallaShow(){
    console.log('=== function mySizePantallaShow() ===');

    if(eid_contenedor){
        eid_contenedor.classList.remove('shown');
    }

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;

    //console.log('window_w: ',window_w);
    //console.log('window_h: ',window_h);
    
    let tradAll = document.querySelectorAll('.trad');
    let count_trad = tradAll.length;

    tradAll.forEach(trad => {
        
        const trad_inner = trad.querySelector('.trad_inner');
        trad_inner.removeAttribute('style');//reset
        
        let trad_h = window_h / count_trad;
        console.log('trad_h: ', trad_h);

        let trad_w = window_w / count_trad;
        console.log('trad_w: ', trad_w);

                // trad.style.height = trad_h + 'px';
                // trad.style.width = trad_w + 'px';

        //let trad_h = trad.style.height;
        let trad_inner_h = trad_inner.offsetHeight;
        console.log('trad_inner_h: ',trad_inner_h);
        
        let trad_inner_w = trad_inner.offsetWidth;
        console.log('trad_inner_w: ',trad_inner_w);

        // Obtener los estilos calculados
        const trad_styles = window.getComputedStyle(trad);
        let font_size_inicial = parseInt(trad_styles.fontSize);
        //console.log('font_size_inicial: ', font_size_inicial);
        
        let font_size_new; 

        if(trad_inner_h > trad_h /*|| trad_inner_w > trad_w*/){// si el texto ocupa más espacio que hay (hay mucho texto)
            console.log(trad);

            for (let i = 1; i < font_size_inicial; i++) {
                font_size_new = font_size_inicial - i;
                //console.log('if. font_size_new: ', font_size_new);
                trad.style.fontSize = font_size_new + 'px';

                if(trad_inner.offsetHeight <= trad_h /*|| trad_inner.offsetWidth <= trad_w*/){
                    console.log('if. --- ya no hay scroll.---');

                    trad.style.fontSize = (font_size_new - 2) + 'px';

                    console.log('if --- trad_h: ', trad_h);
                    console.log('if --- trad_inner.offsetHeight: ', trad_inner.offsetHeight);
                    console.log('if --- trad_w: ', trad_w);
                    console.log('if --- trad_inner.offsetWidth: ', trad_inner.offsetWidth);
                    break;
                }
            }

        }else if(trad_inner_h < trad_h /* || trad_inner_w < trad_w*/){// si el texto ocupa menos espacio que hay (hay poco texto) 

            for (let i = 1; i < (font_size_inicial * 3); i++) {
                font_size_new = font_size_inicial + i;
                console.log('else. font_size_new: ', font_size_new);

                trad.style.fontSize = font_size_new + 'px';

                if(trad_inner.offsetHeight >= trad_h /* || trad_inner.offsetWidth >= trad_w */){
                    console.log('else. --- ya el texto ocupa todo el espacio. ---');
                    
                    trad.style.fontSize = (font_size_new - 2) + 'px';
                    

                    console.log('else --- trad_h: ', trad_h);
                    console.log('else --- trad_inner.offsetHeight: ', trad_inner.offsetHeight);
                    console.log('else --- trad_w: ', trad_w);
                    console.log('else --- trad_inner.offsetWidth: ', trad_inner.offsetWidth);
                    break;
                }
            }
        }

        trad_inner.style.height = '100%';

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


function mySizePantallaShow() {//new como ajustarTexto()
    console.log('=== function mySizePantallaShow() ===');
        
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

