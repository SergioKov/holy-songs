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

<header>

    <div id="btn_menu" class="shown">
        <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>

    <div id="btn_lista_fix" class="shown" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver_sm');">
        <span>L</span>
    </div>

    <div id="menu_contenido">
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
                    <button id="btn_lista" class="btn" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver_sm');">Ver Lista</button>
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
    </div>

    <div id="puntosMenu">
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
    </div>



    <div class="barra_estado">
        <div class="steps_container">
            <div class="step" data-index="0">Instrucción:</div>
        </div>
    </div>

</header>


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
</div><!--/#carousel-->
    

<div id="calculando">Calculando el tamaño de texto.... <br>Espera.</div>


<div id="edit_contenido" class="shown">
    <div id="edit_contenido_inner">

        <div class="edit_head">
            <div class="inner">
                <h4>
                    <span class="bl_titulo">Editar</span>
                    <span class="close" onclick="hideEdit()">✕</span><!-- x -->
                </h4>                
            </div>
        </div><!--/.edit_body-->


        <div class="edit_body">
            <div class="inner">

                <div class="wr_head_body">
                    
                    <div class="bl_head">
                        <div class="dbtn" onclick="showBlockName(this.dataset.block_name)" data-block_name="buscar">Buscar</div>
                        <div class="dbtn" onclick="showBlockName(this.dataset.block_name)" data-block_name="esquema">Esquema</div>
                        <div class="dbtn" onclick="showBlockName(this.dataset.block_name)" data-block_name="cancion">Canción</div>
                        <div class="dbtn" onclick="showBlockName(this.dataset.block_name)" data-block_name="ejemplo">Ejemplo</div>
                        <div class="dbtn dbtn_active" onclick="showBlockName(this.dataset.block_name)" data-block_name="lista">Lista</div>
                    </div>

                    <div class="bl_body">


                        <div id="block_buscar" class="edit_blocks">
                            <div class="bl_partes">
                                
                                <div class="partes bl_parte_l">

                                    <H4>Selecciona canción</H4>

                                    <h5>Buscar:</h5>
                                    <div class="wr_nav">
                                        <div class="wr_inpt_x">
                                            <input
                                                id="inpt_find"
                                                type="text"
                                                placeholder="Введите слово или фразу для поиска..."
                                                data-dic=""
                                                va-lue="боже"
                                                value="zzz"
                                            >
                                            <div id="clear_inpt" onclick="clear_inpt('find')">&times;</div>
                                        </div>
                                        
                                        <button id="btn_ok_find" class="btn" title="Buscar" onclick="findWordsSong()">
                                            <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
                                        </button>

                                    </div><!--/.wr_nav-->


                                    <h5 style="display:none;">Filtrar en los títulos de canciones presentes en la tabla abajo:</h5>
                                    <div class="wr_nav" style="display:none;">
                                        <div class="wr_inpt_x">
                                            <input
                                                id="inpt_filter"
                                                type="text"
                                                placeholder="Введите слово или фразу для фильтра..."
                                                data-dic=""
                                                value=""
                                            >
                                            <div id="clear_inpt" onclick="clear_inpt('find')">&times;</div>
                                        </div>
                                        
                                        <button id="btn_ok_find" class="btn" title="Filtrar" onclick="findWordsNew(this.value)">
                                            <img class="btn_img" src="./images/icon_filter_white_22x22.svg"><!--Filtro-->
                                        </button>

                                    </div><!--/.wr_nav-->


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

                                    <h5 id="titulo_tabla_song" class="titulo_tabla">Canciones encontradas: <b></b></h5>
                                    <div class="wr_tabla">
                                        <div class="wr_tabla_inner">

                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th class="td_n">Nº</th>
                                                        <th class="td_id_song">id_song</th>
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

                                </div>

                                <div class="partes bl_parte_r">
                                    <h4>Vista previa</h4>

                                    <h5>Texto de la canción seleccionada:</h5>
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
                                        
                                    <div class="wr_btns_action">
                                        <p class="prim">Los botones de acciones se verán al selecionar la canción...</p>
                                    </div>
                                    

                                </div>
                            
                            </div>
                        </div><!--/#block_buscar-->


                        <div id="block_esquema" class="edit_blocks">
                            
                            <div id="block_esquema_head" class="edit_blocks_head">
                                <button id="btn_ver_esquema" class="btn" onclick="ver_esquema()">Ver esquema</button>
                                <button id="btn_crear_esquema" class="btn" onclick="crear_esquema()">Crear esquema</button>
                                <button id="btn_select_slide" class="btn" onclick="select_slide()">Select Slide</button>
                            </div>
                            
                            <div class="bl_partes">

                                <div class="partes bl_parte_l" style="width: 43%;">

                                    <H4>Esquema de la canción</H4>

                                    <h5>Bloques con las que se construye la canción:</h5>
                                    <div class="bloques_outer">
                                        <div class="bloques song_bloques">
                                            <!-- aki bloques de la cancion -->
                                             <p class="prim">No has seleccionado la canción para crear su esquema. Selecciona una en la pestaña <b>'Buscar'</b> y luego haz click en el botón <b>'Ver esquema'</b> o <b>'Crear esquema'</b> en la vista previa de la canción...</p>
                                        </div>
                                    </div>

                                </div>

                                <div class="partes bl_parte_c" style="width: 14%;">
                                    <h4>Esquema minimizada</h4>
                                    
                                    <h5>Nueva estructura corta:</h5>
                                    <div class="bloques_outer">
                                        <div class="bloques wr_vista_btns">
                                            <!-- aki vista previa -->
                                            ...
                                        </div>

                                        <div class="wr_esquema_actual" style="display: none;">
                                            <h5>Esquema actual corta:</h5>
                                            <div class="bloques wr_vista_btns_actual">
                                                <!-- aki vista previa -->
                                                ...
                                            </div>
                                        </div>
                                    </div>
                                
                                </div>

                                <div class="partes bl_parte_r" style="width: 43%;">
                                    <h4>Vista previa</h4>
                                    
                                    <h5>Nueva estructura de la canción:</h5>
                                    <div class="bloques_outer">
                                        <div class="bloques wr_vista_blocks">
                                            <!-- aki vista previa -->
                                            ...
                                        </div>
                                    </div>
                                    
                                    <div class="wr_btns_action">
                                        <!-- aki botones de reset y guardar -->
                                        ...
                                    </div>
                                
                                </div>
                            
                            </div>

                            

                        </div><!--/#block_esquema-->


                        <div id="block_cancion" class="edit_blocks">

                            <div id="block_cancion_head" class="edit_blocks_head">
                                <button id="btn_song_ver" class="btn" onclick="editar_song('ver')">Ver canción</button>
                                <button id="btn_song_editar" class="btn" onclick="editar_song('editar')">Editar canción</button>
                                <button id="btn_song_nueva" class="btn" onclick="nueva_song();">Nueva canción</button>
                                <button id="btn_song_eliminar" class="btn" onclick="eliminar_song();">Eliminar canción</button>
                                <button id="btn_" class="btn" onclick="alert('en desarrollo...')">Copiar texto...</button>
                            </div>

                            <div class="bl_partes">
                                
                                <div class="partes bl_parte_l">
                                    <H4>Datos de la canción</H4>

                                    <h5>Añade los datos de la nueva canción:</h5>
                                    <div class="bloques_outer">
                                        <div class="bloques song_bloques">

                                            <div class="puntos_def" style="display: block;">...</div>

                                            <div class="form_container" style="display: none;">
                                                <form>
                                                    
                                                    <p class="mensaje" data-dic="">
                                                        Rellena los campos del formulario con los datos de la nueva canción.
                                                    </p>
                                                    
                                                    <div class="form_group">
                                                        <input type="text" id="title" name="title" required="" placeholder=" ">
                                                        <label for="title">Título de la canción (o su primera frase)</label>
                                                    </div>

                                                    <div class="wr_sel_category select_container">
                                                        <select id="category" class="sel_opt" required="">
                                                            <option value="" disabled selected hidden></option>
                                                            <option value="1">1. Наприкінці церковного зібрання</option>
                                                            <option value="2">2. На рукопокладення</option>
                                                            <option value="3">3. Хрещення</option>
                                                            <option value="4">4. Перед церковним зібранням</option>
                                                            <option value="5">5. Біблійні історії</option>
                                                            <option value="6">6. Заклик до покаяння</option>
                                                            <option value="7">7. Діти та сім'я</option>
                                                            <option value="8">8. Християнська радість</option>
                                                            <option value="9">9. Різдво</option>
                                                            <option value="10">10. Церква</option>
                                                            <option value="11">11. Утіха та підбадьорення</option>
                                                            <option value="12">12. Рішучість і вірність</option>
                                                            <option value="13">13. Слідування за Христом</option>
                                                            <option value="14">14. Для новонавернених</option>
                                                            <option value="15">15. Похорон</option>
                                                            <option value="16">16. Бог, Його любов і велич</option>
                                                            <option value="17">17. Євангеліє</option>
                                                            <option value="18">18. Жнива</option>
                                                            <option value="19">19. Небесне житло</option>
                                                            <option value="20">20. Святий Дух</option>
                                                            <option value="21">21. Настанови та самоперевірка</option>
                                                            <option value="22">22. Ісус Христос</option>
                                                            <option value="23">23. Шлях віри, віра і надія</option>
                                                            <option value="24">24. Останні дні</option>
                                                            <option value="25">25. Любов</option>
                                                            <option value="26">26. Мама</option>
                                                            <option value="27">27. Новий рік</option>
                                                            <option value="28">28. Вечеря Господня</option>
                                                            <option value="29">29. Різне</option>
                                                            <option value="30">30. Практичне життя з Богом</option>
                                                            <option value="31" selected>31. Хвала і подяка</option>
                                                            <option value="32">32. Молитва</option>
                                                            <option value="33">33. Спасіння</option>
                                                            <option value="34">34. Духовна боротьба і перемога</option>
                                                            <option value="35">35. Страждання і смерть Христа</option>
                                                            <option value="36">36. Захід / Схід сонця</option>
                                                            <option value="37">37. Воскресіння Христа</option>
                                                            <option value="38">38. Слово Боже</option>
                                                            <option value="39">39. Заклик до праці</option>
                                                            <option value="40">40. Друге пришестя Христа і суд</option>
                                                            <option value="41">41. Час</option>
                                                            <option value="42">42. Різні християнські свята</option>
                                                            <option value="43">43. Весілля</option>
                                                            <option value="44">44. Привітання та прощання</option>
                                                            <option value="45">45. Молодь</option>
                                                            <option value="46">46. Інструментальна</option>
                                                            <option value="47">47. Колискові</option>
                                                            <option value="48">48. Дитячі</option>
                                                            <option value="49">49. Табірні</option>
                                                            <option value="50">50. Зцілення</option>
                                                            <option value="51">51. Прощення</option>
                                                            <option value="52">52. В’їзд до Єрусалима</option>
                                                            <option value="53">53. Вознесіння Господнє</option>
                                                            <option value="54">54. Пасхальні</option>
                                                            <option value="55">55. Трійця</option>
                                                        </select>
                                                        <label for="category">Category</label>
                                                    </div>

                                                    <div class="wr_sel_category select_container">
                                                        <select id="songbook" class="sel_opt" required="">
                                                             <!-- se pintan los songbook aki desde bd -->
                                                        </select>
                                                        <label for="songbook">Пісенник (Збірник пісень)</label>
                                                    </div>

                                                    <div class="wr_group">

                                                        <div class="form_group wr_id_song">
                                                            <input type="number" id="id_song" name="id_song" required="" placeholder=" ">
                                                            <label for="id_song">Id</label>
                                                        </div>

                                                        <div class="form_group wr_song_number">
                                                            <input type="text" id="song_number" name="song_number" maxlength="6" pattern="\d*" inputmode="numeric" required placeholder=" ">
                                                            <label for="song_number">Número</label>
                                                        </div>
                                                        
                                                        <div class="form_group wr_tune select_container">
                                                            <select id="tune" class="sel_opt" required="">
                                                                <option value="" disabled selected hidden></option>
                                                                <option value="C">C</option>
                                                                <option value="C#">C#</option>
                                                                <option value="Db">Db</option>
                                                                <option value="D">D</option>
                                                                <option value="D#">D#</option>
                                                                <option value="Eb">Eb</option>
                                                                <option value="E">E</option>
                                                                <option value="F">F</option>
                                                                <option value="F#">F#</option>
                                                                <option value="Gb">Gb</option>
                                                                <option value="G">G</option>
                                                                <option value="G#">G#</option>
                                                                <option value="Ab">Ab</option>
                                                                <option value="A">A</option>
                                                                <option value="A#">A#</option>
                                                                <option value="Bb">Bb</option>
                                                                <option value="H">H</option>
                                                            </select>
                                                            <label for="tune">Tonalidad</label>
                                                        </div>

                                                        <div class="form_group wr_lang">
                                                            <select id="lang" class="sel_opt" required="">
                                                                <option value="" disabled selected hidden></option>
                                                                <option value="ua">Українська</option>
                                                                <option value="ru">Русский</option>
                                                                <option value="es">Español</option>
                                                                <option value="en">English</option>
                                                            </select>
                                                            <label for="lang">Idioma</label>
                                                        </div>

                                                    </div>

                                                    <div class="form_group">
                                                        <textarea id="song_text" name="song_text" rows="25" required="" placeholder=" "></textarea>
                                                        <label class="lab_textarea" for="song_text">Texto de la canción</label>
                                                    </div>

                                                    <div class="form_group">
                                                        <textarea id="notes" name="notes" rows="3" required="" placeholder=" "></textarea>
                                                        <label class="lab_textarea" for="notes">Notas (apuntes personales)</label>
                                                    </div>


                                                    <div class="wr_btns_form">
                                                        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
                                                        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarSong(event)">Guardar</button>
                                                    </div>

                                                </form>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                <div class="partes bl_parte_r">
                                    <h4>Vista previa de la canción</h4>
                                    
                                    <h5>Estructura (bloques) de la canción:</h5>
                                    <div class="bloques_outer">
                                        <div class="bloques wr_vista_blocks">
                                            <!-- aki vista previa -->
                                            ...
                                        </div>
                                    </div>
                                    
                                    <div class="wr_btns_action">
                                        <!-- aki botones de reset y guardar -->
                                         ...                                        
                                    </div>

                                </div>
                            
                            </div>

                        </div><!--/#block_cancion-->


                        <div id="block_ejemplo" class="edit_blocks">
                            
                            <div id="block_ejemplo_head" class="edit_blocks_head">
                                <button id="btn_ejemplo_ua" class="btn" onclick="showEjemplo('ua')">Приклад (Укр.)</button>
                                <button id="btn_ejemplo_ru" class="btn" onclick="showEjemplo('ru')">Пример (Рус.)</button>
                                <button id="btn_ejemplo_es" class="btn" onclick="showEjemplo('es')">Ejemplo (Esp.)</button>
                                <button id="btn_ejemplo_en" class="btn" onclick="showEjemplo('en')">Example (Eng.)</button>
                            </div>

                            <div class="bl_partes">
                                
                                <div class="partes bl_parte_l">
                                    <H4>Ejemplo de canción</H4>

                                    <h5>Consulta la manera de escribir los bloques de la canción:</h5>
                                    <div class="bloques_outer">
                                        <div class="bloques song_bloques">

                                            <div class="puntos_def" style="display: block;">...</div>

                                            <div class="form_container" style="display: none;">
                                                <form>
                                                    
                                                    <p class="mensaje" data-dic="">
                                                        Ejemplo de cómo rellenar el campo de texto de la canción.
                                                    </p>
                                                    
                                                    <div class="form_group">
                                                        <textarea id="song_text_ejemplo" name="song_text" rows="25" required="" placeholder=" "></textarea>
                                                        <label class="lab_textarea" for="song_text_ejemplo">Texto de la canción</label>
                                                    </div>

                                                </form>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                <div class="partes bl_parte_r">
                                    <h4>Vista previa del ejemplo</h4>
                                    
                                    <h5>Estructura (bloques) de la canción:</h5>
                                    <div class="bloques_outer">
                                        <div class="bloques wr_vista_blocks">
                                            <!-- aki vista previa -->
                                            ...
                                        </div>
                                    </div>
                                    
                                </div>
                            
                            </div>





                        </div><!--/#block_ejemplo-->


                        <div id="block_lista" class="edit_blocks d-block">
                            
                            <div id="block_lista_head" class="edit_blocks_head">
                                <button id="btn_lista_ver" class="btn" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver_sm');">Ver (SM)</button>
                                <button id="btn_lista_ver" class="btn" onclick="openModal('full','Ordenar lista',null,'buildLista',true, 'sort');">Ordenar</button>
                                <button id="btn_lista_ver" class="btn" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver');">Ver</button>
                                <button id="btn_lista_editar" class="btn" onclick="openModal('full','Editar lista',null,'buildLista',true, 'editar');">Editar</button>
                                <button id="btn_lista_nueva" class="btn" onclick="openModal('full','Nueva lista',null,'buildLista',true, 'nueva');">Nueva lista</button>
                                <button id="btn_lista_nueva" class="btn" onclick="openModal('full','Eliminar lista',null,'buildLista',true, 'eliminar');">Eliminar</button>
                            </div>

                            <div class="bl_partes">
                                
                                <div class="partes bl_parte_l">

                                    <H4>Selecciona lista</H4>

                                    <h5>Buscar en la base de datos:</h5>
                                    <div class="wr_nav">
                                        <div class="wr_inpt_x">
                                            <input
                                                id="inpt_find_lista"
                                                type="text"
                                                placeholder="Введите слово или фразу для поиска..."
                                                data-dic=""
                                                value="2025"
                                            >
                                            <div id="clear_inpt" onclick="clear_inpt('find_lista')">&times;</div>
                                        </div>
                                        
                                        <button id="btn_ok_find_lista" class="btn" title="Buscar" onclick="findWordsLista()">
                                            <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
                                        </button>

                                    </div><!--/.wr_nav-->


                                    <h5>Selecciona modo de búsqueda:</h5>
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


                                    <h5 id="titulo_tabla_lista" class="titulo_tabla">Listas encontradas: <b></b></h5>
                                    <div class="wr_tabla">
                                        <div class="wr_tabla_inner">

                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th class="td_n">Nº</th>
                                                        <th class="td_id_lista">id_lista</th>
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

                                </div>

                                <div class="partes bl_parte_r">
                                    <h4>Vista previa</h4>

                                    <h5>Datos de la lista seleccionada:</h5>
                                    <div class="bloques_outer">                                    
                                        <div class="bloques wr_vista_song">
                                            <div class="vista_song_content">
                                                <div class="d_info">
                                                    <p class="prim">Busca una lista de canciones introduciendo el texto en el campo '<b>Buscar</b>'...</p>
                                                    <p class="prim">(Aquí se mostrarán el título de la lista y sus canciones...)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        
                                    <div class="wr_btns_action">
                                        <p class="prim">Los botones de acciones se verán al selecionar la lista...</p>
                                    </div>
                                    

                                </div>
                            
                            </div>
                        </div><!--/#block_lista-->


                    </div><!--/.bl_body-->

                </div>

            </div>
        </div><!--/.edit_body-->


    </div><!--/edit_contenido_inner-->
</div><!--/edit_contenido-->



<!-- The Modal -->
<div id="myModal" class="modal">

    <!-- Modal Content -->
    <div id="myModalContent" class="modal-content">

        <div class="wr_modcont">

        <header id="modcont_header">
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

        <div id="modcont_body">
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

        <footer id="modcont_footer" style="display:none;">
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


    
<script src="js/s_config.js"></script>
<script src="js/s_obj_lista.js"></script>
<script src="js/s_obj_ejemplos_song.js"></script>
<script src="js/s_song.js"></script>
<script src="js/s_modal.js"></script>
<script src="js/s_listen.js"></script>
<script src="js/s_new.js"></script>
<script src="js/s_test.js"></script>

</body>
</html>
