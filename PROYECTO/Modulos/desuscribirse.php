<?php
session_start();
header('Content-Type: application/json');
include('../Configuracion/conexion.php');

$idUsuario = $_SESSION['ID_Usuario']; 

$query = "DELETE FROM Elige WHERE ID_Cliente = ?";

if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("i", $idUsuario); 

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Te has desuscrito exitosamente.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'No estabas suscrito a esta suscripción.']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'No se pudo completar la desuscripción.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Error en la preparación de la consulta.']);
}

$conn->close();
?>
