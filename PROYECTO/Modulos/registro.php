<?php
session_start();

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

    if (empty($nombre) || empty($apellidos) || empty($cedula) || empty($correo) || empty($contrasena)) {
        echo json_encode(['success' => false, 'mensaje' => 'Por favor, complete todos los campos.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT ID_Usuario FROM Cliente WHERE Cedula = ? OR Correo = ?");
    $stmt->bind_param("ss", $cedula, $correo);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['success' => false, 'mensaje' => 'La cédula o el correo ya están registrados.']);
        $stmt->close();
        exit;
    }

    $conn->begin_transaction();
    try {
        $stmt = $conn->prepare("INSERT INTO Usuario(Nom_Usu, Con_Usu) VALUES (?, ?)");
        $stmt->bind_param("ss", $correo, $contrasena);
        if (!$stmt->execute()) {
            throw new Exception('Error al registrar el usuario: ' . $stmt->error);
        }
        $usuario_id = $stmt->insert_id; 

        $stmt = $conn->prepare("INSERT INTO Cliente(Nombre, Apellidos, Cedula, Edad, Correo, Peso, Altura, Centro_salud, Contrasena, ID_Usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssissdssi", $nombre, $apellidos, $cedula, $edad, $correo, $peso, $altura, $centro_salud, $contrasena, $usuario_id);
        if (!$stmt->execute()) {
            throw new Exception('Error al registrar el cliente: ' . $stmt->error);
        }

        $conn->commit();
        $_SESSION['correo'] = $correo;
        $_SESSION['nombre'] = $nombre;
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'mensaje' => $e->getMessage()]);
    } finally {
        $stmt->close();
    }
}
$conn->close();
?>
