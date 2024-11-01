<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['correo']) && isset($_SESSION['nombre'])) {
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