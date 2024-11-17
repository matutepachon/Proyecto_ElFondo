<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

require '../Configuracion/conexion.php'; // Asegúrate de que la ruta es correcta

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        listarRutinas($conn);
        break;
    case 'POST':
        $data = getBodyData();
        agregarRutina($conn, $data);
        break;
    case 'PUT':
        $data = getBodyData();
        modificarRutina($conn, $data);
        break;
    case 'DELETE':
        $data = getBodyData();
        if (isset($data['id'])) {
            eliminarRutina($conn, $data['id']);
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
    return $data;
}

// Funciones CRUD
function listarRutinas($conn) {
    $sql = "SELECT * FROM Rutina";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $rutinas = [];
        while ($row = $result->fetch_assoc()) {
            $rutinas[] = $row;
        }
        echo json_encode($rutinas);
    } else {
        echo json_encode(["message" => "No hay rutinas"]);
    }
}

function agregarRutina($conn, $data) {
    // Obtener los datos enviados
    $idRutina = $data['ID_Rut']; // ID generado en JavaScript
    $tipo = $data['Tipo_Rut'];
    $duracion = $data['Duracion'];
    $objetivos = $data['Objetivos'];
    $instruccion = $data['Instrucción'];
    $frecuencia = $data['Frecuencia'];

    // Crear la consulta para insertar los datos
    $sql = "INSERT INTO Rutina (ID_Rut, Tipo_Rut, Duracion, Objetivos, Instrucción, Frecuencia) 
            VALUES ('$idRutina', '$tipo', $duracion, '$objetivos', '$instruccion', '$frecuencia')";

    // Ejecutar la consulta
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Rutina agregada con éxito"]);
    } else {
        echo json_encode(["message" => "Error al agregar rutina: " . $conn->error]);
    }
}


function modificarRutina($conn, $data) {
    $id = $data['ID_Rut'];
    $tipo = $data['Tipo_Rut'];
    $duracion = $data['Duracion'];
    $objetivos = $data['Objetivos'];
    $instruccion = $data['Instrucción'];
    $frecuencia = $data['Frecuencia'];

    $sql = "UPDATE Rutina SET Tipo_Rut='$tipo', Duracion=$duracion, Objetivos='$objetivos', 
            Instrucción='$instruccion', Frecuencia='$frecuencia' WHERE ID_Rut='$id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Rutina actualizada con éxito"]);
    } else {
        echo json_encode(["message" => "Error al actualizar rutina: " . $conn->error]);
    }
}

function eliminarRutina($conn, $id) {
    // Primero eliminamos las entradas relacionadas en la tabla 'Agrega'
    $sqlEliminarAgrega = "DELETE FROM Agrega WHERE ID_Rut='$id'";
    if ($conn->query($sqlEliminarAgrega) === TRUE) {
        // Ahora eliminamos la rutina en la tabla 'Rutina'
        $sqlEliminarRutina = "DELETE FROM Rutina WHERE ID_Rut='$id'";
        if ($conn->query($sqlEliminarRutina) === TRUE) {
            echo json_encode(["message" => "Rutina eliminada con éxito"]);
        } else {
            echo json_encode(["message" => "Error al eliminar rutina: " . $conn->error]);
        }
    } else {
        echo json_encode(["message" => "Error al eliminar registros relacionados: " . $conn->error]);
    }
}
?>
