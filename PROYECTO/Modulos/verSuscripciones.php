<?php
include('../Configuracion/conexion.php');

// Configurar el encabezado para JSON
header('Content-Type: application/json');

try {
    $sql = "SELECT ID_Subs, Plan_Sub, Estado, Tipo, Precio FROM Subscripcion";
    $result = $conn->query($sql);

    $suscripciones = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $suscripciones[] = $row;
        }
    }

    // Si no hay suscripciones, devuelve un arreglo vacío
    echo json_encode($suscripciones);

} catch (Exception $e) {
    // Captura el error y devuelve un mensaje en formato JSON
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

// Cerrar la conexión
$conn->close();
?>
