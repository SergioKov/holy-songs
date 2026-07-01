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

    //clearTimeout(timerHolyTimeout);

    enviarTimerPantallas();
}

function reiniciarTimer(){
    console.log('=== function reiniciarTimer() ===');

    objTimer.remainingMs = null;
    objTimer.endTime = Date.now() + objTimer.durationMs;
    objTimer.running = true;
    objTimer.visible = true;
    objTimer.status = 'REINICIADO';

    enviarTimerPantallas();
}

function pausarTimer(){
    console.log('=== function pausarTimer() ===');

    if(!objTimer.running){
        return;
    }

    objTimer.remainingMs = objTimer.endTime - Date.now();
    objTimer.endTime = null;
    objTimer.running = false;
    objTimer.status = 'PAUSADO';

    //clearTimeout(timerHolyTimeout);

    enviarTimerPantallas();
}

function continuarTimer(){
    console.log('=== function continuarTimer() ===');

    if(objTimer.running){
        return;
    }

    objTimer.endTime = Date.now() + objTimer.remainingMs;
    objTimer.remainingMs = null;
    objTimer.running = true;
    objTimer.status = 'CONTINUANDO';

    enviarTimerPantallas();
    //programarSiguienteTick();
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

    objTimer.endTime += minutos * 60000;
    objTimer.status = `SUMADO +${minutos} MINUTO`;

    enviarTimerPantallas();
}

function restarMinutosTimer(minutos){
    console.log('=== function restarMinutosTimer() ===');

    objTimer.endTime -= minutos * 60000;
    objTimer.status = `RESTADO -${minutos} MINUTO`;

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


//========================================//
//end - temporizador para predicadores
//========================================//

        






function calcularEstadoTimer(){
    console.log('=== function calcularEstadoTimer() ===');

    let restante;

    if(objTimer.running){
        restante = objTimer.endTime - Date.now();
    }else{
        restante = objTimer.remainingMs;
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
        status: objTimer.status
    };
}