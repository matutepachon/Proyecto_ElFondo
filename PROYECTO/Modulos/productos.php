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
            // Si estás esperando que el ID se pase a través del cuerpo de la solicitud
            $data = getBodyData();
            // Asegúrate de que estás pasando el ID correcto
            if (isset($data['id'])) {
                eliminarProducto($conn, $data['id']);
            } else {
                http_response_code(400); // Bad Request
                echo json_encode(["message" => "ID no proporcionado"]);
            }
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
    $data = getBodyData(); // Obtener los datos
    $id_pro = $data['ID_Pro'];
    $precio = $data['Precio'];
    $cat_pro = $data['Cat_Pro'];
    $nombre = $data['Nom_Pro'];
    $descuento = $data['Desc_Pro'];
    $rut_img = $data['Rut_Img'];
    $descripcion = $data['Descripcion']; // Mantener como descripción adicional

    // Preparar la consulta SQL para insertar los datos
    $sql = "INSERT INTO Producto (ID_Pro, Precio, Cat_Pro, Nom_Pro, Desc_Pro, Rut_Img, Descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssss", $id_pro, $precio, $cat_pro, $nombre, $descuento, $rut_img, $descripcion);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Producto agregado correctamente"]);
    } else {
        echo json_encode(["message" => "Error al agregar producto", "error" => $conn->error]);
    }
}



function modificarProducto($conn, $data) {
    error_log("Datos recibidos: " . print_r($data, true));

    $id_pro = $data['ID_Pro'] ?? null;
    $precio = $data['Precio'] ?? null;
    $cat_pro = $data['Cat_Pro'] ?? null;
    $nombre = $data['Nom_Pro'] ?? null;
    $descuento = $data['Desc_Pro'] ?? null;
    $rut_img = $data['Rut_Img'] ?? null;
    $descripcion = $data['Descripcion'] ?? null;


    $sql = "UPDATE Producto SET Precio = ?, Cat_Pro = ?, Nom_Pro = ?, Desc_Pro = ?, Rut_Img = ?, Descripcion = ? WHERE ID_Pro = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(["success" => false, "message" => "Error al preparar la consulta", "error" => $conn->error]);
        return;
    }

    $stmt->bind_param("sssssss", $precio, $cat_pro, $nombre, $descuento, $rut_img, $descripcion, $id_pro);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Producto modificado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al ejecutar la consulta", "error" => $stmt->error]);
    }

    $stmt->close();
}



function eliminarProducto($conn, $id) {
    $conn->begin_transaction();

    try {
        $conn->query("DELETE FROM Incluye WHERE ID_Pro = '$id'");
        $conn->query("DELETE FROM Selecciona WHERE ID_Pro = '$id'");
        $conn->query("DELETE FROM Añade WHERE ID_Pro = '$id'");
        $conn->query("DELETE FROM Guarda WHERE ID_Pro = '$id'");

        $sql = "DELETE FROM Producto WHERE ID_Pro = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $id);

        header('Content-Type: application/json');

        if ($stmt->execute()) {
            $conn->commit();
            echo json_encode(["message" => "Producto eliminado correctamente"]);
        } else {
            $conn->rollback();
            echo json_encode(["message" => "Error al eliminar producto", "error" => $conn->error]);
        }
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["message" => "Error al eliminar producto", "error" => $e->getMessage()]);
    }
}

