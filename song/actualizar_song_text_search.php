<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


require_once 'includes/connect_db.php'; // conexión MySQLi
require_once 'functions.php';   // normalizeSearchText()

set_time_limit(0);
ini_set('memory_limit', '512M');

// seguridad básica
//if (!class_exists('Normalizer')) {
//    die('ERROR: PHP intl extension is required.');
//}

// evitar timeouts en migraciones largas
set_time_limit(0);
ini_set('memory_limit', '512M');

// forzar charset correcto
$conn->set_charset('utf8mb4');

// seleccionar datos
$sql = "SELECT id, song_text FROM songs";
$result = $conn->query($sql);

if (!$result) {
    die('ERROR SELECT: ' . $conn->error);
}

// preparar UPDATE
$update = $conn->prepare(
    "UPDATE songs SET song_text_search = ? WHERE id = ?"
);

if (!$update) {
    die('ERROR PREPARE: ' . $conn->error);
}

$updated = 0;

while ($row = $result->fetch_assoc()) {

    $songText = $row['song_text'] ?? '';
    //$search   = normalizeSearchText($songText);//lo descomento cuando hostalia habilite intl
    $search   = normalizeSearchTextNoIntl($songText);//por ahora uso esta función sin intl
    $id       = (int)$row['id'];

    $update->bind_param('si', $search, $id);

    if (!$update->execute()) {
        echo "ERROR UPDATE ID {$id}: {$update->error}\n";
        continue;
    }

    $updated++;

    // feedback cada 100 registros
    if ($updated % 100 === 0) {
        echo "Actualizados: {$updated}\n";
        flush();
    }
}

$update->close();
$result->free();

echo "✔ Migración completada. Total: {$updated} registros.\n";

?>
