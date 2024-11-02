<?php
session_start();
header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (isset($_SESSION['correo']) && isset($_SESSION['nombre']) && isset($_SESSION['tipo_usuario'])) {
    $response = [
        'success' => true,
        'nombre' => $_SESSION['nombre'],
        'correo' => $_SESSION['correo'],
        'tipo_usuario' => $_SESSION['tipo_usuario']
    ];
} else {
    $response = [
        'success' => false,
        'message' => 'Debes iniciar sesión para acceder.'
    ];
}

echo json_encode($response);
?>
