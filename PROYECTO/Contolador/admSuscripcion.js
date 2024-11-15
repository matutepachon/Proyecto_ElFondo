document.addEventListener('DOMContentLoaded', function() {
    fetch("../Modulos/verSuscripciones.php")
        .then(response => response.json())
        .then(data => {
            console.log(data); // Ver qué contiene 'data'
            
            // Verificamos si la respuesta es un arreglo
            if (Array.isArray(data)) {
                // Si la respuesta es un arreglo, mostramos las suscripciones
                const container = document.getElementById("suscripcionesContainer");
                data.forEach(suscripcion => {
                    const card = document.createElement("div");
                    card.classList.add("card", "col-12", "col-md-5", "mx-auto", "my-3", "p-3");
                    card.innerHTML = `
                        <h5 class="card-title">${suscripcion.Plan_Sub}</h5>
                        <p><strong>ID Suscripción:</strong> ${suscripcion.ID_Subs}</p>
                        <p><strong>Estado:</strong> ${suscripcion.Estado}</p>
                        <p><strong>Tipo:</strong> ${suscripcion.Tipo}</p>
                        <p><strong>Precio:</strong> $${suscripcion.Precio}</p>
                        <button class="btn btn-danger" onclick="borrarSuscripcion('${suscripcion.ID_Subs}')">Borrar</button>
                    `;
                    container.appendChild(card);
                });
            } else {
                console.error("La respuesta no es un arreglo:", data);
                alert("Hubo un problema al cargar las suscripciones.");
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            alert("Hubo un problema al cargar las suscripciones.");
        });
});

// Función para borrar una suscripción
function borrarSuscripcion(id) {
    console.log('ID de suscripción a borrar:', id);  // Verifica que el ID es correcto
    if (confirm("¿Estás seguro de que deseas borrar esta suscripción?")) {
        fetch('../Modulos/borrarSuscripcion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_suscripcion: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Suscripción eliminada correctamente.");
                location.reload(); // Recargar la página para actualizar las suscripciones
            } else {
                alert("Hubo un problema al eliminar la suscripción." + data.error);
            }
        })
        .catch(error => {
            console.error("Error al borrar suscripción:", error);
            alert("Hubo un problema al eliminar la suscripción.");
        });
    }
}
