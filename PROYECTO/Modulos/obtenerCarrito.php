<?php
session_start();
header('Content-Type: application/json');

// Incluye el archivo de conexión
require '../Configuracion/conexion.php';  // Asegúrate de que la ruta sea correcta


// Obtener el ID del carrito asociado al usuario
$sql = "SELECT ID_Carrito FROM Carrito WHERE ID_Usuario = $idUsuario AND estado = 1"; // Carrito activo
$result = $conn->query($sql);

// Verificar si se encontró un carrito
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $idCarrito = $row['ID_Carrito'];

    echo json_encode(['success' => true, 'ID_Carrito' => $idCarrito]);
} else {
    echo json_encode(['success' => false, 'message' => 'No se encontró un carrito para este usuario']);
}

$conn->close();
?>
