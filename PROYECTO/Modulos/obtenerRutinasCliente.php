<?php
session_start();
header('Content-Type: application/json');

// Incluir el archivo de conexión
require '../Configuracion/conexion.php';

// Validar si se proporcionó el parámetro `idUsuario`
if (!isset($_GET['idUsuario']) || !is_numeric($_GET['idUsuario'])) {
    echo json_encode(["success" => false, "message" => "ID de usuario no válido o no proporcionado."]);
    exit;
}

$idUsuario = intval($_GET['idUsuario']); // Asegura que sea un número entero

// Consulta para obtener las rutinas asignadas al cliente desde la tabla Agrega
$sql = "SELECT r.ID_Rut, r.Tipo_Rut, r.Duracion, r.Objetivos, r.Instrucción, r.Frecuencia
        FROM Rutina r
        JOIN Agrega a ON r.ID_Rut = a.ID_Rut
        WHERE a.ID_Usuario = ?";

// Preparar la consulta
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error al preparar la consulta: " . $conn->error]);
    exit;
}

// Enlazar parámetros y ejecutar
$stmt->bind_param("i", $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si hay resultados
if ($result && $result->num_rows > 0) {
    $rutinas = [];
    while ($row = $result->fetch_assoc()) {
        $rutinas[] = $row;
    }
    echo json_encode(["success" => true, "rutinas" => $rutinas]);
} else {
    echo json_encode(["success" => false, "message" => "No tienes rutinas asignadas."]);
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
