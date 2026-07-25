//========================================//
//start - temporizador para predicadores
//========================================//
function iniciarTimer(){
    console.log('=== function iniciarTimer() ===');

    makeBtnActive(eid_timerControlPanel, eid_btn_iniciarTimer);

    const minutos = parseInt(eid_timerMinutos.value, 10);
    
    // Validación
    if (isNaN(minutos) || minutos <= 0) {
        alert('Introduzca un tiempo válido.');
        return;
    }

    objTimer.tiempoPausadoMs = 0;
    objTimer.pauseStartedAt = null;

    objTimer.durationMs = minutos * 60 * 1000;
    objTimer.remainingMs = null;// <-- importante
    objTimer.endTime = Date.now() + objTimer.durationMs;
    objTimer.status = 'INICIADO';

    objTimer.running = true;
    objTimer.visible = true;

    console.log('objTimer: ', objTimer);

    enviarTimerPantallas();
}

function pararTimer(){
    console.log('=== function pararTimer() ===');

    makeBtnActive(eid_timerControlPanel, eid_btn_pararTimer);

    objTimer.running = false;
    objTimer.remainingMs = objTimer.durationMs;
    objTimer.endTime = null;
    objTimer.status = 'PARADO';
    objTimer.pauseStartedAt = null;
    objTimer.tiempoPausadoMs = 0;
    objTimer.tiempoRestadoMs = 0;
    objTimer.tiempoSumadoMs = 0;

    enviarTimerPantallas();
}

function reiniciarTimer(){
    console.log('=== function reiniciarTimer() ===');

    makeBtnActive(eid_timerControlPanel, eid_btn_reiniciarTimer);

    objTimer.remainingMs = null;
    objTimer.endTime = Date.now() + objTimer.durationMs;
    objTimer.running = true;
    objTimer.visible = true;
    objTimer.status = 'REINICIADO';
    objTimer.pauseStartedAt = null;
    objTimer.tiempoPausadoMs = 0;
    objTimer.tiempoRestadoMs = 0;
    objTimer.tiempoSumadoMs = 0;

    enviarTimerPantallas();
}

function pausarTimer(){
    console.log('=== function pausarTimer() ===');
    
    makeBtnActive(eid_timerControlPanel, eid_btn_pausarTimer);

    if(!objTimer.running){
        return;
    }

    const ahora = Date.now();
    const restanteActualMs = objTimer.endTime - ahora;

    objTimer.remainingMs = restanteActualMs;
    objTimer.running = false;
    objTimer.endTime = null;
    objTimer.status = 'PAUSADO';

    // Desde este instante empieza la pausa.
    // No modificar tiempoPausadoMs aquí.
    objTimer.pauseStartedAt = ahora;

    enviarTimerPantallas();
}

function continuarTimer(){
    console.log('=== function continuarTimer() ===');
    
    makeBtnActive(eid_timerControlPanel, eid_btn_continuarTimer);

    if(objTimer.running){
        return;
    }

    const ahora = Date.now();

    if(objTimer.pauseStartedAt){
        objTimer.tiempoPausadoMs += ahora - objTimer.pauseStartedAt;
        objTimer.pauseStartedAt = null;
    }

    objTimer.endTime = ahora + objTimer.remainingMs;
    objTimer.remainingMs = null;
    objTimer.running = true;
    objTimer.status = 'EN MARCHA';

    enviarTimerPantallas();
}

function mostrarTimer(){
    console.log('=== function mostrarTimer() ===');

    makeBtnActive(eid_timerControlVista, eid_btn_mostrarTimer);

    // Si no está iniciado
    if(!objTimer.running && objTimer.endTime === null && objTimer.remainingMs === null){

        const minutos = parseInt(eid_timerMinutos.value, 10);

        if(!isNaN(minutos) && minutos > 0){
            objTimer.durationMs = minutos * 60 * 1000;
            objTimer.remainingMs = objTimer.durationMs;
        }
    }

    objTimer.visible = true;
    objTimer.status = 'MOSTRADO';

    enviarTimerPantallas();
}

function ocultarTimer(){
    console.log('=== function ocultarTimer() ===');

    makeBtnActive(eid_timerControlVista, eid_btn_ocultarTimer);

    objTimer.visible = false;
    objTimer.status = 'OCULTADO';

    enviarTimerPantallas();
}

function sumarMinutosTimer(minutos){
    console.log('=== function sumarMinutosTimer() ===');

    makeBtnActive(eid_timerControlMinutos, eid_btn_sumarMinutosTimer);

    const ms = minutos * 60 * 1000;

    if(objTimer.running){
        objTimer.endTime += ms;
    }else{
        objTimer.remainingMs += ms;
    }

    objTimer.tiempoSumadoMs += ms;
    objTimer.status = `SUMADO`;

    enviarTimerPantallas();
}

function restarMinutosTimer(minutos){
    console.log('=== function restarMinutosTimer() ===');

    makeBtnActive(eid_timerControlMinutos, eid_btn_restarMinutosTimer);

    const ms = minutos * 60 * 1000;

    if(objTimer.running){
        objTimer.endTime -= ms;
    }else{
        objTimer.remainingMs -= ms;
    }

    objTimer.tiempoRestadoMs += ms;
    objTimer.status = `RESTADO`;

    enviarTimerPantallas();
}

function obtenerTiempoPausadoActualMs(){
    let tiempoPausadoActualMs = objTimer.tiempoPausadoMs || 0;

    if(
        !objTimer.running &&
        objTimer.status === 'PAUSADO' &&
        objTimer.pauseStartedAt
    ){
        tiempoPausadoActualMs += Date.now() - objTimer.pauseStartedAt;
    }

    return tiempoPausadoActualMs;
}

function calcularEstadoTimer(){
    console.log('=== function calcularEstadoTimer() ===');

    let restante;
    let tiempoPausadoMs = objTimer.tiempoPausadoMs || 0;

    if(objTimer.running){
        restante = objTimer.endTime - Date.now();
    }else{
        restante = objTimer.remainingMs;
    }

    if(
        !objTimer.running &&
        objTimer.status === 'PAUSADO' &&
        objTimer.pauseStartedAt
    ){
        tiempoPausadoMs += Date.now() - objTimer.pauseStartedAt;
    }

    const negativo = restante < 0;

    restante = Math.abs(restante);

    const restanteSegundos = Math.ceil(restante / 1000);

    const minutos = Math.floor(restanteSegundos / 60);
    const segundos = restanteSegundos % 60;

    let clase;

    if(!negativo && restante > objTimer.warningMs){
        clase = 'verde';
    }
    else if(!negativo){
        clase = 'amarillo';
    }
    else if(!objTimer.running){
        clase = 'rojo';
    }
    else if(restante <= objTimer.warningMs){
        clase = 'rojo';
    }
    else{
        clase = 'rojo_blink';
    }

    const tiempo_mostrar = `${negativo ? '-' : ''}${String(minutos).padStart(2,'0')}:${String(segundos).padStart(2,'0')}`;
    console.log('tiempo_mostrar: ', tiempo_mostrar);

    return {
        negativo,
        restante,
        minutos,
        segundos,
        texto: tiempo_mostrar,
        clase,
        status: objTimer.status,
        tiempoPausadoMs
    };
}

function formatearTiempoTimer(ms){
    const totalSegundos = Math.ceil(Math.abs(ms) / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

function enviarTimerPantallas(){
    console.log('=== function enviarTimerPantallas() ===');
    
    // Actualizar en Holy Songs, pintando inmediatamente
    pintarTimerHoly();

    // Actualizar pantalla.php
    actualizarPantallas({
        actualizarSlide:false,
        actualizarVista:false
    });
}
//========================================//
//end - temporizador para predicadores
//========================================//

        









//======================================================//
//start - hora actual y tiempo restante hasta el inicio
//======================================================//

let horaHolyInterval = null;

function iniciarRenderHoraHoly(){

    makeBtnActive(eid_horaControlPanel, eid_btn_iniciarHora);

    if(horaHolyInterval){
        return;
    }

    pintarHoraHoly();

    horaHolyInterval = setInterval(
        pintarHoraHoly,
        1000
    );

    objHora.running = true;
    console.log('objHora: ', objHora);

    enviarHoraPantallas();// pantalla.php recibe visible=true
}

function pararRenderHoraHoly(){

    makeBtnActive(eid_horaControlPanel, eid_btn_pararHora);

    if(!horaHolyInterval){
        return;
    }

    clearInterval(horaHolyInterval);
    horaHolyInterval = null;

    eid_horaHoly.classList.remove('shown');

    eid_estadoHoraHoly.textContent = 'PARADO';
    eid_horaActualHoly.textContent = '--:--:--';//reset
    eid_horaRestanteHoly.textContent = '--:--';//reset

    objHora.running = false;
    console.log('objHora: ', objHora);

    enviarHoraPantallas();
}

function mostrarHora(){
    console.log('=== function mostrarHora() ===');

    if(!horaHolyInterval){
        console.log('horaHolyInterval es null. llamo iniciarRenderHoraHoly()');
        iniciarRenderHoraHoly();
    }

    mostrar_hora_actual_show();
    eid_estadoHoraHoly.textContent = 'MOSTRADO';
    
    objHora.visible = true;
    console.log('objHora: ', objHora);

    enviarHoraPantallas();
}

function ocultarHora(){
    console.log('=== function ocultarHora() ===');
    
    // if(!horaHolyInterval){
    //     eid_horaActualHoly.textContent = '--:--:--';
    //     eid_horaRestanteHoly.textContent = '--:--';
    // }

    ocultar_hora_actual_show();
    eid_estadoHoraHoly.textContent = 'OCULTADO';

    objHora.visible = false;
    console.log('objHora: ', objHora);

    enviarHoraPantallas();
}

function formatearHora(ms, redondearArriba = true){

    const totalSegundos = redondearArriba
        ? Math.max(0, Math.ceil(ms / 1000))
        : Math.max(0, Math.floor(ms / 1000));

    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    if(horas > 0){
        return [
            String(horas).padStart(2,'0'),
            String(minutos).padStart(2,'0'),
            String(segundos).padStart(2,'0')
        ].join(':');
    }

    if(minutos > 0){
        return [
            String(minutos),
            String(segundos).padStart(2,'0')
        ].join(':');
    }

    return String(segundos);
}

function pintarHoraHoly(){
    console.log('=== function pintarHoraHoly() ===');

    if(!horaHolyInterval){
        eid_horaActualHoly.textContent = '--:--:--';//reset
        eid_horaRestanteHoly.textContent = '--:--';//reset
        return;
    }

    const horaInicio = parseInt(eid_horaInicio.value, 10);
    const minutosInicio = parseInt(eid_minutosInicio.value, 10);

    if( isNaN(horaInicio) || isNaN(minutosInicio) ){
        eid_horaHoly.classList.remove('shown');
        return;
    }

    const ahora = new Date();
    const inicio = new Date();

    inicio.setHours(
        horaInicio,
        minutosInicio,
        0,
        0
    );

    const diferenciaMs = inicio.getTime() - ahora.getTime();

    eid_horaHoly.classList.add('shown');
    
    eid_estadoHoraHoly.textContent = 'EN MARCHA';
    eid_horaActualHoly.textContent = ahora.toLocaleTimeString(
        'es-ES',
        { hour12: false }
    );

    if(diferenciaMs > 0){
        eid_horaRestanteHoly.textContent = 'До початку залишилось: ' + formatearHora(diferenciaMs, true);
    }else{
        const transcurridoMs = Math.abs(diferenciaMs); 
        //console.log('transcurridoMs: ', transcurridoMs);
        
        const transcurridoMs_formateado = formatearHora(transcurridoMs, false); 
        //console.log('transcurridoMs_formateado:', transcurridoMs_formateado);
        
        if(transcurridoMs_formateado == 0){
            eid_horaRestanteHoly.textContent = 'Початок богослужіння';
        }else{
            eid_horaRestanteHoly.textContent = 'Від початку минуло: ' + transcurridoMs_formateado;    
        }   
    }
}

function enviarHoraPantallas(){
    console.log('=== function enviarHoraPantallas() ===');
    
    // Actualizar en Holy Songs, pintando inmediatamente
    pintarHoraHoly();

    // Actualizar pantalla.php
    actualizarPantallas({
        actualizarSlide:false,
        actualizarVista:false
    });
}
//======================================================//
//end - hora actual y tiempo restante hasta el inicio
//======================================================//