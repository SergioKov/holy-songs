<?php
include('includes/config.php');
session_start();//importante para ver al usuario logueado
include('functions.php');





//si los datos NO VIENEN desde el metodo permitido
if (!in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
	// Manejar solicitudes incorrectas
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Solicitud incorrecta.',
        'dic_code' => 'd250'
    ]);
    exit;
}

//si los datos SÍ VIENEN desde desde el metodo permitido
//es lo mismo que => if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET'){
if (in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
    
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $jsonString = file_get_contents('php://input');//saco datos del cuerpo de la solicitud. 
        //debug($jsonString, 'jsonString');
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        $jsonString = $_GET['datos'];//saco datos del url.
        //debug($jsonString, 'jsonString');
    } 
    

    // limpiar caracteres de control ilegales
    //$jsonString = cleanControlChars($jsonString);
    $jsonString = escapeControlChars($jsonString);
	//echo_json_x($jsonString, 'jsonString');

    // escapar saltos de línea
    $jsonString = escapeNewlines($jsonString);
	//echo_json_x($jsonString, 'jsonString');

    
    


    if (isValidJson($jsonString)) {
        //echo "JSON válido";

        // decodificar
        $datos = json_decode($jsonString, true); // Decodificación a array asociativo
        //echo_json_x($datos, 'datos');

        // Validar estructura y contenido del JSON
        if (isset($datos['song_text']) ) {
            //echo "JSON es válido y contiene las claves esperadas.";
            //sigo adelante...
        } else {
            //echo "JSON no contiene las claves esperadas.";
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Error al procesar el JSON. El objeto no contiene las claves esperadas.',
                'dic_code' => 'd301'
            ]);
            exit;
        }

    } else {
        //echo "JSON inválido";
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Error al decodificar JSON. jsonErrorMessage: ' . jsonErrorMessage($jsonString),
            'json_last_error_msg' => json_last_error_msg(),
            'dic_code' => 'd302'
        ]);
        exit;
    }


    //$datos = json_decode($jsonString, true);
    //debug($datos, 'datos');
	//echo_json($datos, 'datos');
	//echo_json_x($datos, 'datos');



    // // Validar si la decodificación fue exitosa
    // if (json_last_error() === JSON_ERROR_NONE) {
    //     // Validar estructura y contenido del JSON
    //     if (isset($datos['song_text']) ) {
    //         //echo "JSON es válido y contiene las claves esperadas.";
    //         //sigo adelante...
    //     } else {
    //         //echo "JSON no contiene las claves esperadas.";
    //         http_response_code(400);
    //         echo json_encode([
    //             'success' => false,
    //             'error' => 'Error al procesar el JSON. El objeto no contiene las claves esperadas.',
    //             'dic_code' => 'd301'
    //         ]);
    //         exit;
    //     }
    // } else {
    //     //echo "Error al decodificar JSON: " . json_last_error_msg();
    //     //writeLog("Error al decodificar JSON. Error: [" . json_last_error_msg() . "]", 'ERROR');

    //     http_response_code(400);
    //     echo json_encode([
    //         'success' => false,
    //         'error' => 'Error al decodificar JSON.',
    //         'json_last_error_msg' => json_last_error_msg(),
    //         'dic_code' => 'd302'
    //     ]);
    //     exit;
    // }

    // Verificar que se decodificó correctamente
    if ($datos === null) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Error al procesar el JSON.',
            'dic_code' => 'd235'
        ]);
        exit;
    }
    

    //exit('<br>hasta aki');


    // Recuperar los valores
    if(true /*isset($_SESSION['username']) && isset($_SESSION['id_user']) */) {
        //$id_user_logged = $_SESSION['id_user'];
        //$username_logged = $_SESSION['username'];
        $id_user_logged = 1;
        $username_logged = 'demo_user';
        //echo json_encode(['mensaje' => 'sesion username_logged: ' . $username_logged ]);        
    } else {
        $id_user_logged = 5;
        $username_logged = 'user_test_no_borrar';
        //echo json_encode(['mensaje' => $username_logged]);
        
        //writeLog("No existe sessión. Para insertar datos hay que loguearse antes. Solicitud incorrecta.");
        
        // Manejar solicitudes incorrectas
        //http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'No existe sessión. Para insertar datos hay que loguearse antes. Solicitud incorrecta.',
            'dic_code' => 'd245'
        ]);
        die();
    }
	//echo_json_x($id_user_logged, 'id_user_logged');

    include('includes/connect_db.php');

    
    $id_song = $conn->real_escape_string($datos['id_song']);//get parameter
    $song_number = $conn->real_escape_string($datos['song_number']);//get parameter
    $title = $conn->real_escape_string($datos['title']);//get parameter
    $title2 = $conn->real_escape_string($datos['title2']);//get parameter
    $title_note = $conn->real_escape_string($datos['title_note']);//get parameter
    $category  = $conn->real_escape_string($datos['category']);//get parameter
    $songbook  = $conn->real_escape_string($datos['songbook']);//get parameter
    $song_text  = $conn->real_escape_string($datos['song_text']);//get parameter

    //variables de busqueda
    $title_search = normalizeSearchText($title ?? '');
    
    if($title2){
        $title_search .= ' __|__ ' . normalizeSearchText($title2 ?? '');
    }
    if($title_note){
        $title_search .= ' __|__ ' . normalizeSearchText($title_note ?? '');
    }

    $song_text_search  = normalizeSearchText($song_text);//quito puntuación, acentos, etc para mejorar búsquedas
    

    /*
    //por ahora sin intl
    $title_search = normalizeSearchTextNoIntl($title ?? '');

    if($title2){
        $title_search .= ' __|__ ' . normalizeSearchTextNoIntl($title2 ?? '');
    }
    if($title_note){
        $title_search .= ' __|__ ' . normalizeSearchTextNoIntl($title_note ?? '');
    }

    $song_text_search  = normalizeSearchTextNoIntl($song_text);//quito puntuación, acentos, etc para mejorar búsquedas
    */

    
    //$arr_esquema = $datos['arr_esquema'];
    $arr_esquema_array = $datos['arr_esquema'];
    //echo_json_x($arr_esquema_array, 'arr_esquema_array');

    $arr_esquema_string = json_encode($datos['arr_esquema'], JSON_UNESCAPED_UNICODE);//arrTabs //no usar $conn->real_escape_string($datos['arr']) ya que retorna NULL

    $tune  = $conn->real_escape_string($datos['tune']);//get parameter
    $tune_transpose  = $conn->real_escape_string($datos['tune_transpose']);//get parameter
    $tipo_acorde  = $conn->real_escape_string($datos['tipo_acorde']);//get parameter
    $tipo_fuente  = $conn->real_escape_string($datos['tipo_fuente']);//get parameter
    $url_youtube  = $conn->real_escape_string($datos['url_youtube']);//get parameter
    $url_recurso  = $conn->real_escape_string($datos['url_recurso']);//get parameter
    $tempo_bpm  = $conn->real_escape_string($datos['tempo_bpm']);//get parameter
    $lang  = $conn->real_escape_string($datos['lang']);//get parameter
    $notes  = $conn->real_escape_string($datos['notes']);//get parameter

    //ajustes de song
    $font_size  = $conn->real_escape_string($datos['font_size']);//get parameter
    $num_columns  = $conn->real_escape_string($datos['num_columns']);//get parameter
    $acordes_visible  = $conn->real_escape_string($datos['acordes_visible']);//get parameter
    $texto_visible  = $conn->real_escape_string($datos['texto_visible']);//get parameter
    $contenido_width  = $conn->real_escape_string($datos['contenido_width']);//get parameter

    //debug($tabla);
    //debug($campo);
    //debug($arr, 'arr');
    //echo_json_x($arr_esquema, 'arr_esquema');
    //echo_json_x($arr_esquema_array, 'arr_esquema_array');

    //exit('<br>hasta aki-2');

    // Obtener la fecha y hora actual
    $fechaHoraActual = date("Y-m-d H:i:s");
    

    //busco si hay registro en la tabla a donde insertar array
    // $sql_init = "SELECT * 
    //             FROM songs 
    //             WHERE id_songs = '$id_song' 
    // ";
    $sql_prep = "SELECT * 
                FROM songs 
                WHERE id_song = ? 
    ";
    $arr_params = [$id_song];
    $sql_preparada = prepararQuery($conn, $sql_prep, $arr_params);
	$result = $conn->query($sql_preparada);
    //debug_x($sql_preparada, 'sql_preparada');

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_song = $row["id_song"];//1
        $hay_id_song_en_tabla = true;
    }else{
        $hay_id_song_en_tabla = false;
    }




    //song ajustes
    $sql_prep_aj = "SELECT * 
                FROM songs_ajustes 
                WHERE id_song = ? 
    ";
    $arr_params_aj = [$id_song];
    $sql_preparada_aj = prepararQuery($conn, $sql_prep_aj, $arr_params_aj);
	$result_aj = $conn->query($sql_preparada_aj);
    //debug_x($sql_preparada, 'sql_preparada');

    if($result_aj->num_rows > 0){
        $row_aj = $result_aj->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_song_sj = $row_aj["id_song"];//1
        $hay_id_song_en_ajustes = true;
    }else{
        $hay_id_song_en_ajustes = false;
    }






	//echo_json_x($hay_id_song_en_tabla, 'hay_id_song_en_tabla');

    $sign = '__[(&)]__';//IMPORTANTE! para que ho haya errores con $arr en json
    
    // Realizar la inserción o (update) en la base de datos 
    if($hay_id_song_en_tabla){
        //hago update
        if (is_array($arr_esquema_array) && !empty($arr_esquema_array) ) {// Es un array y tiene elementos
            $action_tipo = 'is_update_arr_esquema_ok';
            //arr_esquema = '$arr_esquema_string', es obligatorio en la consulta
            $sql2_up_init = "UPDATE songs SET
                    song_number = '$song_number',
                    title = '$title',
                    title2 = '$title2',
                    title_note = '$title_note',
                    title_search = '$title_search',
                    category = '$category',
                    songbook = '$songbook',
                    song_text = '$song_text',
                    song_text_search = '$song_text_search',
                    arr_esquema = '$arr_esquema_string',
                    tune = '$tune',
                    tune_transpose = '$tune_transpose',
                    tipo_acorde = '$tipo_acorde',
                    tipo_fuente = '$tipo_fuente',
                    url_youtube = '$url_youtube',
                    url_recurso = '$url_recurso',
                    tempo_bpm = '$tempo_bpm',
                    lang = '$lang',
                    notes = '$notes',
                    updated_at = '$fechaHoraActual'
                WHERE id_song = '$id_song'
            ";
            //echo_json_x($sql2_up_init, 'sql2_up_init');
        }else{//no es array o está vacío. no incluyo arr_esquema en la SQL
            $action_tipo = 'is_update_arr_esquema_vacio';
            $sql2_up_init = "UPDATE songs SET
                    song_number = '$song_number',
                    title = '$title',
                    title2 = '$title2',
                    title_note = '$title_note',
                    title_search = '$title_search',
                    category = '$category',
                    songbook = '$songbook',
                    song_text = '$song_text',
                    song_text_search = '$song_text_search',
                    arr_esquema = '',
                    tune = '$tune',
                    tune_transpose = '$tune_transpose',
                    tipo_acorde = '$tipo_acorde',
                    tipo_fuente = '$tipo_fuente',
                    url_youtube = '$url_youtube',
                    url_recurso = '$url_recurso',
                    tempo_bpm = '$tempo_bpm',
                    lang = '$lang',
                    notes = '$notes',
                    updated_at = '$fechaHoraActual'
                WHERE id_song = '$id_song'
            ";
        }
        $result2 = $conn->query($sql2_up_init);
        //debug_x($sql2_up_preparada, 'sql2_up_preparada');
        //echo_json_x($sql2_up_preparada, 'sql2_up_preparada');
        

    }else{
        
        //hago insert
        if (is_array($arr_esquema_array) && !empty($arr_esquema_array)) {// Es un array y tiene elementos
            $action_tipo = 'is_insert_arr_esquema_ok';
            $sql2_in_init = "INSERT INTO songs 
                    (
                        song_number,
                        title,
                        title2,
                        title_note,
                        title_search,
                        category,
                        songbook,
                        song_text,
                        song_text_search,
                        arr_esquema,
                        tune,
                        tune_transpose,
                        tipo_acorde,
                        tipo_fuente,
                        url_youtube,
                        url_recurso,
                        tempo_bpm,
                        lang,
                        notes,
                        created_at
                    ) 
                VALUES 
                    (
                        '$song_number', 
                        '$title', 
                        '$title2', 
                        '$title_note', 
                        '$title_search', 
                        '$category', 
                        '$songbook', 
                        '$song_text', 
                        '$song_text_search', 
                        '$arr_esquema_string', 
                        '$tune', 
                        '$tune_transpose', 
                        '$tipo_acorde', 
                        '$tipo_fuente', 
                        '$url_youtube', 
                        '$url_recurso', 
                        '$tempo_bpm', 
                        '$lang', 
                        '$notes', 
                        '$fechaHoraActual'
                    )
            ";
        }else{//no es array o está vacío. no incluyo arr_esquema en la SQL
            $action_tipo = 'is_insert_arr_esquema_vacio';
            $sql2_in_init = "INSERT INTO songs 
                    (
                        song_number,
                        title,
                        title2,
                        title_note,
                        title_search,
                        category,
                        songbook,
                        song_text,
                        song_text_search,
                        tune,
                        tune_transpose,
                        tipo_acorde,
                        tipo_fuente,
                        url_youtube,
                        url_recurso,
                        tempo_bpm,
                        lang,
                        notes,
                        created_at
                    ) 
                VALUES 
                    (
                        '$song_number',
                        '$title',
                        '$title2',
                        '$title_note',
                        '$title_search',
                        '$category',
                        '$songbook',
                        '$song_text',
                        '$song_text_search',
                        '$tune',
                        '$tune_transpose',
                        '$tipo_acorde',
                        '$tipo_fuente',
                        '$url_youtube',
                        '$url_recurso',
                        '$tempo_bpm',
                        '$lang',
                        '$notes',
                        '$fechaHoraActual'
                    )
            ";
        }

        $result2 = $conn->query($sql2_in_init);
        //debug_x($sql2_in_preparada, 'sql2_in_preparada');

        
    }
	//echo_json_x($result2, 'result2');


    if($hay_id_song_en_ajustes){
        $sql2_up_init_ajustes = "UPDATE songs_ajustes SET
                                    font_size = '$font_size',
                                    num_columns = '$num_columns',
                                    acordes_visible = '$acordes_visible',
                                    texto_visible = '$texto_visible',
                                    contenido_width = '$contenido_width',
                                    updated_at = '$fechaHoraActual'
                                WHERE id_song = '$id_song'
                            ";
        $result2_ajustes = $conn->query($sql2_up_init_ajustes);
    }else{
        $sql2_in_init_ajustes = "INSERT INTO songs_ajustes 
                                    (
                                        id_user,
                                        id_song,
                                        font_size,
                                        num_columns,
                                        acordes_visible,
                                        texto_visible,
                                        contenido_width,
                                        created_at
                                    ) 
                                VALUES 
                                    (
                                        '$id_user_logged',
                                        '$id_song',
                                        '$font_size',
                                        '$num_columns',
                                        '$acordes_visible',
                                        '$texto_visible',
                                        '$contenido_width',
                                        '$fechaHoraActual'
                                    )
                            ";
        $result2_ajustes = $conn->query($sql2_in_init_ajustes);
    }


    //Update o insert datos en la tabla $tabla
    if($result2 === TRUE && $result2_ajustes === TRUE){
        if($hay_id_song_en_tabla){
            $respuesta = [
                'success' => true,
                'id_song' => $id_song,
                'action' => 'is_update',
                'action_tipo' => $action_tipo,
                'mensaje' => 'Datos actualizados correctamente.'
            ];
        }else{
            //consulta para saber id_song de la cancion añadida
            $sql_id_song = "SELECT id_song 
                            FROM songs
                            ORDER BY id_song DESC
                            LIMIT 1 
            ";
            $result_id_song = $conn->query($sql_id_song);

            if($result_id_song->num_rows > 0){
                $row_id_song = $result_id_song->fetch_assoc();
                //echo_json_x($row_id_song,'row_id_song');		
                $id_song_bd = $row_id_song["id_song"];//1    
            }else{
                $id_song_bd = null;
            }

            $respuesta = [
                'success' => true,
                'id_song' => $id_song_bd,
                'action' => 'is_insert',
                'action_tipo' => $action_tipo,
                'mensaje' => 'Datos insertados correctamente.'
            ];
        }

    }else{

        if($hay_id_song_en_tabla){
            //writeLog("Error al actualizar datos. Error: [" . $conn->error . "]");

            $respuesta = [
                'success' => false,
                'error' => 'Error al actualizar datos: ',
                'conn_error' => $conn->error
            ];
        }else{
            //writeLog("Error al insertar datos. Error: [" . $conn->error . "]");

            $respuesta = [
                'success' => false,
                'mensaje' => 'Error al insertar datos: ',
                'conn_error' => $conn->error
            ];
        }

    }

    //Cierro conexion con bd
    $conn->close();	

    // Enviar respuesta al cliente en formato JSON
    header('Content-Type: application/json');
    echo json_encode($respuesta);
	
}

?>
