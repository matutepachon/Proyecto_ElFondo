<?php
session_start();
header('Content-Type: application/json');

require_once '../Configuracion/conexion.php';

if (isset($_SESSION['correo'])) {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $usuario_id = $_POST['usuario_id'] ?? '';

        if ($usuario_id) {
            $conn->begin_transaction();

            try {
                $conn->query("DELETE FROM Realiza WHERE ID_Usuario = $usuario_id");
                $conn->query("DELETE FROM Elige WHERE ID_Cliente = $usuario_id");
                $conn->query("DELETE FROM Agrega WHERE ID_Usuario = $usuario_id");
                $conn->query("DELETE FROM Integra WHERE ID_Usuario = $usuario_id");
                $conn->query("DELETE FROM Selecciona WHERE ID_Usuario = $usuario_id");
                $conn->query("DELETE FROM Añade WHERE ID_Usuario = $usuario_id");
                $conn->query("DELETE FROM Cliente WHERE ID_Usuario = $usuario_id");

                $stmt = $conn->prepare("DELETE FROM Usuario WHERE ID_Usuario = ?");
                $stmt->bind_param("i", $usuario_id);
                if ($stmt->execute()) {
                    $conn->commit();
                    echo json_encode(['success' => true, 'mensaje' => 'Usuario y registros relacionados eliminados correctamente.']);
                } else {
                    $conn->rollback();
                    echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar el usuario.']);
                }
                $stmt->close();
            } catch (Exception $e) {
                $conn->rollback();
                echo json_encode(['success' => false, 'mensaje' => 'Error en la transacción: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'mensaje' => 'ID de usuario no proporcionado.']);
        }
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Método de solicitud no válido.']);
    }
} else {
    echo json_encode(['success' => false, 'mensaje' => 'No autorizado.']);
}

$conn->close();
?>
