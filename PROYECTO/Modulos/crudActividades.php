<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

// Conexión a la base de datos
require '../Configuracion/conexion.php'; // Asegúrate de que la ruta es correcta

// Verificar conexión a la base de datos
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Obtener el método de la solicitud
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        listarActividades($conn);
        break;
    case 'POST':
        $data = getBodyData();
        agregarActividad($conn, $data);
        break;
    case 'PUT':
        $data = getBodyData();
        modificarActividad($conn, $data);
        break;
    case 'DELETE':
        $data = getBodyData();
        if (isset($data['ID_Actividad'])) {
            eliminarActividad($conn, $data['ID_Actividad']);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "ID no proporcionado"]);
        }
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

    // Log de los datos recibidos para depuración
    error_log(print_r($data, true)); // Guarda los datos en el log de PHP
    return $data;
}

// Funciones CRUD

// Listar todas las actividades
function listarActividades($conn) {
    $sql = "SELECT * FROM Actividad";
    $result = $conn->query($sql);

    // Depuración de la consulta
    if (!$result) {
        echo json_encode(["message" => "Error en la consulta: " . $conn->error]);
        return;
    }

    if ($result->num_rows > 0) {
        $actividades = [];
        while ($row = $result->fetch_assoc()) {
            $actividades[] = $row;
        }
        echo json_encode($actividades);
    } else {
        echo json_encode(["message" => "No hay actividades"]);
    }
}

// Agregar una nueva actividad
function agregarActividad($conn, $data) {
    // Validar los datos recibidos
    if (!isset($data['ID_Actividad'], $data['Tipo_Act'], $data['Fecha_Hora'], $data['Duracion'])) {
        echo json_encode(["message" => "Faltan datos necesarios para agregar la actividad"]);
        return;
    }

    $idActividad = $data['ID_Actividad'];
    $tipo = $data['Tipo_Act'];
    $fechaHora = $data['Fecha_Hora']; // Asegúrate de que este valor esté en formato correcto (YYYY-MM-DD HH:MM:SS)
    $duracion = $data['Duracion'];

    $sql = "INSERT INTO Actividad (ID_Actividad, Tipo_Act, Fecha_Hora, Duracion) 
            VALUES ('$idActividad', '$tipo', '$fechaHora', $duracion)";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Actividad agregada con éxito"]);
    } else {
        echo json_encode(["message" => "Error al agregar actividad: " . $conn->error]);
    }
}

// Modificar una actividad existente
function modificarActividad($conn, $data) {
    if (!isset($data['ID_Actividad'], $data['Tipo_Act'], $data['Fecha_Hora'], $data['Duracion'])) {
        echo json_encode(["message" => "Faltan datos necesarios para modificar la actividad"]);
        return;
    }

    $id = $data['ID_Actividad'];
    $tipo = $data['Tipo_Act'];
    $fechaHora = $data['Fecha_Hora']; // Asegúrate de que este valor esté en formato correcto (YYYY-MM-DD HH:MM:SS)
    $duracion = $data['Duracion'];

    $sql = "UPDATE Actividad SET Tipo_Act='$tipo', Fecha_Hora='$fechaHora', Duracion=$duracion 
            WHERE ID_Actividad='$id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Actividad actualizada con éxito"]);
    } else {
        echo json_encode(["message" => "Error al actualizar actividad: " . $conn->error]);
    }
}

// Eliminar una actividad
function eliminarActividad($conn, $id) {
    // Verificar si el ID de actividad existe antes de eliminar
    if (empty($id)) {
        echo json_encode(["message" => "El ID de actividad no es válido"]);
        return;
    }

    // Eliminar las relaciones en la tabla 'posee' primero
    $sql = "DELETE FROM posee WHERE ID_Actividad='$id'";
    if ($conn->query($sql) === TRUE) {
        // Luego eliminar la actividad de la tabla 'Actividad'
        $sql = "DELETE FROM Actividad WHERE ID_Actividad='$id'";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Actividad y su relación eliminada con éxito"]);
        } else {
            echo json_encode(["message" => "Error al eliminar actividad: " . $conn->error]);
        }
    } else {
        echo json_encode(["message" => "Error al eliminar las relaciones en 'posee': " . $conn->error]);
    }
}

?>
