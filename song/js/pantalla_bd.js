const eid_contenedor = document.getElementById('contenedor');
//const eid_contenedor_prev_inner = document.getElementById('contenedor_prev_inner');
let arr_pantalla = [];
let delay_fn = 1200;//200 por defecto
let count_intentos = 0;

let id_songslide = 1;//test
let objPantalla = {};
let debug = false;
//debug = true;

//si se abre este ficheo , añado la info de esto en localStorage
localStorage.setItem('pantalla_abierta','true');

document.addEventListener('DOMContentLoaded', async () => {
    //console.log('documento pantalla cargado'); 
    
    await cargar_datos_pantalla();

    lanzarIntentos();
    mySizePantallaShow();
});


async function cargar_datos_pantalla(){
    console.log('=== function cargar_datos_pantalla() ===');

    objPantalla = await getDataPantallaFromBd();//IMPORTANTE para cojer todos los datos necesarios
    console.log('objPantalla: ', objPantalla);
    console.log('de bd --- objPantalla.arr_pantalla: ', objPantalla.arr_pantalla);

    objPantalla.arr_pantalla.forEach(item => {
        console.log('item before: ', item);
        if(item.fieldset_html){
            item.fieldset_html = restoreHtmlFromSanitized(item.fieldset_html);
        }
        console.log('item after: ', item);
    });

    console.log('restoreHtmlFromSanitized(objPantalla.arr_pantalla): ', objPantalla.arr_pantalla);

    localStorage.setItem('arr_pantalla', JSON.stringify(objPantalla.arr_pantalla) );//IMPORTANTE!
}


async function getDataPantallaFromBd(){
    console.log('=== function getDataPantallaFromBd() ===');

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
        console.log('data: ', data);  
        
        if(data.success){
            console.log('success is true');

            let slide_text = data.slide_text; 
            //console.log(`id_songslide: [${id_songslide}] --- id_song: [${data.id_song}] --- slide_text: [${slide_text}] --- data.pantalla_show: `, data.pantalla_show);

            data.arr_pantalla = (esString(data.arr_pantalla) && data.arr_pantalla != '' && data.arr_pantalla.length > 0) ? JSON.parse(data.arr_pantalla) : [] ;//IMPORTANTE!
            console.log(`parseado data.arr_pantalla: `, data.arr_pantalla);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getDataPantallaFromBd(): error.message: ', error.message);
    }
}


async function lanzarIntentos(){
    console.log('=== function lanzarIntentos() ===');

    await cargar_datos_pantalla();

    let pantallaShow = (objPantalla.arr_pantalla[0].pantalla_show == true) ? 'true' : 'false';
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
    //console.log('old --- arr_pantalla: ', arr_pantalla);

    //si el contenedor está vacío, lo construyo
    if(arr_pantalla && eid_contenedor && eid_contenedor.querySelector('.trad') == null ){
        //console.log('el contenedor está vacío, lo construyo...');
        construirElementosYAppend(eid_contenedor, arr_pantalla);
        //construirElementosYAppend(eid_contenedor_prev_inner, arr_pantalla);
    }

    //lanzo intenos cada 0.2 seg para comprobar si ha cambiado localStorage
    //si ha cambiado, actualizo arr_pantalla y reconstruyo el contenedor
    setTimeout(async ()=>{//COMENTAR PARA TEST
        
        await cargar_datos_pantalla();

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
                construirElementosYAppend(eid_contenedor, arr_pantalla);
                //construirElementosYAppend(eid_contenedor_prev_inner, arr_pantalla);
            }
        }else{
            //console.log('arr_pantalla old y new son IGUALES. no hago nada...');
        }

        lanzarIntentos();//COMENTAR PARA TEST

    },delay_fn);//COMENTAR PARA TEST
}


function construirElementosYAppend(contenedor, arr_pantalla){

    //eid_contenedor.innerHTML = '';//reset
    contenedor.innerHTML = '';//reset
    eid_contenedor.classList.remove('shown');//se añade 'shown' en mySizePantallaShow();

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
            eid_contenedor.classList.remove('shown');//se añade 'shown' en mySizePantallaShow();
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

        const trad_inner_computedStyle = window.getComputedStyle(trad_inner);
        let trad_inner_paddings = parseInt(trad_inner_computedStyle.padding) * 2;


        const fieldset_computedStyle = window.getComputedStyle(trad_inner.querySelector('fieldset'));
        let fieldset_margins = parseInt(fieldset_computedStyle.marginInline) * 2;// 8 * 2 = 16


        trad_inner.removeAttribute('style');//reset

        let fontSize = 10;
        trad.style.fontSize = fontSize + 'px';

        const clone = trad.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.left = '-9999px';
        //clone.style.top = '0px';
        //clone.style.left = '0px';
        document.body.appendChild(clone);
        //eid_contenedor.appendChild(clone);

        while (fontSize < 150) {//while() es mas rapido que for()
            clone.style.fontSize = fontSize + 'px';
            console.log('clone.style.fontSize: ', fontSize);
            
            //trad.style.fontSize = fontSize + 'px';//para test en tiempo real ver el cambio
            //console.log('trad.style.fontSize: ', fontSize);
            
            const { width, height } = clone.getBoundingClientRect();
            console.log('clone de trad. --- rect. width: ', width);
            console.log('clone. de trad --- rect. height: ', height);

            // const trad_rect = trad.getBoundingClientRect();
            // console.log(' --- trad_rect.width: ', trad_rect.width);
            // console.log(' --- trad_rect.height: ', trad_rect.height);

            const { width: fieldset_width, height: fieldset_height } = trad_inner.querySelector('fieldset').getBoundingClientRect();
            console.log(' --- fieldset_width: ', fieldset_width);
            console.log(' --- fieldset_height: ', fieldset_height);

            let condicion_sobresale = (
                (fieldset_width + trad_inner_paddings + fieldset_margins + 10) > maxW || 
                (fieldset_height +trad_inner_paddings + fieldset_margins + 10) > maxH
            );

            console.log(' --- condicion_sobresale: ', condicion_sobresale);
            if(condicion_sobresale){
                console.log(' sobresale');
                //alert(' sobresale');
            }

            if (width > maxW || height > maxH || condicion_sobresale) {
                console.log('width o height sobresale. hago break: ', width, height);                
                break;
            }
            fontSize++;
        }

        trad.style.fontSize = (fontSize - 1) + 'px';
        //trad.style.fontSize = (fontSize*0.1) + 'px';//le quito 10 %

        let trad_h = window.innerHeight / count_trad;
        //console.log('trad_h: ', trad_h);

        let trad_w = window.innerWidth / count_trad;
        //console.log('trad_w: ', trad_w);

        trad_inner.style.height = trad_h + 'px';
        trad_inner.style.width = trad_w + 'px';

        document.body.removeChild(clone);
        //eid_contenedor.removeChild(clone);
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



window.addEventListener('load',function(d){
    //console.log('load - window.innerWidth: '+window.innerWidth);
    mySizePantallaShow();
});

window.addEventListener('resize',function(d){
    //console.log('resize - window.innerWidth: '+window.innerWidth);
    mySizePantallaShow();
});


function hay_id_songslide(func_name = ''){
    console.log('=== function hay_id_song() ===');
    
    if(!id_songslide){
        console.warn(func_name + ' --- No hay id_songslide. hago return...');
        alert(func_name + ' --- No hay id_songslide. hago return...');
        return false;
    }
    console.log(func_name + ' --- id_songslide: ', id_songslide);

    return true;  
}

function esString(valor) {
    return typeof valor === "string";
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


/**
 * Limpia un HTML reemplazando comillas dobles (") en atributos por '__||__'
 * para que sea seguro guardar en JSON en BD.
 * @param {string} html - El HTML completo.
 * @returns {string} HTML seguro para JSON/BD.
 */
function sanitizeHtmlForJson(html) {
    return html.replace(/(\w+)="([^"]*)"/g, (match, attrName, attrValue) => {
        return `${attrName}=__||__${attrValue}__||__`; // reemplaza " por '__||__'
    });
}


/**
 * Revertir HTML sanitizado reemplazando '__||__' por comillas dobles.
 * @param {string} sanitizedHtml - HTML con '__||__' en los atributos.
 * @returns {string} HTML original con comillas dobles.
 */
function restoreHtmlFromSanitized(sanitizedHtml) {
    return sanitizedHtml.replace(/=__\|\|__(.*?)__\|\|__/g, '="$1"');
}
