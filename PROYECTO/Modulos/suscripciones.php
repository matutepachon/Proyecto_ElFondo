<?php
session_start();
header('Content-Type: application/json');

include('../configuracion/conexion.php');

$query = "SELECT ID_Subs, Plan_Sub, Tipo, Precio, Estado FROM Subscripcion";
$result = $conn->query($query);

$suscripciones = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $suscripciones[] = $row;
    }
    echo json_encode($suscripciones);
} else {
    echo json_encode(['error' => 'No se encontraron suscripciones.']);
}

$conn->close();
?>
