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

    <header>
        <nav>
            <ul>
                <li><a class="active" href="#" data-link="">Home</a></li>
                <li><a href="/song" data-link="">Song</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="container">

    <!-- <h1 class="h1_title">Bible-Text.com</h1> -->
    <h1 class="h1_title">BT</h1>
    
        

    </div><!--/container-->

    <footer>
        <p>&copy; <?=date("Y");?> Bible-Text.com. Todos los derechos reservados.</p>
    </footer>

</body>
</html>