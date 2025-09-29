<?php
//es: song/index.php
//include('../includes/templates/check_auth.php');//antes (sin el enrutador en /index.php)
include __DIR__ . '/../includes/templates/check_auth.php';
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Song</title>
    <link rel="icon" type="image/png" href="../images/hs.png">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="./css/song.css">
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
        <div id="btn_lista_fix" class="shown" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver_sm');">
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

            <div class="edit_head">
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
                            <div class="dbtn" onclick="showBlockName(this.dataset.block_name)" data-block_name="buscar">Buscar</div>
                            <div class="dbtn" onclick="showBlockName(this.dataset.block_name)" data-block_name="esquema">Esquema</div>
                            <div class="dbtn" onclick="showBlockName(this.dataset.block_name)" data-block_name="cancion">Canción</div>
                            <div class="dbtn" onclick="showBlockName(this.dataset.block_name)" data-block_name="ejemplo">Ejemplo</div>
                            <div class="dbtn dbtn_active" onclick="showBlockName(this.dataset.block_name)" data-block_name="lista">Lista</div>
                        </div><!--/.bl_head-->
                        
                        <!--.bl_body-->
                        <div class="bl_body">


                            <!--/#block_buscar-->
                            <div id="block_buscar" class="edit_blocks">
                                
                                <div id="block_buscar_head" class="edit_blocks_head">

                                    <div class="block_option_y_action">
                                        
                                        <div class="wr_block_option">
                                            <div class="wr_block_option_inner">
                                                <p class="prim opt_prim">
                                                    Para ver los datos de la canción, búscala y selecciónala antes en esta pestaña o crea una nueva pulsando en <b>'Nueva Canción'</b>.
                                                </p>

                                                <button class="btn opt_edit" onclick="crearPages(); closeAll();">crearPages()</button>
                                                <button class="btn opt_edit">2.Ver algo...</button>
                                                <button class="btn opt_edit">3.Ver algo...</button>

                                                <div class="separador opt_edit"></div>
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


                                    <div class="wr_lcr btns2">
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
                                    </div><!--/.wr_lcr-->

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
                                                            value="zzz">
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
                                                                                <option value="5">5) Frase exacta</option>
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

                                                            <table>
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
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </div>

                                                </div><!--/.d_titulo_y_tabla-->
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
                                                    <div class="bloques wr_vista_song">
                                                        <div class="vista_song_content">
                                                            <div class="d_info">
                                                                <p class="prim">Busca una canción introduciendo el texto en el campo '<b>Buscar</b>'...</p>
                                                                <p class="prim">(Aquí se mostrará el texto de la canción...)</p>
                                                            </div>
                                                        </div>
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
                                                <p class="prim opt_prim">
                                                    Para ver el esquema de la canción, búscala y selecciónala antes en la pestaña <button class="btn inline" onclick="showBlockName('buscar')">Buscar</button>.
                                                </p>

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
                                                                            <span>Acciones con la canción:</span>
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
                                                                            <span>Acciones con la canción:</span>
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

                                                                        <div class="contenedor_sel_pantalla">
                                                                            <h4>Mostrar / Ocultar</h4>
                                                                            <div class="wr_sel_pantalla">
                                                                                <button class="btn" onclick="showTipoContent(this,'i')">Logo en Fondo</button>
                                                                                <button class="btn" onclick="showTipoContent(this,'l')">Títulos</button>
                                                                                <button class="btn" onclick="showTipoContent(this,'c')">Acordes</button>
                                                                                <button class="btn" onclick="showTipoContent(this,'n')">Sig. Diapositiva</button>
                                                                            </div>
                                                                        </div>

                                                                        <div class="contenedor_sel_pantalla">
                                                                            <h4>Control LOCAL</h4>
                                                                            <p>Mostrar la diapositiva en EL MISMO DISPOSITIVO:</p>
                                                                            <div class="wr_sel_pantalla">
                                                                                <button class="btn" onclick="window.open('pantalla.php','miPestañaText');">Pestaña Local (Text)</button>
                                                                                <button class="btn" onclick="window.open('pantalla.php','miVentanaText', 'width=800,height=600,top=100,left=100,resizable=yes,scrollbars=yes');">Ventana Local (Text)</button>
                                                                            </div>

                                                                            <div class="wr_sel_pantalla">
                                                                                <button class="btn" onclick="window.open('pantalla.php?t=cln','miPestañaAcordes');">Pestaña Local (Acordes)</button>
                                                                                <button class="btn" onclick="window.open('pantalla.php?t=cln','miVentanaAcordes', 'width=800,height=600,top=100,left=100,resizable=yes,scrollbars=yes');">Ventana Local (Acordes)</button>
                                                                            </div>
                                                                        </div> 


                                                                        <div class="contenedor_sel_pantalla">
                                                                            <h4>Control REMOTO</h4>
                                                                            <p>Mostrar la diapositiva en EL DISPOSITIVO REMOTO:</p>
                                                                            <p>Accede a: <a href="http://holy-songs.local/song/pantalla_bd.php" target="_blank">SOLO TEXTO</a></p>
                                                                            <p>Accede a: <a href="http://holy-songs.local/song/pantalla_bd.php?t=cln" target="_blank">TEXTO CON ACORDES</a></p>
                                                                            <div class="wr_sel_pantalla">
                                                                                <button class="btn" onclick="window.open('pantalla_bd.php','miPestañaBdText');">Pestaña Remota (Text)</button>
                                                                                <button class="btn" onclick="window.open('pantalla_bd.php','miVentanaBdText', 'width=800,height=600,top=100,left=100,resizable=yes,scrollbars=yes');">Ventana Remota (Text)</button>
                                                                            </div>

                                                                            <div class="wr_sel_pantalla">
                                                                                <button class="btn" onclick="window.open('pantalla_bd.php?t=cln','miPestañaBdAcordes');">Pestaña Remota (Acordes)</button>
                                                                                <button class="btn" onclick="window.open('pantalla_bd.php?t=cln','miVentanaBdAcordes', 'width=800,height=600,top=100,left=100,resizable=yes,scrollbars=yes');">Ventana Remota (Acordes)</button>
                                                                            </div>
                                                                        </div> 
                                                                        
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

                                                <div id="vklad_btn_pantallaShow" class="dbtn" title="Mostrar Pantalla" onclick="enableDisablePantallaShow()">
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
                                                        
                                                        <button style="display: none;" id="btn_actions_select_slide" class="btn btn_set btn_actions" onclick="hideShowDiv('bl_actions_select_slide');" title="Acciones">
                                                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                                                        </button>
                                                    </h4>
                                                </div><!--/.parte_fija-->                                                

                                                <!--/parte_variable-->
                                                <div class="parte_variable">
                                                    <div class="bloques_outer">
                                                        <div class="bloques wr_vista_blocks wr_full_block">
                                                            <div id="pantalla_body">
                                                                <div id="fondo_body" class="">
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
                                                <p class="prim opt_prim">
                                                    Para ver los datos de la canción, búscala y selecciónala antes en la pestaña <button class="btn inline" onclick="showBlockName('buscar')">Buscar</button> o crea una nueva pulsando en <b>'Nueva'</b>.
                                                </p>

                                                <button id="btn_song_ver" class="btn opt_edit" onclick="ver_song()">Ver</button>
                                                <button id="btn_song_editar" class="btn opt_edit" onclick="editar_song()">Editar</button>
                                                <button id="btn_song_eliminar" class="btn opt_edit" onclick="eliminar_song();">Eliminar</button>
                                                <button id="" class="btn opt_edit" onclick="alert('en desarrollo...')">Copiar texto...</button>
                                                
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

                                
                                    <div class="wr_lcr btns2">
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
                                    </div><!--/.wr_lcr-->

                                </div><!--/#block_cancion_head-->


                                <div id="block_cancion_body" class="edit_blocks_body">
                                    <div class="bl_partes">

                                        <div class="partes bl_parte_l bl_active">
                                            
                                            <!--/parte_fija-->
                                            <div class="parte_fija">
                                                <H4>Datos de la canción</H4>
                                            </div><!--/.parte_fija-->

                                            <!--/parte_variable-->
                                            <div class="parte_variable">

                                                <div class="bloques_outer">
                                                    <div id="cancion_song_bloques" class="bloques song_bloques">
                                                        <!-- aki antes form -->
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
                                                <p class="prim opt_prim">
                                                    Para ver los datos de la lista, búscala y selecciónala antes en esta pestaña o crea una nueva pulsando en <b>'Nueva'</b>.
                                                </p>

                                                <button id="btn_lista_ver_sm" class="btn opt_edit" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver_sm');">Ver (SM)</button>
                                                <button id="btn_lista_sort" class="btn opt_edit" onclick="openModal('full','Ordenar lista',null,'buildLista',true, 'sort');">Ordenar</button>
                                                <button id="btn_lista_ver" class="btn opt_edit" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver');">Ver</button>
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

                                    <div class="wr_lcr btns2">
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
                                    </div><!--/.wr_lcr-->

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
                                                            value="2025">
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

                                                            <table>
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
                                                        <div class="bloques wr_vista_lista">
                                                            <div class="vista_lista_content">
                                                                <div class="d_info">
                                                                    <p class="prim">Busca una lista de canciones introduciendo el texto en el campo '<b>Buscar</b>'...</p>
                                                                    <p class="prim">(Aquí se mostrarán el título de la lista y sus canciones...)</p>
                                                                </div>
                                                            </div>
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
    </div><!--/myModal--><!---->


    <!-- Contenedor de Toasts - ventanas emergentes -->
    <div id="toast_container"></div>
    <!--/ contenedor de toasts --><!---->


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