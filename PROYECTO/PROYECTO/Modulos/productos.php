<?php
session_start();


// productos.php

header('Content-Type: application/json');
require '../Configuracion/conexion.php';

// Método para obtener el cuerpo de la solicitud
function getBodyData() {
    $data = json_decode(file_get_contents('php://input'), true);
    if (is_null($data)) {
        parse_str(file_get_contents("php://input"), $data);
    }
    return $data;
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
function agregarProducto($conn) {
    // Acceder a los datos enviados por FormData
    $id_pro = $_POST['ID_Pro'];
    $precio = $_POST['Precio'];
    $nombre = $_POST['Nom_Pro'];
    $descripcion = $_POST['Desc_Pro'];
    $imagen = $_POST['Imagen'];

    // Preparar la consulta SQL para insertar los datos
    $sql = "INSERT INTO Producto (ID_Pro, Precio, Nom_Pro, Desc_Pro, Imagen) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $id_pro, $precio, $nombre, $descripcion, $imagen);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Producto agregado correctamente"]);
    } else {
        echo json_encode(["message" => "Error al agregar producto", "error" => $conn->error]);
    }
}





// Modificar Producto (PUT)
function modificarProducto($conn, $data) {
    // Acceder a los datos enviados por JSON
    $id_pro = $data['ID_Pro']; // Se utiliza para buscar el producto
    $precio = $data['Precio'];
    $nombre = $data['Nom_Pro'];
    $descripcion = $data['Desc_Pro'];
    $imagen = $data['Imagen'];

    // Verificar que se reciban todos los datos
    if (empty($id_pro) || empty($precio) || empty($nombre) || empty($descripcion) || empty($imagen)) {
        echo json_encode(["message" => "Faltan datos, todos los campos son requeridos"]);
        return;
    }

    // Preparar la consulta SQL para actualizar los datos
    $sql = "UPDATE Producto SET Precio = ?, Nom_Pro = ?, Desc_Pro = ?, Imagen = ? WHERE ID_Pro = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(["message" => "Error al preparar la consulta", "error" => $conn->error]);
        return;
    }

    // Enlazar parámetros
    $stmt->bind_param("sssss", $precio, $nombre, $descripcion, $imagen, $id_pro);

    // Ejecutar la consulta y verificar el resultado
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["message" => "Producto modificado correctamente"]);
        } else {
            echo json_encode(["message" => "No se encontró el producto o no se modificaron los datos"]);
        }
    } else {
        echo json_encode(["message" => "Error al ejecutar la consulta", "error" => $stmt->error]);
    }
    
    // Cerrar el statement
    $stmt->close(); // Asegúrate de cerrar el statement después de ejecutarlo
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

