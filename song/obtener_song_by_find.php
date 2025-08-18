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
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $words_input = isset($_GET['words_input']) ? $_GET['words_input'] : null ;
        $modo = isset($_GET['modo']) ? $_GET['modo'] : 1 ;

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

// Buscar "Jesús Pedro" en varios campos
$where = buildWhere($modo, $words_input, ["s.title", "s.song_text", "s.notes"], $params, $types);


//test modos de where
$sql_init = "SELECT 
                s.id_song, 
                s.song_number, 
                s.title, 
                s.category,
                ct.name AS category_name,
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





//======================================================================//
//FUNCTIONS - start
//======================================================================//
function buildWhere($modo, $texto, $campos = ["contenido"], &$params = [], &$types = "") {
    $where = "";
    $texto = trim($texto);

    // Arma condiciones OR para los distintos campos
    $makeConditions = function($expr) use ($campos) {
        $conds = [];
        foreach ($campos as $campo) {
            $conds[] = "$campo $expr";
        }
        return "(" . implode(" OR ", $conds) . ")";
    };

    switch ($modo) {

        // 1) Todas las palabras (pueden ser parte de otras palabras, sin importar orden)
        case 1:
            $palabras = preg_split('/\s+/', $texto);
            $ands = [];
            foreach ($palabras as $palabra) {
                $ors = [];
                foreach ($campos as $campo) {
                    $ors[] = "$campo LIKE ?";
                    $params[] = "%" . $palabra . "%";
                    $types .= "s";
                }
                $ands[] = "(" . implode(" OR ", $ors) . ")";
            }
            $where = implode(" AND ", $ands);
            break;


        // 2) Todas las palabras (sin importar orden)
        case 2:
        $palabras = preg_split('/\s+/', $texto);
        $ands = [];
        foreach ($palabras as $palabra) {
            $ors = [];
            foreach ($campos as $campo) {
                $ors[] = "$campo REGEXP ?";
                $params[] = "[[:<:]]" . $palabra . "[[:>:]]";
                $types .= "s";
            }
            $ands[] = "(" . implode(" OR ", $ors) . ")";
        }
        $where = implode(" AND ", $ands);
        break;
        

        // 3) Coincidir al menos una palabra (OR global)
        case 3:
            $palabras = preg_split('/\s+/', $texto, -1, PREG_SPLIT_NO_EMPTY);
            $orsGlobal = [];

            foreach ($palabras as $palabra) {
                $orsCampos = [];
                foreach ($campos as $campo) {
                    $orsCampos[] = "$campo REGEXP ?";
                    $params[] = "[[:<:]]" . $palabra . "[[:>:]]";
                    $types .= "s";
                }
                // Cada palabra puede aparecer en cualquiera de los campos
                $orsGlobal[] = "(" . implode(" OR ", $orsCampos) . ")";
            }

            // Con OR global: basta con que una de las palabras esté
            $where = "(" . implode(" OR ", $orsGlobal) . ")";
            break;            


        // 4) Palabras en el orden establecido
        case 4:
            $palabras = preg_split('/\s+/', $texto, -1, PREG_SPLIT_NO_EMPTY);

            // Un solo patrón que respete el orden
            $pattern = implode('.+', array_map('preg_quote', $palabras));

            $ors = [];
            foreach ($campos as $campo) {
                $ors[] = "$campo REGEXP ?";
                $params[] = $pattern;
                $types .= "s";
            }
            $where = "(" . implode(" OR ", $ors) . ")";
            break; 
            
            
        // 5) Frase exacta
        case 5:
            $ors = [];
            foreach ($campos as $campo) {
                $ors[] = "$campo LIKE ?";
                $params[] = "%" . $texto . "%";
                $types .= "s";
            }
            $where = "(" . implode(" OR ", $ors) . ")";
            break;


        // 6) Palabras exactas (no pueden ser parte de otras palabras, sin importar orden)
        case 6:
            $palabras = preg_split('/\s+/', $texto, -1, PREG_SPLIT_NO_EMPTY);
            $ands = [];
            foreach ($palabras as $palabra) {
                $ors = [];
                foreach ($campos as $campo) {
                    $ors[] = "$campo REGEXP ?";
                    $params[] = "[[:<:]]" . $palabra . "[[:>:]]";
                    $types .= "s";
                }
                $ands[] = "(" . implode(" OR ", $ors) . ")";
            }
            $where = implode(" AND ", $ands);
            break;

    }

    return $where;
}
//======================================================================//
//FUNCTIONS - end
//======================================================================//

?>
