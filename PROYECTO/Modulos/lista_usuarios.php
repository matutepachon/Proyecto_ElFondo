<?php
session_start();
header("Content-Type: application/json");

require_once "../Configuracion/conexion.php";

// Consulta para obtener el ID, nombre completo, correo y el estado de suscripción
$query = "
    SELECT 
        c.ID_Usuario,
        CONCAT(c.Nombre, ' ', c.Apellidos) AS Nombre_Completo,
        u.Correo_usu,
        CASE 
            WHEN e.ID_Subs IS NOT NULL THEN 'Tiene suscripción'
            ELSE 'Sin suscripción'
        END AS Estado_Suscripción
    FROM 
        Cliente c
    JOIN 
        Usuario u ON c.ID_Usuario = u.ID_Usuario
    LEFT JOIN 
        Elige e ON c.ID_Usuario = e.ID_Cliente;
";

$result = $conn->query($query);

if (!$result) {
    echo json_encode(["success" => false, "mensaje" => "Error en la consulta: " . $conn->error]);
    exit;
}

$usuarios = [];

// Recopilar los datos en un arreglo
while ($row = $result->fetch_assoc()) {
    $usuarios[] = $row;
}

// Retornar los datos en formato JSON
echo json_encode(["success" => true, "usuarios" => $usuarios]);

$conn->close();
?>
