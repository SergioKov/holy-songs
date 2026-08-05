
function togglePlayPauseVideo(){
    console.log('=== function togglePlayPauseVideo() ===');

    makeBtnActive(eid_videoControlPanel, eid_btn_playPauseVideo);

    if(objVideo.running){
        //pauso video
        objVideo.estado = 'PAUSE';
        objVideo.running = false;

        eid_btn_playPauseVideo.innerHTML = '▶';
        eid_estadoVideoHoly.textContent = 'PAUSADO';

    }else{
        //reproduzco video
        objVideo.estado = 'PLAY';
        objVideo.running = true;

        // El vídeo que debe reproducir pantalla.php
        if(!src_video_actual){
            alert('No hay ningún vídeo seleccionado.');
            return;
        }
        objVideo.src = src_video_actual;

        eid_btn_playPauseVideo.innerHTML = '⏸';
        eid_estadoVideoHoly.textContent = 'REPRODUCIENDO';

        enfocarReferencia(1);
    }

    // No modificar currentTime
    objVideo.syncCurrentTime = false;

    enviarVideoPantallas();
}

function iniciarVideo(){
    console.log('=== function iniciarVideo() ===');

    makeBtnActive(eid_videoControlPanel, eid_btn_iniciarVideo);

    objVideo.estado = 'PLAY';
    objVideo.running = true;

    eid_btn_playPauseVideo.innerHTML = '⏸';
    eid_estadoVideoHoly.textContent = 'REPRODUCIENDO';

    enviarVideoPantallas();
}


function pausarVideo(){
    console.log('=== function pausarVideo() ===');

    makeBtnActive(eid_videoControlPanel, eid_btn_pausarVideo);

    objVideo.estado = 'PAUSADO';
    objVideo.running = false;

    eid_btn_playPauseVideo.innerHTML = '▶';
    eid_estadoVideoHoly.textContent = 'PAUSADO';

    enviarVideoPantallas();
}


function pararVideo(){
    console.log('=== function pararVideo() ===');

    makeBtnActive(eid_videoControlPanel, eid_btn_pararVideo);

    objVideo.estado = 'STOP';
    objVideo.running = false;
    objVideo.currentTime = 0;

    eid_btn_playPauseVideo.innerHTML = '▶';
    
    eid_estadoVideoHoly.textContent = 'PARADO';
    eid_videoTextHoly.textContent = `00:00 / ${formatearHora(objVideo.duration * 1000, false)}`;

    enviarVideoPantallas();
}

function videoPrev(){
    console.log('=== function videoPrev() ===');

    // TODO:
    // Seleccionar el vídeo anterior de la lista
    // objVideo.src = ...

    objVideo.estado = 'PLAY';
    objVideo.running = true;

    enviarVideoPantallas();
}


function videoNext(){
    console.log('=== function videoNext() ===');

    // TODO:
    // Seleccionar el siguiente vídeo de la lista
    // objVideo.src = ...

    objVideo.estado = 'PLAY';
    objVideo.running = true;

    enviarVideoPantallas();
}


function videoBack(valor){
    console.log('=== function videoBack() ===');

    if(valor <= 0 || valor > 60){
        return;
    }

    objVideo.currentTime = Math.max(
        objVideo.currentTime - valor,
        0
    );

    objVideo.syncCurrentTime = true;

    enviarVideoPantallas();
}


function videoForward(valor){
    console.log('=== function videoForward() ===');

    if(valor <= 0 || valor > 60){
        return;
    }

    objVideo.currentTime = Math.min(
        objVideo.currentTime + valor,
        objVideo.duration
    );

    objVideo.syncCurrentTime = true;

    enviarVideoPantallas();
}

function abrirVideo(){
    console.log('=== function abrirVideo() ===');

    // TODO:
    // abrir selector de vídeos
    // seleccionar vídeo
    // objVideo.src = rutaSeleccionada;
    // enviarVideoPantallas();
}


function mostrarVideo(){
    console.log('=== function mostrarVideo() ===');

    makeBtnActive(eid_videoControlVista, eid_btn_mostrarVideo);

    eid_videoDisplay.classList.remove('grey');
    eid_videoDisplay.classList.add('azul');

    objVideo.visible = true;
    
    // No modificar currentTime
    objVideo.syncCurrentTime = false;

    enviarVideoPantallas();
}


function ocultarVideo(){
    console.log('=== function ocultarVideo() ===');

    makeBtnActive(eid_videoControlVista, eid_btn_ocultarVideo);

    eid_videoDisplay.classList.remove('azul');
    eid_videoDisplay.classList.add('grey');

    objVideo.visible = false;

    // No modificar currentTime
    objVideo.syncCurrentTime = false;

    enviarVideoPantallas();
}

function enviarVideoPantallas(){

    actualizarPantallas({
        actualizarSlide: false,
        actualizarVista: false
    });

}

function actualizarEstadoVideo(data){

    objVideo.currentTime = data.currentTime;
    objVideo.duration = data.duration;

    if(!sliderDragging){
        eid_videoSliderHoly.max = objVideo.duration;
        eid_videoSliderHoly.value = objVideo.currentTime;

        eid_videoTextHoly.textContent =
            formatearHora(objVideo.currentTime * 1000, false)
            + ' / ' +
            formatearHora(objVideo.duration * 1000, false);
    }
    
    const actual = formatearHora(
        data.currentTime * 1000,
        false
    );

    const total = formatearHora(
        data.duration * 1000,
        false
    );

    eid_videoTextHoly.textContent = `${actual} / ${total}`;

    switch(data.estado){

        case 'PLAY':
            eid_estadoVideoHoly.textContent = 'REPRODUCIENDO';
            break;

        case 'PAUSE':
            eid_estadoVideoHoly.textContent = 'PAUSADO';
            break;

        case 'STOP':
            eid_estadoVideoHoly.textContent = 'PARADO';
            break;

        case 'ENDED':
            eid_estadoVideoHoly.textContent = 'FINALIZADO';
            break;
    }
}


function videoSliderInput(value){

    sliderDragging = true;

    eid_videoTextHoly.textContent = 
        formatearHora(value * 1000, false)
        + ' / ' +
        formatearHora(objVideo.duration * 1000, false);

}

function videoSliderChange(value){

    sliderDragging = false;

    objVideo.currentTime = parseFloat(value);

    enviarVideoPantallas();
}