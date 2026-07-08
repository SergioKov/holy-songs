//========================================//
//start - temporizador para predicadores
//========================================//
function iniciarTimer(){
    console.log('=== function iniciarTimer() ===');

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
    //programarSiguienteTick();
}

function pararTimer(){
    console.log('=== function pararTimer() ===');

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

function ocultarTimer(){
    console.log('=== function ocultarTimer() ===');

    objTimer.visible = false;
    objTimer.status = 'OCULTADO';

    enviarTimerPantallas();
}

function mostrarTimer(){
    console.log('=== function mostrarTimer() ===');

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

function sumarMinutosTimer(minutos){
    console.log('=== function sumarMinutosTimer() ===');

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

//========================================//
//end - temporizador para predicadores
//========================================//

        






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