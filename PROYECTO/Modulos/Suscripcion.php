<?php
session_start();
header('Content-Type: application/json');

// Incluye la conexión a la base de datos
require_once '../Configuracion/Conexion.php';

// Verifica si el usuario tiene una sesión activa y su ID está en la sesión
if (!isset($_SESSION["ID_Usuario"])) {
    echo json_encode(['success' => false, 'message' => 'ID de usuario no encontrado en la sesión']);
    exit;
}

$idUsuario = $_SESSION["ID_Usuario"];

// Preparar y ejecutar la consulta para verificar la suscripción
$query = "SELECT 1 FROM Elige WHERE ID_Cliente = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si el usuario ya está suscrito
if ($result->fetch_assoc()) {
    // Existe un registro en la tabla Elige para este usuario
    $response = [
        'success' => true,
        'message' => 'El usuario ya tiene una suscripción.'
    ];
} else {
    // No existe un registro en la tabla Elige para este usuario
    $response = [
        'success' => false,
        'message' => 'El usuario no tiene una suscripción.'
    ];
}

// Liberar y cerrar la conexión
$stmt->close();
$conn->close();

echo json_encode($response);
?>
