<?php
session_start();
header('Content-Type: application/json');


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
