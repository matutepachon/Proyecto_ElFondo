<?php
session_start();
header('Content-Type: application/json');
require '../Configuracion/conexion.php'; // Archivo con la conexión a MySQLi

if (!isset($_SESSION['ID_Usuario'])) {
    echo json_encode(['error' => 'Usuario no logueado']);
    exit;
}

$idUsuario = $_SESSION['ID_Usuario'];

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Error al conectar con la base de datos: ' . $conn->connect_error]);
    exit;
}

// Obtener los dos últimos registros de entrenamiento para el usuario
$query = "
    SELECT e.registro_peso, e.registro_imc
    FROM Entrenamiento e
    INNER JOIN Registra r ON e.ID_Ent = r.ID_Ent
    WHERE r.ID_Usuario = ?
    ORDER BY e.ID_Ent DESC
    LIMIT 2
";
$stmt = $conn->prepare($query);

// Verificar si la preparación de la consulta fue exitosa
if ($stmt === false) {
    echo json_encode(['error' => 'Error al preparar la consulta: ' . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("i", $idUsuario);
$stmt->execute();
$result = $stmt->get_result();
$registros = $result->fetch_all(MYSQLI_ASSOC);

// Validar si hay suficientes registros
if (count($registros) < 2) {
    echo json_encode(['error' => 'No hay suficientes registros para calcular la variación.']);
    $stmt->close();
    $conn->close();
    exit;
}

// Calcular variación de peso
$variacionPeso = $registros[0]['registro_peso'] - $registros[1]['registro_peso'];

// Datos para la gráfica del IMC
$graficaQuery = "
    SELECT e.registro_imc
    FROM Entrenamiento e
    INNER JOIN Registra r ON e.ID_Ent = r.ID_Ent
    WHERE r.ID_Usuario = ?
    ORDER BY e.ID_Ent ASC
";
$graficaStmt = $conn->prepare($graficaQuery);

// Verificar si la preparación de la consulta fue exitosa
if ($graficaStmt === false) {
    echo json_encode(['error' => 'Error al preparar la consulta para la gráfica: ' . $conn->error]);
    $stmt->close();
    $conn->close();
    exit;
}

$graficaStmt->bind_param("i", $idUsuario);
$graficaStmt->execute();
$graficaResult = $graficaStmt->get_result();
$imcHistorico = $graficaResult->fetch_all(MYSQLI_ASSOC);

// Cerrar conexiones
$stmt->close();
$graficaStmt->close();
$conn->close();

// Devolver los datos en formato JSON
echo json_encode([
    'imcActual' => $registros[0]['registro_imc'],
    'variacionPeso' => $variacionPeso,
    'imcHistorico' => $imcHistorico
]);
?>
