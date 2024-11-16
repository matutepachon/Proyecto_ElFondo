<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');
require '../Configuracion/conexion.php';

if (!isset($_SESSION['ID_Usuario'])) {
    echo json_encode(['error' => 'Usuario no logueado']);
    exit;
}

$idUsuario = $_SESSION['ID_Usuario'];  // Obtener el ID del usuario logueado

// Obtener la cantidad total de entrenamientos del usuario logueado
$cantidadQuery = "
    SELECT COUNT(*) as cantidad 
    FROM Entrenamiento e
    INNER JOIN Registra r ON e.ID_Ent = r.ID_Ent
    WHERE r.ID_Usuario = ?
";
$cantidadStmt = $conn->prepare($cantidadQuery);
$cantidadStmt->bind_param("i", $idUsuario);
$cantidadStmt->execute();
$cantidadResult = $cantidadStmt->get_result();
$cantidadData = $cantidadResult->fetch_assoc();

// Obtener los minutos acumulados por tipo de entrenamiento del usuario logueado
$minutosQuery = "
    SELECT e.Tipo_Ent, SUM(e.Tiempo_Ent * 60) AS Minutos_Acumulados
    FROM Entrenamiento e
    INNER JOIN Registra r ON e.ID_Ent = r.ID_Ent
    WHERE r.ID_Usuario = ?
    GROUP BY e.Tipo_Ent
";
$minutosStmt = $conn->prepare($minutosQuery);
$minutosStmt->bind_param("i", $idUsuario);
$minutosStmt->execute();
$minutosResult = $minutosStmt->get_result();

// Crear un array para los minutos por tipo
$minutosData = [];
while ($row = $minutosResult->fetch_assoc()) {
    $minutosData[] = $row;
}

// Verificar si hay algún error antes de enviar el JSON
if (!$cantidadData || empty($minutosData)) {
    echo json_encode(['error' => 'Datos no encontrados']);
    exit;
}

// Devolver los datos en formato JSON
echo json_encode([
    'cantidad' => $cantidadData['cantidad'],
    'minutos' => $minutosData
]);
?>
