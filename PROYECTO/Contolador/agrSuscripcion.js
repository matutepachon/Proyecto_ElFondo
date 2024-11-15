
document.getElementById("añadSub").addEventListener("submit", function(e) {
    e.preventDefault();  // Evita que la página se recargue

    // Crear un nuevo objeto FormData a partir del formulario
    const formData = new FormData(this);

    // Enviar los datos mediante Fetch a PHP
    fetch('../Modulos/agregarSuscripcion.php', {
        method: 'POST',
        body: formData  // Aquí simplemente pasamos el objeto FormData
    })
    .then(response => response.json())  // Convertir la respuesta en JSON
    .then(data => {
        // Verificar si la respuesta contiene éxito o error
        if (data.success) {
            alert("Suscripción agregada correctamente");
        } else {
            alert("Error al agregar suscripción: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error al comunicarse con el servidor:', error);
        alert('Hubo un error al procesar la solicitud.');
    });
});
