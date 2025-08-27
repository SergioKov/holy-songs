<?php
session_start();//importante para ver al usuario logueado

//header("Access-Control-Allow-Origin: *");//? no sé si hace falta...

include('functions.php');
include('includes/config.php');

/*
//HACER PRUEBAS...
echo json_encode([
    'HACIENDO_PRUEBAS' => 'DESCOMENTAR EN PROD',
    'success' => false,
    'valorCampo' => 'no_tiene_datos',
    'error' => 'No hay todos los parametros necesarios.',
    'dic_code' => 'd251'
]);
exit;
*/





//si los datos SÍ VIENEN desde el metodo permitido
//es lo mismo que => if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET'){
if (in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
    
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        // Obtener datos del cuerpo de la solicitud (en formato JSON)
        $inputJSON = file_get_contents('php://input');
        $datos = json_decode($inputJSON, true);
        //debug($inputJSON, 'inputJSON');
        //echo json_encode(['$datos' => $datos]);
        // Verificar que se decodificó correctamente

        if ($datos === null) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'valorData' => 'no_tiene_datos',
                'error' => 'No hay todos los parametros necesarios.',
                'dic_code' => 'd251'
            ]);
            exit;
        }

        $words_input = $datos['words_input'];
        $modo = $datos['modo'];
        $buscar_en = $datos['buscar_en'];
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $words_input = isset($_GET['words_input']) ? $_GET['words_input'] : null ;
        $modo = isset($_GET['modo']) ? $_GET['modo'] : 1 ;
        $buscar_en = isset($_GET['buscar_en']) ? $_GET['buscar_en'] : 1 ;

        if ($words_input === null) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'valorData' => 'no_tiene_datos',
                'error' => 'No hay todos los parametros necesarios.',
                'dic_code' => 'd251'
            ]);
            exit;
        }        
    }
}



include('includes/connect_db.php');

$words_input = $conn->real_escape_string($words_input);//aki importante
$modo = $conn->real_escape_string($modo);
$buscar_en = $conn->real_escape_string($buscar_en);
//echo_json_x($datos, 'datos');
//echo_json_x($words_input);
//echo_json_x($modo);


//busco si hay registro
// Preparar y ejecutar la consulta
//antes. no optimizado
// $sql_init = "SELECT 
//                 id_song, 
//                 song_number, 
//                 title, 
//                 category, 
//                 (SELECT `name` FROM category_translations ct WHERE ct.lang = s.lang AND ct.id_category = s.category LIMIT 1) as category_name,
//                 song_text, 
//                 arr_esquema, 
//                 tune, 
//                 lang, 
//                 notes, 
//                 count, 
//                 created_at, 
//                 updated_at  
//             FROM songs s
//             WHERE song_text like '%$words_input%'
// ";

// $sql_init = "SELECT 
//                 s.id_song, 
//                 s.song_number, 
//                 s.title, 
//                 s.category,
//                 ct.name AS category_name,
//                 s.song_text, 
//                 s.arr_esquema, 
//                 s.tune, 
//                 s.lang,
//                 s.notes, 
//                 s.count, 
//                 s.created_at, 
//                 s.updated_at
//             FROM songs s
//             LEFT JOIN category_translations ct 
//                 ON ct.id_category = s.category AND ct.lang = s.lang
//             WHERE MATCH(s.title, s.song_text, s.notes) AGAINST('$words_input' IN NATURAL LANGUAGE MODE)
//             ORDER BY s.title, s.song_number, s.id_song
// ";
// $result = $conn->query($sql_init); 



$params = [];
$types  = "";
$arr_campos = [];

switch ($buscar_en) {
    case '1'://Todos los campos por defecto disponibles (rápido)
    default:
        $arr_campos = ['s.id_song', 's.song_number', 's.title', 's.song_text', 's.notes'];
        break;

    case '2'://Todos los campos disponibles (lento)
        $arr_campos = ['s.id_song', 's.song_number', 's.title', 'ct.name', 'ct.lang_name', 's.song_text', 's.notes'];
        break;
    
    case '3'://Todos los campos de texto disponibles
        $arr_campos = ['s.title', 'ct.name', 's.song_text', 's.notes'];
        break;

    case '4'://Sólo el título de canción
        $arr_campos = ['s.title'];
        break;

    case '5'://Sólo el texto de canción
        $arr_campos = ['s.song_text'];
        break;

    case '6':// Sólo las notas de canción
        $arr_campos = ['s.notes'];
        break;

    case '7'://Identificador y número de canción
        $arr_campos = ['s.id_song', 's.song_number'];
        break;

    case '8'://Sólo el identificador de canción
        $arr_campos = ['s.id_song'];
        break;

    case '9'://Sólo el número de canción
        $arr_campos = ['s.song_number'];
        break;

    case '10'://Sólo el identificador de categoría
        $arr_campos = ['s.category'];
        break;

    case '11'://Sólo el nombre de categoría
        $arr_campos = ['ct.name'];
        break;

    case '12'://Sólo el idioma de canción
        $arr_campos = ['ct.lang_name'];
        break;
}

// Buscar "Jesús Pedro" en varios campos
$where = buildWhere($modo, $words_input, $arr_campos, $params, $types);


//test modos de where
$sql_init = "SELECT 
                s.id_song, 
                s.song_number, 
                s.title, 
                s.category,
                ct.name AS category_name,
                ct.lang_name AS lang_name,
                s.songbook,
                sb.title AS songbook_title,
                s.song_text, 
                s.arr_esquema, 
                s.tune, 
                s.lang,
                s.notes, 
                s.count, 
                s.created_at, 
                s.updated_at
            FROM songs s
            LEFT JOIN category_translations ct 
                ON ct.id_category = s.category AND ct.lang = s.lang
            LEFT JOIN songbooks sb 
                ON sb.id_songbook = s.songbook
            WHERE $where
            ORDER BY s.title, s.song_number, s.id_song
";

// Si quieres ver la consulta “final” (sólo para debug, no ejecutar así en producción):
// reconstruir consulta final para debug
$finalSQL = $sql_init;
foreach ($params as $p) {
    $safe = "'" . $p . "'";
    $pos = strpos($finalSQL, "?");
    if ($pos !== false) {
        $finalSQL = substr_replace($finalSQL, $safe, $pos, 1);
    }
}
//debug_x($finalSQL, 'finalSQL');//para ver la consulta preparada para debuguear

$stmt = $conn->prepare($sql_init);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();


//-- AND id_song = '$id_song'
//$sql_prep = "SELECT $campo 
//            FROM $tabla 
//            WHERE id_user = '$id_user_logged' 
//";
//$arr_params = [$campo, $tabla, $id_user_logged];
//$sql_preparada = prepararQuery($conn, $sql_prep, $arr_params);
//$result = $conn->query($sql_init);
//echo_json_x($sql_init, 'sql');
//debug_x($sql_init, 'sql');



//hacer test en HOSTALIA
/*
if (!$result) {
    die("Error en la consulta: " . $conn->error);
}else{
	echo "Filas encontradas: " . $result->num_rows;
	die("<p>ok en la consulta</p>");
}
*/



if($result->num_rows > 0){   
    
    $result_data = [
        'success' => true,//AUNQUE NO TIENE DATOS , PONGO TRUE PARA QUE ENTRE EN EL BLOQUE
        'valorData' => 'hay_datos',
        'totalRows' => $result->num_rows,
        'arr_data' => []
    ];

    while ($row = $result->fetch_assoc()) {

        $id_song_bd = $row['id_song'];
        $title_bd = $row['title'];
        $song_text_bd = $row['song_text'];
        $data = [
            'success' => true,
            'id_song' => $row['id_song'],
            'song_number' => $row['song_number'],
            'title' => $row['title'],
            'category' => $row['category'],
            'category_name' => $row['category_name'],
            'songbook' => $row['songbook'],
            'songbook_title' => $row['songbook_title'],
            'lang_name' => $row['lang_name'],
            'song_text' => $row['song_text'],
            'arr_esquema' => $row['arr_esquema'],
            'tune' => $row['tune'],
            'lang' => $row['lang'],
            'notes' => $row['notes'],
            'count' => $row['count'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
            'valorData' => 'hay_datos'
        ];

        $result_data['arr_data'][] = $data;
    }
    
}else{
    
    $result_data = [
        'success' => false,//AUNQUE NO TIENE DATOS , PONGO TRUE PARA QUE ENTRE EN EL BLOQUE
        'valorData' => 'no_tiene_datos'
    ];

}

//Cierro conexion con bd
$conn->close();

// Enviar respuesta al cliente en formato JSON
header('Content-Type: application/json');
echo json_encode($result_data);


?>
