<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

require '../Configuracion/conexion.php';  // Asegúrate de que la conexión esté correcta

// Verificar si el usuario está logueado
if (!isset($_SESSION['ID_Usuario'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();  // Aseguramos que se detenga la ejecución después de enviar la respuesta
}

// Obtener el ID del producto desde la solicitud JSON
$data = json_decode(file_get_contents("php://input"), true);

// Verificar si se ha proporcionado un ID de producto
if (!isset($data['idProducto'])) {
    echo json_encode(['success' => false, 'message' => 'ID de producto no proporcionado']);
    exit();
}

$idProducto = $data['idProducto'];
$idUsuario = $_SESSION['ID_Usuario'];  // Obtener el ID del usuario de la sesión

// Verificar si el carrito existe para este usuario
$sql = "SELECT ID_Carrito FROM Carrito WHERE ID_Usuario = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error]);
    exit();
}

$stmt->bind_param("s", $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    // Si el carrito no existe, crearlo con un ID único
    $newCarritoId = uniqid('carrito_', true);  // Generamos un ID único para el carrito

    // Crear el carrito (no especificamos ID_Carrito porque es generado)
    $createCarritoSql = "INSERT INTO Carrito (ID_Carrito, ID_Usuario, Cant_Pro, estado) VALUES (?, ?, 0, true)";
    $createCarritoStmt = $conn->prepare($createCarritoSql);
    $createCarritoStmt->bind_param("ss", $newCarritoId, $idUsuario);

    if ($createCarritoStmt->execute()) {
        // El carrito fue creado con éxito
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al crear el carrito: ' . $conn->error]);
        exit();
    }
} else {
    // Si el carrito ya existe, obtenemos el ID del carrito
    $carrito = $result->fetch_assoc();
    $newCarritoId = $carrito['ID_Carrito'];
}

// Verificar si el producto ya está en el carrito
$sqlCheck = "SELECT * FROM Guarda WHERE ID_Pro = ? AND ID_Carrito = ? AND ID_Usuario = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("sss", $idProducto, $newCarritoId, $idUsuario);
$stmtCheck->execute();
$checkResult = $stmtCheck->get_result();

if ($checkResult->num_rows > 0) {
    // El producto ya está en el carrito, incrementamos la cantidad en la tabla Carrito
    $updateCantSql = "UPDATE Carrito SET Cant_Pro = Cant_Pro + 1 WHERE ID_Carrito = ?";
    $updateCantStmt = $conn->prepare($updateCantSql);
    $updateCantStmt->bind_param("s", $newCarritoId);

    if ($updateCantStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Cantidad de producto actualizada en el carrito']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar la cantidad del producto en el carrito']);
    }
} else {
    // El producto no está en el carrito, lo agregamos
    $sqlInsert = "INSERT INTO Guarda (ID_Pro, ID_Carrito, ID_Usuario) VALUES (?, ?, ?)";
    $stmtInsert = $conn->prepare($sqlInsert);
    $stmtInsert->bind_param("sss", $idProducto, $newCarritoId, $idUsuario);

    if ($stmtInsert->execute()) {
        // Actualizar la cantidad de productos en el carrito
        $updateCantSql = "UPDATE Carrito SET Cant_Pro = Cant_Pro + 1 WHERE ID_Carrito = ?";
        $updateCantStmt = $conn->prepare($updateCantSql);
        $updateCantStmt->bind_param("s", $newCarritoId);

        if ($updateCantStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Producto agregado al carrito y cantidad actualizada']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar la cantidad del carrito']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al agregar el producto al carrito']);
    }
}
?>
