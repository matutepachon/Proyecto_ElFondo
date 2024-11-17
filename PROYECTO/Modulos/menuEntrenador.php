<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

require '../Configuracion/conexion.php'; // Asegúrate de que la ruta es correcta

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = getBodyData();
        asignarRutinaAUsuario($conn, $data);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

// Función para obtener el cuerpo de la solicitud
function getBodyData() {
    $data = json_decode(file_get_contents('php://input'), true);
    if (is_null($data)) {
        parse_str(file_get_contents("php://input"), $data);
    }
    return $data;
}

// Función para asignar rutina a un cliente
function asignarRutinaAUsuario($conn, $data) {
    $idRutina = $data['ID_Rut'];
    $idUsuario = $data['ID_Usuario'];

    // Usar una declaración preparada para evitar inyecciones SQL
    $sql = "INSERT INTO Agrega (ID_Usuario, ID_Rut) VALUES (?, ?)";

    if ($stmt = $conn->prepare($sql)) {
        // Enlazar los parámetros
        $stmt->bind_param("is", $idUsuario, $idRutina);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo json_encode(["message" => "Rutina asignada correctamente"]);
        } else {
            echo json_encode(["message" => "Error al asignar rutina: " . $stmt->error]);
        }

        // Cerrar la declaración
        $stmt->close();
    } else {
        echo json_encode(["message" => "Error en la preparación de la consulta: " . $conn->error]);
    }
}
?>
