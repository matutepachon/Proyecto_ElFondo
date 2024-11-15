<?php

header('Content-Type: application/json');
require '../Configuracion/conexion.php'; 

// Obtener los datos enviados desde el formulario
$ID_Subs = $_POST['ID_Subs'];
$Plan_Sub = $_POST['Plan_Sub'];
$Estado = $_POST['Estado'];
$Tipo = $_POST['Tipo'];
$Precio = $_POST['Precio'];

// Preparar la consulta SQL para insertar los datos en la tabla 'Subscripcion'
$sql = "INSERT INTO Subscripcion (ID_Subs, Plan_Sub, Estado, Tipo, Precio) 
        VALUES ('$ID_Subs', '$Plan_Sub', '$Estado', '$Tipo', '$Precio')";

// Ejecutar la consulta y verificar si la inserción fue exitosa
if ($conn->query($sql) === TRUE) {
    // Si la inserción fue exitosa, devolver respuesta JSON de éxito
    echo json_encode(["success" => true, "message" => "Suscripción agregada correctamente"]);
} else {
    // Si hubo un error, devolver respuesta JSON con el error
    echo json_encode(["success" => false, "message" => "Error al agregar la suscripción: " . $conn->error]);
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
