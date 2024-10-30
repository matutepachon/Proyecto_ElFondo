<?php
session_start();
header('Content-Type: application/json');

require_once '../Configuracion/conexion.php';

if (isset($_SESSION['correo'])) {
    $result = $conn->query("SELECT ID_Usuario, Nombre, Correo FROM Cliente WHERE Correo != 'root@gmail.com'");

    $usuarios = [];
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }

    echo json_encode(['success' => true, 'usuarios' => $usuarios]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'No autorizado.']);
}
$conn->close();
?>
