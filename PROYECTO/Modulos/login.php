<?php
session_start();
header("Content-Type: application/json");

include "../Configuracion/conexion.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_correo = $_POST["correo"] ?? "";
    $input_contrasena = $_POST["contrasena"] ?? "";

    // Asegúrate de que los campos no estén vacíos
    if (empty($input_correo) || empty($input_contrasena)) {
        echo json_encode(['success' => false, 'message' => 'Correo y contraseña son obligatorios.']);
        exit();
    }

    // Buscar el usuario en la tabla Usuario y verificar si es Admin, Cliente o Entrenador
    $stmt = $conn->prepare("
        SELECT U.ID_Usuario, 
               COALESCE(C.Nombre, 'Admin', 'Entrenador') AS Nombre, 
               U.Con_Usu, 
               CASE 
                   WHEN A.ID_Usuario IS NOT NULL THEN 'admin' 
                   WHEN E.ID_Usuario IS NOT NULL THEN 'entrenador' 
                   ELSE 'cliente' 
               END AS tipo_usuario 
        FROM Usuario U 
        LEFT JOIN Cliente C ON U.ID_Usuario = C.ID_Usuario 
        LEFT JOIN Admin A ON U.ID_Usuario = A.ID_Usuario 
        LEFT JOIN Entrenador E ON U.ID_Usuario = E.ID_Usuario 
        WHERE U.Correo_Usu = ?
    ");
    
    if ($stmt) {
        $stmt->bind_param("s", $input_correo);
        $stmt->execute();
        $stmt->bind_result($id, $nombre, $password_hash, $tipo_usuario);
        $stmt->fetch();
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error en la consulta a la base de datos."]);
        exit();
    }

    // Verificar la contraseña
    if (isset($password_hash) && password_verify($input_contrasena, $password_hash)) {
        // Establecer variables de sesión
        $_SESSION["correo"] = $input_correo;
        $_SESSION["nombre"] = $nombre;
        $_SESSION["ID_Usuario"] = $id; // Cambiado a 'ID_Usuario' para ser consistente
        $_SESSION["tipo_usuario"] = $tipo_usuario; // 'admin', 'cliente' o 'entrenador'

        echo json_encode(["success" => true, "tipo_usuario" => $tipo_usuario]);
    } else {
        echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método de solicitud no válido."]);
}

$conn->close();
?>
