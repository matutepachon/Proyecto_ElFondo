<?php
session_start();
header("Content-Type: application/json");

require_once "../Configuracion/Conexion.php";

$idUsuario = $_SESSION["ID_Usuario"];

$query = "SELECT 1 FROM Elige WHERE ID_Cliente = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->fetch_assoc()) {
    $response = ["success" => true,];
} else {
    $response = ["success" => false];
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
