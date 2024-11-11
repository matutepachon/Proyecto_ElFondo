<?php
session_start();
header('Content-Type: application/json');

require_once '../Configuracion/conexion.php';

if (isset($_SESSION['correo'])) {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $usuario_id = $_POST['usuario_id'] ?? '';

        if ($usuario_id) {
            $stmt = $conn->prepare("DELETE FROM Entrenador WHERE ID_Usuario = ?");
            $stmt->bind_param("i", $usuario_id);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'mensaje' => 'Entrenador eliminado correctamente.']);
            } else {
                echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar al Entrenador.']);
            }

            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'mensaje' => 'ID de entrenador no proporcionado.']);
        }
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Método de solicitud no válido.']);
    }
} else {
    echo json_encode(['success' => false, 'mensaje' => 'No autorizado.']);
}

$conn->close();
?>
