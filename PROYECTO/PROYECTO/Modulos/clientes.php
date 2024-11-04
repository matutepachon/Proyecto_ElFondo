<?php
session_start();
header('Content-Type: application/json');
require '../Configuracion/conexion.php';

// Obtener ID del usuario logueado desde la sesión
$idUsuario = $_SESSION['ID_Usuario'] ?? null;

if (!$idUsuario) {
    echo json_encode(["message" => "Usuario no autenticado"]);
    exit; // Salir si no está autenticado
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            obtenerCliente($conn, $_GET['id']);
        } else {
            obtenerClientePorUsuario($conn, $idUsuario); // Obtener datos del cliente logueado
        }
        break;
    case 'POST':
        agregarCliente($conn);
        break;
    case 'PUT':
        actualizarCliente($conn);
        break;
    case 'DELETE':
        eliminarCliente($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

// Obtener cliente específico (GET)
function obtenerCliente($conn, $id) {
    $sql = "SELECT * FROM Cliente WHERE ID_Usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["message" => "Cliente no encontrado"]);
    }
}

// Obtener datos del cliente logueado (GET)
function obtenerClientePorUsuario($conn, $idUsuario) {
    $sql = "SELECT * FROM Cliente WHERE ID_Usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["message" => "Cliente no encontrado"]);
    }
}

// Agregar un cliente (POST)
function agregarCliente($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $sql = "INSERT INTO Cliente (ID_Usuario, Nombre, Apellidos, Cedula, Edad, Peso, Altura, Centro_salud) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ississss", $data['ID_Usuario'], $data['Nombre'], $data['Apellidos'], $data['Cedula'], $data['Edad'], $data['Peso'], $data['Altura'], $data['Centro_salud']);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Cliente agregado con éxito"]);
    } else {
        echo json_encode(["message" => "Error al agregar cliente"]);
    }
}

// Actualizar cliente (PUT)
function actualizarCliente($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $sql = "UPDATE Cliente SET Nombre=?, Apellidos=?, Cedula=?, Edad=?, Peso=?, Altura=?, Centro_salud=? WHERE ID_Usuario=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssisssi", $data['Nombre'], $data['Apellidos'], $data['Cedula'], $data['Edad'], $data['Peso'], $data['Altura'], $data['Centro_salud'], $data['ID_Usuario']);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Cliente actualizado con éxito"]);
    } else {
        echo json_encode(["message" => "Error al actualizar cliente"]);
    }
}

// Eliminar cliente (DELETE)
function eliminarCliente($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $sql = "DELETE FROM Cliente WHERE ID_Usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $data['ID_Usuario']);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Cliente eliminado con éxito"]);
    } else {
        echo json_encode(["message" => "Error al eliminar cliente"]);
    }
}
?>
