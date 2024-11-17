<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

require '../Configuracion/conexion.php';

// Verificar si el usuario está logueado
if (!isset($_SESSION['ID_Usuario'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();
}

// Obtener el ID de la suscripción desde la solicitud JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idSuscripcion'])) {
    echo json_encode(['success' => false, 'message' => 'ID de suscripción no proporcionado']);
    exit();
}

$idSuscripcion = $data['idSuscripcion'];
$idUsuario = $_SESSION['ID_Usuario']; // ID del usuario logueado

try {
    // Verificar si el carrito existe para este usuario
    $sql = "SELECT ID_Carrito, Cant_Pro FROM Carrito WHERE ID_Usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $idUsuario);
    $stmt->execute();
    $result = $stmt->get_result();

    $newCarritoId = '';
    if ($result->num_rows == 0) {
        // Crear un carrito si no existe, con Cant_Pro inicializada en 0
        $newCarritoId = uniqid('carrito_', true);
        $createCarritoSql = "INSERT INTO Carrito (ID_Carrito, ID_Usuario, Cant_Pro, estado) VALUES (?, ?, 0, true)";
        $createCarritoStmt = $conn->prepare($createCarritoSql);
        $createCarritoStmt->bind_param("ss", $newCarritoId, $idUsuario);

        if (!$createCarritoStmt->execute()) {
            throw new Exception('Error al crear el carrito: ' . $conn->error);
        }
    } else {
        // Si el carrito ya existe, obtener sus datos
        $carrito = $result->fetch_assoc();
        $newCarritoId = $carrito['ID_Carrito'];
    }

    // Verificar si la suscripción ya está en el carrito
    $sqlCheck = "SELECT * FROM S_Guarda WHERE ID_Subs = ? AND ID_Carrito = ?";
    $stmtCheck = $conn->prepare($sqlCheck);
    $stmtCheck->bind_param("ss", $idSuscripcion, $newCarritoId);
    $stmtCheck->execute();
    $checkResult = $stmtCheck->get_result();

    if ($checkResult->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'La suscripción ya está en el carrito']);
        exit();
    }

    // Agregar la suscripción al carrito
    $sqlInsert = "INSERT INTO S_Guarda (ID_Subs, ID_Carrito) VALUES (?, ?)";
    $stmtInsert = $conn->prepare($sqlInsert);
    $stmtInsert->bind_param("ss", $idSuscripcion, $newCarritoId);

    if ($stmtInsert->execute()) {
        // Actualizar la cantidad de productos en el carrito sumando 1
        $updateCantSql = "UPDATE Carrito SET Cant_Pro = Cant_Pro + 1 WHERE ID_Carrito = ?";
        $updateCantStmt = $conn->prepare($updateCantSql);
        $updateCantStmt->bind_param("s", $newCarritoId);

        if ($updateCantStmt->execute()) {
            // Obtener la cantidad actualizada desde la base de datos
            $refreshSql = "SELECT Cant_Pro FROM Carrito WHERE ID_Carrito = ?";
            $refreshStmt = $conn->prepare($refreshSql);
            $refreshStmt->bind_param("s", $newCarritoId);
            $refreshStmt->execute();
            $refreshResult = $refreshStmt->get_result();

            if ($refreshResult->num_rows > 0) {
                $carritoActualizado = $refreshResult->fetch_assoc();

                echo json_encode([
                    'success' => true,
                    'message' => 'Suscripción agregada al carrito',
                    'carritoId' => $newCarritoId,
                    'cantidad' => $carritoActualizado['Cant_Pro'] // Mostrar el valor real desde la base de datos
                ]);
                exit();
            }
        }
        throw new Exception('Error al actualizar la cantidad del carrito');
    } else {
        throw new Exception('Error al agregar la suscripción al carrito');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
