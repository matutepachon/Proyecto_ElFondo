<?php
session_start();
header("Content-Type: application/json");

require '../Configuracion/conexion.php';

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

// Verificamos que la ID del cliente esté en la sesión
if (!isset($_SESSION['ID_Usuario'])) {
    echo json_encode(["success" => false, "message" => "No has iniciado sesión"]);
    exit;
}

$ID_Usuario = $_SESSION['ID_Usuario'];

// Consulta para obtener los datos del cliente desde la tabla Cliente
$sql = "SELECT Nombre, Apellidos, Cedula, Edad, Peso, Altura, Centro_salud, Fecha_registro FROM Cliente WHERE ID_Usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $ID_Usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $cliente = $result->fetch_assoc();
    echo json_encode(["success" => true, "cliente" => $cliente]);
} else {
    echo json_encode(["success" => false, "message" => "Cliente no encontrado"]);
}

$stmt->close();
$conn->close();
?>
