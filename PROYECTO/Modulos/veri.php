<?php
session_start();

// Verifica si el ID_Usuario está en la sesión
if (isset($_SESSION['ID_Usuario'])) {
    // Si existe, muestra el ID de usuario
    echo "El ID de usuario en la sesión es: " . $_SESSION['ID_Usuario'];
} else {
    // Si no existe, muestra un mensaje de error
    echo "No se encuentra el ID de usuario en la sesión.";
}
?>
