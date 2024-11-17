<?php
session_start();
header('Content-Type: application/json');

// Incluye el archivo de conexión
require '../Configuracion/conexion.php';

// Verifica si la conexión se realizó correctamente
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verifica que haya un usuario logueado
if (!isset($_SESSION['ID_Usuario'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

// Recuperar el último ID de factura generado para el usuario
$idUsuario = $_SESSION['ID_Usuario'];
$sql = "SELECT * FROM Factura WHERE ID_Usuario = '$idUsuario' ORDER BY Fecha_Emision DESC LIMIT 1";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Obtener la última factura
    $factura = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'factura' => $factura
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'No se encontraron facturas para este usuario']);
}

$conn->close();
?>
