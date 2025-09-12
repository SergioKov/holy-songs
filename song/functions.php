<?php
//=====================================================================================//
// FUNCTIONS - START
//=====================================================================================//

function debug($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    var_dump($variable);
    echo"</pre>";
}


function debug_x($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    var_dump($variable);
    echo"</pre>";
    exit;
}

function debug_r($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    print_r($variable);
    echo"</pre>";
}

function debug_r_x($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    print_r($variable);
    echo"</pre>";
    exit;
}

function echo_json($variable, $name_var = null){
    if($name_var != null){
        echo json_encode([
            $name_var => $variable
        ], JSON_UNESCAPED_UNICODE);    
    }else{
        echo json_encode([
            'variable' => $variable
        ], JSON_UNESCAPED_UNICODE);
    }    
    exit;
}

function echo_json_x($variable, $name_var = null){//con exit;
    if($name_var != null){
        echo json_encode([
            $name_var => $variable,
            'funcion' => 'echo_json_x()',
            'hago_exit' => true
        ], JSON_UNESCAPED_UNICODE);    
    }else{
        echo json_encode([
            'variable' => $variable,
            'funcion' => 'echo_json_x()',
            'hago_exit' => true
        ], JSON_UNESCAPED_UNICODE);
    }    
    exit;
}

function isValidJson(string $jsonString): bool {
    // Decodificar sin convertir a array
    json_decode($jsonString);
    return (json_last_error() === JSON_ERROR_NONE);
}

function cleanControlChars(string $jsonString): string {
    // elimina todos los caracteres de control excepto \n, \r y \t
    return preg_replace('/[^\P{C}\n\r\t]+/u', '', $jsonString);
}

function escapeControlChars(string $jsonString): string {
    // Escapa todos los caracteres de control de ASCII (0-31) excepto \n, \r, \t
    return preg_replace_callback('/[\x00-\x1F]/', function($matches) {
        $char = $matches[0];
        switch ($char) {
            case "\n": return "\\n";
            case "\r": return "\\r";
            case "\t": return "\\t";
            default:
                return sprintf("\\u%04x", ord($char));
        }
    }, $jsonString);
}


function escapeNewlines(string $jsonString): string {
    // reemplaza saltos de línea que no estén escapados
    // Solo reemplaza saltos de línea que no están escapados.
    // Mantiene intactos los \\n correctos.
    return preg_replace('/(?<!\\\\)\n/', '\\\\n', $jsonString);
}

function jsonErrorMessage(string $jsonString): string {
    json_decode($jsonString);
    $error = json_last_error();

    switch ($error) {
        case JSON_ERROR_NONE:
            return 'OK';
        case JSON_ERROR_DEPTH:
            return 'Excedida la profundidad máxima de la pila';
        case JSON_ERROR_STATE_MISMATCH:
            return 'Desajuste de modos o underflow';
        case JSON_ERROR_CTRL_CHAR:
            return 'Error de carácter de control';
        case JSON_ERROR_SYNTAX:
            return 'Error de sintaxis';
        case JSON_ERROR_UTF8:
            return 'Caracteres UTF-8 malformados';
        default:
            return 'Error desconocido (código ' . $error . ')';
    }
}


function interpolateQuery($query, $params) {//$params es un array
    // Dividir la consulta en partes utilizando '?' como delimitador
    $parts = explode('?', $query);
    $final_query = '';
    
    // Iterar sobre las partes y los parámetros
    for ($i = 0; $i < count($parts); $i++) {
        $final_query .= $parts[$i];
        
        // Añadir el valor del parámetro si existe
        if (isset($params[$i])) {
            $value = $params[$i];
            
            // Determinar el tipo de dato y formatear adecuadamente
            if (is_int($value) || is_float($value)) {
                $final_query .= $value;
            } elseif (is_null($value)) {
                $final_query .= 'NULL';
            } else {
                // Escapar caracteres especiales para cadenas
                $escaped = addslashes($value);
                $final_query .= "'" . $escaped . "'";
            }
        }
    }
    
    return $final_query;
}

function prepararQuery($conn, $query, $arr_params, $sign = '?') {
    //echo "<hr><p> START --- function: prepararQuery() </p><hr>";
    //$conn => es necesario para $conn->real_escape_string($value)
    //$query => es la consulta sql 
    //$arr_params => es un array de parámetros
    //$sign => por defecto es '?' pero al introducir json pongo signo especial. Ej.: '__[(&)]__' //no usar '<' ni '>'
    //si en arr_params algun valor es null, meterlo directamente sin usar '?'
    //si la consulta $query no tiene '?' pasar $arr_params vacio => [] o no USAR ESTA FUNCION YA QUE NO HACE NADA

    // Dividir la consulta en partes utilizando '?' como delimitador
    $arr_parts = explode($sign, $query);
    $final_query = '';
    
    //debug($sign, 'sign');
    //debug($query, 'query');
    //debug($arr_params, 'arr_params');
    //debug($arr_parts, 'arr_parts');
    //debug(count($arr_parts), 'count(arr_parts)');
    //echo "<hr><p> START --- FOR </p><hr>";

    if(count($arr_parts) > 1){//SI AL MENOS HAY UN '?' AL DIVIDIR STRING RETORNA 2 VALORES EN arr_parts

        // Iterar sobre las partes y los parámetros
        for ($i = 0; $i < count($arr_parts); $i++) {        
            $final_query .= $arr_parts[$i];

            //debug($arr_parts[$i],"$ arr_parts[$i]");
            //debug($final_query, "$ final_query [$i] antes");
            
            // Añadir el valor del parámetro si existe
            if (isset($arr_params[$i]) ) {
                $value = $arr_params[$i];

                //debug($arr_params[$i], "$ arr_params[$i]");
                //debug($value, 'value');
                
                // Determinar el tipo de dato y formatear adecuadamente
                if (is_int($value) || is_float($value)) {
                    $final_query .= $value;
                    //echo " $ value es INT o FLOAT";
                } elseif (is_bool($value)) {
                    $final_query .= ($value) ? 1 : 0 ;
                    //echo " $ value es BOOL";
                } elseif (is_null($value)) {
                    //aki no entra nunca ya que si $arr_params[$i] = NULL la comprobación isset(NULL) retorna false y no entra aki. 
                    //pero lo dejo aki con esta explicación
                    $final_query .= 'NULL';
                    //echo " $ value [$value] es NULL";
                } else {
                    // Escapar caracteres especiales para cadenas
                    $value_escaped = $conn->real_escape_string($value);
                    $final_query .= "'" . $value_escaped . "'";
                    //echo " $ value [$value] es STRING";
                }
            }

            //debug($final_query, "$ final_query [$i] después ");
            //echo "<hr>";
        }
        //echo "<hr><p> END --- FOR </p><hr>";
        //echo "<hr><p> END --- function: prepararQuery() </p><hr>";

        return $final_query;

    }else{

        //echo "<hr><h3> NO HAY '?' EN LA CONSULTA. LA RETORNO TAL CUAL</h3>";
        return $query;
    }    
}



function buildWhere($modo, $texto, $campos = ["array de campos"], &$params = [], &$types = "", $arr_songbooks) {
    
    $where = "";
    $texto = trim($texto);

    switch ($modo) {

        // 1) Todas las palabras (pueden ser parte de otras palabras, sin importar orden)
        default:
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
            $where .= implode(" AND ", $ands);
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
        $where .= implode(" AND ", $ands);
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
            $where .= "(" . implode(" OR ", $orsGlobal) . ")";
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
            $where .= "(" . implode(" OR ", $ors) . ")";
            break; 
            
            
        // 5) Frase exacta
        case 5:
            $ors = [];
            foreach ($campos as $campo) {
                $ors[] = "$campo LIKE ?";
                $params[] = "%" . $texto . "%";
                $types .= "s";
            }
            $where .= "(" . implode(" OR ", $ors) . ")";
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
            $where .= implode(" AND ", $ands);
            break;

    }

    //si se ha indicado songbook donde buscar
    if(!empty($arr_songbooks)){
        $ids = [];
        foreach ($arr_songbooks as $songbook) {
            if (filter_var($songbook, FILTER_VALIDATE_INT) !== false) {
                //si quero meter en la consulta directamente ' AND s.songbook IN (1,2,3) '
                //$ids[] = $songbook;
                
                //si quiero meter como ' AND s.songbook IN (?,?,?) ' y convertir en ' AND s.songbook IN (1,2,3) '
                $ids[] = "?";
                $params[] = $songbook;
                $types .= "i"; // tipo entero
            }
        }

        if (!empty($ids)) {
            $where .= " AND s.songbook IN (" . implode(",", $ids) . ") ";
        }
    }

    return $where;
}


function convertirFecha($fecha, $separador = '/') {
    $partes = explode('-', $fecha);// de formato sql '2025-08-03' a '03/08/2025' o '03.08.2025'
    return $partes[2] . $separador . $partes[1] . $separador . $partes[0];
}


function ordenarResultByArray($result, $arr_lista_ids){
    // Paso 1: Crear un índice rápido id_song → datos
    $map = [];
    foreach ($result as $row) {
        $map[$row['id_song']] = $row;
    }

    // Paso 2: Construir nuevo array en el orden de $arr_lista_ids
    $ordered = [];
    foreach ($arr_lista_ids as $id) {
        if (isset($map[$id])) {
            $ordered[] = $map[$id];
        }
    }

    return $ordered;

    // Resultado ordenado
    //print_r($ordered);
}


//=====================================================================================//
// FUNCTIONS - END
//=====================================================================================//
?>