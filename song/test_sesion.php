<?php 
session_start();

$nombre_fichero = basename(__FILE__);
echo $nombre_fichero; // Muestra solo el nombre del archivo actual '40_matthew.php'
echo '<p>$ nombre_fichero: ' . $nombre_fichero;

$nombre_fichero_sin_extension = substr($nombre_fichero,0,-4);
echo '<p>$ nombre_fichero_sin_extension: ' . $nombre_fichero_sin_extension;



if( isset($_SESSION['username']) && isset($_SESSION['id_user']) ){
    echo "<p> hay sesion";
    echo "<p> username: " . $_SESSION['username'];
    echo "<p> id_user: " . $_SESSION['id_user'];
}else{
    echo "<p> no hay sesion";
    exit();
}
?>