<?php
session_start();
header('Content-Type: application/json');

// Incluye el archivo de conexión
require '../Configuracion/conexion.php';  // Asegúrate de que la ruta sea correcta

// Verifica si la conexión se realizó correctamente
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtén la respuesta de PayPal
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['orderID'], $data['total'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

// Información de la transacción recibida desde PayPal
$orderID = $data['orderID'];
$total = $data['total'];

// Suponiendo que el ID del usuario lo tienes en la sesión
$idUsuario = $_SESSION['ID_Usuario'];  // Asegúrate de que la sesión tiene este valor

// Inicia la transacción en la base de datos
$conn->begin_transaction();

try {
    // 1. Crear la factura (datos estáticos)
    $fechaEmision = date("Y-m-d H:i:s");
    $direccion = "Dirección ficticia"; // Puedes modificarla si lo necesitas
    $rut = rand(10000000, 99999999); // Generar un rut aleatorio
    $telefono = rand(100000000, 999999999); // Generar teléfono aleatorio
    $nomEmisor = "Bitnes Gym"; // Nombre del emisor
    $subtotal = $total; // El subtotal es igual al total por ahora
    $iva = $subtotal * 0.22; // El IVA es el 22%
    $precioTotal = $subtotal + $iva; // Precio total con IVA

    // Generar una constancia aleatoria
    $constancia = strtoupper(uniqid('FAC-', true));

    // Descripción estática
    $descripcion = "Compra realizada a través de la web";

    // Insertar la factura en la base de datos
    $sqlFactura = "INSERT INTO Factura (ID_Fact, Fecha_Emision, Direccion, Rut, Telefono, Nom_Emisor, ID_Usuario, Cantidad, Descripcion, Precio_Total, Subtotal, Constancia, Iva) 
                   VALUES ('$orderID', '$fechaEmision', '$direccion', $rut, $telefono, '$nomEmisor', $idUsuario, 1, '$descripcion', $precioTotal, $subtotal, '$constancia', $iva)";

    if ($conn->query($sqlFactura) !== TRUE) {
        throw new Exception("Error al insertar la factura");
    }

    // 2. Eliminar todos los productos del carrito
    $stmt = $conn->prepare("DELETE FROM Carrito WHERE ID_Usuario = ?");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();

    // 3. Eliminar todos los productos guardados (de la tabla Guarda)
    $stmt = $conn->prepare("DELETE FROM Guarda WHERE ID_Usuario = ?");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();

    // 4. Eliminar todas las suscripciones guardadas (de la tabla S_Guarda)
    $stmt = $conn->prepare("DELETE FROM S_Guarda WHERE ID_Usuario = ?");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();

    // 5. Finalizar la transacción
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Factura generada correctamente y productos eliminados']);

} catch (Exception $e) {
    // Si hay algún error, revertir la transacción
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

// Cerrar la conexión
$conn->close();
?>
