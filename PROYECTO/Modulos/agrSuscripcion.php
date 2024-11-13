<?php
session_start();

// Incluir la conexión a la base de datos
include '../Configuracion/conexion.php';

header('Content-Type: application/json');

    $ID_Subs = $_POST['ID_Subs'] ?? '';
    $Plan_Sub = $_POST['Plan_Sub'] ?? '';
    $Estado = $_POST['Estado'] ?? '';
    $Tipo = $_POST['Tipo'] ?? '';
    $Precio = $_POST['Precio'] ?? '';
    
    $sql = "INSERT INTO Subscripcion (ID_Subs, Plan_Sub, Estado, Tipo, Precio) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $ID_Subs, $Plan_Sub, $Estado, $Tipo, $Precio);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Suscripcion Agregada "]);
    } else {
        echo json_encode(["message" => "Error al agregar la Suscripcion", "error" => $conn->error]);
    }

    

$stmt->close();
$conn->close();
?>
