<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

// Conexión a la base de datos
require '../Configuracion/conexion.php'; // Asegúrate de que la ruta es correcta

// Verificar conexión a la base de datos
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Obtener el método de la solicitud
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id_usuario'])) {
            listarActividades($conn, $_GET['id_usuario']);
        } else {
            listarActividadesDisponibles($conn);
        }
        break;
    case 'POST':
        $data = getBodyData();
        seleccionarActividad($conn, $data);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

// Función para obtener el cuerpo de la solicitud
function getBodyData() {
    $data = json_decode(file_get_contents('php://input'), true);
    if (is_null($data)) {
        parse_str(file_get_contents("php://input"), $data);
    }

    return $data;
}

// Listar todas las actividades disponibles
function listarActividadesDisponibles($conn) {
    $sql = "SELECT * FROM Actividad";
    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode(["message" => "Error en la consulta: " . $conn->error]);
        return;
    }

    if ($result->num_rows > 0) {
        $actividades = [];
        while ($row = $result->fetch_assoc()) {
            $actividades[] = $row;
        }
        echo json_encode($actividades);
    } else {
        echo json_encode(["message" => "No hay actividades disponibles"]);
    }
}

// Listar las actividades a las que un usuario está suscrito, incluyendo los beneficios
function listarActividades($conn, $idUsuario) {
    // Consulta ajustada para listar actividades suscritas por el usuario
    $sql = "SELECT a.ID_Actividad, a.Tipo_Act, a.Fecha_Hora, a.Duracion
            FROM Actividad a
            JOIN Posee p ON a.ID_Actividad = p.ID_Actividad
            JOIN Integra i ON p.ID_Ben = i.ID_Ben
            WHERE i.ID_Usuario = '$idUsuario'";

    $result = $conn->query($sql);

    // Verificar si hubo errores en la consulta
    if (!$result) {
        echo json_encode(["message" => "Error en la consulta: " . $conn->error]);
        return;
    }

    // Procesar resultados si existen
    if ($result->num_rows > 0) {
        $actividades = [];
        while ($row = $result->fetch_assoc()) {
            $actividades[] = $row;
        }
        echo json_encode($actividades);
    } else {
        echo json_encode(["message" => "No estás suscrito a ninguna actividad"]);
    }
}

// Seleccionar una actividad para un cliente y asignarle los beneficios
function seleccionarActividad($conn, $data) {
    if (!isset($data['ID_Usuario'], $data['ID_Actividad'])) {
        echo json_encode(["message" => "Faltan datos necesarios para seleccionar la actividad"]);
        return;
    }

    $idUsuario = $data['ID_Usuario'];
    $idActividad = $data['ID_Actividad'];

    // Verificar si el usuario ya está suscrito a esta actividad
    $checkSql = "SELECT * FROM Posee WHERE ID_Actividad = '$idActividad' AND ID_Ben IN (SELECT ID_Ben FROM Integra WHERE ID_Usuario = '$idUsuario')";
    $checkResult = $conn->query($checkSql);

    if ($checkResult && $checkResult->num_rows > 0) {
        echo json_encode(["message" => "Ya estás inscrito en esta actividad"]);
    } else {
        // Generar un nuevo ID único para el beneficio
        $beneficioId = uniqid('ben_');
        $beneficioDesc = "Beneficio para actividad $idActividad";

        // Insertar un nuevo beneficio
        $insertBeneficioSql = "INSERT INTO Beneficios (ID_Ben, Descripcion) VALUES ('$beneficioId', '$beneficioDesc')";
        if ($conn->query($insertBeneficioSql) === TRUE) {
            // Verificar si la relación ya existe en la tabla 'Posee'
            $checkPoseeSql = "SELECT * FROM Posee WHERE ID_Actividad = '$idActividad' AND ID_Ben = '$beneficioId'";
            $checkPoseeResult = $conn->query($checkPoseeSql);

            if ($checkPoseeResult && $checkPoseeResult->num_rows == 0) {
                // Insertar la relación en la tabla 'Posee'
                $insertPoseeSql = "INSERT INTO Posee (ID_Actividad, ID_Ben) VALUES ('$idActividad', '$beneficioId')";
                if ($conn->query($insertPoseeSql) === TRUE) {
                    // Insertar el beneficio asociado al usuario en la tabla 'Integra' si no existe
                    $insertIntegraSql = "INSERT INTO Integra (ID_Usuario, ID_Ben) VALUES ('$idUsuario', '$beneficioId')";
                    if ($conn->query($insertIntegraSql) === TRUE) {
                        echo json_encode(["message" => "Actividad seleccionada y beneficios asignados con éxito"]);
                    } else {
                        echo json_encode(["message" => "Error al insertar en la tabla Integra: " . $conn->error]);
                    }
                } else {
                    echo json_encode(["message" => "Error al insertar en la tabla Posee: " . $conn->error]);
                }
            } else {
                echo json_encode(["message" => "Esta relación ya existe en la tabla Posee"]);
            }
        } else {
            echo json_encode(["message" => "Error al insertar en la tabla Beneficios: " . $conn->error]);
        }
    }
}



?>
