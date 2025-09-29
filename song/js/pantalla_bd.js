const eid_contenedor = document.getElementById('contenedor');
//const eid_contenedor_prev_inner = document.getElementById('contenedor_prev_inner');
let arr_pantalla = [];
let delay_fn = 200;//200 por defecto
let count_intentos = 0;

let id_songslide = 1;//test
let objPantalla = {};
let debug = false;
//debug = true;

//Vars para formar tipo de contenido por defecto
let show_acordes = false;
let show_legend = false;
let show_next_slide = false;

let arr_pantalla_str_new = '';
let arr_pantalla_str_old = '';


// Obtiene toda la parte de la URL actual
const params = new URLSearchParams(window.location.search);

// Leer un parámetro específico
const id = params.get("id");   // "8050"
const t  = params.get("t");    // "lc2" //en local solo hay 't' ya que 'id' es el elegido por el admin

if(t){
    if(t.includes('c')){//acordes
        show_acordes = true;
        eid_contenedor.classList.add('show_acordes');
    }else{
        eid_contenedor.classList.remove('show_acordes');
    }

    if(t.includes('l')){//legend
        show_legend = true;
        eid_contenedor.classList.add('show_legend');
    }else{
        eid_contenedor.classList.remove('show_legend');
    }

    if(t.includes('n')){//next 2 lineas del sig kuplet si hay
        show_acordes = true;
        eid_contenedor.classList.add('show_next_slide');
    }else{
        eid_contenedor.classList.remove('show_next_slide');
    }
}





//si se abre este ficheo , añado la info de esto en localStorage
localStorage.setItem('pantalla_abierta','true');

document.addEventListener('DOMContentLoaded', async () => {
    //console.log('documento pantalla cargado'); 
    
    await cargar_datos_pantalla();
    lanzarIntentos();// dentro está mySizePantallaShow();
});

//Si HACE FALTA USAR 
window.addEventListener('load',function(d){
    //console.log('load - window.innerWidth: '+window.innerWidth);

    lanzarIntentos();// dentro está mySizePantallaShow();
});

window.addEventListener('resize',function(d){
    //console.log('resize - window.innerWidth: '+window.innerWidth);
    mySizePantallaShow();
});



async function cargar_datos_pantalla(){
    console.log('=== function cargar_datos_pantalla() ===');

    objPantalla = await getDataPantallaFromBd();//IMPORTANTE para cojer todos los datos necesarios
    console.log('objPantalla: ', objPantalla);
    console.log('de bd --- objPantalla.arr_pantalla: ', objPantalla.arr_pantalla);

    objPantalla.arr_pantalla.forEach(item => {
        console.log('item before: ', item);
        if(item.slide_html){
            item.slide_html = restoreHtmlFromSanitized(item.slide_html);
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

    let pantallaShow = (objPantalla.pantalla_show == '1') ? 'true' : 'false';
    if(eid_contenedor){
        if(pantallaShow === 'true'){
            eid_contenedor.classList.add('shown');
        }else{
            eid_contenedor.classList.remove('shown');
        }
    }
    
        
    arr_pantalla_str_old = localStorage.getItem('arr_pantalla');
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

        //DESCOMENTAR EN PROD!!!
        //eid_contenedor.classList.remove('shown');//se añade 'shown' en mySizePantallaShow();

        construirElementosYAppend();

    }else{//el contenedor ya existe
        console.log('el contenedor YA EXISTE, no lo construyo de nuevo... lo relleno si ha cambiado localStorage');

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
                
                construirElementosYAppend();         
            }
        }else{
            //console.log('arr_pantalla old y new so IGUALES. no hago nada...');
        }

        lanzarIntentos();//COMENTAR PARA TEST

    },delay_fn);//COMENTAR PARA TEST        

}

/**
 * eid_contenedor es global
 * arr_pantalla es global
 */
function construirElementosYAppend(){

    eid_contenedor.innerHTML = '';//reset

    //DESCOMENTAR EN PROD!!!
    eid_contenedor.classList.remove('shown');//se añade 'shown' en mySizePantallaShow();

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

            //DESCOMENTAR EN PROD!!!
            eid_contenedor.classList.remove('shown');//se añade 'shown' en mySizePantallaShow();
            
            eid_contenedor.append(trad);
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
        //await nextFrame();//cuando lo quito animacion es mejor!
        //await sleep(100);//cuando lo quito animacion es mejor!

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
        maxW = window.innerWidth / count_trad - 10;
        maxH = window.innerHeight / count_trad - 10;
    }else{//es tablet o desktop
        // dejo 32px de padding entre el border de pantalla y el texto
        maxW = window.innerWidth / count_trad - 32;
        maxH = window.innerHeight / count_trad - 32;        
    }

    //recorrer...
    tradAll.forEach( async (trad) => {
        //console.log('trad: ', trad);

        const trad_inner = trad.querySelector('.trad_inner');
        //console.log('trad_inner: ', trad_inner);

        trad_inner.removeAttribute('style');//reset

        const clone_contenedor = eid_contenedor.cloneNode(true);
        clone_contenedor.style.position = 'relative';
        clone_contenedor.style.visibility = 'hidden';
        clone_contenedor.style.left = '-9999px';
        document.body.appendChild(clone_contenedor);

        const clone = trad.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.left = '-9999px';
        clone_contenedor.appendChild(clone);

        let fontSize_new = await ajustarFuenteBinaria(/*trad,*/ clone, maxW, maxH);
        console.log("FontSize final. fontSize_new:", fontSize_new);
        //alert('1. sdfgsdg');
        
        trad.style.fontSize = fontSize_new + 'px';
        //alert('2. sdfgsdg');

        let trad_h = window.innerHeight / count_trad;
        //console.log('trad_h: ', trad_h);

        // si quero mostrar en varias columnas, divido entre count_trad
        // si solo en rows => no divido, sino 
        // let trad_w = window.innerWidth / count_trad;
        let trad_w = window.innerWidth;// muestro en rows
        //console.log('trad_w: ', trad_w);

        trad_inner.style.height = trad_h + 'px';
        trad_inner.style.width = trad_w + 'px';        
        
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
