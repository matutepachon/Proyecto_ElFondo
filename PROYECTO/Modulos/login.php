<?php
session_start();
header("Content-Type: application/json");

include "../Configuracion/conexion.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $input_correo = trim($_POST["correo"] ?? "");
    $input_contrasena = trim($_POST["contrasena"] ?? "");

    if (empty($input_correo) || empty($input_contrasena)) {
        echo json_encode(['success' => false, 'message' => 'Correo y contraseña son obligatorios.']);
        exit();
    }

    try {
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

        if (!$stmt) {
            throw new Exception("Error al preparar la consulta.");
        }

        $stmt->bind_param("s", $input_correo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();

            if (password_verify($input_contrasena, $row['Con_Usu'])) {
                $_SESSION["correo"] = $input_correo;
                $_SESSION["nombre"] = $row['Nombre'];
                $_SESSION["ID_Usuario"] = $row['ID_Usuario'];
                $_SESSION["tipo_usuario"] = $row['tipo_usuario'];

                echo json_encode(["success" => true, "tipo_usuario" => $row['tipo_usuario']]);
            } else {
                echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos."]);
        }

        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Ocurrió un error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método de solicitud no válido."]);
}

$conn->close();
?>
