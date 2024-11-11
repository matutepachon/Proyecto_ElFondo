<?php
session_start();
header('Content-Type: application/json');

require_once '../Configuracion/conexion.php';

if (!isset($_SESSION['correo'])) {
    echo json_encode(['success' => false, 'mensaje' => 'No autorizado.']);
    exit;
}

$result = $conn->query("SELECT u.ID_Usuario, u.Correo_usu FROM Entrenador e JOIN Usuario u ON e.ID_Usuario = u.ID_Usuario");

if (!$result) {
    echo json_encode(['success' => false, 'mensaje' => 'Error en la consulta: ' . $conn->error]);
    exit;
}

$entrenadores = [];
while ($row = $result->fetch_assoc()) {
    $entrenadores[] = $row;
}

if (empty($entrenadores)) {
    echo json_encode(['success' => false, 'mensaje' => 'No se encontraron entrenadores.']);
} else {
    echo json_encode(['success' => true, 'entrenadores' => $entrenadores]);
}

$conn->close();
?>
