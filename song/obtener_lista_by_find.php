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
//Preparar y ejecutar la consulta
$params = [];
$types  = "";

// Buscar "Jesús Pedro" en varios campos
$where = buildWhere($modo, $words_input, ["id_lista", "title", "notes"], $params, $types);


//test modos de where
$sql_init = "SELECT 
                id_lista, 
                title,
                notes,
                arr_lista,
                fecha,
                created_at,
                updated_at 
            FROM listas
            WHERE $where
            ORDER BY id_lista DESC, title ASC
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

        $id_lista_bd = $row['id_lista'];
        $title_bd = $row['title'];
        $data = [
            'success' => true,
            'id_lista' => $row['id_lista'],
            'title' => $row['title'],
            'notes' => $row['notes'],
            'arr_lista' => $row['arr_lista'],
            'fecha' => $row['fecha'],
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
