<?php
session_start();
header('Content-Type: application/json');

// Incluye el archivo de conexión
require '../Configuracion/conexion.php';  // Asegúrate de que la ruta sea correcta

// Verifica si la conexión es exitosa
if (!$conn) {
    echo json_encode(['success' => false, 'error' => 'Error en la conexión a la base de datos.']);
    exit;
}

// Suponiendo que el ID del producto o suscripción esté presente en el cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);
$idProducto = $data['idProducto'] ?? null;

if (!$idProducto) {
    echo json_encode(['success' => false, 'error' => 'Faltan parámetros.']);
    exit;
}

try {
    // Verifica si es un Producto
    $stmt = $conn->prepare("SELECT * FROM Producto WHERE ID_Pro = ?");
    $stmt->bind_param("s", $idProducto); // 's' indica que es un string
    $stmt->execute();
    $producto = $stmt->get_result()->fetch_assoc();

    if ($producto) {
        // Si es un Producto, disminuimos Cant_Pro en la tabla Carrito
        $stmt = $conn->prepare("UPDATE Carrito SET Cant_Pro = Cant_Pro - 1 WHERE ID_Carrito = ?");
        $stmt->bind_param("s", $idProducto);
        $stmt->execute();

        // Verificamos si Cant_Pro llegó a 0 y eliminamos el carrito si es el caso
        $stmt = $conn->prepare("SELECT Cant_Pro FROM Carrito WHERE ID_Carrito = ?");
        $stmt->bind_param("s", $idProducto);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        if ($result && $result['Cant_Pro'] <= 0) {
            // Si Cant_Pro es 0 o menos, eliminamos el producto del carrito
            $stmt = $conn->prepare("DELETE FROM Carrito WHERE ID_Carrito = ?");
            $stmt->bind_param("s", $idProducto);
            $stmt->execute();
        }

        // Luego, eliminamos de la tabla 'Guarda'
        $stmt = $conn->prepare("DELETE FROM Guarda WHERE ID_Pro = ?");
        $stmt->bind_param("s", $idProducto);
        $stmt->execute();

        echo json_encode(['success' => true]);
    } else {
        // Si no es un producto, verificamos si es una Suscripción
        $stmt = $conn->prepare("SELECT * FROM Subscripcion WHERE ID_Subs = ?");
        $stmt->bind_param("s", $idProducto);
        $stmt->execute();
        $subscripcion = $stmt->get_result()->fetch_assoc();

        if ($subscripcion) {
            // Si es una Suscripción, disminuimos Cant_Pro en la tabla Carrito
            $stmt = $conn->prepare("UPDATE Carrito SET Cant_Pro = Cant_Pro - 1 WHERE ID_Carrito = ?");
            $stmt->bind_param("s", $idProducto);
            $stmt->execute();

            // Verificamos si Cant_Pro llegó a 0 y eliminamos el carrito si es el caso
            $stmt = $conn->prepare("SELECT Cant_Pro FROM Carrito WHERE ID_Carrito = ?");
            $stmt->bind_param("s", $idProducto);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            if ($result && $result['Cant_Pro'] <= 0) {
                // Si Cant_Pro es 0 o menos, eliminamos el producto del carrito
                $stmt = $conn->prepare("DELETE FROM Carrito WHERE ID_Carrito = ?");
                $stmt->bind_param("s", $idProducto);
                $stmt->execute();
            }

            // Luego, eliminamos de la tabla 'S_Guarda'
            $stmt = $conn->prepare("DELETE FROM S_Guarda WHERE ID_Subs = ?");
            $stmt->bind_param("s", $idProducto);
            $stmt->execute();

            echo json_encode(['success' => true]);
        } else {
            // Si no se encuentra ni un producto ni una suscripción, retornamos error
            echo json_encode(['success' => false, 'error' => 'No se encontró el producto o suscripción.']);
            exit;
        }
    }
} catch (Exception $e) {
    // Si ocurre un error en la ejecución
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
}
?>
