<?php

require('../Configuracion/conexion.php');

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$id_suscripcion = $data['id_suscripcion'];

try {
    $conn->begin_transaction();

    $queries = [
        "DELETE FROM Elige WHERE ID_Subs = ?",
        "DELETE FROM Ofrece WHERE ID_Subs = ?",
        "DELETE FROM S_Guarda WHERE ID_Subs = ?",
        "DELETE FROM Compra WHERE ID_Compra = ?",
        "DELETE FROM Factura WHERE ID_Fact = ?",
        "DELETE FROM Subscripcion WHERE ID_Subs = ?"
    ];

    foreach ($queries as $query) {
        $stmt = $conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $conn->error);
        }

        $stmt->bind_param("s", $id_suscripcion);

        if (!$stmt->execute()) {
            throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
        }

        $stmt->close();
    }

    $conn->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {    
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();



?>
