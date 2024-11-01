<?php
session_start();
header('Content-Type: application/json');

include '../Configuracion/conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_correo = $_POST['correo'] ?? '';
    $input_contrasena = $_POST['contrasena'] ?? '';

    $roles = [
        'cliente' => 'Cliente',
        'admin' => 'Admin',
        'entrenador' => 'Entrenador'
    ];

    $login_successful = false;
    
    foreach ($roles as $role => $table) {
        $stmt = $conn->prepare("SELECT ID_Usuario, Nombre, Contrasena FROM $table WHERE Correo = ?");
        $stmt->bind_param("s", $input_correo);
        $stmt->execute();
        $stmt->bind_result($id, $nombre, $password_hash);

        if ($stmt->fetch() && password_verify($input_contrasena, $password_hash)) {
            
            $_SESSION['correo'] = $input_correo;
            $_SESSION['nombre'] = $nombre;
            $_SESSION['id'] = $id;
            $_SESSION['user_role'] = $role;

            $login_successful = true;
            break;
        }
        $stmt->close();
    }

    $conn->close();

    if ($login_successful) {
        echo json_encode(['success' => true, 'role' => $_SESSION['user_role']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Correo o contraseña incorrectos']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método de solicitud no válido.']);
}
?>
