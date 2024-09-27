<?php
session_start();
header('Content-Type: application/json');

include '../Configuracion/conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_correo = $_POST['correo'] ?? '';
    $input_contrasena = $_POST['contrasena'] ?? '';

    $stmt = $conn->prepare("SELECT ID_Usuario, Nombre, Contrasena FROM Cliente WHERE Correo = ?");
    $stmt->bind_param("s", $input_correo);
    $stmt->execute();
    $stmt->bind_result($id, $nombre, $password_hash);
    $stmt->fetch();
    $stmt->close();
    $conn->close();

    if ($password_hash && password_verify($input_contrasena, $password_hash)) {

        $_SESSION['correo'] = $input_correo;
        $_SESSION['nombre'] = $nombre;
        $_SESSION['id'] = $id;

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Correo o contraseña incorrectos']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método de solicitud no válido.']);
}
?>
