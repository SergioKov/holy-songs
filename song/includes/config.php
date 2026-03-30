<?php
/*
if($_SERVER['HTTP_HOST'] == 'tu_web_en_prod_aki'){//HOSTALIA
    $arr_metodos = ['POST'];//en PROD siempre!   
}else{//LOCALHOST
    $arr_metodos = ['POST', 'GET'];//para hacer test...  
}
*/

$arr_metodos = ['POST', 'GET'];//descomentar para hacer test y comentar en PROD... 


//para que funcione CORS en Safari
$allowed_origins = [
    'http://holy-songs.local',
    'https://holy-songs.local',
    'http://holy-songs.com',
    'https://holy-songs.com'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

// Preflight (Safari)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

?>