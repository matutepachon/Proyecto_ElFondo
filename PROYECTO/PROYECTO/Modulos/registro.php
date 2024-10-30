<?php
session_start();

// Incluir la conexión a la base de datos
include '../Configuracion/conexion.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $cedula = $_POST['cedula'] ?? '';
    $edad = $_POST['edad'] ?? '';
    $correo = $_POST['correo'] ?? '';
    $peso = $_POST['peso'] ?? '';
    $altura = $_POST['altura'] ?? '';
    $centro_salud = $_POST['centro_salud'] ?? '';
    $contrasena = password_hash($_POST['contrasena'] ?? '', PASSWORD_BCRYPT);

    $stmt = $conn->prepare("SELECT ID_Usuario FROM Cliente WHERE Cedula = ? OR Correo = ?");
    $stmt->bind_param("ss", $cedula, $correo);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['success' => false, 'mensaje' => 'La cédula o el correo ya están registrados.']);
    } else {
        $stmt = $conn->prepare("INSERT INTO Cliente(Nombre, Apellidos, Cedula, Edad, Correo, Peso, Altura, Centro_salud, Contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssissdss", $nombre, $apellidos, $cedula, $edad, $correo, $peso, $altura, $centro_salud, $contrasena);

        if ($stmt->execute()) {
            $_SESSION['correo'] = $correo;
            $_SESSION['nombre'] = $nombre;
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'mensaje' => 'Error al registrar el usuario.']);
        }
    }
    $stmt->close();
}
$conn->close();
?>
