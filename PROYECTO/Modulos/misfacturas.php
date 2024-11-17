<?php
session_start();
header('Content-Type: application/json');

// Incluye el archivo de conexión
require '../Configuracion/conexion.php';  // Asegúrate de que la ruta sea correcta

// Verifica si el usuario está logueado
if (!isset($_SESSION['ID_Usuario'])) {
    echo json_encode(['error' => 'Usuario no logueado']);
    exit;
}

$idUsuario = $_SESSION['ID_Usuario'];

try {
    // Ajusta la consulta SQL para que coincida con los nombres de las columnas de la tabla
    $sql = "SELECT ID_Fact, Fecha_Emision, Precio_Total, Descripcion FROM Factura WHERE ID_Usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $idUsuario);
    $stmt->execute();
    $result = $stmt->get_result();

    $facturas = [];
    while ($row = $result->fetch_assoc()) {
        $facturas[] = $row;
    }

    echo json_encode($facturas);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al obtener las facturas']);
}
?>
