<?php



// Conexión a la base de datos
if($_SERVER['HTTP_HOST'] == 'holy-songs.com'){//HOSTALIA
    //echo"hostalia";
	$servername = "PMYSQL120.dns-servicio.com";
    $username = "holy_songs_user";
    $password = "&parol_holy_songs_user&";
    $dbname = "7229353_db_holy_songs";//db de holy-songs
    
}else{//LOCALHOST
    //echo"localhost";
	$servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "db_songs";    
}

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    //echo "conn error";
    //writeLog("Conexión fallida. Error: [" . $conn->connect_error . "]");

	die("Conexión fallida: " . $conn->connect_error);
}else{
	//echo "conn ok";
}


?>