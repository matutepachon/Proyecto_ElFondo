<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

require '../Configuracion/conexion.php';

// Obtener ID del usuario logueado desde la sesión
$idUsuario = $_SESSION['ID_Usuario'] ?? null;

function getBodyData() {
    $data = json_decode(file_get_contents('php://input'), true);
    if (is_null($data)) {
        parse_str(file_get_contents("php://input"), $data);
    }
    return $data;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['alt']) && $_GET['alt'] === 'true') {
            obtenerAltura($conn, $idUsuario);
        } elseif (isset($_GET['id'])) {
            obtenerEntrenamiento($conn, $_GET['id']);
        } else {
            listarEntrenamientos($conn);
        }
        break;
    case 'POST':
        $data = getBodyData();
        agregarEntrenamiento($conn, $data, $idUsuario);
        break;
    case 'PUT':
        $data = getBodyData();
        modificarEntrenamiento($conn, $data);
        break;
    case 'DELETE':
        $data = getBodyData();
        if (isset($data['id'])) {
            eliminarEntrenamiento($conn, $data['id']);
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

// Funciones CRUD
// Listar Entrenamientos del usuario logueado (GET)
// Listar Entrenamientos del usuario logueado (GET)
function listarEntrenamientos($conn) {
    // Obtener el ID del usuario logueado desde la sesión
    
    if (!isset($_SESSION['ID_Usuario'])) {
        echo json_encode(["message" => "Usuario no logueado"]);
        return;
    }
    
    $idUsuario = $_SESSION['ID_Usuario'];

    // Consulta que une las tablas Entrenamiento y Registra para obtener solo los entrenamientos del usuario logueado
    $sql = "
        SELECT e.* 
        FROM Entrenamiento e
        INNER JOIN Registra r ON e.ID_Ent = r.ID_Ent
        WHERE r.ID_Usuario = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idUsuario);  // Suponiendo que ID_Usuario es un número entero
    $stmt->execute();
    $result = $stmt->get_result();
    
    $entrenamientos = [];
    while ($row = $result->fetch_assoc()) {
        $entrenamientos[] = $row;
    }
    
    echo json_encode($entrenamientos);
}

// Obtener Entrenamiento por ID del usuario logueado (GET)
function obtenerEntrenamiento($conn, $id) {
    // Obtener el ID del usuario logueado desde la sesión
    session_start();
    if (!isset($_SESSION['ID_Usuario'])) {
        echo json_encode(["message" => "Usuario no logueado"]);
        return;
    }
    
    $idUsuario = $_SESSION['ID_Usuario'];

    // Consulta que une las tablas Entrenamiento y Registra para obtener solo los entrenamientos del usuario logueado
    $sql = "
        SELECT e.* 
        FROM Entrenamiento e
        INNER JOIN Registra r ON e.ID_Ent = r.ID_Ent
        WHERE e.ID_Ent = ? AND r.ID_Usuario = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $id, $idUsuario);  // Suponiendo que ID_Ent es un varchar y ID_Usuario es un int
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Si no se encuentra el entrenamiento, devolver un mensaje
    $entrenamiento = $result->fetch_assoc();
    
    if ($entrenamiento) {
        echo json_encode($entrenamiento);
    } else {
        echo json_encode(["message" => "Entrenamiento no encontrado o no pertenece al usuario"]);
    }
}



// Agregar Entrenamiento (POST)
function agregarEntrenamiento($conn, $data, $idUsuario) {
    $id_ent = uniqid();
    $tipo_ent = $data['tipo_ent'];
    $tiempo_ent = $data['tiempo_ent'];
    $calor_quem = $data['calor_quem'];
    $registro_peso = $data['peso'];
    $registro_imc = $data['imc']; // Obtener IMC del cuerpo de la solicitud

    $conn->begin_transaction();
    try {
        // Insertar en la tabla Entrenamiento
        $sql1 = "INSERT INTO Entrenamiento (ID_Ent, Tipo_Ent, Tiempo_Ent, Calor_Quem, registro_peso, registro_imc) 
                 VALUES (?, ?, ?, ?, ?, ?)";
        $stmt1 = $conn->prepare($sql1);
        $stmt1->bind_param("ssiidd", $id_ent, $tipo_ent, $tiempo_ent, $calor_quem, $registro_peso, $registro_imc);
        $stmt1->execute();

        // Insertar en la tabla Registra
        $sql2 = "INSERT INTO Registra (ID_Ent, ID_Usuario) VALUES (?, ?)";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->bind_param("si", $id_ent, $idUsuario);
        $stmt2->execute();

        // Actualizar el peso del cliente en la tabla Cliente
        $sql3 = "UPDATE Cliente SET Peso = ? WHERE ID_Usuario = ?";
        $stmt3 = $conn->prepare($sql3);
        $stmt3->bind_param("di", $registro_peso, $idUsuario);
        $stmt3->execute();

        // Confirmar la transacción
        $conn->commit();
        echo json_encode(["message" => "Entrenamiento agregado correctamente y peso del cliente actualizado"]);
    } catch (Exception $e) {
        // Revertir los cambios en caso de error
        $conn->rollback();
        echo json_encode(["message" => "Error al agregar entrenamiento", "error" => $e->getMessage()]);
    }
}
function eliminarEntrenamiento($conn, $id) {
    $conn->begin_transaction();

    try {
        // Eliminar los registros relacionados en la tabla Registra
        $conn->query("DELETE FROM Registra WHERE ID_Ent = '$id'");

        // Eliminar el entrenamiento de la tabla Entrenamiento
        $sql = "DELETE FROM Entrenamiento WHERE ID_Ent = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $id);

        header('Content-Type: application/json');  // Especificar que la respuesta es JSON

        if ($stmt->execute()) {
            $conn->commit();  // Confirmar la transacción
            echo json_encode(["message" => "Entrenamiento eliminado correctamente"]);
        } else {
            $conn->rollback();  // Revertir en caso de error
            echo json_encode(["message" => "Error al eliminar entrenamiento", "error" => $conn->error]);
        }
    } catch (Exception $e) {
        $conn->rollback();  // Revertir en caso de excepción
        echo json_encode(["message" => "Error al eliminar entrenamiento", "error" => $e->getMessage()]);
    }
}


?>
