<?php


// Initialize all variables as empty by default
$cl_home = $cl_song = '';
$href_home = '/home';
$href_song = '/song';

if(!isset($li_active)){
    $li_active = 'home';
}

// Set the active class based on $li_active
switch ($li_active) {
    case 'song':
        $cl_song = 'active';//aunque no se usa, dejo por si acaso...
        $href_song = '#';
        break;

    case 'home':
    default:
        $cl_home = 'active';
        $href_home = '#';
        break;
}

?>
<header>
    <nav>
        <ul>
            <li><a class="<?=$cl_home?>" href="<?=$href_home?>" data-link="home">Home</a></li>
            <li><a class="<?=$cl_song?>" href="<?=$href_song?>" data-link="slideshow">Song</a></li>
        </ul>
    </nav>
</header>
