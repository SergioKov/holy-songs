<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Holy-Songs - Pantalla</title>
    <link rel="icon" type="image/png" href="./images/bq.png">    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href='https://fonts.googleapis.com/css?family=Muli' rel='stylesheet'>    
    <link href="https://fonts.googleapis.com/css2?family=Oswald&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital@1&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Open+Sans:wght@300&family=Raleway:wght@100&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400..700;1,400..700&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=PT+Sans+Narrow:wght@400;700&family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./css/pantalla.css">
</head>
<body>

<?php
    $ejemplo = `
        <div id="contenedor">        
            <div id="trad0" class="trad">
                <div class="trad_inner">
                    <p class="verse">
                        <span class="verse_ref">Иоан. 3:16</span>
                        <span class="verse_number">16</span>
                        <span class="verse_text">Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него, не погиб, но имел жизнь вечную.</span>
                    </p>
                    <p class="verse_full_ref">Иоанa 3:16 (RST+)</p>
                </div>
            </div>

            <div id="trad1" class="trad">
                <div class="trad_inner">
                    <p class="verse">
                        <span class="verse_ref">Iван. 3:16</span>
                        <span class="verse_number">16</span>
                        <span class="verse_text">Так бо Бог полюбив світ, що дав Сина Свого Одноро́дженого, щоб кожен, хто вірує в Нього, не згинув, але мав життя вічне.</span>
                    </p>
                    <p class="verse_full_ref">Iванa 3:16 (Ukr_Ogi88)</p>
                </div>
            </div>

            <div id="trad2" class="trad">
                <div class="trad_inner">
                    <p class="verse">
                        <span class="verse_ref">Jn. 3:16</span>
                        <span class="verse_number">16</span>
                        <span class="verse_text">Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.</span>
                    </p>
                    <p class="verse_full_ref">Juan 3:16 (RV60)</p>
                </div>
            </div>
        </div><!--/#contenedor-->
    `;
?>

    <div id="contenedor" class="">

    </div><!--/#contenedor-->
    
    
    <script src="js/pantalla_config.js"></script>
    <script src="js/pantalla.js"></script>
    <script src="js/pantalla_both.js"></script>
</body>
</html>
