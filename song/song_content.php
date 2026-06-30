<?php

session_start(); //aki obligatorio ya que no tiene header.php (header.php tienen dentro session_start())

//es: song/index.php
//include('../includes/templates/check_auth.php');//antes (sin el enrutador en /index.php)
include __DIR__ . '/../includes/templates/check_auth.php';
?>

<?php
//Rutas al show-screen dependiendo de hosting actual
if ($_SERVER['HTTP_HOST'] == 'holy-songs.com') { //HOSTALIA
    //echo"hostalia";
    //$href_css = "http://show-screen.com/css/pantalla.css";//.com

    $ruta_screen_pantalla = "https://show-screen.com/"; //en 'index.php' hay 'screen_pantalla.php'
    echo "
        <script>
            let ruta_screen_pantalla = 'https://show-screen.com/';
        </script>
    ";
} else { //LOCALHOST
    //echo"localhost";
    //$href_css = "https://show-screen.local/css/pantalla.css";//.local

    $ruta_screen_pantalla = "http://show-screen.local/"; //en 'index.php' hay 'screen_pantalla.php'
    echo "
        <script>
            let ruta_screen_pantalla = 'http://show-screen.local/';
        </script>
    ";
}




//sesion iniciada correctamente
if (isset($_SESSION['login']) && $_SESSION['login'] === true) {
    $img_login_src = "./images/login2_green.svg";

    echo '
            <script>
                let hay_usuario_logueado = true;
                let username = "' . addslashes($_SESSION['username']) . '";
                let email = "' . addslashes($_SESSION['email']) . '";
                //alert("username: " + username);        
            </script>
        ';

    if (isset($_SESSION['success'])) {
        echo '
                <script>
                    window.addEventListener("DOMContentLoaded", () => {
    
                        showToast(
                            "ok",
                            "' . addslashes($_SESSION['success']) . '",
                            2000,
                            "center"
                        );
            
                    });            
                </script>
            ';
        unset($_SESSION['success']);
    }
} else {
    $img_login_src = "./images/login2_grey.svg";
    echo '
            <script>
                let hay_usuario_logueado = false;        
            </script>
        ';
}


?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Song</title>
    <link rel="icon" type="image/png" href="../images/hs.png">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=Noto+Music&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=PT+Sans+Narrow:wght@400;700&family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="./css/song.css">
    <link rel="stylesheet" href="./css/toast.css">
    <link rel="stylesheet" href="./css/song_modal.css">
    <link rel="stylesheet" href="./css/song_scroll.css">
    <link rel="stylesheet" href="./css/song_public.css">
    <link rel="stylesheet" href="./css/song_resp.css">

    <style id="style_item_h"></style>
</head>

<body>

    <!-- Header de arriba - contenedor de ajustes de Transponer... -->
    <header>

        <!-- Boton hamburguesa Menu a la Izquierda -->
        <div id="btn_menu" class="shown">
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div><!--/#btn_menu-->

        <!-- Boton L de Lista a la Derechaa -->
        <div id="btn_lista_fix" class="shown" onclick="openModal('full','Lista actual',null,'buildLista',true, 'ver_sm');">
            <span>L</span>
        </div><!--/#btn_lista_fix-->


        <!-- Menu de Header arriba - contenedor de transponer arriba ... -->
        <div id="menu_contenido" class="elementos_modales">
            <div id="menu_contenido_inner">

                <div id="head_block_l">
                    <div onclick="hideShowPuntosMenu()">
                        <div id="hamburger" class="hamburger">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>

                <div id="head_block_c">
                    <div class="wr_transpose">

                        <div class="separador"></div>
                        <button id="btn_lista" class="btn" onclick="showEdit('lista')">Buscar Lista</button>
                        <div class="separador"></div>

                        <div id="d_currentTipoAcorde">Tipo acorde (si hay): </div>
                        <button id="btn_diez" class="btn changeTipoAcorde" onclick="changeTipoAcorde('diez')">#</button>
                        <button id="btn_bemol" class="btn changeTipoAcorde" onclick="changeTipoAcorde('bemol')">b</button>

                        <div class="separador"></div>

                        <div id="d_currentTransposition">Transpose: <b>0</b></div>
                        <button class="btn changeTranspose" onclick="changeTranspose('down')">-</button>
                        <button class="btn changeTranspose" onclick="changeTranspose('up')">+</button>
                        <button class="btn changeTranspose" onclick="resetTonalidad()">Reset</button>

                        <div class="separador"></div>
                    </div>
                </div>

                <div id="head_block_r">
                    <span class="close" onclick="hideMenu()">✕</span>
                </div>

            </div>
        </div><!--/#menu_contenido-->

        <!-- Puntos Menu - contenedor de menu desplegable... -->
        <div id="puntosMenu" class="elementos_modales">
            <ul>
                <li onclick="showEdit('buscar')">Buscar</li>
                <li onclick="showEdit('esquema')">Esquema</li>
                <li onclick="showEdit('cancion')">Canción</li>
                <li onclick="showEdit('ejemplo')">Ejemplo</li>
                <li onclick="showEdit('lista')">Lista</li>
                <li>---</li>
                <li onclick="openModal('full','Mostrar canción',null,'showSong')">1. opemModal() - showSong()</li>
                <li onclick="openModal('full','Crear esquema de canción',null,'buildEsquema')">1. opemModal() - buildEsquema()</li>
                <li><a href="/">Inicio</a></li>
                <li><a href="/home">Salir de Song a Home</a></li>
            </ul>
        </div><!--/#puntosMenu-->


        <!-- barra_estado - contenedor de steps... -->
        <div class="barra_estado">
            <div class="steps_container">
                <div class="step" data-index="0">Instrucción:</div>
            </div>
        </div><!--/.barra_estado-->

    </header><!--/header--><!---->


    <!-- Carousel - contenedor de slides... -->
    <div id="carousel">
        <div class="slide_container">

            <div class="slide">
                <div class="slide_inner">
                    <fieldset class="kuplet">
                        <legend>Instrucción:</legend>
                        <p class="t">1. Accede al Menú.</p>
                        <p class="t">2. Busca o crea una canción.</p>
                        <p class="t">3. Crea diapositivas para verlas aquí.</p>
                        <p class="t">4. Empieza a alabar a Dios.</p>
                    </fieldset>
                </div>
            </div>


        </div><!--/.slide_container-->
    </div><!--/#carousel--><!---->


    <!-- Calculando - texto a mostrar mientras se calcula font-size... -->
    <div id="calculando">Calculando el tamaño de texto.... <br>Espera.</div>
    <!--/#calculando -  --><!---->


    <!-- Edit Contenido -  -->
    <div id="edit_contenido" class="elementos_modales shown">
        <div id="edit_contenido_inner">

            <div class="edit_head" style="display: none;">
                <div class="inner">
                    <h4>
                        <span class="bl_titulo">Editar</span>
                        <span class="close" onclick="hideEdit()">✕</span><!-- x -->
                    </h4>
                </div>
            </div><!--/.edit_head-->


            <div class="edit_body">
                <div class="inner">

                    <!--.bl_outer-->
                    <div class="bl_outer">

                        <!--.bl_head-->
                        <div class="bl_head">

                            <!--.bl_head_l-->
                            <div class="bl_head_l">
                                <div class="dbtn dbtn_fx" onclick="showBlockName(this.dataset.block_name)" data-block_name="buscar" title="Buscar">
                                    <!--Buscar-->
                                    <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                                    <span class="vkl_name">Buscar</span>
                                </div>
                                <div class="dbtn dbtn_fx" onclick="showBlockName(this.dataset.block_name)" data-block_name="esquema" title="Esquema">
                                    <!--Esquema-->
                                    <img class="btn_img" src="./images/esquema_512x512_white.png">
                                    <span class="vkl_name">Esquema</span>
                                </div>
                                <div class="dbtn dbtn_fx" onclick="showBlockName(this.dataset.block_name)" data-block_name="cancion" title="Canción">
                                    <!--Canción-->
                                    <img class="btn_img" src="./images/song_512x512_white.png">
                                    <span class="vkl_name">Canción</span>
                                </div>
                                <div class="dbtn dbtn_fx dbtn_active" onclick="showBlockName(this.dataset.block_name)" data-block_name="lista" title="Lista">
                                    <!--Lista-->
                                    <img class="btn_img" src="./images/checklist2_24x24.png">
                                    <span class="vkl_name">Listas</span>
                                </div>
                            </div><!--/.bl_head_l-->

                            <!--.bl_head_r-->
                            <div class="bl_head_r">
                                <div class="dbtn dbtn_fx" onclick="showBlockName(this.dataset.block_name)" data-block_name="ejemplo" title="Ejemplo">
                                    <!--Ejemplo-->
                                    <img class="btn_img" src="./images/help_512x512_white.png">
                                    <span class="vkl_name">Ejemplo</span>
                                </div>
                                <div class="dbtn dbtn" onclick="manejarLogin();" data-block_name="login" title="Login">
                                    <!--Lista-->
                                    <img id="img_login" class="btn_img" src="<?= $img_login_src; ?>">
                                </div>
                            </div><!--/.bl_head_r-->


                        </div><!--/.bl_head-->

                        <!--.bl_body-->
                        <div class="bl_body">


                            <!--/#block_buscar-->
                            <div id="block_buscar" class="edit_blocks">

                                <div id="block_buscar_head" class="edit_blocks_head">

                                    <div class="block_option_y_action">

                                        <div class="wr_block_option">
                                            <div class="wr_block_option_inner">

                                                <div style="display: none;">
                                                    <button class="btn opt_edit" onclick="crearPages(); closeAll();">crearPages()</button>
                                                    <button class="btn opt_edit">2.Ver algo...</button>
                                                    <button class="btn opt_edit">3.Ver algo...</button>
                                                    <div class="separador opt_edit"></div>
                                                </div>


                                                <button class="btn opt_nueva" onclick="showBlockName('cancion'); nueva_song();">Nueva Canción</button>
                                            </div><!--/.wr_block_option_inner-->
                                        </div><!--/.wr_block_option-->

                                        <div class="wr_head_action">

                                            <div class="wr_dbtns_panels">

                                                <div class="dbtn_panel dbtn_panel_l active" onclick="hideShowPanel('block_buscar','l')">
                                                    <div class="pan2 p_l pan_side"></div>
                                                    <div class="pan2 p_r"></div>
                                                </div>

                                                <div class="dbtn_panel dbtn_panel_r active" onclick="hideShowPanel('block_buscar','r')">
                                                    <div class="pan2 p_l"></div>
                                                    <div class="pan2 p_r pan_side"></div>
                                                </div>

                                            </div><!--/.wr_panels-->

                                            <button id="btn_actions_buscar" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_buscar');" title="Acciones">
                                                <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                            </button>
                                            <div id="bl_actions_buscar" class="bl_set bl_actions" style="display:none;">
                                                <div class="bl_set_inner bl_closed">
                                                    <div class="inner_content">

                                                        <div class="inner_content_head_body">
                                                            <div class="inner_content_head">
                                                                <div class="wr_title_btn_close">
                                                                    <span>Acciones con la canción:</span>
                                                                    <span class="sp_close">✕</span>
                                                                </div>
                                                            </div><!--/.inner_content_head-->

                                                            <div class="inner_content_body">
                                                                <ul class="ul_action">
                                                                    <p class="prim">Los botones de acciones se verán al selecionar la canción...</p>
                                                                </ul>
                                                            </div><!--/.inner_content_body-->
                                                        </div><!--/.inner_content_head_body-->

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div><!--/.block_option_y_action-->


                                    <!-- <div class="wr_lcr btns2">
                                        <div class="wr_lcr_inner">
                                            <div class="v_lcr v_lcr_l lcr_active" onclick="clickLCR(this,'l','block_buscar')">
                                                <div>Datos</div>
                                            </div>
                                            <div class="v_lcr v_lcr_r" onclick="clickLCR(this,'r','block_buscar')">
                                                <div>Vista</div>
                                            </div>
                                        </div>
                                        <div class="wr_lcr_line">
                                            <div class="lcr_line lines2 line_2l"></div>
                                        </div>
                                    </div> -->
                                    <!--/.wr_lcr-->

                                </div><!--/#block_buscar_head-->


                                <div id="block_buscar_body" class="edit_blocks_body">

                                    <div class="bl_partes">

                                        <div class="partes bl_parte_l bl_active">

                                            <!--/parte_fija-->
                                            <div class="parte_fija">

                                                <H4>Buscar canción:</H4>
                                                <div class="wr_nav">
                                                    <div class="wr_inpt_x">
                                                        <input
                                                            id="inpt_find"
                                                            class="inpt_vvod"
                                                            type="text"
                                                            placeholder="Введите слово или фразу для поиска..."
                                                            data-dic=""
                                                            va-lue="боже"
                                                            value="aaa">
                                                        <div class="clear_inpt" onclick="clear_inpt('find')">&times;</div>
                                                    </div>

                                                    <button id="btn_ok_find" class="btn btn_search" title="Buscar" onclick="findWordsSong()">
                                                        <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
                                                    </button>

                                                    <button id="btn_find_settings" class="btn btn_set btn_search" onclick="hideShowDiv('bl_find_settings');" title="Ajustes">
                                                        <img class="btn_img posi-tion_row" src="./images/settings7_white.svg">
                                                    </button>
                                                    <div id="bl_find_settings" class="bl_set" style="display:none;">
                                                        <div class="bl_set_inner bl_closed">
                                                            <div class="inner_content">

                                                                <div class="inner_content_head_body">
                                                                    <div class="inner_content_head">
                                                                        <div class="wr_title_btn_close">
                                                                            <span>Marca parametros de búsqueda:</span>
                                                                            <span class="sp_close">✕</span>
                                                                        </div>
                                                                    </div><!--/.inner_content_head-->

                                                                    <div class="inner_content_body">
                                                                        <h5>Modo de búsqueda:</h5>
                                                                        <div class="wr_sel_song m_0">
                                                                            <select id="modo" class="sel_song">
                                                                                <option value="1">1) Todas las palabras (pueden ser parte de otras palabras, sin importar orden)</option>
                                                                                <option value="2">2) Todas las palabras (no pueden ser parte de otras palabras, sin importar orden)</option>
                                                                                <option value="3">3) Coincidir al menos una palabra</option>
                                                                                <option value="4">4) Palabras en el orden establecido</option>
                                                                                <option value="5" selected>5) Frase exacta</option>
                                                                                <option value="6">6) Palabras exactas (no pueden ser parte de otras palabras, sin importar orden)</option>
                                                                            </select>
                                                                        </div>

                                                                        <h5>Campos de búsqueda:</h5>
                                                                        <div class="wr_sel_song">
                                                                            <select id="buscar_en" class="sel_song">
                                                                                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                                                                                <option value="2">2) Todos los campos disponibles (lento)</option>
                                                                                <option value="3">3) Todos los campos de texto disponibles</option>
                                                                                <option value="4">4) Sólo el título de canción</option>
                                                                                <option value="5">5) Sólo el texto de canción</option>
                                                                                <option value="6">6) Sólo las notas de canción</option>
                                                                                <option value="7">7) Identificador y número de canción</option>
                                                                                <option value="8">8) Sólo el identificador de canción</option>
                                                                                <option value="9">9) Sólo el número de canción</option>
                                                                                <option value="10">10) Sólo el identificador de categoría</option>
                                                                                <option value="10">10) Sólo el nombre de categoría</option>
                                                                                <option value="11">11) Sólo el idioma</option>
                                                                            </select>
                                                                        </div>
                                                                    </div><!--/.inner_content_body-->
                                                                </div><!--/.inner_content_head_body-->

                                                            </div>
                                                        </div>
                                                    </div>

                                                </div><!--/.wr_nav-->

                                                <div id="d_sel_songbooks" class="wr_sb m_0">
                                                    <h5>Songbooks donde buscar (separados por coma):</h5>
                                                    <button id="btn_songbook_search" class="btn btn_big btn_set" onclick="hideShowDiv('bl_songbook_search');">
                                                        Seleccionar songbooks:
                                                    </button>
                                                    <div id="bl_songbook_search" class="bl_set" style="display: none;">
                                                        <div class="bl_set_inner bl_closed">
                                                            <div class="inner_content">

                                                                <div class="inner_content_head_body">
                                                                    <div class="inner_content_head">
                                                                        <div class="wr_title_btn_close">
                                                                            <span>Marca parametros de búsqueda:</span>
                                                                            <span class="sp_close">✕</span>
                                                                        </div>
                                                                    </div><!--/.inner_content_head-->

                                                                    <div class="inner_content_body">
                                                                        <span class="sp_prim">Si no se indica songbook, se buscará en todos los disponibles.</span>

                                                                        <div class="d_options_cboxes">
                                                                            <button class="btn" onclick="checkAllCboxes('wr_sb_checkboxes')">Selecionar todos</button>
                                                                            <button class="btn" onclick="uncheckAllCboxes('wr_sb_checkboxes')">Deseleccionar todos</button>
                                                                        </div>

                                                                        <div id="wr_sb_checkboxes" class="wr_checkboxes">
                                                                            <label>
                                                                                <p>
                                                                                    <input type="checkbox" name="songbooks" value="1">
                                                                                    <span>Ejemplo de Songbook...</span>
                                                                                </p>
                                                                            </label>
                                                                        </div>
                                                                    </div><!--/.inner_content_body-->
                                                                </div><!--/.inner_content_head_body-->

                                                            </div><!--/.inner_content-->
                                                        </div><!--/.bl_set_inner-->
                                                    </div><!--/.bl_set-->

                                                </div><!--/#d_sel_songbooks-->

                                            </div><!--/.parte_fija-->

                                            <!--/parte_variable-->
                                            <div class="parte_variable">
                                                <div class="d_titulo_y_tabla">

                                                    <div id="titulo_tabla_song" class="wr_titulo_tabla">
                                                        <h5 class="titulo_tabla">Canciones encontradas: <b>...</b></h5>
                                                        <span id="sp_icon_filtro" class="sp_filtro d-none" onclick="hideShowDesktopFilter(eid_d_filter_results, this);">
                                                            <img class="btn_img" src="./images/icon_filter_white_22x22.svg">
                                                        </span>
                                                    </div>

                                                    <div id="d_filter_results" class="contenedor_filter">
                                                        <div class="wr_nav">
                                                            <div class="wr_inpt_x">
                                                                <input
                                                                    id="inpt_filter"
                                                                    class="inpt_vvod"
                                                                    type="text"
                                                                    placeholder="Введите слово или фразу для фильтра..."
                                                                    data-dic=""
                                                                    value="">
                                                                <div class="clear_inpt" onclick="clear_inpt('filter')">&times;</div>
                                                            </div>
                                                        </div><!--/.wr_nav-->

                                                        <div class="filter_result" style="display: none;">
                                                            <div class="filter_result_inner">
                                                                <span>Filtrado:</span>
                                                                <span class="f_num">...</span>
                                                            </div>
                                                        </div>

                                                    </div><!--/#d_filter_results-->


                                                    <div class="wr_tabla">
                                                        <div class="wr_tabla_inner">

                                                            <div id="bl_songs_finded" class="canciones_body">
                                                                <!-- aki los p de songs encontradas-->
                                                            </div><!--/.canciones_body-->

                                                            <table style="display: none;">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="td_n">Nº</th>
                                                                        <th class="td_id_song">Id</th>
                                                                        <th class="td_numero">Número</th>
                                                                        <th class="td_titulo">Título</th>
                                                                        <th class="td_esquema">Esquema</th>
                                                                        <th class="td_category">Categoría</th>
                                                                        <th class="td_songbook">Songbook</th>
                                                                        <th class="td_idioma">Idioma</th>
                                                                        <th class="td_tonalidad">Tonalidad</th>
                                                                        <th class="td_transpose">Transpose</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="td_n">...</td>
                                                                        <td class="td_id_song">...</td>
                                                                        <td class="td_numero">...</td>
                                                                        <td class="td_titulo">...</td>
                                                                        <td class="td_esquema">...</td>
                                                                        <td class="td_category">...</td>
                                                                        <td class="td_songbook">...</td>
                                                                        <td class="td_idioma">...</td>
                                                                        <td class="td_tonalidad">...</td>
                                                                        <td class="td_transpose">...</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </div>

                                                </div><!--/.d_titulo_y_tabla-->
                                            </div><!--/.parte_variable-->

                                        </div><!--/.bl_parte_l-->


                                        <div class="partes bl_parte_r vista_r">

                                            <!--/parte_fija-->
                                            <div class="parte_fija">
                                                <h4 class="h4_vista_previa">
                                                    <span>Vista previa:</span>
                                                </h4>
                                            </div><!--/.parte_fija-->

                                            <!--/parte_variable-->
                                            <div class="parte_variable">
                                                <div class="bloques_outer">
                                                    <div class="bloques wr_vista_song">

                                                        <div class="vista_head">
                                                            <button class="btn btn_vista_atras_head" onclick="ocultarTodasVistas();">
                                                                <img src="images/arrow_left2_white.svg">
                                                            </button>
                                                            <button class="btn_actions no_visible">&nbsp;</button>
                                                            <div class="vp_titulo">Vista (<b>Canción</b>)</div>
                                                            <button class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_buscar');">
                                                                <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                            </button>
                                                            <button class="btn btn_vista_close_head" onclick="ocultarTodasVistas();">
                                                                <img src="images/x_white.png">
                                                            </button>
                                                        </div><!--/.vista_head-->

                                                        <div class="vista_song_content">
                                                            <div class="d_info">
                                                                <p class="prim">Busca una canción introduciendo el texto en el campo '<b>Buscar</b>'...</p>
                                                                <p class="prim">(Aquí se mostrará el texto de la canción...)</p>
                                                            </div>
                                                        </div><!--/.vista_song_content-->

                                                    </div>
                                                </div>

                                            </div><!--/.parte_variable-->

                                        </div><!--/.bl_parte_r-->

                                    </div><!--/.bl_partes-->

                                </div><!--/#block_buscar_body-->

                            </div><!--/#block_buscar-->



                            <!--#block_esquema-->
                            <div id="block_esquema" class="edit_blocks">

                                <div id="block_esquema_head" class="edit_blocks_head">

                                    <div class="block_option_y_action">

                                        <div class="wr_block_option">
                                            <div class="wr_block_option_inner">
                                                <button class="btn opt_nueva" onclick="showBlockName('cancion'); nueva_song();">Nueva Canción</button>
                                                <button id="btn_ver_esquema" class="btn opt_edit" onclick="showVklad(this,'ver_esquema')">Ver</button>
                                                <button id="btn_crear_esquema" class="btn opt_edit" onclick="showVklad(this,'crear_esquema')">Crear</button>
                                                <button id="btn_select_slide" class="btn opt_edit" onclick="showVklad(this,'select_slide')">Slide</button>
                                            </div><!--/.wr_block_option_inner-->
                                        </div><!--/.wr_block_option-->

                                        <div class="wr_head_action">

                                            <div class="vklad_ver_esquema vklads" style="display: block;">
                                                <div class="vklads_head_inner">

                                                    <div class="wr_dbtns_panels">

                                                        <div class="dbtn_panel dbtn_panel_l active" onclick="hideShowPanel('block_esquema','l','ver_esquema')">
                                                            <div class="pan3 p_l pan_side"></div>
                                                            <div class="pan3 p_c"></div>
                                                            <div class="pan3 p_r"></div>
                                                        </div>

                                                        <div class="dbtn_panel dbtn_panel_c active" onclick="hideShowPanel('block_esquema','c','ver_esquema')">
                                                            <div class="pan3 p_l"></div>
                                                            <div class="pan3 p_c pan_side"></div>
                                                            <div class="pan3 p_r"></div>
                                                        </div>

                                                        <div class="dbtn_panel dbtn_panel_r active" onclick="hideShowPanel('block_esquema','r','ver_esquema')">
                                                            <div class="pan3 p_l"></div>
                                                            <div class="pan3 p_c"></div>
                                                            <div class="pan3 p_r pan_side"></div>
                                                        </div>

                                                    </div><!--/.wr_panels-->

                                                    <button id="btn_actions_ver_esquema" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_ver_esquema');" title="Acciones">
                                                        <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                    </button>
                                                    <div id="bl_actions_ver_esquema" class="bl_set bl_actions" style="display:none;">
                                                        <div class="bl_set_inner bl_closed">
                                                            <div class="inner_content">

                                                                <div class="inner_content_head_body">
                                                                    <div class="inner_content_head">
                                                                        <div class="wr_title_btn_close">
                                                                            <span>Acciones con la esquema:</span>
                                                                            <span class="sp_close">✕</span>
                                                                        </div>
                                                                    </div><!--/.inner_content_head-->

                                                                    <div class="inner_content_body">
                                                                        <ul class="ul_action">
                                                                            <p class="prim">1.Los botones de acciones se verán al selecionar la canción...</p>
                                                                        </ul>
                                                                    </div><!--/.inner_content_body-->
                                                                </div><!--/.inner_content_head_body-->

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><!--/.vklads_head_inner-->
                                            </div><!--/.vklad_ver_esquema-->


                                            <div class="vklad_crear_esquema vklads" style="display: none;">
                                                <div class="vklads_head_inner">

                                                    <div class="wr_dbtns_panels">

                                                        <div class="dbtn_panel dbtn_panel_l active" onclick="hideShowPanel('block_esquema','l','crear_esquema')">
                                                            <div class="pan3 p_l pan_side"></div>
                                                            <div class="pan3 p_c"></div>
                                                            <div class="pan3 p_r"></div>
                                                        </div>

                                                        <div class="dbtn_panel dbtn_panel_c active" onclick="hideShowPanel('block_esquema','c','crear_esquema')">
                                                            <div class="pan3 p_l"></div>
                                                            <div class="pan3 p_c pan_side"></div>
                                                            <div class="pan3 p_r"></div>
                                                        </div>

                                                        <div class="dbtn_panel dbtn_panel_r active" onclick="hideShowPanel('block_esquema','r','crear_esquema')">
                                                            <div class="pan3 p_l"></div>
                                                            <div class="pan3 p_c"></div>
                                                            <div class="pan3 p_r pan_side"></div>
                                                        </div>

                                                    </div><!--/.wr_panels-->

                                                    <button id="btn_actions_crear_esquema" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_crear_esquema');" title="Acciones">
                                                        <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                    </button>
                                                    <div id="bl_actions_crear_esquema" class="bl_set bl_actions" style="display:none;">
                                                        <div class="bl_set_inner bl_closed">
                                                            <div class="inner_content">

                                                                <div class="inner_content_head_body">
                                                                    <div class="inner_content_head">
                                                                        <div class="wr_title_btn_close">
                                                                            <span>Acciones con la esquema:</span>
                                                                            <span class="sp_close">✕</span>
                                                                        </div>
                                                                    </div><!--/.inner_content_head-->

                                                                    <div class="inner_content_body">
                                                                        <ul class="ul_action">
                                                                            <p class="prim">2.Los botones de acciones se verán al selecionar la canción...</p>
                                                                        </ul>
                                                                    </div><!--/.inner_content_body-->
                                                                </div><!--/.inner_content_head_body-->

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><!--/.vklads_head_inner-->
                                            </div><!--/.vklad_crear_esquema-->


                                            <div class="vklad_select_slide vklads" style="display: none;">
                                                <div class="vklads_head_inner">

                                                    <div class="wr_dbtns_panels">

                                                        <div class="dbtn_panel dbtn_panel_l active" onclick="hideShowPanel('block_esquema','l','select_slide')">
                                                            <div class="pan3 p_l pan_side"></div>
                                                            <div class="pan3 p_c"></div>
                                                            <div class="pan3 p_r"></div>
                                                        </div>

                                                        <div class="dbtn_panel dbtn_panel_c active" onclick="hideShowPanel('block_esquema','c','select_slide')">
                                                            <div class="pan3 p_l"></div>
                                                            <div class="pan3 p_c pan_side"></div>
                                                            <div class="pan3 p_r"></div>
                                                        </div>

                                                        <div class="dbtn_panel dbtn_panel_r active" onclick="hideShowPanel('block_esquema','r','select_slide')">
                                                            <div class="pan3 p_l"></div>
                                                            <div class="pan3 p_c"></div>
                                                            <div class="pan3 p_r pan_side"></div>
                                                        </div>

                                                    </div><!--/.wr_panels-->



                                                    <button id="btn_enfocarPantalla_fast" class="btn flex_center btn_actions" onclick="enfocarMisReferenciasOCrear()">
                                                        <img class="btn_img_sm" src="images/center_focus.png">
                                                    </button>

                                                    <button id="btn_recargarPantalla_fast" class="btn flex_center btn_actions" onclick="recargarMisReferenciasOCrear()">
                                                        <img class="btn_img_sm" src="images/reload_white_32x32.png">
                                                    </button>

                                                    <button id="btn_select_slide_settings" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_select_slide_settings');" title="Settings">
                                                        <img class="btn_img_sm" src="./images/settings7_white.svg">
                                                    </button>
                                                    <div id="bl_select_slide_settings" class="bl_set bl_actions" style="display:none;">
                                                        <div class="bl_set_inner bl_closed">
                                                            <div class="inner_content max_768">

                                                                <div class="inner_content_head_body">
                                                                    <div class="inner_content_head">
                                                                        <div class="wr_title_btn_close">
                                                                            <span>Ajustes de vista de diapositivas</span>
                                                                            <span class="sp_close">✕</span>
                                                                        </div>
                                                                    </div><!--/.inner_content_head-->

                                                                    <div class="inner_content_body">

                                                                        <h4>Admin</h4>

                                                                        <div class="contenedor_sel_pantalla">
                                                                            <h4>Fondo cuando la diapositiva está oculta</h4>
                                                                            <p>Habilitar / Deshabilitar:</p>
                                                                            <div class="wr_sel_pantalla wr_opt_fondo">
                                                                                <button id="btn_show_logo_en_fondo" class="btn opt_fondo btn_big d-none" onclick="showTipoContent(this,'i')">Logo en Fondo</button>
                                                                                <button id="btn_show_bible_en_fondo" class="btn opt_fondo btn_big" onclick="showTipoContent(this,'b')">Bible en Fondo</button>
                                                                                <button id="btn_show_black_en_fondo" class="btn opt_fondo btn_big" onclick="showTipoContent(this,'f')">Black en Fondo</button>
                                                                                <button id="btn_show_imagen_en_fondo" class="btn opt_fondo btn_big w_100" onclick="showTipoContent(this,'g')">Fondo personalizado</button>
                                                                            </div>

                                                                            <div id="wr_imagen_personalizada" class="wr_imagen d-none">
                                                                                <div class="wr_imagen_inner">
                                                                                    <input
                                                                                        id="backgroundMedia"
                                                                                        type="file"
                                                                                        name="media[]"
                                                                                        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                                                                                        multiple
                                                                                    >
                                                                                    <div id="previewContainer">
                                                                                        <!-- Aquí se mostrará la vista previa de la imagen seleccionada -->
                                                                                    </div>
                                                                                    <button
                                                                                        id="btnUploadMedia"
                                                                                        class="btn btn_big w_100 d-none"
                                                                                        type="button"
                                                                                    >
                                                                                        Subir media
                                                                                    </button>

                                                                                    <div id="imagenesContainer">
                                                                                        <!-- Aquí se mostrarán las imágenes subidas -->
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>

                                                                        <div class="contenedor_sel_pantalla">
                                                                            <h4>Permiso al Usuario personalizar la vista de la diapositiva</h4>
                                                                            <p>Si está habilitado, el usuario puede elegir qué quiere ver en la diapositiva: títulos, acordes, una parte de la siguiente diapositiva.</p>
                                                                            <p>Habilitar / Deshabilitar:</p>
                                                                            <div class="wr_sel_pantalla">
                                                                                <button id="btn_user_view_control" class="btn w_100" onclick="showTipoContent(this,'u')">Control de Usuario</button>
                                                                            </div>
                                                                        </div>

                                                                        <h4>Vista de Diapositiva</h4>
                                                                        <div class="contenedor_sel_pantalla">
                                                                            <p>Mostrar / Ocultar:</p>
                                                                            <div class="wr_sel_pantalla">
                                                                                <button id="btn_show_legend" class="btn w_100" onclick="showTipoContent(this,'l')">Títulos</button>
                                                                                <button id="btn_show_acordes" class="btn w_100" onclick="showTipoContent(this,'c')">Acordes</button>
                                                                                <button id="btn_show_next_slide" class="btn w_100" onclick="showTipoContent(this,'n')">Siguiente Diapositiva</button>
                                                                            </div>

                                                                            <br>
                                                                            <p>Alineación de contenido:</p>
                                                                            <div class="wr_sel_pantalla">
                                                                                <button id="btn_show_en_top" class="btn w_100" onclick="showTipoContent(this,'t')">Top</button>
                                                                                <button id="btn_show_en_center" class="btn w_100" onclick="showTipoContent(this,'z')">Center</button>

                                                                            </div>

                                                                            <br>
                                                                            <p>Parte de visualización:</p>
                                                                            <div class="wr_sel_pantalla">
                                                                                <button id="btn_show_en_parte_top" class="btn w_100" onclick="showTipoContent(this,'x')">Parte Top</button>
                                                                            </div>

                                                                            <br>
                                                                            <p>Brillo de la pantalla:</p>
                                                                            <div id="contenedorBrillo" class="contenedor_brillo">
                                                                                <input id="deslizador" class="deslizador" type="range"   min="10" max="100" value="100">
                                                                                <span id="valorBrillo" class="porcentaje" >100%</span>
                                                                            </div>

                                                                        </div>

                                                                        <h4>Ubicación</h4>
                                                                        <div class="contenedor_sel_pantalla">
                                                                            <h4>LOCAL</h4>
                                                                            <p>Mostrar la diapositiva en EL MISMO DISPOSITIVO:</p>
                                                                            <p>
                                                                                Escoge esta opción si usas otra pantalla desde el dispositivo actual (PC o MAC) para mostrar en otra pantalla conectada las diapositivas para el público.
                                                                            </p>
                                                                            <div class="wr_sel_pantalla">
                                                                                <button class="btn btn_ver_pantalla w_100" onclick="abrirPantalla(1)">
                                                                                    <img src="images/monitor_1_white.png">
                                                                                    <span>Pantalla Local 1 (principal)</span>
                                                                                </button>
                                                                                <button class="btn flex_center" onclick="enfocarReferencia(1)">
                                                                                    <img class="btn_img_sm" src="images/center_focus.png">
                                                                                </button>
                                                                                <button class="btn" onclick="recargarReferencia(1)">
                                                                                    <img class="btn_img_sm" src="images/reload_white_32x32.png">
                                                                                </button>
                                                                                <button class="btn" onclick="cerrarReferencia(1)">✕</button>
                                                                            </div>

                                                                            <div class="wr_sel_pantalla">
                                                                                <button class="btn btn_ver_pantalla w_100" onclick="abrirPantalla(2)">
                                                                                    <img src="images/monitor_1_white.png">
                                                                                    <span>Pantalla Local 2 (sala)</span>
                                                                                </button>
                                                                                <button class="btn flex_center" onclick="enfocarReferencia(2)">
                                                                                    <img class="btn_img_sm" src="images/center_focus.png">
                                                                                </button>
                                                                                <button class="btn" onclick="recargarReferencia(2)">
                                                                                    <img class="btn_img_sm" src="images/reload_white_32x32.png">
                                                                                </button>
                                                                                <button class="btn" onclick="cerrarReferencia(2)">✕</button>
                                                                            </div>

                                                                            <div class="wr_sel_pantalla">
                                                                                <button class="btn btn_ver_pantalla w_100" onclick="abrirPantalla(3)">
                                                                                    <img src="images/monitor_1_white.png">
                                                                                    <span>Pantalla Local 3 (sala 2)</span>                                                                                    
                                                                                </button>
                                                                                <button class="btn flex_center" onclick="enfocarReferencia(3)">
                                                                                    <img class="btn_img_sm" src="images/center_focus.png">
                                                                                </button>
                                                                                <button class="btn" onclick="recargarReferencia(3)">
                                                                                    <img class="btn_img_sm" src="images/reload_white_32x32.png">
                                                                                </button>
                                                                                <button class="btn" onclick="cerrarReferencia(3)">✕</button>
                                                                            </div>

                                                                        </div>


                                                                        <div class="contenedor_sel_pantalla d-none">
                                                                            <h4 class="h4_vista_previa">
                                                                                <span>REMOTO</span>
                                                                                <button class="btn btn_active">Grabar Slides en BD</button>
                                                                            </h4>
                                                                            <p>Mostrar la diapositiva en EL DISPOSITIVO REMOTO:</p>
                                                                            <p>
                                                                                Escoge esta opción si quieres que otros usuarios vean esta pantalla desde sus dispositivos (Móviles, Tablets, PC o MAC). Para aquello ellos deben acceder al enlace abajo:
                                                                            </p>
                                                                            <p>
                                                                                <a id="link_pantalla_bd" href="" target="_blank"><!--se añade por js--></a>
                                                                            </p>

                                                                            <p>
                                                                                Si escojes esta opción se habilitará la grabación de diapositivas en la base de datos lo que te ayudará a ver las diapositivas en diferentes dispositivos al entrar en la dirección mostrada arriba.
                                                                            </p>

                                                                            <div class="wr_sel_pantalla">
                                                                                <button class="btn w_100" onclick="abrirReferencia(miPantallaRemota);">Pantalla Remota</button>
                                                                                <button class="btn" onclick="cerrarReferencia(miPantallaRemota);">✕</button>
                                                                            </div>
                                                                        </div>

                                                                        <div class="wr_qr_code d-none">
                                                                            <h4>Escanea el código QR</h4>
                                                                            <div class="wr_qr_img">
                                                                                <!-- <img class="w_100" src="./images/qr_show_screen_com.png"> -->
                                                                                <img class="w_100" src="./images/qr_show_screen_com.svg">
                                                                            </div>
                                                                            <div class="wr_qr_inpt">
                                                                                <input id="inpt_pantalla_bd" type="text" value="" readonly>
                                                                            </div>
                                                                        </div>


                                                                    </div><!--/.inner_content_body-->

                                                                </div><!--/.inner_content_head_body-->

                                                            </div>
                                                        </div>
                                                    </div>









                                                    <button id="btn_actions_select_slide" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_select_slide');" title="Acciones">
                                                        <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                    </button>
                                                    <div id="bl_actions_select_slide" class="bl_set bl_actions" style="display:none;">
                                                        <div class="bl_set_inner bl_closed">
                                                            <div class="inner_content">

                                                                <div class="inner_content_head_body">
                                                                    <div class="inner_content_head">
                                                                        <div class="wr_title_btn_close">
                                                                            <span>3. Escoge la acción:</span>
                                                                            <span class="sp_close">✕</span>
                                                                        </div>
                                                                    </div><!--/.inner_content_head-->

                                                                    <div class="inner_content_body">
                                                                        <ul class="ul_action">
                                                                            <p class="prim">3.Los botones de acciones se verán al selecionar la canción...</p>
                                                                        </ul>
                                                                    </div><!--/.inner_content_body-->

                                                                </div><!--/.inner_content_head_body-->

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><!--/.vklad_head_inner-->
                                            </div><!--/.vklad_select_slide-->
                                        </div>

                                    </div><!--/.block_option_y_action-->


                                    <div class="vklad_ver_esquema vklads" style="display: block;">
                                        <div class="wr_lcr btns3" data-info="ver_esquema">
                                            <div class="wr_lcr_inner">
                                                <div class="v_lcr v_lcr_l lcr_active" onclick="clickLCR(this,'l','block_esquema', 3, 'ver_esquema')">
                                                    <div>Datos</div>
                                                </div>
                                                <div class="v_lcr v_lcr_c" onclick="clickLCR(this,'c','block_esquema', 3, 'ver_esquema')">
                                                    <div>Esquema</div>
                                                </div>
                                                <div class="v_lcr v_lcr_r" onclick="clickLCR(this,'r','block_esquema', 3, 'ver_esquema')">
                                                    <div>Vista</div>
                                                </div>
                                            </div>
                                            <div class="wr_lcr_line">
                                                <div class="lcr_line lines3 line_3l"></div>
                                            </div>
                                        </div><!--/.wr_lcr-->
                                    </div><!--/.vklad_ver_esquema-->


                                    <div class="vklad_crear_esquema vklads" style="display: none;">
                                        <div class="wr_lcr btns3" data-info="crear_esquema">
                                            <div class="wr_lcr_inner">
                                                <div class="v_lcr v_lcr_l lcr_active" onclick="clickLCR(this,'l','block_esquema', 3, 'crear_esquema')">
                                                    <div>Datos</div>
                                                </div>
                                                <div class="v_lcr v_lcr_c" onclick="clickLCR(this,'c','block_esquema', 3, 'crear_esquema')">
                                                    <div>Esquema</div>
                                                </div>
                                                <div class="v_lcr v_lcr_r" onclick="clickLCR(this,'r','block_esquema', 3, 'crear_esquema')">
                                                    <div>Vista</div>
                                                </div>
                                            </div>
                                            <div class="wr_lcr_line">
                                                <div class="lcr_line lines3 line_3l"></div>
                                            </div>
                                        </div><!--/.wr_lcr-->
                                    </div><!--/.vklad_crear_esquema-->


                                    <div class="vklad_select_slide vklads" style="display: none;">
                                        <div class="wr_lcr btns3" data-info="select_slide">
                                            <div class="wr_lcr_inner">
                                                <div class="v_lcr v_lcr_l lcr_active" onclick="clickLCR(this,'l','block_esquema', 3, 'select_slide')">
                                                    <div>Datos</div>
                                                </div>
                                                <div class="v_lcr v_lcr_c" onclick="clickLCR(this,'c','block_esquema', 3, 'select_slide')">
                                                    <div>Esquema</div>
                                                </div>
                                                <div class="v_lcr v_lcr_r" onclick="clickLCR(this,'r','block_esquema', 3, 'select_slide')">
                                                    <div>Vista</div>
                                                </div>
                                            </div>
                                            <div class="wr_lcr_line">
                                                <div class="lcr_line lines3 line_3l"></div>
                                            </div>
                                        </div><!--/.wr_lcr-->


                                        <div id="contenedor_nav_pantalla" class="w_100">
                                            <div id="wr_btns_pantalla">
                                                <div id="vklad_btn_slideGoPrev" class="dbtn" title="Previous slide" onclick="slideGo('prev')">
                                                    <img src="images/arrow_left_r_icon_white.svg">
                                                </div>

                                                <div id="vklad_btn_pantallaShow" class="dbtn" title="Mostrar Pantalla" onclick="toggle_pantalla_show()">
                                                    <img src="images/monitor_1_white.png">
                                                    <span id="titulo_shown">...</span>
                                                </div>

                                                <div id="vklad_btn_slideGoNext" class="dbtn" data-dic="" title="Next slidew" onclick="slideGo('next')">
                                                    <img src="images/arrow_right_r_icon_white.svg">
                                                </div>
                                            </div>
                                        </div>


                                    </div><!--/.vklad_select_slide-->


                                </div><!--/#block_esquema_head-->

                                <div id="block_esquema_body" class="edit_blocks_body">

                                    <div class="vklad_ver_esquema vklads" style="display: block;">
                                        <div class="vklads_inner bl_partes">

                                            <div class="partes bl_parte_l bl_active">

                                                <!--/parte_fija-->
                                                <div class="parte_fija">
                                                    <h4 class="h4_vista_previa">
                                                        <span>1. Bloques actuales:</span>

                                                        <button style="display: none;" id="btn_actions_ver_esquema_l" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_ver_esquema_l');" title="Acciones">
                                                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                        </button>
                                                    </h4>
                                                </div><!--/.parte_fija-->

                                                <!--/parte_variable-->
                                                <div class="parte_variable">
                                                    <div class="bloques_outer">
                                                        <div class="bloques song_bloques solo_ver">
                                                            <!-- aki bloques de la cancion -->
                                                            <p class="prim">Bloques únicos con las que se construye la canción</p>
                                                            <p class="prim">No has seleccionado la canción para ver su esquema. Selecciona una en la pestaña
                                                                <button class="btn inline" onclick="showBlockName('buscar')">
                                                                    Buscar
                                                                </button>
                                                                y luego haz click en el botón de acciones
                                                                <button class="btn tres_puntos" onclick="hideShowDiv('bl_actions_buscar');">
                                                                    <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                                </button>
                                                                y luego en la acción <b>'Ver esquema'</b>.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div><!--/.parte_variable-->

                                            </div><!--/.bl_parte_l-->


                                            <div class="partes bl_parte_c">

                                                <!--/parte_fija-->
                                                <div class="parte_fija">
                                                    <h4>1. Esquema actual:</h4>
                                                </div><!--/.parte_fija-->

                                                <!--/parte_variable-->
                                                <div class="parte_variable">
                                                    <div class="bloques_outer">
                                                        <div class="bloques wr_vista_btns">
                                                            <!-- aki botones vista previa -->
                                                            ...
                                                        </div>
                                                    </div>
                                                </div><!--/.parte_variable-->

                                            </div><!--/.bl_parte_c-->


                                            <div class="partes bl_parte_r">

                                                <div class="parte_fija">
                                                    <h4 class="h4_vista_previa">
                                                        <span>1. Vista actual:</span>
                                                        <button style="display: none;" id="btn_actions_ver_esquema" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_ver_esquema');" title="Acciones">
                                                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                        </button>
                                                    </h4>
                                                </div><!--/.parte_fija-->

                                                <!--/parte_variable-->
                                                <div class="parte_variable">
                                                    <div class="bloques_outer">
                                                        <div class="bloques wr_vista_blocks">
                                                            <!-- aki vista previa -->
                                                            ...
                                                        </div>
                                                    </div>
                                                    <div class="wr_btns_action" style="display: none;">
                                                        <!-- aki botones de reset y guardar -->
                                                        ...
                                                    </div>
                                                </div><!--/.parte_variable-->

                                            </div><!--/.bl_parte_r-->

                                        </div><!--/.vklads_inner-->

                                    </div><!--/.vklad_ver_esquema-->


                                    <div class="vklad_crear_esquema vklads" style="display: none;">
                                        <div class="vklads_inner bl_partes">

                                            <div class="partes bl_parte_l bl_active">

                                                <!--/parte_fija-->
                                                <div class="parte_fija">
                                                    <h4 class="h4_vista_previa">
                                                        <span>2. Crear esquema nueva</span>

                                                        <button style="display: none;" id="btn_actions_crear_esquema_l" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_crear_esquema_l');" title="Acciones">
                                                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                        </button>
                                                    </h4>
                                                </div><!--/.parte_fija-->

                                                <!--/parte_variable-->
                                                <div class="parte_variable">
                                                    <div class="bloques_outer">
                                                        <div class="bloques song_bloques">
                                                            <!-- aki bloques de la cancion -->
                                                            <p class="prim">Bloques únicos con las que se construye la canción</p>
                                                            <p class="prim">No has seleccionado la canción para crear su esquema. Selecciona una en la pestaña <b>'Buscar'</b> y luego haz click en el botón <b>'Crear esquema'</b> en la vista previa de la canción...</p>
                                                        </div>
                                                    </div>
                                                </div><!--/.parte_variable-->

                                            </div><!--/.bl_parte_l-->


                                            <div class="partes bl_parte_c">

                                                <!--/parte_fija-->
                                                <div class="parte_fija">
                                                    <h4>2. Esquema nueva</h4>
                                                </div><!--/.parte_fija-->

                                                <!--/parte_variable-->
                                                <div class="parte_variable">
                                                    <div class="bloques_outer">
                                                        <div class="bloques wr_vista_btns">
                                                            <!-- aki botones vista previa -->
                                                            ...
                                                        </div>
                                                        <div class="wr_esquema_actual">
                                                            <h5>Esquema actual:</h5>
                                                            <div class="bloques wr_vista_btns_actual">
                                                                <!-- aki vista previa -->
                                                                ...
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><!--/.parte_variable-->

                                            </div><!--/.bl_parte_c-->


                                            <div class="partes bl_parte_r">

                                                <div class="parte_fija">
                                                    <h4 class="h4_vista_previa">
                                                        <span>2. Vista nueva:</span>
                                                        <button style="display: none;" id="btn_actions_crear_esquema" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_crear_esquema');" title="Acciones">
                                                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                        </button>
                                                    </h4>
                                                </div><!--/.parte_fija-->

                                                <!--/parte_variable-->
                                                <div class="parte_variable">
                                                    <div class="bloques_outer">
                                                        <div class="bloques wr_vista_blocks">
                                                            <!-- aki vista previa -->
                                                            ...
                                                        </div>
                                                    </div>
                                                </div><!--/.parte_variable-->

                                            </div><!--/.bl_parte_r-->

                                        </div><!--/.vklads_inner-->

                                    </div><!--/.vklad_crear_esquema-->


                                    <div class="vklad_select_slide vklads" style="display: none;">
                                        <div class="vklads_inner bl_partes">

                                            <div class="partes bl_parte_l bl_active">

                                                <!--/parte_fija-->
                                                <div class="parte_fija">
                                                    <h4 class="h4_vista_previa">
                                                        <span>3. Diapositivas:</span>
                                                    </h4>
                                                </div><!--/.parte_fija-->

                                                <!--/parte_variable-->
                                                <div class="parte_variable">
                                                    <div class="bloques_outer">
                                                        <div class="bloques song_bloques">
                                                            <!-- aki bloques de la cancion -->
                                                            <p class="prim">Selecciona una diapositiva de las disponibles para mostrar</p>
                                                            <p class="prim">No has seleccionado la canción para mostrar su texto para el público. Selecciona una en la pestaña <b>'Buscar'</b> y luego haz click en el botón <b>'Pantalla'</b> en la vista previa de la canción...</p>
                                                        </div>
                                                    </div>
                                                </div><!--/.parte_variable-->

                                            </div><!--/.bl_parte_l-->


                                            <div class="partes bl_parte_c">

                                                <!--/parte_fija-->
                                                <div class="parte_fija">
                                                    <h4>3. Esquema actual:</h4>
                                                </div><!--/.parte_fija-->

                                                <!--/parte_variable-->
                                                <div class="parte_variable">
                                                    <div class="bloques_outer">
                                                        <div class="bloques wr_vista_btns">
                                                            <!-- aki vista previa -->
                                                            ...
                                                        </div>
                                                    </div>
                                                </div><!--/.parte_variable-->

                                            </div><!--/.bl_parte_c-->


                                            <div class="partes bl_parte_r">

                                                <!--parte_fija-->
                                                <div class="parte_fija">
                                                    <h4 class="h4_vista_previa">
                                                        <span>3. Diapositiva actual:</span>
                                                        <button class="btn" onclick="recargarMisReferenciasOCrear()">
                                                            <img class="btn_img_sm2" src="images/reload_white_32x32.png">
                                                        </button>
                                                    </h4>
                                                </div><!--/.parte_fija-->

                                                <!--/parte_variable-->
                                                <div class="parte_variable">
                                                    <div class="bloques_outer">
                                                        <div class="bloques wr_vista_blocks wr_full_block">
                                                            <div id="pantalla_body">
                                                                <div id="fondo_body" class="">
                                                                    <video id="videoFondo_body" src="" autoplay muted loop playsinline></video>
                                                                    <div id="contenedor_prev" class="shown">
                                                                        <div id="contenedor_prev_inner">
                                                                            <!-- aki vista previa -->
                                                                            <p class="prim">Aquí se mostrará el texto que verá el público en una ventana separada que tienes que abrir en el otro monitor, televisór o proyector. No has seleccionado la canción para mostrar su texto. Selecciona una en la pestaña <b>'Buscar'</b> y luego haz click en el botón <b>'Seleccionar diapositiva'</b> en la vista previa de la canción...</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><!--/.parte_variable-->

                                            </div><!--/.bl_parte_r-->

                                        </div><!--/.vklads_inner-->

                                    </div><!--/.vklad_select_slide-->

                                </div><!--/#block_esquema_body-->

                            </div><!--/#block_esquema-->





                            <!--#block_cancion-->
                            <div id="block_cancion" class="edit_blocks">

                                <div id="block_cancion_head" class="edit_blocks_head">

                                    <div class="block_option_y_action">

                                        <div class="wr_block_option">
                                            <div class="wr_block_option_inner">

                                                <button id="btn_song_editar" class="btn opt_edit" onclick="editar_song()">Editar</button>
                                                <button id="btn_song_eliminar" class="btn opt_edit" onclick="eliminar_song();">Eliminar</button>

                                                <div class="separador opt_edit"></div>

                                                <button id="btn_song_nueva" class="btn opt_nueva" onclick="nueva_song();">Nueva Canción</button>
                                            </div><!--/.wr_block_option_inner-->
                                        </div><!--/.wr_block_option-->

                                        <div class="wr_head_action">

                                            <div class="wr_dbtns_panels">

                                                <div class="dbtn_panel dbtn_panel_l active" onclick="hideShowPanel('block_cancion','l')">
                                                    <div class="pan2 p_l pan_side"></div>
                                                    <div class="pan2 p_r"></div>
                                                </div>

                                                <div class="dbtn_panel dbtn_panel_r active" onclick="hideShowPanel('block_cancion','r')">
                                                    <div class="pan2 p_l"></div>
                                                    <div class="pan2 p_r pan_side"></div>
                                                </div>

                                            </div><!--/.wr_panels-->

                                            <button class="btn btn_tmp d-none" onclick="toggleVistaFixed()">
                                                toggleVista
                                            </button>

                                            <button id="btn_actions_cancion" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_cancion');" title="Acciones">
                                                <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                            </button>
                                            <div id="bl_actions_cancion" class="bl_set bl_actions" style="display:none;">
                                                <div class="bl_set_inner bl_closed">
                                                    <div class="inner_content">

                                                        <div class="inner_content_head_body">
                                                            <div class="inner_content_head">
                                                                <div class="wr_title_btn_close">
                                                                    <span>Acciones con la canción:</span>
                                                                    <span class="sp_close">✕</span>
                                                                </div>
                                                            </div><!--/.inner_content_head-->

                                                            <div class="inner_content_body">
                                                                <ul class="ul_action">
                                                                    <p class="prim">Los botones de acciones se verán al selecionar la canción...</p>
                                                                </ul>
                                                            </div><!--/.inner_content_body-->
                                                        </div><!--/.inner_content_head_body-->

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div><!--/.block_option_y_action-->


                                    <!-- <div class="wr_lcr btns2">
                                        <div class="wr_lcr_inner">
                                            <div class="v_lcr v_lcr_l lcr_active" onclick="clickLCR(this,'l','block_cancion')">
                                                <div>Datos</div>
                                            </div>
                                            <div class="v_lcr v_lcr_r" onclick="clickLCR(this,'r','block_cancion')">
                                                <div>Vista</div>
                                            </div>
                                        </div>
                                        <div class="wr_lcr_line">
                                            <div class="lcr_line lines2 line_2l"></div>
                                        </div>
                                    </div> -->
                                    <!--/.wr_lcr-->

                                </div><!--/#block_cancion_head-->


                                <div id="block_cancion_body" class="edit_blocks_body">
                                    <div class="bl_partes">

                                        <div class="partes bl_parte_l bl_active">

                                            <!--/parte_fija-->
                                            <div class="parte_fija">
                                                <h4 class="h4_vista_previa">
                                                    <span>Canción:</span>
                                                    <!-- los botones guardar y vista previa -->
                                                </h4>
                                            </div><!--/.parte_fija-->

                                            <!--/parte_variable-->
                                            <div class="parte_variable">

                                                <div class="bloques_outer">
                                                    <div id="cancion_song_bloques" class="bloques song_bloques">
                                                        <!-- aki antes form -->
                                                        <p class="prim opt_prim">
                                                            Búsca la canción <button class="btn inline" onclick="showBlockName('buscar')">Buscar</button> o crea una nueva.
                                                        </p>
                                                    </div>
                                                </div>

                                            </div><!--/.parte_variable-->

                                        </div><!--/.bl_parte_l-->


                                        <div class="partes bl_parte_r vista_r">

                                            <!--/parte_fija-->
                                            <div class="parte_fija d-none">
                                                <h4 class="h4_vista_previa">
                                                    <span>Vista previa:</span>
                                                </h4>
                                            </div><!--/.parte_fija-->

                                            <!--/parte_variable-->
                                            <div class="parte_variable">

                                                <!-- experiment -->
                                                <div id="tema_block" class="vista_fixed tema_white">
                                                    <div class="vista_fixed_inner">

                                                        <div class="vista_fixed_head">

                                                            <div class="wr_hamburger3 shown" onclick="toggleMenuOver();">
                                                                <div id="hamburger3" class="hamburger">
                                                                    <span></span>
                                                                    <span></span>
                                                                    <span></span>
                                                                </div>
                                                            </div>

                                                            <button class="btn_actions no_visible" style="display: none;">&nbsp;</button>
                                                            <div id="d_state_drag_song" class="btn_actions" onclick="toggleDragSong();">
                                                                <img src="images/drag_left_right.png">
                                                            </div>

                                                            <div class="vp_titulo">
                                                                <div id="id_song_num">....</div>
                                                                <div id="id_song_pos">.. / ..</div>
                                                            </div>

                                                            <button class="d-none btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_lista');">
                                                                <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                            </button>

                                                            <div id="d_state_fullscreen" class="btn_actions" onclick="toggleFullscreen('.vista_fixed', this)">
                                                                <img src="images/icon_size_max.svg">
                                                            </div>

                                                            <button class="btn btn_vista_fixed_close" onclick="ocultarVistaFixed();">
                                                                <img src="images/x_white.png">
                                                            </button>

                                                        </div><!--/.vista_fixed_head-->


                                                        <div class="vista_fixed_body">

                                                            <div class="d_menu_over">

                                                                <div class="wr_btns_actualizar">
                                                                    <button class="btn btn_vista btn_song_refresh btn_refresh" onclick="refreshSong()">
                                                                        <img src="images/refresh.png" class="">
                                                                        <span>Actualizar</span>
                                                                    </button>
                                                                    <button class="btn btn_vista btn_song_guardar btn_refresh" onclick="guardarSong(this,'cancion_song_bloques','editar');">
                                                                        <img src="./images/guardar.png" class="">
                                                                        <span>Guardar</span>
                                                                    </button>
                                                                </div>

                                                                <div class="wr_btns_next_prev">
                                                                    <button class="btn" onclick="listaSongGo('prev')">
                                                                        <img src="images/arrow_chevron_left_white.svg">
                                                                    </button>
                                                                    <div id="aviso_lista_song" class="aviso_tmp"></div>
                                                                    <button class="btn" onclick="listaSongGo('next')">
                                                                        <img src="images/arrow_chevron_right_white.svg">
                                                                    </button>
                                                                </div>

                                                                <div class="wr_btns_f_inner">
                                                                    <div class="d_cat">
                                                                        <button class="btn" onclick="changeFontSize(-1)">A-</button>
                                                                        <button class="btn" onclick="changeFontSize(0)">A</button>
                                                                        <button class="btn" onclick="changeFontSize(1)">A+</button>
                                                                    </div>
                                                                    <div class="d_cat">
                                                                        <button class="btn" onclick="makeColumns(1)">|</button>
                                                                        <button class="btn" onclick="makeColumns(2)">||</button>
                                                                        <button class="btn" onclick="makeColumns(3)">|||</button>
                                                                        <button class="btn" onclick="makeColumns(4)">||||</button>
                                                                    </div>
                                                                    <div class="d_cat">
                                                                        <button id="btn_state_acordes" class="btn" onclick="toggleAcordes()">
                                                                            <img src="/song/images/music_note_on32x32.png">
                                                                        </button>
                                                                        <button id="btn_state_texto" class="btn" onclick="toggleTexto()">
                                                                            <img src="/song/images/text_on32x32.png">
                                                                        </button>
                                                                        <button id="btn_state_contenido_width" class="btn" onclick="toggleContenidoWidth()">
                                                                            <img src="/song/images/auto_width_off.png">
                                                                        </button>
                                                                    </div>
                                                                </div>



                                                            </div><!--/.d_menu_over-->

                                                            <div class="d_drag_over">
                                                                <div id="aviso_drag_lista_song" class="aviso_tmp"></div>
                                                            </div><!--/.d_drag_over-->

                                                            <div class="d_contenedor">
                                                                <div class="contenedor">
                                                                    <p class="prim">Para ver el texto de la canción, búscala en la pestaña <b>Buscar</b> o selecciona una canción desde una lista en la pestaña <b>Lista</b>.</p><!-- aki los fieldset -->
                                                                </div><!--/.d_contenedor-->
                                                            </div><!--/.d_contenedor-->

                                                        </div><!--/.vista_fixed_body-->

                                                    </div><!--/.vista_fixed_inner-->
                                                </div><!--/.vista_fixed-->
                                                <!-- end experiment -->




                                                <div id="old_tema_block" class="bloques_outer tema_white" style="display:none;">
                                                    <div class="bloques wr_vista_blocks">
                                                        <!-- aki vista previa -->
                                                        <div class="contenedor">
                                                            <!-- aki los fieldset -->
                                                        </div>
                                                    </div>
                                                </div>


                                            </div><!--/.parte_variable-->

                                        </div><!--/.bl_parte_r-->

                                    </div><!--/.bl_partes-->

                                </div><!--/#block_cancion_body-->

                            </div><!--/#block_cancion-->




                            <!--#block_ejemplo-->
                            <div id="block_ejemplo" class="edit_blocks">

                                <div id="block_ejemplo_head" class="edit_blocks_head">

                                    <div class="block_option_y_action">

                                        <div class="wr_block_option">
                                            <div class="wr_block_option_inner">
                                                <button id="btn_ejemplo_ua" class="btn" onclick="showEjemplo('ua')">Укр.</button>
                                                <button id="btn_ejemplo_ru" class="btn" onclick="showEjemplo('ru')">Рус.</button>
                                                <button id="btn_ejemplo_es" class="btn" onclick="showEjemplo('es')">Esp.</button>
                                                <button id="btn_ejemplo_en" class="btn" onclick="showEjemplo('en')">Eng.</button>
                                            </div><!--/.wr_block_option_inner-->
                                        </div><!--/.wr_block_option-->

                                        <div class="wr_head_action">

                                            <div class="wr_dbtns_panels">

                                                <div class="dbtn_panel dbtn_panel_l active" onclick="hideShowPanel('block_ejemplo','l')">
                                                    <div class="pan2 p_l pan_side"></div>
                                                    <div class="pan2 p_r"></div>
                                                </div>

                                                <div class="dbtn_panel dbtn_panel_r active" onclick="hideShowPanel('block_ejemplo','r')">
                                                    <div class="pan2 p_l"></div>
                                                    <div class="pan2 p_r pan_side"></div>
                                                </div>

                                            </div><!--/.wr_panels-->

                                            <button id="btn_actions_ejemplo" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_ejemplo');" title="Acciones">
                                                <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                            </button>
                                            <div id="bl_actions_ejemplo" class="bl_set bl_actions" style="display:none;">
                                                <div class="bl_set_inner bl_closed">
                                                    <div class="inner_content">

                                                        <div class="inner_content_head_body">
                                                            <div class="inner_content_head">
                                                                <div class="wr_title_btn_close">
                                                                    <span>Acciones con la canción:</span>
                                                                    <span class="sp_close">✕</span>
                                                                </div>
                                                            </div><!--/.inner_content_head-->

                                                            <div class="inner_content_body">
                                                                <ul class="ul_action">
                                                                    <p class="prim">Los botones de acciones se verán al selecionar el ejemplo...</p>
                                                                </ul>
                                                            </div><!--/.inner_content_body-->
                                                        </div><!--/.inner_content_head_body-->

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div><!--/.block_option_y_action-->

                                    <div class="wr_lcr btns2">
                                        <div class="wr_lcr_inner">
                                            <div class="v_lcr v_lcr_l lcr_active" onclick="clickLCR(this,'l','block_ejemplo')">
                                                <div>Datos</div>
                                            </div>
                                            <div class="v_lcr v_lcr_r" onclick="clickLCR(this,'r','block_ejemplo')">
                                                <div>Vista</div>
                                            </div>
                                        </div>
                                        <div class="wr_lcr_line">
                                            <div class="lcr_line lines2 line_2l"></div>
                                        </div>
                                    </div><!--/.wr_lcr-->

                                </div><!--/#block_ejemplo_head-->


                                <div id="block_ejemplo_body" class="edit_blocks_body">
                                    <div class="bl_partes">

                                        <div class="partes bl_parte_l bl_active">

                                            <!--/parte_fija-->
                                            <div class="parte_fija">
                                                <H4>Ejemplo de canción:</H4>
                                            </div><!--/.parte_fija-->

                                            <!--/parte_variable-->
                                            <div class="parte_variable">
                                                <div class="bloques_outer">
                                                    <div class="bloques song_bloques">
                                                        <p class="prim">Aquí se colocará el ejemplo...</p>
                                                    </div>
                                                </div>
                                            </div><!--/.parte_variable-->

                                        </div><!--/.bl_parte_l-->


                                        <div class="partes bl_parte_r">

                                            <!--/parte_fija-->
                                            <div class="parte_fija">
                                                <h4 class="h4_vista_previa">
                                                    <span>Vista previa:</span>
                                                </h4>
                                            </div><!--/.parte_fija-->

                                            <!--/parte_variable-->
                                            <div class="parte_variable">
                                                <div class="bloques_outer">
                                                    <div class="bloques wr_vista_blocks">
                                                        <!-- aki vista previa -->
                                                        ...
                                                    </div>
                                                </div>
                                            </div><!--/.parte_variable-->

                                        </div><!--/.bl_parte_r-->

                                    </div><!--/.bl_partes-->

                                </div><!--/#block_ejemplo_body-->

                            </div><!--/#block_ejemplo-->





                            <!--#block_lista-->
                            <div id="block_lista" class="edit_blocks d-block">

                                <div id="block_lista_head" class="edit_blocks_head">

                                    <div class="block_option_y_action">

                                        <div class="wr_block_option">
                                            <div class="wr_block_option_inner">

                                                <button id="btn_lista_ver_sm" class="btn opt_edit" onclick="openModal('full','Lista actual',null,'buildLista',true, 'ver_sm');">Lista actual</button>
                                                <button id="btn_lista_sort" class="btn opt_edit" onclick="openModal('full','Ordenar lista',null,'buildLista',true, 'sort');">Ordenar</button>
                                                <button id="btn_lista_ver" class="btn opt_edit" onclick="openModal('full','Lista actual',null,'buildLista',true, 'ver');">Ver</button>
                                                <button id="btn_lista_editar" class="btn opt_edit" onclick="openModal('full','Editar lista',null,'buildLista',true, 'editar');">Editar</button>
                                                <button id="btn_lista_eliminar" class="btn opt_edit" onclick="openModal('full','Eliminar lista',null,'buildLista',true, 'eliminar');">Eliminar</button>

                                                <div class="separador opt_edit"></div>
                                                <button id="btn_lista_nueva" class="btn opt_nueva" onclick="openModal('full','Nueva Lista',null,'buildLista',true, 'nueva');">Nueva Lista</button>
                                            </div><!--/.wr_block_option_inner-->
                                        </div><!--/.wr_block_option-->

                                        <div class="wr_head_action">

                                            <div class="wr_dbtns_panels">

                                                <div class="dbtn_panel dbtn_panel_l active" onclick="hideShowPanel('block_lista','l')">
                                                    <div class="pan2 p_l pan_side"></div>
                                                    <div class="pan2 p_r"></div>
                                                </div>

                                                <div class="dbtn_panel dbtn_panel_r active" onclick="hideShowPanel('block_lista','r')">
                                                    <div class="pan2 p_l"></div>
                                                    <div class="pan2 p_r pan_side"></div>
                                                </div>

                                            </div><!--/.wr_panels-->

                                            <button class="btn btn_tmp d-none" onclick="toggleVistaFixed()">
                                                toggleVista
                                            </button>

                                            <button id="btn_actions_lista" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_lista');" title="Acciones">
                                                <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                            </button>

                                            <div id="bl_actions_lista" class="bl_set bl_actions" style="display:none;">
                                                <div class="bl_set_inner bl_closed">
                                                    <div class="inner_content">

                                                        <div class="inner_content_head_body">
                                                            <div class="inner_content_head">
                                                                <div class="wr_title_btn_close">
                                                                    <span>Escoge acción con la lista:</span>
                                                                    <span class="sp_close">✕</span>
                                                                </div>
                                                            </div><!--/.inner_content_head-->

                                                            <div class="inner_content_body">
                                                                <ul class="ul_action">
                                                                    <p class="prim">Los botones de acciones se verán al selecionar la lista...</p>
                                                                </ul>
                                                            </div><!--/.inner_content_body-->
                                                        </div><!--/.inner_content_head_body-->

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div><!--/.block_option_y_action-->

                                    <!-- <div class="wr_lcr btns2">
                                        <div class="wr_lcr_inner">
                                            <div class="v_lcr v_lcr_l lcr_active" onclick="clickLCR(this,'l','block_lista')">
                                                <div>Datos</div>
                                            </div>
                                            <div class="v_lcr v_lcr_r" onclick="clickLCR(this,'r','block_lista')">
                                                <div>Vista</div>
                                            </div>
                                        </div>
                                        <div class="wr_lcr_line">
                                            <div class="lcr_line lines2 line_2l"></div>
                                        </div>
                                    </div> -->
                                    <!--/.wr_lcr-->

                                </div><!--/#block_lista_head-->

                                <div id="block_lista_body" class="edit_blocks_body">
                                    <div class="bl_partes">

                                        <div class="partes bl_parte_l bl_active">

                                            <!--/parte_fija-->
                                            <div class="parte_fija">

                                                <H4>Buscar lista:</H4>
                                                <div class="wr_nav">
                                                    <div class="wr_inpt_x">
                                                        <input
                                                            id="inpt_find_lista"
                                                            class="inpt_vvod"
                                                            type="text"
                                                            placeholder="Введите слово или фразу для поиска..."
                                                            data-dic=""
                                                            value="2026">
                                                        <div class="clear_inpt" onclick="clear_inpt('find_lista')">&times;</div>
                                                    </div>

                                                    <button id="btn_ok_find_lista" class="btn btn_search" title="Buscar" onclick="findWordsLista()">
                                                        <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
                                                    </button>

                                                    <button id="btn_find_lista_settings" class="btn btn_set btn_search" onclick="hideShowDiv('bl_find_lista_settings');" title="Ajustes">
                                                        <img class="btn_img posi-tion_row" src="./images/settings7_white.svg">
                                                    </button>

                                                </div><!--/.wr_nav-->

                                                <div id="bl_find_lista_settings" class="bl_set" style="display:none;">
                                                    <div class="bl_set_inner bl_closed">
                                                        <div class="inner_content">

                                                            <div class="inner_content_head_body">
                                                                <div class="inner_content_head">
                                                                    <div class="wr_title_btn_close">
                                                                        <span>Marca parametros de búsqueda:</span>
                                                                        <span class="sp_close">✕</span>
                                                                    </div>
                                                                </div><!--/.inner_content_head-->

                                                                <div class="inner_content_body">
                                                                    <h5>Modo de búsqueda:</h5>
                                                                    <div class="wr_sel_song m_0">
                                                                        <select id="modo_lista" class="sel_song">
                                                                            <option value="1">1) Todas las palabras (pueden ser parte de otras palabras, sin importar orden)</option>
                                                                            <option value="2">2) Todas las palabras (no pueden ser parte de otras palabras, sin importar orden)</option>
                                                                            <option value="3">3) Coincidir al menos una palabra</option>
                                                                            <option value="4">4) Palabras en el orden establecido</option>
                                                                            <option value="5">5) Frase exacta</option>
                                                                            <option value="6">6) Palabras exactas (no pueden ser parte de otras palabras, sin importar orden)</option>
                                                                        </select>
                                                                    </div>

                                                                    <h5>Campos de búsqueda:</h5>
                                                                    <div class="wr_sel_song">
                                                                        <select id="buscar_en_lista" class="sel_song">
                                                                            <option value="1">1) Todos los campos por defecto disponibles - (rápido)</option>
                                                                            <option value="2">2) Todos los campos disponibles, los títulos de canciones incluidos - (lento)</option>
                                                                            <option value="3">3) Todos los campos de texto disponibles</option>
                                                                            <option value="4">4) Sólo el título de lista</option>
                                                                            <option value="5">5) Sólo las notas de lista</option>
                                                                            <option value="6">6) Sólo el identificador de lista</option>
                                                                            <option value="7">7) Sólo la fecha de lista (introducir en formatos: aaaa-mm-dd, aaaa-mm, aaaa, mm, dd)</option>
                                                                        </select>
                                                                    </div>
                                                                </div><!--/.inner_content_body-->
                                                            </div><!--/.inner_content_head_body-->

                                                        </div>
                                                    </div>
                                                </div>

                                            </div><!--/.parte_fija-->

                                            <!--/parte_variable-->
                                            <div class="parte_variable">
                                                <div class="d_titulo_y_tabla">

                                                    <div id="titulo_tabla_lista" class="wr_titulo_tabla">
                                                        <h5 class="titulo_tabla">Listas encontradas: <b>...</b></h5>
                                                        <span id="sp_icon_filtro_lista" class="sp_filtro d-none" onclick="hideShowDesktopFilter(eid_d_filter_results_lista, this);">
                                                            <img class="btn_img" src="./images/icon_filter_white_22x22.svg">
                                                        </span>
                                                    </div>

                                                    <div id="d_filter_results_lista" class="contenedor_filter">
                                                        <div class="wr_nav">
                                                            <div class="wr_inpt_x">
                                                                <input
                                                                    id="inpt_filter_lista"
                                                                    class="inpt_vvod"
                                                                    type="text"
                                                                    placeholder="Введите слово или фразу для фильтра..."
                                                                    data-dic=""
                                                                    value="">
                                                                <div class="clear_inpt" onclick="clear_inpt('filter_lista')">&times;</div>
                                                            </div>
                                                        </div><!--/.wr_nav-->

                                                        <div class="filter_result" style="display: none;">
                                                            <div class="filter_result_inner">
                                                                <span>Filtrado:</span>
                                                                <span class="f_num">...</span>
                                                            </div>
                                                        </div>

                                                    </div><!--/#d_filter_results_lista-->



                                                    <div class="wr_tabla">
                                                        <div class="wr_tabla_inner">

                                                            <div id="bl_listas_finded" class="canciones_body">
                                                                <!-- aki los p de listas encontradas-->
                                                                <p class="prim">
                                                                    Búsca la lista o crea una nueva.
                                                                </p>
                                                            </div><!--/.canciones_body-->


                                                            <table style="display: none;">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="td_n">Nº</th>
                                                                        <th class="td_id_lista">Id</th>
                                                                        <th class="td_titulo">Título</th>
                                                                        <th class="td_dia_sem">Día/Sem.</th>
                                                                        <th class="td_fecha">Fecha</th>
                                                                        <th class="td_lista">Lista</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="td_n">...</td>
                                                                        <td class="td_id_lista">...</td>
                                                                        <td class="td_titulo">...</td>
                                                                        <td class="td_dia_sem">...</td>
                                                                        <td class="td_fecha">...</td>
                                                                        <td class="td_lista">...</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </div>

                                                </div><!--/.d_titulo_y_tabla-->
                                            </div><!--/.parte_variable-->

                                        </div><!--/.bl_parte_l-->

                                        <div class="partes bl_parte_r vista_r">

                                            <!--/parte_fija-->
                                            <div class="parte_fija">
                                                <h4 class="h4_vista_previa">
                                                    <span>Vista previa:</span>
                                                </h4>
                                            </div><!--/.parte_fija-->

                                            <!--/parte_variable-->
                                            <div class="parte_variable">
                                                <div class="bloques_outer">
                                                    <div class="bloques wr_vista_lista">

                                                        <div class="vista_head">
                                                            <button class="btn btn_vista_atras_head" onclick="ocultarTodasVistas();">
                                                                <img src="images/arrow_left2_white.svg">
                                                            </button>
                                                            <button class="btn_actions no_visible">&nbsp;</button>
                                                            <div class="vp_titulo">Vista (<b>Lista</b>)</div>
                                                            <button class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_lista');">
                                                                <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                            </button>
                                                            <button class="btn btn_vista_close_head" onclick="ocultarTodasVistas();">
                                                                <img src="images/x_white.png">
                                                            </button>
                                                        </div><!--/.vista_head-->

                                                        <div class="vista_lista_content">
                                                            <div class="d_info">
                                                                <p class="prim">Busca una lista de canciones introduciendo el texto en el campo '<b>Buscar</b>'...</p>
                                                                <p class="prim">(Aquí se mostrarán el título de la lista y sus canciones...)</p>
                                                            </div>
                                                        </div><!--/.vista_lista_content-->

                                                    </div>
                                                </div>
                                            </div><!--/.parte_variable-->

                                        </div><!--/.bl_parte_r-->

                                    </div><!--/.bl_partes-->

                                </div><!--/#block_lista_body-->

                            </div><!--/#block_lista-->





                        </div><!--/.bl_body-->

                    </div><!--/.bl_outer-->

                </div><!--/.inner-->
            </div><!--/.edit_body-->


        </div><!--/edit_contenido_inner-->
    </div><!--/edit_contenido--><!---->


    <!-- Modal -->
    <div id="myModal" class="modal">

        <!-- Modal Content -->
        <div id="myModalContent" class="modal-content">

            <div class="wr_modcont">

                <header id="modcont_header" class="elementos_modales">
                    <div class="inner">
                        <h4>
                            <span id="h4_text">aki modal content header</span>
                            <span class="close" onclick="closeModal(null,true)">&#10005;</span><!-- x -->
                        </h4>
                    </div>
                    <div id="bl_modalFilter">
                        <div id="bl_modalFilter_inner"></div>
                    </div>
                </header>

                <div id="modcont_body" class="elementos_modales">
                    <div class="inner">

                        <div id="bl_modalTop" class="body_bls" style="display:none;">
                            <div id="bl_modalTopInner">

                                <div id="topLogin" style="display: none;">
                                    <div id="topLoginInner">
                                    </div><!--/#topLoginInner-->
                                </div><!--/#topLogin-->

                                <div id="topMenu" style="display: none;">
                                    <div id="topMenuInner">
                                    </div><!--/#topMenuInner-->
                                </div><!--/#topMenu-->

                            </div><!--/#bl_modalTopInner-->
                        </div><!--/#bl_modalTop-->


                        <div id="bl_modalCenter" class="body_bls" style="display:none;">
                            <div id="bl_modalCenterInner">
                                ...
                            </div>
                        </div>


                        <div id="bl_modalBottom" class="body_bls" style="display:none;">
                            <div id="bl_modalBottomInner">
                                ...
                            </div>

                        </div>


                        <div id="bl_modalFull" class="body_bls" style="display:none;">
                            <div id="bl_modalFullInner" class="vyb_trans">
                                ...
                            </div>
                        </div>


                    </div><!--/inner-->
                </div><!--/modcont_body-->

                <footer id="modcont_footer" class="elementos_modales" style="display:none;">
                    <div class="inner">
                        <p>
                            <span class="close" onclick="closeModal(null,true)">&#10005;</span>
                            aki modal content footer
                        </p>
                    </div>
                </footer>

            </div><!--/wr_modcont-->

        </div><!--/myModalContent-->
    </div><!--/myModal-->





    <!-- Contenedor de Toasts - ventanas emergentes -->
    <div id="toast_container"></div>
    <!--/ contenedor de toasts -->


    <script src="js/s_config.js"></script>
    <script src="js/s_obj_lista.js"></script>
    <script src="js/s_obj_ejemplos_song.js"></script>
    <script src="js/s_song.js"></script>
    <script src="js/s_modal.js"></script>
    <script src="js/s_listen.js"></script>
    <script src="js/s_new.js"></script>
    <script src="js/s_old.js"></script>
    <script src="js/s_test.js"></script>

</body>

</html>