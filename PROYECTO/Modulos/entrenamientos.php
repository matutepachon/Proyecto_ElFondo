<?php
session_start();
header('Content-Type: application/json');
require '../Configuracion/conexion.php';

// Obtener ID del usuario logueado desde la sesión
$idUsuario = $_SESSION['ID_Usuario'] ?? null;

if (!$idUsuario) {
    echo json_encode(["message" => "Usuario no autenticado"]);
    http_response_code(401); // Error de autenticación
    exit;
}

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
    echo json_encode($result->fetch_assoc() ?: ["message" => "Entrenamiento no encontrado"]);
}

//

// Agregar Entrenamiento (POST)
function agregarEntrenamiento($conn, $data, $idUsuario) {
    $id_ent = uniqid();
    $tipo_ent = $data['tipo_ent'];
    $tiempo_ent = $data['tiempo_ent'];
    $calor_quem = $data['calor_quem'];
    $registro_peso = $data['peso'];  // Nuevo peso del usuario
    $registro_imc = $data['imc'];    // Obtener IMC del cuerpo de la solicitud

    $conn->begin_transaction();
    try {
        // Insertar el nuevo entrenamiento en la tabla Entrenamiento
        $sql1 = "INSERT INTO Entrenamiento (ID_Ent, Tipo_Ent, Tiempo_Ent, Calor_Quem, registro_peso, registro_imc) 
                 VALUES (?, ?, ?, ?, ?, ?)";
        $stmt1 = $conn->prepare($sql1);
        $stmt1->bind_param("ssiiii", $id_ent, $tipo_ent, $tiempo_ent, $calor_quem, $registro_peso, $registro_imc);
        $stmt1->execute();

        // Insertar en la tabla de relación Registra
        $sql2 = "INSERT INTO Registra (ID_Ent, ID_Usuario) VALUES (?, ?)";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->bind_param("si", $id_ent, $idUsuario);
        $stmt2->execute();

        // Actualizar el peso del usuario logueado en la tabla Cliente
        $sql3 = "UPDATE Cliente SET Peso = ? WHERE ID_Usuario = ?";
        $stmt3 = $conn->prepare($sql3);
        $stmt3->bind_param("di", $registro_peso, $idUsuario);
        $stmt3->execute();

        // Confirmar la transacción
        $conn->commit();
        echo json_encode(["message" => "Entrenamiento agregado y peso del usuario actualizado correctamente"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["message" => "Error al agregar entrenamiento", "error" => $e->getMessage()]);
    }
}

// Modificar Entrenamiento (PUT)
function modificarEntrenamiento($conn, $data) {
    $id_ent = $data['ID_Ent'];
    $tipo_ent = $data['Tipo_Ent'];
    $tiempo_ent = $data['Tiempo_Ent'];
    $calor_quem = $data['Calor_Quem'];
    $registro_peso = $data['registro_peso'];
    $registro_imc = $data['imc']; // Obtener IMC del cuerpo de la solicitud

    $sql = "UPDATE Entrenamiento SET Tipo_Ent = ?, Tiempo_Ent = ?, Calor_Quem = ?, registro_peso = ?, registro_imc = ? WHERE ID_Ent = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("siiiss", $tipo_ent, $tiempo_ent, $calor_quem, $registro_peso, $registro_imc, $id_ent);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Entrenamiento modificado correctamente"]);
    } else {
        echo json_encode(["message" => "Error al modificar entrenamiento", "error" => $stmt->error]);
    }
}

// Eliminar Entrenamiento (DELETE)
function eliminarEntrenamiento($conn, $id) {
    $sql = "DELETE FROM Entrenamiento WHERE ID_Ent = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Entrenamiento eliminado correctamente"]);
    } else {
        echo json_encode(["message" => "Error al eliminar entrenamiento", "error" => $conn->error]);
    }
}
?>
