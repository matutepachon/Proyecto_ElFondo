<?php
session_start();
header('Content-Type: application/json');

$response = ['success' => false];

if (isset($_SESSION['nombre'])) {
    $response = [
        'success' => true,
        'nombre' => $_SESSION['nombre']
    ];
}

echo json_encode($response);
?>
