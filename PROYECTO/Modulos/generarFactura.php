<?php
// Obtener los datos enviados por el cliente (desde JavaScript)
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Verificar si los datos son válidos
if (isset($data['orderID']) && isset($data['payerID']) && isset($data['details']) && isset($data['productos']) && isset($data['total'])) {
    // Crear una factura en formato texto
    $orderID = $data['orderID'];
    $payerID = $data['payerID'];
    $productos = $data['productos'];
    $total = $data['total'];

    // Crear el contenido de la factura
    $factura = "Factura de Compra\n";
    $factura .= "ID de Orden: $orderID\n";
    $factura .= "ID del Payer: $payerID\n";
    $factura .= "Fecha: " . date('Y-m-d H:i:s') . "\n\n";
    $factura .= "Productos comprados:\n";

    foreach ($productos as $producto) {
        $factura .= "- " . $producto['nombre'] . " | Cantidad: " . $producto['cantidad'] . " | Precio Unitario: $" . number_format($producto['precio'], 2) . "\n";
    }

    $factura .= "\nTotal: $" . number_format($total, 2) . "\n";
    $factura .= "---------------------------------\n";

    // Guardar la factura en un archivo de texto (puedes almacenar en base de datos si lo prefieres)
    $nombreArchivo = 'facturas/factura_' . $orderID . '.txt';
    file_put_contents($nombreArchivo, $factura);

    // Responder al cliente que la factura fue generada exitosamente
    echo json_encode(['success' => true, 'file' => $nombreArchivo]);
} else {
    // Si los datos no son válidos, devolver un error
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
}
?>
