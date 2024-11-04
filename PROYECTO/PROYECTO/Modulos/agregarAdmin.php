<?php
session_start();

// Incluir la conexión a la base de datos
include '../Configuracion/conexion.php';

header('Content-Type: application/json');

$response = []; // Array para la respuesta en JSON

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validar y asignar variables
    $input_correo = $_POST['correo'] ?? '';
    $input_contrasena = $_POST['contrasena'] ?? '';

    if ($input_correo && $input_contrasena) {
        $correo = $input_correo;
        $contrasena = password_hash($input_contrasena, PASSWORD_BCRYPT);

        // Comprobar si el correo ya está registrado en la tabla Usuario
        $stmt = $conn->prepare("SELECT ID_Usuario FROM Usuario WHERE Correo_Usu = ?");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $response = ['success' => false, 'mensaje' => 'El correo ya está registrado.'];
        } else {
            // Insertar en la tabla Usuario
            $stmt = $conn->prepare("INSERT INTO Usuario (Correo_Usu, Con_Usu) VALUES (?, ?)");
            $stmt->bind_param("ss", $correo, $contrasena);

            if ($stmt->execute()) {
                // Obtener el ID del nuevo usuario insertado
                $id_usuario = $stmt->insert_id;

                // Insertar en la tabla Admin con el ID de Usuario
                $stmt = $conn->prepare("INSERT INTO Admin (ID_Usuario) VALUES (?)");
                $stmt->bind_param("i", $id_usuario);

                if ($stmt->execute()) {
                    $response = ['success' => true, 'mensaje' => 'Admin registrado con éxito.'];
                } else {
                    $response = ['success' => false, 'mensaje' => 'Error al registrar al admin: ' . $stmt->error];
                }
            } else {
                $response = ['success' => false, 'mensaje' => 'Error al registrar al usuario: ' . $stmt->error];
            }
        }
        $stmt->close();
    } else {
        $response = ['success' => false, 'mensaje' => 'Por favor, completa todos los campos.'];
    }
} else {
    $response = ['success' => false, 'mensaje' => 'Método de solicitud no válido.'];
}

echo json_encode($response);
$conn->close();
?>
