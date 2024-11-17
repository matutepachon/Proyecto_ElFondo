<?php
session_start();
header("Content-Type: application/json");

require_once "../Configuracion/conexion.php";

$result = $conn->query("SELECT c.ID_Usuario, c.Nombre, c.Apellidos, u.Correo_usu FROM Cliente c JOIN Usuario u ON c.ID_Usuario = u.ID_Usuario;");

if (!$result) {
    echo json_encode(["success" => false, "mensaje" => "Error en la consulta: " . $conn->error]);
    exit;
}

$usuarios = [];

while ($row = $result->fetch_assoc()) {
    $usuarios[] = $row;
}

echo json_encode(["success" => true, "usuarios" => $usuarios]);

$conn->close();
?>
