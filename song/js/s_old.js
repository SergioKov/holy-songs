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



function old_hayElementosModalesAbiertos() {
    return [...document.querySelectorAll('.elementos_modales')]
        .some(modal => {
            if (!modal.offsetParent) return false; // no visible en DOM
            const rect = modal.getBoundingClientRect();
            return rect.width > 0 &&
                rect.height > 0 &&
                rect.bottom > 0 &&
                rect.right > 0 &&
                rect.top < window.innerHeight &&
                rect.left < window.innerWidth;
        });
}

async function old_nueva_song(){
    console.log('=== function nueva_song() ===');

    id_song = null;//reset id_song -> ya que es nueva canción

    //reseteo datos de la song anterior para evitar confusión
    resetBlockBuscar();
    resetBlockEsquema();
    resetLineasXinBlock(eid_block_cancion);

    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_btns_action.innerHTML = '...';//reset 
    
    pintSongbooksOptions(cancion_form_container.querySelector('#songbook'));

    cancion_song_bloques.classList.add('solo_ver');

    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Nueva canción:';
    form_mensaje.textContent = 'Rellena los campos del formulario con los datos de la nueva canción.';

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
    eid_block_cancion_head.querySelector('#btn_song_nueva').classList.add('btn_active');

    cancion_song_bloques.querySelector('.puntos_def').style.display = 'none';//oculto '...'
    cancion_form_container.style.display = 'block';//mostrar formulario de canción

    makeInputsDisabled(cancion_form_container, false);
    cancion_form_container.querySelector('form').reset();//reseteo formulario 

    cancion_form_container.querySelector('#id_song').disabled = true;//deshabilito input id_song   
    cancion_form_container.querySelector('.wr_id_song').style.display = 'none';//oculto el wr_id_song

    cancion_wr_btns_action.innerHTML = `
        <button class="btn" onclick="showBlockName('buscar');">Buscar</button>
    `;
    
    console.log('fin');
}


function old_editar_song(modo){
    console.log('=== function editar_song() ===');

    if(!hay_id_song('editar_song()')){
        return; // <- se detiene aquí si no hay id_song
    }

    resetLineasXinBlock(eid_block_cancion);

    if(modo == 'ver'){
        makeInputsDisabled(cancion_form_container, true);
        //Partes left-right
        eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Ver canción:';
        //eid_block_cancion.querySelector('.bl_parte_r h4').textContent = 'Vista previa de la canción seleccionada:';
        //form_mensaje.textContent = 'Mira los campos del formulario de la canción.';

        resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
        eid_block_cancion_head.querySelector('#btn_song_ver').classList.add('btn_active');
    }
    else if(modo == 'editar'){
        makeInputsDisabled(cancion_form_container, false);
        //Partes left-right
        eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Editar canción:';
        //eid_block_cancion.querySelector('.bl_parte_r h4').textContent = 'Vista previa de la canción editada:';
        //form_mensaje.textContent = 'Edita los campos del formulario de la canción.';

        resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
        eid_block_cancion_head.querySelector('#btn_song_editar').classList.add('btn_active');
    }


    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_btns_action.innerHTML = '...';//reset 

    pintSongbooksOptions(cancion_form_container.querySelector('#songbook'));   

    cancion_song_bloques.classList.add('solo_ver');
    
    cancion_song_bloques.querySelector('.puntos_def').style.display = 'none';//oculto '...'
    cancion_form_container.style.display = 'block';//mostrar formulario de canción

    cancion_form_container.querySelector('form').reset();//reseteo formulario    
    
    cancion_form_container.querySelector('#title').value = objSong.title || '';
    cancion_form_container.querySelector('#category').value = objSong.category || '';
    cancion_form_container.querySelector('#songbook').value = objSong.songbook || '';
    cancion_form_container.querySelector('#id_song').value = objSong.id_song;
    cancion_form_container.querySelector('#id_song').disabled = true;//deshabilito input id_song
    cancion_form_container.querySelector('.wr_id_song').style.display = 'block';//muestro el wr_id_song
    cancion_form_container.querySelector('#song_number').value = objSong.song_number || '';
    cancion_form_container.querySelector('#tune').value = objSong.tune || '';
    cancion_form_container.querySelector('#lang').value = objSong.lang;
    cancion_form_container.querySelector('#song_text').value = objSong.song_text || '';
    cancion_form_container.querySelector('#notes').value = objSong.notes || '';

    handleFormInput(cancion_form_container.querySelector('#song_text'), eid_block_cancion);

    buildEsquemaSoloTitulos(cancion_form_container.querySelector('.d_esquema_titulos'), objSong.arr_esquema);

    let vista_html = '';

    if(objSong.arr_esquema.length > 0){
        vista_html += `
            <p class="p_titulo">Esquema:</p>
        `;
        objSong.arr_esquema.forEach( (item, i)=>{
            if(i != 0){
                vista_html += `
                    <p class="texto_norm linea">
                        <span class="titulo">(${item.nombre})</span> 
                        ${ (item.veces > 1) ?  '<span class="puntos"></span> <span class="veces">(x' + item.veces + ')</span>' : '' }
                    </p>
                `;
            }
        });
    }else{
        vista_html += `
            <p class="p_titulo">Esquema:</p>
            <p class="texto_norm">No</p>
        `;
    }
    console.log('vista_html: ' ,vista_html);

    cancion_wr_btns_action.innerHTML = `
        <button class="btn btn_big" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</button>
        <button class="btn btn_big" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</button>
        <button class="btn btn_big" onclick="crearSlides();">Crear slides</button>
        <button class="btn btn_big" onclick="crearSlides(); closeAll()">Crear slides + Ver</button>
    `;

    
    console.log('fin');    
}


function old_eliminar_song(){
    console.log('=== function eliminar_song() ===');

    if(!hay_id_song('eliminar_song()')){
        return; // <- se detiene aquí si no hay id_song
    }

    resetLineasXinBlock(eid_block_cancion);

    makeInputsDisabled(cancion_form_container, true);
    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Eliminar canción:';
    //eid_block_cancion.querySelector('.bl_parte_r h4').textContent = 'Vista previa:';
    form_mensaje.textContent = 'Revisa los campos del formulario de la canción que se va a eliminar.';

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor
    eid_block_cancion_head.querySelector('#btn_song_eliminar').classList.add('btn_active');

    cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_btns_action.innerHTML = '...';//reset    

    cancion_song_bloques.classList.add('solo_ver');
    
    cancion_song_bloques.querySelector('.puntos_def').style.display = 'none';//oculto '...'
    cancion_form_container.style.display = 'block';//mostrar formulario de canción

    cancion_form_container.querySelector('form').reset();//reseteo formulario    
    
    cancion_form_container.querySelector('#title').value = objSong.title || '';
    cancion_form_container.querySelector('#category').value = objSong.category || '';
    cancion_form_container.querySelector('#id_song').value = objSong.id_song;
    cancion_form_container.querySelector('#id_song').disabled = true;//deshabilito input id_song
    cancion_form_container.querySelector('.wr_id_song').style.display = 'block';//muestro el wr_id_song
    cancion_form_container.querySelector('#song_number').value = objSong.song_number || '';
    cancion_form_container.querySelector('#tune').value = objSong.tune || '';
    cancion_form_container.querySelector('#lang').value = objSong.lang;
    cancion_form_container.querySelector('#song_text').value = objSong.song_text || '';
    cancion_form_container.querySelector('#notes').value = objSong.notes || '';

    handleFormInput(cancion_form_container.querySelector('#song_text'), eid_block_cancion);

    cancion_wr_btns_action.innerHTML = `
        <button class="btn btn_big" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</button>                
        <button class="btn btn_big btn_eliminar" onclick="deleteSong();">Eliminar Canción DEFINITIVAMENTE</button>                
    `;
    
    console.log('fin');    
}
