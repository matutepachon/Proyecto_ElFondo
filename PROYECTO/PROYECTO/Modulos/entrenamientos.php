<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// entrenamientos.php

header('Content-Type: application/json');
require '../Configuracion/conexion.php';

// Método para obtener el cuerpo de la solicitud
function getBodyData() {
    // Obtiene el cuerpo de la solicitud y decodifica el JSON
    return json_decode(file_get_contents('php://input'), true);
}

// Obtener el método HTTP (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            obtenerEntrenamiento($conn, $_GET['id']);
        } else {
            listarEntrenamientos($conn);
        }
        break;
    case 'POST':
        $data = getBodyData();
        agregarEntrenamiento($conn, $data);
        break;
    case 'PUT':
        $data = getBodyData();
        modificarEntrenamiento($conn, $data);
        break;
    case 'DELETE':
        $data = getBodyData();
        eliminarEntrenamiento($conn, $data['id']);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

// Funciones CRUD

// Listar Entrenamientos (GET)
function listarEntrenamientos($conn) {
    $sql = "SELECT * FROM Entrenamiento";
    $result = $conn->query($sql);

    $entrenamientos = [];
    while ($row = $result->fetch_assoc()) {
        $entrenamientos[] = $row;
    }

    echo json_encode($entrenamientos);
}

// Obtener Entrenamiento por ID (GET)
function obtenerEntrenamiento($conn, $id) {
    $sql = "SELECT * FROM Entrenamiento WHERE ID_Ent = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["message" => "Entrenamiento no encontrado"]);
    }
}

// Agregar Entrenamiento (POST)
function agregarEntrenamiento($conn, $data) {
    // Obtener los datos
    $id_ent = $data['ID_Ent'];
    $tipo_ent = $data['Tipo_Ent'];
    $tiempo_ent = $data['Tiempo_Ent'];
    $calor_quem = $data['Calor_Quem'];
    $registro_peso = $data['registro_peso'];
    $registro_imc = $data['registro_imc'];

    // Preparar la consulta SQL para insertar los datos
    $sql = "INSERT INTO Entrenamiento (ID_Ent, Tipo_Ent, Tiempo_Ent, Calor_Quem, registro_peso, registro_imc) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["message" => "Error en la preparación de la consulta", "error" => $conn->error]);
        return;
    }

    // Vincular los parámetros
    $stmt->bind_param("ssiiii", $id_ent, $tipo_ent, $tiempo_ent, $calor_quem, $registro_peso, $registro_imc);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Entrenamiento agregado correctamente"]);
    } else {
        echo json_encode(["message" => "Error al agregar entrenamiento", "error" => $stmt->error]);
    }

    $stmt->close(); // Cerrar la declaración preparada
}

// Modificar Entrenamiento (PUT)
function modificarEntrenamiento($conn, $data) {
    // Acceder a los datos enviados por JSON
    $id_ent = $data['ID_Ent']; // Se utiliza para buscar el entrenamiento
    $tipo_ent = $data['Tipo_Ent'];
    $tiempo_ent = $data['Tiempo_Ent'];
    $calor_quem = $data['Calor_Quem'];
    $registro_peso = $data['registro_peso'];
    $registro_imc = $data['registro_imc'];

    // Verificar que se reciban todos los datos
    if (empty($id_ent) || empty($tipo_ent) || empty($tiempo_ent) || empty($calor_quem) || empty($registro_peso) || empty($registro_imc)) {
        echo json_encode(["message" => "Faltan datos, todos los campos son requeridos"]);
        return;
    }

    // Preparar la consulta SQL para actualizar los datos
    $sql = "UPDATE Entrenamiento SET Tipo_Ent = ?, Tiempo_Ent = ?, Calor_Quem = ?, registro_peso = ?, registro_imc = ? WHERE ID_Ent = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(["message" => "Error al preparar la consulta", "error" => $conn->error]);
        return;
    }

    // Enlazar parámetros
    $stmt->bind_param("iiiiss", $tipo_ent, $tiempo_ent, $calor_quem, $registro_peso, $registro_imc, $id_ent);

    // Ejecutar la consulta y verificar el resultado
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["message" => "Entrenamiento modificado correctamente"]);
        } else {
            echo json_encode(["message" => "No se encontró el entrenamiento o no se modificaron los datos"]);
        }
    } else {
        echo json_encode(["message" => "Error al ejecutar la consulta", "error" => $stmt->error]);
    }
    
    // Cerrar el statement
    $stmt->close();
}

// Eliminar Entrenamiento (DELETE)
function eliminarEntrenamiento($conn, $id) {
    $sql = "DELETE FROM Entrenamiento WHERE ID_Ent = ?"; 
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);

    header('Content-Type: application/json'); // Asegurarse de que la respuesta sea JSON

    if ($stmt->execute()) {
        echo json_encode(["message" => "Entrenamiento eliminado correctamente"]);
    } else {
        echo json_encode(["message" => "Error al eliminar entrenamiento", "error" => $conn->error]);
    }
}  
