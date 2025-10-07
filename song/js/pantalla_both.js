//========================================================================================//
//aki el codigo que se usa con ambos (both) local 'pantall.js' y remoto 'pantalla_bd.js'
//========================================================================================//
console.log('es pantalla_both.js');

/**
 * eid_contenedor es global
 * objPantallaParams es global
 */
function aplicarVista(){
    //console.log('=== function aplicarVista() ===');

    //Admin control
    pantalla_show = (objPantallaParams.pantalla_show == '1') ? true : false;
    show_logo_en_fondo = (objPantallaParams.show_logo_en_fondo == '1') ? true : false;
    show_bible_en_fondo = (objPantallaParams.show_bible_en_fondo == '1') ? true : false;
    show_black_en_fondo = (objPantallaParams.show_black_en_fondo == '1') ? true : false;
    user_view_control = (objPantallaParams.user_view_control == '1') ? true : false;
    
    //User control
    show_legend = (objPantallaParams.show_legend == '1') ? true : false;
    show_acordes = (objPantallaParams.show_acordes == '1') ? true : false;
    show_next_slide = (objPantallaParams.show_next_slide == '1') ? true : false;

    // si hay contenedor...
    if(eid_contenedor){
        
        //Admin control
        if(pantalla_show === true){
            eid_contenedor.classList.add('shown');
            document.body.classList.remove('logo_en_fondo');
            document.body.classList.remove('bible_en_fondo');
            document.body.classList.remove('black_en_fondo');
        }else{
            eid_contenedor.classList.remove('shown');

            if(show_logo_en_fondo === true){
                document.body.classList.add('logo_en_fondo');
            }else{
                document.body.classList.remove('logo_en_fondo');
            }

            if(show_bible_en_fondo === true){
                document.body.classList.add('bible_en_fondo');
            }else{
                document.body.classList.remove('bible_en_fondo');
            }

            if(show_black_en_fondo === true){
                document.body.classList.add('black_en_fondo');
            }else{
                document.body.classList.remove('black_en_fondo');
            }
        }


        //User control
        if(show_acordes === true){
            eid_contenedor.classList.add('show_acordes');
        }else{
            eid_contenedor.classList.remove('show_acordes');
        }

        if(show_legend === true){
            eid_contenedor.classList.add('show_legend');
        }else{
            eid_contenedor.classList.remove('show_legend');
        }

        if(show_next_slide === true){
            eid_contenedor.classList.add('show_next_slide');
        }else{
            eid_contenedor.classList.remove('show_next_slide');
        }
    }


    //si está permitido para el usuario controlar la vista, ...
    if(user_view_control === true){
        //console.log('aplico vista usuario...');
        aplicarVistaUsuario();
    }

}//end function aplicarVista()


function aplicarVistaUsuario(){
    //console.log('=== function aplicarVistaUsuario() ===');

    // Obtiene toda la parte de la URL actual
    const params = new URLSearchParams(window.location.search);

    // Leer un parámetro específico
    const id = params.get("id");   // "8050"
    const t  = params.get("t");    // "lc2" //en local solo hay 't' ya que 'id' es el elegido por el admin

    if(t){

        //legend
        if(t.includes('l')){
            show_legend = true;
            eid_contenedor.classList.add('show_legend');
        }else{
            show_legend = false;
            eid_contenedor.classList.remove('show_legend');
        }

        //acordes
        if(t.includes('c')){
            show_acordes = true;
            eid_contenedor.classList.add('show_acordes');
        }else{
            show_acordes = false;
            eid_contenedor.classList.remove('show_acordes');
        }

        //next_slide.  2 lineas del sig kuplet si hay
        if(t.includes('n')){
            show_acordes = true;
            eid_contenedor.classList.add('show_next_slide');
        }else{
            show_acordes = false;
            eid_contenedor.classList.remove('show_next_slide');
        }
    }
}



/**
 * eid_contenedor es global
 * arr_pantalla es global
 */
function construirElementosYAppend(){
    //console.log('=== function construirElementosYAppend() ===');

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
        eid_contenedor.append(p);
        
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
    //console.log('trad_width: ', trad_width);
    //console.log('trad_height: ', trad_height);

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        trad.style.fontSize = mid + 'px';

        // Espera que el navegador pinte y calcule layout
        //await nextFrame();//cuando lo quito animacion es mejor!
        //await sleep(100);//cuando lo quito animacion es mejor!

        const verse = trad.querySelector('.verse');
        if (!verse) break; // por seguridad

        const { width: verse_width, height: verse_height } = verse.getBoundingClientRect();
        //console.log('verse_width: ', verse_width);
        //console.log('verse_height: ', verse_height);

        if (verse_width <= maxW && verse_height <= maxH      /*&& verse_width <= trad_width && verse_height <= trad_height*/ ) {
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
        //console.log("FontSize final. fontSize_new:", fontSize_new);
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

    aplicarVista();
}


function hay_id_songslide(func_name = ''){
    //console.log('=== function hay_id_song() ===');
    
    if(!id_songslide){
        console.warn(func_name + ' --- No hay id_songslide. hago return...');
        alert(func_name + ' --- No hay id_songslide. hago return...');
        return false;
    }
    //console.log(func_name + ' --- id_songslide: ', id_songslide);

    return true;  
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












