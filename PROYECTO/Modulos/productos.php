<?php
session_start();


// productos.php

header('Content-Type: application/json');
require '../Configuracion/conexion.php';

// Método para obtener el cuerpo de la solicitud
function getBodyData() {
    return json_decode(file_get_contents('php://input'), true);
}

// Obtener el método HTTP (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            obtenerProducto($conn, $_GET['id']);
        } else {
            listarProductos($conn);
        }
        break;
    case 'POST':
        $data = getBodyData();
        agregarProducto($conn, $data);
        break;
    case 'PUT':
        $data = getBodyData();
        modificarProducto($conn, $data);
        break;
    case 'DELETE':
        $data = getBodyData();
        eliminarProducto($conn, $data['id']);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

// Funciones CRUD

// Listar Productos (GET)
function listarProductos($conn) {
    $sql = "SELECT * FROM Producto";
    $result = $conn->query($sql);

    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }

    echo json_encode($productos);
}

// Obtener Producto por ID (GET)
function obtenerProducto($conn, $id) {
    $sql = "SELECT * FROM Producto WHERE ID_Pro = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["message" => "Producto no encontrado"]);
    }
}

// Agregar Producto (POST)
function agregarProducto($conn, $data) {
    $sql = "INSERT INTO Producto (ID_Pro, Precio, Nom_Pro, Desc_Pro, Imagen) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $data['ID_Pro'], $data['Precio'], $data['Nom_Pro'], $data['Desc_Pro'], $data['Imagen']);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Producto agregado correctamente"]);
    } else {
        echo json_encode(["message" => "Error al agregar producto", "error" => $conn->error]);
    }
}

// Modificar Producto (PUT)
function modificarProducto($conn, $data) {
    $sql = "UPDATE Producto SET Precio = ?, Nom_Pro = ?, Desc_Pro = ?, Imagen = ? WHERE ID_Pro = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $data['Precio'], $data['Nom_Pro'], $data['Desc_Pro'], $data['Imagen'], $data['ID_Pro']);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Producto modificado correctamente"]);
    } else {
        echo json_encode(["message" => "Error al modificar producto", "error" => $conn->error]);
    }
}

// Eliminar Producto (DELETE)
function eliminarProducto($conn, $id) {
    $sql = "DELETE FROM Producto WHERE ID_Pro = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Producto eliminado correctamente"]);
    } else {
        echo json_encode(["message" => "Error al eliminar producto", "error" => $conn->error]);
    }
}
