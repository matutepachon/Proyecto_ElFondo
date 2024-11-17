<?php
// Configuración
$clientId = "AYs4iMtmN7UVoKcy7kG4hnJKj7133Z0x6i2V52ClHeY5fP_jv9bWhGLunTBnNccHKnS89DgfSvWQuiV-";
$secret = "EA2nWRp0g2VfnidZ1vHgbu1OH1hAhDoJBDqTFmvN-cuQAtGYq0QCiwretGpbgFTiu5gqTb2C-I_YYPtF";

// Obtiene el contenido JSON del POST
$body = file_get_contents('php://input');
$data = json_decode($body);

// Verifica que los datos requeridos existan
if (!isset($data->orderID) || !isset($data->payerID)) {
    echo json_encode(array("status" => "error", "message" => "Datos incompletos"));
    exit;
}

// Crea el pedido con el API de PayPal
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.sandbox.paypal.com/v1/payments/payment/{$data->orderID}/execute");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array("payer_id" => $data->payerID)));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Authorization: Basic " . base64_encode("$clientId:$secret")
));

$response = curl_exec($ch);
curl_close($ch);

// Verifica si hubo algún error al hacer la solicitud
if ($response === false) {
    echo json_encode(array("status" => "error", "message" => "Error al comunicarse con PayPal."));
    exit;
}

// Decodifica la respuesta de la API de PayPal
$dataResponse = json_decode($response);

// Verifica si la transacción fue aprobada
if (isset($dataResponse->status) && $dataResponse->status === 'COMPLETED') {
    echo json_encode(array("status" => "success", "details" => $dataResponse));
} else {
    // Muestra la respuesta completa de PayPal en caso de error
    echo json_encode(array("status" => "error", "message" => "Error al procesar el pago. Detalles: " . json_encode($dataResponse)));
}
?>
