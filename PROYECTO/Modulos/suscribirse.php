<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['ID_Usuario'])) {
    echo json_encode(['error' => 'No estás autenticado.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['idSuscripcion'])) {
    $idSuscripcion = $data['idSuscripcion'];
    $idUsuario = $_SESSION['ID_Usuario'];

    include('../configuracion/conexion.php');

    $query = "INSERT INTO Elige (ID_Cliente, ID_Subs) VALUES (?, ?)";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("is", $idUsuario, $idSuscripcion); 
        
        if ($stmt->execute()) {
            $_SESSION["idSuscripcion"]= $idSuscripcion;
            echo json_encode(['success' => true, 'message' => 'Te has suscrito exitosamente.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'No se pudo suscribir.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Error en la preparación de la consulta.']);
    }

    $conn->close();
} else {
    echo json_encode(['success' => false, 'error' => 'ID de suscripción no proporcionado.']);
}
?>
