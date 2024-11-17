<?php
session_start();
header('Content-Type: application/json');

// Verificar si el usuario está logueado
if (isset($_SESSION['ID_Usuario'])) {
    echo json_encode([
        'success' => true,
        'ID_Usuario' => $_SESSION['ID_Usuario']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Usuario no autenticado'
    ]);
}
?>
