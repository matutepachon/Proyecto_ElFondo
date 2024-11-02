<?php
session_start();
header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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