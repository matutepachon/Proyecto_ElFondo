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

    // Comprobar si la cédula ya está registrada en la tabla Cliente
    $stmt = $conn->prepare("SELECT ID_Usuario FROM Usuario WHERE Correo_Usu = ? OR ID_Usuario IN (SELECT ID_Usuario FROM Cliente WHERE Cedula = ?)");
    $stmt->bind_param("ss", $correo, $cedula);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['success' => false, 'mensaje' => 'La cédula o el correo ya están registrados.']);
    } else {
        // Insertar en la tabla Usuario primero
        $stmt = $conn->prepare("INSERT INTO Usuario (Correo_Usu, Con_Usu) VALUES (?, ?)");
        $stmt->bind_param("ss", $correo, $contrasena);

        if ($stmt->execute()) {
            // Obtener el ID del nuevo usuario insertado
            $id_usuario = $stmt->insert_id;

            // Ahora insertar en la tabla Cliente con el ID de Usuario
            $stmt = $conn->prepare("INSERT INTO Cliente (ID_Usuario, Nombre, Apellidos, Cedula, Edad, Peso, Altura, Centro_salud) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ississds", $id_usuario, $nombre, $apellidos, $cedula, $edad, $peso, $altura, $centro_salud);

            if ($stmt->execute()) {
                $_SESSION['correo'] = $correo;
                $_SESSION['nombre'] = $nombre;
                $_SESSION['tipo_usuario']= "";  

                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'mensaje' => 'Error al registrar el usuario en la tabla Cliente: ' . $stmt->error]);
            }
        } else {
            echo json_encode(['success' => false, 'mensaje' => 'Error al registrar el usuario en la tabla Usuario: ' . $stmt->error]);
        }
    }
    $stmt->close();
}
$conn->close();
?>
