<?php
session_start();
header('Content-Type: application/json');

// Incluye el archivo de conexión
require '../Configuracion/conexion.php';  // Asegúrate de que la ruta sea correcta

// Verifica si la conexión es exitosa
if (!$conn) {
    echo json_encode(['success' => false, 'error' => 'Error en la conexión a la base de datos.']);
    exit;
}

// Asegúrate de que el carrito y la compra estén disponibles
$data = json_decode(file_get_contents('php://input'), true);
$idCarrito = $data['idCarrito'] ?? null;
$idUsuario = $data['idUsuario'] ?? null;
$subtotal = $data['subtotal'] ?? 0;
$cantidadProductos = $data['cantidadProductos'] ?? 0;

if (!$idCarrito || !$idUsuario || $subtotal <= 0 || $cantidadProductos <= 0) {
    echo json_encode(['success' => false, 'error' => 'Faltan parámetros o los valores no son válidos.']);
    exit;
}

try {
    // Inicia la transacción
    $conn->begin_transaction();

    // Paso 1: Crear el registro de Compra
    $idCompra = uniqid('compra_');  // Generar un ID único para la compra
    $stmt = $conn->prepare("INSERT INTO Compra (ID_Compra, Sub_Total, Cant_Pro) VALUES (?, ?, ?)");
    $stmt->bind_param("sii", $idCompra, $subtotal, $cantidadProductos);
    $stmt->execute();

    if ($stmt->affected_rows == 0) {
        throw new Exception("Error al insertar en la tabla Compra.");
    }

    // Paso 2: Crear el registro de Factura
    $idFactura = uniqid('factura_');  // Generar un ID único para la factura
    $fechaEmision = date('Y-m-d H:i:s');
    $fechaVencimiento = date('Y-m-d H:i:s', strtotime('+1 month'));  // Por ejemplo, vencimiento en 1 mes

    // Datos de la factura (estos deberían venir de alguna entrada o ser generados)
    $direccion = "Dirección de facturación";
    $rut = 123456789;
    $telefono = 987654321;
    $nomEmisor = "Nombre del emisor";
    $cantidad = $cantidadProductos;
    $descripcion = "Descripción de la compra";
    $precioUnitario = $subtotal / $cantidadProductos;  // Estimación del precio unitario
    $precioTotal = $subtotal;
    $subtotal = $subtotal;
    $descuento = 0;  // Este valor puede cambiar
    $constancia = "constancia.pdf";  // Esto también debe ser gestionado de alguna forma
    $iva = $precioTotal * 0.19;  // Ejemplo de IVA del 19%
    $imprenta = "Nombre de la imprenta";

    $stmt = $conn->prepare("INSERT INTO Factura (ID_Fact, Fecha_Emision, Direccion, Rut, Telefono, Nom_Emisor, ID_Usuario, Cantidad, Descripcion, Precio_Unitario, Precio_Total, Subtotal, Descuento, Constancia, Fecha_Vence, Iva, Imprenta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssiiissiiiss", $idFactura, $fechaEmision, $direccion, $rut, $telefono, $nomEmisor, $idUsuario, $cantidad, $descripcion, $precioUnitario, $precioTotal, $subtotal, $descuento, $constancia, $fechaVencimiento, $iva, $imprenta);
    $stmt->execute();

    if ($stmt->affected_rows == 0) {
        throw new Exception("Error al insertar en la tabla Factura.");
    }

    // Paso 3: Relacionar la factura con el usuario
    $stmt = $conn->prepare("INSERT INTO F_Crea (ID_Usuario, ID_Compra, ID_Fact) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $idUsuario, $idCompra, $idFactura);
    $stmt->execute();

    if ($stmt->affected_rows == 0) {
        throw new Exception("Error al insertar en la tabla F_Crea.");
    }

    // Paso 4: Relacionar la compra con el carrito
    $stmt = $conn->prepare("INSERT INTO C_Genera (ID_Carrito, ID_Compra) VALUES (?, ?)");
    $stmt->bind_param("ss", $idCarrito, $idCompra);
    $stmt->execute();

    if ($stmt->affected_rows == 0) {
        throw new Exception("Error al insertar en la tabla C_Genera.");
    }

    // Paso 5: Eliminar el carrito (si es necesario) o actualizar estado
    $stmt = $conn->prepare("UPDATE Carrito SET estado = 0 WHERE ID_Carrito = ?");
    $stmt->bind_param("s", $idCarrito);
    $stmt->execute();

    if ($stmt->affected_rows == 0) {
        throw new Exception("Error al actualizar el estado del carrito.");
    }

    // Commit de la transacción si todo fue exitoso
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Compra procesada correctamente.']);

} catch (Exception $e) {
    // Rollback en caso de error
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => 'Error en el proceso de compra: ' . $e->getMessage()]);
}
?>
