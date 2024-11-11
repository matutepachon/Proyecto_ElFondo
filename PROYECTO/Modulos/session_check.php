<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['ID_Usuario'])) {
    $response = [
        'success' => true,
        'nombre' => $_SESSION['nombre'],
        'correo' => $_SESSION['correo']
    ];
} else {
    $response = [
        'success' => false
    ];
}

echo json_encode($response);
?>

