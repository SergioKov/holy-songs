function openModal(param = null, headerTitle = null, htmlTrans = null, action = null, modalFadeIn = true, args = null){
    console.log('=== function openModal() ===');
    console.log(`param: ${param} --- headerTitle: ${headerTitle}`); 
    console.log(`args:`, args); 
    
    //Reset
    eid_myModalContent.removeAttribute('class');
    eid_myModalContent.classList.add('modal-content');
    eid_modcont_body.removeAttribute('class');//reset    

    if(modalFadeIn){
        eid_myModal.style.display = "block";
        eid_myModal.style.opacity = 0;//start efecto fade
        setTimeout(()=>{
            eid_myModal.style.opacity = 1;//end efecto fade
        },10);
    }else{
        eid_myModal.style.display = "block";
        eid_myModal.style.opacity = 1;//start efecto fade
    }
 
    Array.from(document.querySelectorAll('.body_bls')).forEach((el,i)=>{
        el.style.display = 'none';
    });

    eid_bl_modalCenterInner.innerHTML = '';
    eid_bl_modalBottomInner.innerHTML = '';
    eid_bl_modalFullInner.innerHTML = '';
    //reset_spFiltro();

    mySizeModal();//IMPORTANTE!!! ajusta el modal al tamaño de la pantalla
    


    //Tipos de ModalContent
    switch (param) {

        //Меню
        case 'top':
            eid_modcont_body.style.overflow = 'auto';//habilita scroll  
            eid_modcont_body.classList.add('theme_grey');   
            //eid_h4_text.innerHTML = headerTitle;//'Меню';
            //eid_btn_sp_atras.style.display = 'none'; //mo muestro flecha atras
            eid_myModal.style.paddingTop = '0px';
            eid_myModalContent.classList.add('modalContentTop');
            eid_bl_modalTop.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentTop .wr_modcont').classList.add('mooved');
            },10);

            let eid_topLogin = document.getElementById('topLogin');
            let eid_topMenu = document.getElementById('topMenu');

            switch (action) {
            
                case 'showLogin':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');  
                    eid_h4_text.innerHTML = headerTitle;//'Меню'; 
                    //console.log('aki llamar showLogin()');

                    // eid_topLogin.style.display = 'block';
                    // eid_topMenu.style.display = 'none';

                    //listenLoginFormInput();

                    buildForm();
                    //showLogin(htmlTrans, param);
                    break;

                case 'showMenu':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');  
                    eid_h4_text.innerHTML = headerTitle;//'Меню'; 

                    buildMenu();                   
            
            
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //pendiente de desarrollo
        case 'center':
            eid_h4_text.innerHTML = headerTitle;//'verse Меню';
            //eid_btn_sp_atras.style.display = 'none';//?
            eid_myModal.style.paddingTop = '25vh';
            eid_myModalContent.classList.add('modalContentCenter');
            eid_bl_modalCenter.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentCenter .wr_modcont').classList.add('mooved');
            },10);
            

            switch (action) {
            
                case 'showAviso':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso()');
                    //alert('aki showAviso()');
                    showAviso(htmlTrans, param);//es arr_p_id en este caso
                    break;
                                
                case 'showAviso2'://se introduce objeto HTML (y no elemento.innerHTML como en 'showAviso')
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso2()');
                    //alert('aki showAviso2()');
                    showAviso2(htmlTrans, param);//es arr_p_id en este caso
                    break;
                                
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //pendiente de desarrollo
        case 'bottom':
            eid_h4_text.innerHTML = headerTitle;//'verse Меню';
            //eid_btn_sp_atras.style.display = 'none';//?
            eid_myModal.style.paddingTop = '50vh';
            eid_myModalContent.classList.add('modalContentBottom');
            eid_bl_modalBottom.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentBottom .wr_modcont').classList.add('mooved');
            },10);

            switch (action) {
                        
                case 'showAviso':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso()');
                    //alert('aki showAviso()');
                    showAviso(htmlTrans, param);//es arr_p_id en este caso
                    break;
                
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //Выбор модуля Библии из Избранных
        case 'full':
            //eid_btn_sp_atras.style.display = 'block';
            eid_myModal.style.paddingTop = '0vh';
            eid_myModalContent.classList.add('modalContentFull');
            eid_bl_modalFull.style.display = 'block';
            
            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentFull .wr_modcont')?.classList.add('mooved');
            },10);
            
            switch (action) {
            
                case 'showSong':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar showSong()');
                    //alert('hasta aki...');
                    buildTest();
                    //showSong();
                    break;
            
                case 'buildEsquema':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildEsquema()');
                    //alert('hasta aki...');
                    buildEsquema();
                    break;

                case 'buildLista':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildLista()');
                    // alert('hasta aki...');
                    let lista_action = args;
                    console.log('lista_action:', lista_action);

                    buildLista(lista_action);
                    break;

                case 'buildFormCancion':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildFormCancion()');
                    // alert('hasta aki...');
                    let contenedor = eid_bl_modalFullInner;//solo aki
                    let cancion_action = args;
                    console.log('contenedor:', contenedor);
                    console.log('cancion_action:', cancion_action);

                    buildFormCancion(contenedor, cancion_action);
                    break;

                case 'buildFormEjemplo':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildFormCancion()');
                    // alert('hasta aki...');
                    let contenedor_ejemplo = eid_bl_modalFullInner;//solo aki
                    let lang_ejemplo = args;
                    console.log('contenedor_ejemplo:', contenedor_ejemplo);
                    console.log('lang_ejemplo:', lang_ejemplo);

                    buildFormEjemplo(contenedor_ejemplo, lang_ejemplo);
                    break;
            
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;


        default:
            //console.log('---case default: nada---');
            break;
    }
}



// When the user clicks on <span> (x), close the eid_myModal
function closeModal(modal_head_text = null, click_fuera_o_x = false) {    
    let actual_h4_text = eid_myModal.querySelector('#h4_text').textContent;
    console.log('actual_h4_text: ',actual_h4_text);
    
    const ecl_mooved = document.querySelector('.mooved');

    if(ecl_mooved){
        let classList_new = Array.from(ecl_mooved.classList).filter(el => el != 'mooved');
        ecl_mooved.className = classList_new.join(' ');
    }

    if(modal_head_text == actual_h4_text || click_fuera_o_x){
        //console.log(`[if]. el titulo es igual. ${modal_head_text} == ${actual_h4_text}. o click_fuera_o_x -> Cierro modal.`);

        eid_myModal.style.opacity = 0;//start efecto fade
        setTimeout(()=>{
            eid_myModal.style.display = "none";
        },400);

    }else{
        //console.log(`[else] --- NO. el titulo no es igual. ${modal_head_text} != ${actual_h4_text}`);
        //no hago nada
    }

}

function mySizeModal(){
    console.log('=== function mySizeModal() ===');
    
    let modcont_body_max_h = 
      window.innerHeight 
    - eid_modcont_header.offsetHeight 
    //- (10 * 2)//10 es margin top y bottom de class '.inner'
    ;
    console.log('modcont_body_max_h: ', modcont_body_max_h);    
    eid_modcont_body.style.maxHeight = modcont_body_max_h + 'px';//comento para no duplicat
}



function buildTest(){//NO SE USA
    console.log('=== function buildTest() ===');

    eid_bl_modalFullInner.innerHTML = '';//reset

    const ejemplo_html = `
    
        <div class="wr_show">
            <div class="show_song_head">
                <button class="btn">Nueva canción</button>
                <button class="btn">Editar canción</button>
                <button class="btn">Eliminar canción</button>
                <button class="btn">Crear esquema</button>
            </div>
        </div>      
    `;

    const d_ejemplo = document.createElement('div');
    d_ejemplo.innerHTML = ejemplo_html;

    //eid_bl_modalFullInner.append(p);
    eid_bl_modalFullInner.append(d_ejemplo);
}


function buildEsquema(){//NO SE USA
    console.log('=== function buildEsquema() ===');

    eid_bl_modalFullInner.innerHTML = '';//reset

    const ejemplo_html = `
    
        <div class="wr_show">
            <div class="show_song_head">
                zxcvzxc
            </div>
            <div class="show_song_body">
                <p>algo...</p>                
            </div>
        </div>      
    `;

    const d_ejemplo = document.createElement('div');
    d_ejemplo.innerHTML = ejemplo_html;

    //eid_bl_modalFullInner.append(p);
    eid_bl_modalFullInner.append(d_ejemplo);
}












function buildFormCancion(contenedor, cancion_action = null){
    console.log('=== function buildFormCancion() ===');

    console.log('cancion_action: ', cancion_action);
    console.log('objSong: ', objSong);

    if(!contenedor){
        alert('no hay contenedor, hago return...');
        return;
    }

    let id_vstavka = '';
    if(contenedor.id == 'bl_modalFullInner'){
        id_vstavka = 'mod_';
    }


    //eid_bl_modalFullInner.innerHTML = '';//reset
    contenedor.innerHTML = '';//reset

    let mensaje_html = '';
    //let contenedor;//general. se asigna luego

    if(cancion_action !== 'nueva'){
        if(!hay_id_song('buildFormCancion()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ninguna canción.</p>
                <p class="p_aviso">Busca una canción introduciendo el texto en la pestaña <b>Buscar</b>.</p>
                <button id="btn_lista" class="btn btn_big w_100" onclick="closeModal(null,true); showEdit('Buscar');">Buscar</button>
            `;
            openModal('center','Aviso Lista',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_lista
        }
    }
  

    //Botones ELIMINAR - FORMULARIO
    const wr_btns_eliminar = document.createElement('div');
    wr_btns_eliminar.className = 'wr_btns_eliminar';
    wr_btns_eliminar.innerHTML = `
        <button class="btn btn_big" onclick="openModal('full','Editar Canción',null,'buildFormCancion',true, 'editar');">Editar</button>
        <button class="btn btn_big btn_eliminar" onclick="deleteSong(event, '${contenedor.id}');">Eliminar Canción DEFINITIVAMENTE</button>
    `;

    
    //Botones GUARDAR - FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarSong(event, '${contenedor.id}','${cancion_action}');">Guardar</button>
    `;


    //FORMULARIO
    const form_cancion = document.createElement('div');
    //form_cancion.id = 'form_cancion';
    form_cancion.className = 'form_cancion';
    form_cancion.innerHTML = `
        <div class="form_container">
            <form>
                
                <p class="mensaje"></p>

                <div class="form_group wr_title">
                    <input id="${id_vstavka}title" name="title" type="text" required="" placeholder=" ">
                    <label for="${id_vstavka}title">Título de la canción (o su primera frase)</label>
                </div>

                <div class="wr_sel_category select_container">
                    <select id="${id_vstavka}category" name="category" class="sel_opt" required="">
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
                    <label for="${id_vstavka}category">Category</label>
                </div>

                <div class="wr_sel_category select_container">
                    <select id="${id_vstavka}songbook" name="songbook" class="sel_opt" required="">
                        <!-- se pintan los songbook aki desde bd -->
                    </select>
                    <label for="${id_vstavka}songbook">Пісенник (Збірник пісень)</label>
                </div>

                <div class="wr_group">

                    <div class="form_group wr_id_song">
                        <input id="${id_vstavka}id_song" name="id_song" class="inpt_id_song" type="number" required="" placeholder=" ">
                        <label for="${id_vstavka}id_song">Id</label>
                    </div>

                    <div class="form_group wr_song_number">
                        <input id="${id_vstavka}song_number" name="song_number" type="text" maxlength="6" pattern="\d*" inputmode="numeric" required placeholder=" ">
                        <label for="${id_vstavka}song_number">Número</label>
                    </div>

                    <div class="form_group wr_tune select_container">
                        <select id="${id_vstavka}tune" name="tune" class="sel_opt" required="">
                            <option value="" disabled selected hidden></option>
                            <option value="C">C</option>
                            <option value="Cm">Cm</option>
                            <option value="C#">C#</option>
                            <option value="C#m">C#m</option>
                            <option value="Db">Db</option>
                            <option value="Dbm">Dbm</option>
                            <option value="D">D</option>
                            <option value="Dm">Dm</option>
                            <option value="D#">D#</option>
                            <option value="D#m">D#m</option>
                            <option value="Eb">Eb</option>
                            <option value="Ebm">Ebm</option>
                            <option value="E">E</option>
                            <option value="Em">Em</option>
                            <option value="F">F</option>
                            <option value="Fm">Fm</option>
                            <option value="F#">F#</option>
                            <option value="F#m">F#m</option>
                            <option value="Gb">Gb</option>
                            <option value="Gbm">Gbm</option>
                            <option value="G">G</option>
                            <option value="Gm">Gm</option>
                            <option value="G#">G#</option>
                            <option value="G#m">G#m</option>
                            <option value="Ab">Ab</option>
                            <option value="Abm">Abm</option>
                            <option value="A">A</option>
                            <option value="Am">Am</option>
                            <option value="A#">A#</option>
                            <option value="A#m">A#m</option>
                            <option value="Bb">Bb</option>
                            <option value="Bbm">Bbm</option>
                            <option value="H">H</option>
                            <option value="Hm">Hm</option>
                        </select>
                        <label for="${id_vstavka}tune">Tonalidad</label>
                    </div>

                    <div class="form_group wr_lang">
                        <select id="${id_vstavka}lang" name="lang" class="sel_opt" required="">
                            <option value="" disabled selected hidden></option>
                            <option value="ua">Українська</option>
                            <option value="ru">Русский</option>
                            <option value="es">Español</option>
                            <option value="en">English</option>
                        </select>
                        <label for="${id_vstavka}lang">Idioma</label>
                    </div>

                </div>

                <div class="form_group">
                    <textarea id="${id_vstavka}song_text" name="song_text" rows="25" required="" placeholder=" "></textarea>
                    <label for="${id_vstavka}song_text" class="lab_textarea">Texto de la canción</label>
                </div>
                
                <!-- Esquema -->
                <div class="d_esquema_titulos parte_lista"></div>

                <div class="form_group">
                    <textarea id="${id_vstavka}notes" name="notes" rows="3" required="" placeholder=" "></textarea>
                    <label for="${id_vstavka}notes" class="lab_textarea">Notas (apuntes personales)</label>
                </div>

            </form>
        </div>     
    `;


    const form = form_cancion.querySelector('form');


    switch (cancion_action) {
        case 'nueva'://Nueva lista
            mensaje_html = `
                <span>Canción <b class="c_blue">NUEVA</b>.</span>
            `;
            id_song = null;
            form_cancion.querySelector('.mensaje').innerHTML = mensaje_html;
            form.reset();//reseteo formulario
            form.elements["id_song"].disabled = true;//deshabilito input id_song   
            form.querySelector('.wr_id_song').style.display = 'none';//oculto el wr_id_song
            
            pintSongbooksOptions(form.elements['songbook']); 
            
            //2. escucho al cambiar el texto...
            form.elements['song_text'].oninput = (e) => {
                handleFormInput(e, eid_block_cancion);
            }           
            break;
                    
        default:
        case 'ver'://Ver Cancion - FORMULARIO
        case 'editar'://Editar Cancion - FORMULARIO
        case 'eliminar'://Eliminar Cancion - FORMULARIO
            mensaje_html = `
                <span class="sp_id">
                    <span>Id: <b class="c_green">${id_song}</b></span>
                    <span><b class="actual">(ACTUAL)</b></span>
                </span>
            `;
            form.querySelector('.mensaje').innerHTML = mensaje_html;

            pintSongbooksOptions(form.elements['songbook']);   
            
            // cancion_song_bloques.querySelector('.puntos_def').style.display = 'none';//oculto '...'
            // cancion_form_container.style.display = 'block';//mostrar formulario de canción



            form.reset();//reseteo formulario    
            
            form.elements['title'].value = objSong.title || '';
            form.elements['category'].value = objSong.category || '';
            form.elements['songbook'].value = objSong.songbook || '';
            form.elements['id_song'].value = objSong.id_song;
            form.elements['id_song'].disabled = true;//deshabilito input id_song
            form.querySelector('.wr_id_song').style.display = 'block';//muestro el wr_id_song
            form.elements['song_number'].value = objSong.song_number || '';
            form.elements['tune'].value = objSong.tune || '';
            form.elements['lang'].value = objSong.lang;
            form.elements['song_text'].value = objSong.song_text || '';
            form.elements['notes'].value = objSong.notes || '';

            //1. importante para que pinte bloques al añadir form (si hacer oninput)
            handleFormInput(form.elements['song_text'], eid_block_cancion);

            //2. escucho al cambiar el texto...
            form.elements['song_text'].oninput = (e) => {
                handleFormInput(e, eid_block_cancion);
            }

            buildEsquemaSoloTitulos(form.querySelector('.d_esquema_titulos'), objSong.arr_esquema);             
            break;
    }

    if(['ver'].includes(cancion_action)){
        //no apendo nada;
        makeInputsDisabled(form_cancion, true);//deshabilito los inputs
    }else if(['nueva','editar'].includes(cancion_action)){
        form_cancion.querySelector('form').append(wr_btns_form);
        if(['nueva'].includes(cancion_action)){
            makeInputsDisabled(form_cancion, false);//habilito los inputs
        }
    }else if(['eliminar'].includes(cancion_action)){
        form_cancion.querySelector('form').append(wr_btns_eliminar);
        makeInputsDisabled(form_cancion, true);//deshabilito los inputs
    }

    //añado al DOM
    // eid_bl_modalFullInner.append(form_cancion);
    contenedor.append(form_cancion);

    console.log('fin func --- buildFormCancion');
}




function buildFormEjemplo(contenedor, lang){
    console.log('=== function buildFormEjemplo() ===');

    //console.log('cancion_action: ', cancion_action);
    //console.log('objSong: ', objSong);

    if(!contenedor){
        alert('no hay contenedor, hago return...');
        return;
    }

    if(!lang){
        alert('no hay lang, hago return...');
        return;
    }

    let id_vstavka = '';
    if(contenedor.id == 'bl_modalFullInner'){
        id_vstavka = 'mod_ej_';
    }


    //eid_bl_modalFullInner.innerHTML = '';//reset
    contenedor.innerHTML = '';//reset

    let mensaje_html = '';

    //FORMULARIO
    const form_ejemplo = document.createElement('div');
    //form_ejemplo.id = 'form_ejemplo';
    form_ejemplo.className = 'form_ejemplo';
    form_ejemplo.innerHTML = `
        <div class="form_container">
            <form>
                
                <p class="mensaje">Ejemplo de cómo rellenar el campo de texto de la canción.</p>

                <div class="form_group">
                    <textarea id="${id_vstavka}song_text_ejemplo" name="song_text_ejemplo" rows="140" required="" placeholder=" "></textarea>
                    <label for="${id_vstavka}song_text_ejemplo" class="lab_textarea">Texto de la canción</label>
                </div>

            </form>
        </div>     
    `;


    const form = form_ejemplo.querySelector('form');
    form.reset();//reseteo formulario
    form.elements['song_text_ejemplo'].value = obj_ejemplos_song[lang];    

    //1. importante para que pinte bloques al añadir form (si hace oninput)
    handleFormInput(form.elements['song_text_ejemplo'], eid_block_ejemplo);

    //2. escucho al cambiar el texto...
    form.elements['song_text_ejemplo'].oninput = (e) => {
        console.log('654 - song_text_ejemplo.oninput()... ');
        handleFormInput(e, eid_block_ejemplo);
    }

    //añado al DOM
    contenedor.append(form_ejemplo);

    console.log('fin func --- buildFormEjemplo');
}














function buildLista(lista_action = null){
    console.log('=== function buildLista() ===');

    console.log('lista_action: ', lista_action);
    console.log('objLista: ', objLista);

    eid_bl_modalFullInner.innerHTML = '';//reset

    // Formato YYYY-MM-DD que necesita <input type="date">
    const fecha_hoy = new Date().toISOString().split("T")[0];

    let id_lista_val = '';
    let title_val = '';
    let diaSemana_val = '';
    let fecha_val = fecha_hoy;
    let notes_val = '';
    let mensaje_html = '';
    let arr_lista_bucle = [];
    let cl_id_lista = 'd-none';//oculto
    let texto_ordenar = '';
    let contenedor;//general. se asigna luego

    if(lista_action !== 'nueva'){
        if(!hay_id_lista('buildLista()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ninguna lista.</p>
                <p class="p_aviso">Crea una lista añadiéndo canciones o busca la lista según tus criterios en la pestaña <b>Lista</b>.</p>
                <button id="btn_lista" class="btn btn_big w_100" onclick="closeModal(null,true); showEdit('lista');">Buscar Lista</button>
            `;
            openModal('center','Aviso Lista',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_lista
        } 
        id_lista_val = objLista.id_lista;
        title_val = objLista.title;
        diaSemana_val = diaSemana(objLista.fecha);
        // fecha_val = convertirFecha(objLista.fecha, 'ver', '/');
        fecha_val = objLista.fecha_ver;//formato ya desde bd '03/08/2025'
        notes_val = objLista.notes;
        arr_lista_bucle = objLista.arr_lista;
    }

    switch (lista_action) {
        case 'nueva'://Nueva lista
            mensaje_html = `
                <span>Rellena los campos del formulario con los datos de la lista <b class="c_blue">NUEVA</b>.</span>
            `;
            arr_lista_bucle = arr_lista;
            console.log('(nueva) --- arr_lista_bucle: ', arr_lista_bucle);
            id_lista = null;
            break;

        case 'ver_sm'://Ver lista - SM => SMALL - vista
            console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_lista = '';//muestro
            break;
            
        case 'sort'://Ordenar (Sort) lista - SM => SMALL - vista
            console.log('(ordenar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_lista = '';//muestro
            texto_ordenar = 'Ordena la lista según tus preferencias arrastrando las canciones.';
            break;
        
        default:
        case 'ver'://Ver lista - FORMULARIO
        case 'editar'://Editar lista - FORMULARIO
            fecha_val = objLista.fecha;//formato correcto para el input '2025-08-03'
            mensaje_html = `
                <span class="sp_id">
                    <span>Id: <b class="c_green">${id_lista}</b></span>
                    <span><b class="actual">(ACTUAL)</b></span>
                </span>
            `;
            console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            break;

        case 'eliminar'://Eliminar lista - SM => SMALL - vista
            console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_lista = '';//muestro
            break;
    }
    

    //Botones GUARDAR - SM
    // const wr_btns_guardar = document.createElement('div');
    // wr_btns_guardar.className = 'wr_btns_guardar';
    // wr_btns_guardar.innerHTML = `
    //     <button class="btn btn_big" onclick="showEdit('lista'); closeModal(null,true);">Buscar Lista</button>
    //     <button class="btn btn_big" onclick="openModal('full','Editar lista',null,'buildLista',true, 'editar');">Editar lista</button>
    // `;

    //Botones ELIMINAR - SM
    const wr_btns_eliminar = document.createElement('div');
    wr_btns_eliminar.className = 'wr_btns_eliminar';
    wr_btns_eliminar.innerHTML = `
        <button class="btn btn_big" onclick="openModal('full','Editar lista',null,'buildLista',true, 'editar');">Editar lista</button>
        <button class="btn btn_big btn_eliminar" onclick="deleteLista();">Eliminar Lista DEFINITIVAMENTE</button>
    `;


    //para VER - SM
    const contenedor_lista_sm = document.createElement('div');
    contenedor_lista_sm.id = 'contenedor_lista_sm';
    contenedor_lista_sm.innerHTML = `                    
        <div class="parte_lista">
            <p class="p_sm ${cl_id_lista}">Id: <b>${id_lista_val}</b></p>
            <p class="p_sm">Titulo: <b>${title_val}</b></p>
            <p class="p_sm">Fecha: <b>${diaSemana_val} ${fecha_val}</b></p>
        </div>
        
        <!-- Aviso ordenar -->
        ${(lista_action == 'sort') ? '<div class="d_aviso_sort shown parte_lista">' + texto_ordenar + '</div>' : '' }</div>

        <!-- Canciones -->
        <div class="d_canciones_lista parte_lista"></div>

        ${ (notes_val) ? `<p class="p_sm ${ ((lista_action == 'eliminar') ? '' : 'parte_lista') }">Notas: <b>${notes_val}</b></p>` : '' }

        ${(lista_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;

    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarLista(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_lista = document.createElement('div');
    form_lista.id = 'form_lista';
    form_lista.innerHTML = `
        <div class="form_container">
            <form>
                
                <p class="mensaje" data-dic="">
                    ${mensaje_html}
                </p>

                <div class="form_group wr_title">
                    <input type="text" id="title" name="title" required="" placeholder=" " value="${title_val}">
                    <label for="title">Título de la lista</label>
                </div>

                <div class="form_group wr_fecha">
                    <input type="date" id="fecha" name="fecha" required="" placeholder=" " value="${fecha_val}">
                    <label for="title">Fecha del evento</label>
                </div>

                <!-- Canciones -->
                <div class="d_canciones_lista parte_lista"></div>

                <div class="form_group">
                    <textarea id="notes" name="notes" rows="3" required="" placeholder=" ">${notes_val}</textarea>
                    <label class="lab_textarea" for="notes">Notas (apuntes personales)</label>
                </div>

                ${ (['nueva','editar'].includes(lista_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;

    //Reasigno el contenedor
    if(['ver_sm','sort','eliminar'].includes(lista_action)){ 
        contenedor = contenedor_lista_sm;        
    }else{
        contenedor = form_lista;
        if(lista_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
    }

    if(lista_action == 'sort'){
        buildListaSort(contenedor.querySelector('.d_canciones_lista'), arr_lista_bucle); 
        setTimeout(() => {
            contenedor.querySelector('.d_aviso_sort').classList.remove('shown');
        }, 4000);
    }else{
        buildListaSoloSongs(contenedor.querySelector('.d_canciones_lista'), arr_lista_bucle);        
    }

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}



function buildListaSoloSongs(contenedor, arr_lista_bucle, sort = false){
    console.log('=== function buildListaSoloSongs() ===');

    contenedor.innerHTML = '';//reset - SIEMPRE
    
    const wr_p_lista = document.createElement('div');
    wr_p_lista.className = 'wr_p_lista';
    
    if(Array.isArray(arr_lista_bucle) && arr_lista_bucle.length > 0){
        
        //Head
        const d_canciones_head = document.createElement('div');
        d_canciones_head.className = 'canciones_head';
        d_canciones_head.innerHTML = `
            <span class="sp_canciones">Canciones:</span>
        `;
        wr_p_lista.append(d_canciones_head);

        if(!sort){
            const btn_action_ordenar = document.createElement('button');
            btn_action_ordenar.className = 'btn btn_action_ordenar';
            btn_action_ordenar.textContent = 'Ordenar';
            btn_action_ordenar.onclick = () => {
                openModal('full','Ordenar lista',null,'buildLista',true, 'sort');
            }        
            d_canciones_head.append(btn_action_ordenar);

            const btn_action_editar = document.createElement('button');
            btn_action_editar.className = 'btn btn_action_editar';
            btn_action_editar.textContent = 'Editar';
            btn_action_editar.onclick = () => {
                openModal('full','Editar lista',null,'buildLista',true, 'editar');
            }        
            d_canciones_head.append(btn_action_editar);
        }

        //Body
        const d_canciones_body = document.createElement('div');
        d_canciones_body.className = 'canciones_body';
        wr_p_lista.append(d_canciones_body);


        //Recorrer array
        arr_lista_bucle.forEach((item, i) => {
            console.log('item: ', item);

            const p = document.createElement('p');            

            if(item.id_song == lista_id_song){
                p.className = `p_lista active`;
            }else{
                p.className = `p_lista`;
            }

            p.dataset.id_song = item.id_song;
            // p.innerHTML = `
            //     <span class="l_n">${i + 1}.</span>
            //     <span class="l_title">${item.title}</span>
            //     <span class="l_tune">${item.tune || ''}</span>
            //     <span class="l_id">${item.id_song}</span>
            //     <span class="l_edit"><img src="images/icon_edit_white.svg"></span>
            //     <span class="btn_song_x" data-id_song_to_del="${item.id_song}">✕</span>
            // `;

            p.innerHTML = `
                <span class="wn_2_flex">
                    
                    <span class="sp_flex_btns">
                        <span class="l_tune">${item.tune || ''}</span>
                        <span class="l_id">${item.id_song}</span>
                        <span class="l_edit"><img src="images/icon_edit_white.svg"></span>
                        <span class="btn_song_x" data-id_song_to_del="${item.id_song}">✕</span>
                    </span>

                    <span class="sp_flex_n_title">
                        <span class="l_n">${i + 1}.</span>
                        <span class="l_title">${item.title}</span>
                    </span>

                </span>
            `;
            
            p.onclick = (e) => {
                lista_id_song = e.currentTarget.dataset.id_song;
                console.log('lista_id_song: ', lista_id_song);

                if(e.target.classList.contains('btn_song_x')){
                    //Eliminar canción de la lista
                    console.log('Eliminar canción de la lista. id_song: ', lista_id_song);
                    e.stopPropagation();//evita que se dispare el onclick del padre

                    eliminarSongDeLista(lista_id_song);

                }else if(e.target.closest('.l_edit')){
                    //Editar canción de la lista
                    console.log('Editar canción de la lista. id_song: ', lista_id_song);
                    e.stopPropagation();//evita que se dispare el onclick del padre

                    editSongOfLista(e, lista_id_song);

                }else{
                    crearSlidesForSongOfLista(e, lista_id_song);
                }
            }

            // wr_p_lista.append(p);
            d_canciones_body.append(p);
        });

        contenedor.append(wr_p_lista);        

    }else{//lista vacía
            
        const p = document.createElement('p');
        p.className = 'prim';
        p.innerHTML = `
            No hay canciones 
        `;
        wr_p_lista.append(p);

        const d_info = document.createElement('div');
        d_info.className = 'd_info';
        d_info.innerHTML = `
            <p class="prim">
                Lista vacía 
            </p>
            <p class="prim">
                Para añadir canciones pincha en la canción deseada y añádela a la lista seleccionada. 
            </p>
            <button class="btn" onclick="showBlockName('buscar')">Buscar Canciones</button>
        `;

        contenedor.append(wr_p_lista);
    }

}

























function buildEsquemaSoloTitulos(contenedor, arr_esquema_bucle){
    console.log('=== function buildEsquemaSoloTitulos() ===');

    contenedor.innerHTML = '';//reset - SIEMPRE
    
    const wr_p_esquema = document.createElement('div');
    wr_p_esquema.className = 'wr_p_esquema';
            
    //Head
    const d_esquema_head = document.createElement('div');
    d_esquema_head.className = 'esquema_head';
    d_esquema_head.innerHTML = `
        <span>Esquema:</span>
        <div>
            <button class="btn btn_ver_esquema">Ver</button>
            <button class="btn btn_crear_esquema">Editar</button>
        </div>
    `;
    d_esquema_head.onclick = (e) => {
        e.preventDefault();
        console.log('click en esquema_head');

        if(e.target.closest('.btn_ver_esquema')){
            showEdit('esquema');
            showVklad(e.currentTarget,'ver_esquema');
        }
        
        if(e.target.closest('.btn_crear_esquema')){
            showEdit('esquema');
            showVklad(e.currentTarget,'crear_esquema');
        }
    }
    wr_p_esquema.append(d_esquema_head);


    //Body
    const d_esquema_body = document.createElement('div');
    d_esquema_body.className = 'canciones_body';
    wr_p_esquema.append(d_esquema_body);

    if(Array.isArray(arr_esquema_bucle) && arr_esquema_bucle.length > 0){

        //Recorrer array
        arr_esquema_bucle.forEach((item, i) => {
            console.log('item: ', item);

            if(i == 0){
                return;//no dejo mostrar '_titulo_cancion_'
            }

            const p = document.createElement('p');            
            p.className = 'p_esquema linea';

            let veces_html = '';
            if(item.veces > 1){
                veces_html = `<span class="veces">(x${item.veces})</span>`;
            }

            p.innerHTML = `
                <span class="titulo">${item.nombre}</span>
                ${veces_html}
            `;

            d_esquema_body.append(p);
        });

        contenedor.append(wr_p_esquema);        

    }else{//lista vacía
            
        const p = document.createElement('p');
        p.className = 'prim';
        p.innerHTML = `
            La esquema por efecto. <br>Las partes de la canción se verán tal cual como en el texto de la canción.
        `;
        d_esquema_body.append(p);

        contenedor.append(wr_p_esquema);
    }

} 




























function buildListaSort(contenedor, arr_lista_bucle){
    console.log('=== function buildListaSort() ===');
    made_draggable_once = false;//aki SIEPRE false

    contenedor.innerHTML = '';//reset - SIEMPRE
    
    const wr_p_lista = document.createElement('div');
    wr_p_lista.className = 'wr_p_lista';
    
    if(Array.isArray(arr_lista_bucle) && arr_lista_bucle.length > 0){
        
        //Head
        const d_canciones_head = document.createElement('div');
        d_canciones_head.className = 'canciones_head';
        d_canciones_head.innerHTML = `
            <span class="sp_canciones">Canciones:</span>
        `;
        wr_p_lista.append(d_canciones_head);
        
        const btn_action_ver = document.createElement('button');
        btn_action_ver.className = 'btn btn_action_ver';
        btn_action_ver.textContent = 'Ver';
        btn_action_ver.onclick = () => {
            openModal('full','Ver lista',null,'buildLista',true, 'ver_sm');
        }        
        d_canciones_head.append(btn_action_ver);

        const btn_action_editar = document.createElement('button');
        btn_action_editar.className = 'btn btn_action_editar';
        btn_action_editar.textContent = 'Editar';
        btn_action_editar.onclick = () => {
            openModal('full','Editar lista',null,'buildLista',true, 'editar');
        }        
        d_canciones_head.append(btn_action_editar);

        //Body
        const d_canciones_body = document.createElement('div');
        d_canciones_body.id = 'd_canciones_body_drag';
        d_canciones_body.className = 'canciones_body';
        wr_p_lista.append(d_canciones_body);


        //Recorrer array
        arr_lista_bucle.forEach((item, i) => {
            console.log('item: ', item);

            const p = document.createElement('p');
            p.draggable = true;
            
            if(item.id_song == lista_id_song){
                p.className = `p_lista p_drag draggable active`;
            }else{
                p.className = `p_lista p_drag draggable`;
            }

            p.dataset.id_song = item.id_song;
            p.innerHTML = `
                <span class="l_n">${i + 1}.</span>
                <span class="l_title">${item.title}</span>
                <span class="l_tune">${item.tune || ''}</span>
                <span class="l_id">${item.id_song}</span>
                <span class="l_drag">
                    <span></span>
                    <span></span>
                </span>
            `;

            // wr_p_lista.append(p);
            d_canciones_body.append(p);
        });

        contenedor.append(wr_p_lista);        

    }else{//lista vacía
            
        const p = document.createElement('p');
        p.className = 'prim';
        p.innerHTML = `
            No hay canciones 
        `;
        wr_p_lista.append(p);

        const d_info = document.createElement('div');
        d_info.className = 'd_info';
        d_info.innerHTML = `
            <p class="prim">
                Lista vacía 
            </p>
            <p class="prim">
                Para añadir canciones pincha en la canción deseada y añádela a la lista seleccionada. 
            </p>
            <button class="btn" onclick="showBlockName('buscar')">Buscar Canciones</button>
        `;

        contenedor.append(wr_p_lista);
    }

    setTimeout(() => {
        makeItemsDraggable('d_canciones_body_drag', 'p_drag');       
    }, 500);

}







async function getDataSongFromBd(){
    console.log('=== function getDataSongFromBd() ===');

    try {
        
        if(!hay_id_song('getDataSongFromBd()')){
            return; // <- se detiene aquí si no hay id_song
        } 
               
        const response = await fetch('obtener_song_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_song: id_song
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');

            let song_title = data.title; 
            let song_text = data.song_text; 
            // data.arr_esquema = (data.arr_esquema != '') ? JSON.parse(data.arr_esquema) : data.arr_esquema ; 
            data.arr_esquema = (esString(data.arr_esquema) && data.arr_esquema != '' && data.arr_esquema.length > 0) ? JSON.parse(data.arr_esquema) : [] ;// test arr vacio 

            console.log(`id_song: [${id_song}] --- song_title: [${song_title}] --- song_text: [${song_text}] --- data.arr_esquema: `, data.arr_esquema);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getSongById(): error.message: ', error.message);
    }
}


async function getDataListaFromBd(){
    console.log('=== function getDataListaFromBd() ===');

    try {
        
        if(!hay_id_lista('getDataListaFromBd()')){
            return; // <- se detiene aquí si no hay id_lista
        } 
               
        const response = await fetch('obtener_lista_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_lista: id_lista
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        let data;

        if(debug){
            data = await response.text();//test
        }else{
            data = await response.json();
        }
        console.log('data:', data);  
        
        if(data.success){
            console.log('success is true');

            let lista_title = data.title; 
            //data.arr_lista = (esString(data.arr_lista) && data.arr_lista != '' && data.arr_lista.length > 0) ? JSON.parse(data.arr_lista) : [] ;// test arr vacio 

            console.log(`id_lista: [${id_lista}] --- lista_title: [${lista_title}] --- data.arr_lista: `, data.arr_lista);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getDataListaFromBd(): error.message: ', error.message);
    }
}


async function getSongbooksFromBd(){//sacar TODOS los SongBooks para rellenar el <select></select>
    console.log('=== function getSongbooksFromBd() ===');

    try {
        
        // if(!hay_id_song('getDataSongFromBd()')){
        //     return; // <- se detiene aquí si no hay id_song
        // } 
               
        const response = await fetch('obtener_songbooks_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                tipo_consulta: 'todo'//sacar todos los datos
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');
            console.log(`data.arr_songbooks: `, data.arr_songbooks);
            
            objSongbooksBd = data.arr_songbooks; //asigno a variable global
            console.log(`objSongbooksBd: `, objSongbooksBd);

            return objSongbooksBd;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getSongbooksFromBd(): error.message: ', error.message);
    }
}




async function getDataSongsFromBdByFind(objFindParams){
    console.log('=== function getDataSongsFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en, arr_songbooks_search} = objFindParams;

    try {
        
        if(!words_input){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }
               
        const response = await fetch('obtener_song_by_find.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                words_input,
                arr_songbooks_search,
                modo,
                buscar_en
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log('data: ', data);  
        
        if(data.success){
            console.log('success is true');

            let arr_data = data.arr_data;
            //console.log(`arr_data: `, arr_data);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getDataSongsFromBdByFind(): error.message: ', error.message);
    }
}


async function getDataListasFromBdByFind(objFindListaParams){
    console.log('=== function getDataListasFromBdByFind(objFindListaParams) ===');

    let {words_input, modo, buscar_en} = objFindListaParams;

    try {
        
        if(!words_input){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }
               
        const response = await fetch('obtener_lista_by_find.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                words_input,
                modo,
                buscar_en
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        let data;
        if(debug){
            data = await response.text();//test
        }else{
            data = await response.json();
        }
        console.log('data: ', data);
        
        if(data.success){
            console.log('success is true');

            let arr_data = data.arr_data; 

            console.log(`arr_data: `, arr_data);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getDataListasFromBdByFind(): error.message: ', error.message);
    }
}




async function insertarSongDatos(objSong) {
    console.log('=== function insertarSongDatos(objSong) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objSong || Object.keys(objSong).length == 0){
            alert('No hay todos los parametros necesarios de la cancion...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objSong: ',objSong);
        
        const objSong_str = JSON.stringify(objSong);
        console.log('objSong_str: ', objSong_str);

        const response = await fetch('insertar_song_datos.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objSong_str
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }
        
        let data;
        if(debug){
            data = await response.text();//test
        }else{
            data = await response.json();
        }
        console.log('data: ',data); 
        
        return data;

    } catch (error) {
        console.error('Error en la función insertarSongDatos: ', error);
    }
}


async function deleteSongFromBd(){
    console.log('=== function deleteSongFromBd() ===');

    try {
        
        if(!hay_id_song('deleteSongFromBd()')){
            return; // <- se detiene aquí si no hay id_song
        } 
               
        const response = await fetch('eliminar_song_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_song: id_song
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');

            let song_title = data.title; 
            let song_text = data.song_text; 
            data.arr_esquema = (data.arr_esquema != '') ? JSON.parse(data.arr_esquema) : data.arr_esquema ; 

            console.log(`[ELIMINADA] id_song: [${id_song}] --- song_title: [${song_title}] --- song_text: [${song_text}] --- data.arr_esquema: `, data.arr_esquema);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en deleteSongFromBd(): error.message: ', error.message);
    }
}




async function insertarListaDatos(objLista) {
    console.log('=== function insertarListaDatos(objLista) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objLista || Object.keys(objLista).length == 0){
            alert('No hay todos los parametros necesarios de la lista...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objLista: ',objLista);

        const objLista_str = JSON.stringify(objLista);
        console.log('objLista_str: ',objLista_str);

        const response = await fetch('insertar_lista_datos.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objLista_str
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        console.log('data: ',data); 
        
        return data;

    } catch (error) {
        console.error('Error en la función insertarSongDatos: ', error);
    }
}


async function deleteListaFromBd(){
    console.log('=== function deleteListaFromBd() ===');

    try {
        
        if(!hay_id_lista('deleteListaFromBd()')){
            return; // <- se detiene aquí si no hay id_lista
        } 
               
        const response = await fetch('eliminar_lista_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_lista: id_lista
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');

            let lista_title = data.title; 
            let lista_nota = data.notes; 
            //data.arr_lista = (data.arr_lista != '') ? JSON.parse(data.arr_lista) : data.arr_lista ; 

            console.log(`[ELIMINADA] id_lista: [${id_lista}] --- lista_title: [${lista_title}] --- lista_nota: [${lista_nota}] --- data.arr_lista: `, data.arr_lista);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en deleteListaFromBd(): error.message: ', error.message);
    }
}



function showAviso(htmlTrans, positionModal){
    console.log('=== showAviso(htmlTrans, param) ===');

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.innerHTML = '';
    }else if(positionModal == 'bottom'){
        eid_bl_modalBottomInner.innerHTML = '';
    }
    
    const p = document.createElement('p');
    p.className = 'p_aviso';
    p.innerHTML = htmlTrans;

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.append(p);    
    }else if(positionModal == 'bottom'){
        eid_bl_modalBottomInner.append(p);
    }

}

function showAviso2(elemento_aviso, positionModal){// elemento_aviso es objeto HTML y no elemento.innerHTML
    console.log('=== showAviso2(elemento_aviso, param) ===');

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.innerHTML = '';
    }else if(positionModal == 'bottom'){
        eid_bl_modalBottomInner.innerHTML = '';
    }
    
    const contenedor_aviso = document.createElement('div');
    contenedor_aviso.className = 'contenedor_aviso';
    contenedor_aviso.append(elemento_aviso);

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.append(contenedor_aviso);    
    }else if(positionModal == 'bottom'){
        eid_bl_modalBottomInner.append(contenedor_aviso);
    }

}