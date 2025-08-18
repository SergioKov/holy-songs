<?php 
//es home
//include('../includes/templates/check_auth.php');//antes (sin el enrutador en /index.php)
include __DIR__ . '/../includes/templates/check_auth.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="icon" type="image/png" href="../images/hs.png">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link id="estilos_slideshow" rel="stylesheet" href="../css/style_index.css">
</head>
<body>

<?php
    $li_active = 'home';
    include __DIR__ . '/../includes/templates/header.php';
?>
    
    <div class="container">

        <!-- <h1 class="h1_title">Holy-Songs.com</h1> -->
        <h1 class="h1_title">HS</h1>
    
        

    </div><!--/container-->

<?php
    include __DIR__ . '/../includes/templates/footer.php';
?>

</body>
</html>