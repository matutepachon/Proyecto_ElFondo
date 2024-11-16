document.addEventListener("DOMContentLoaded", function() {
    // Verificar el acceso del usuario al cargar la página
    fetch("../Modulos/accesos.php")
        .then(response => {
            return response.json();
        })
        .then(data => {
            const tipoUsuario = data.tipo_usuario;

            // Verifica si el usuario no es admin y está en la página de agregarEntrenador.html
            if (window.location.pathname.includes("adminEntrenadores.html") && tipoUsuario !== 'admin') {
                Swal.fire({
                    icon: "error",
                    title: "No tienes permiso para acceder a esta página.",
                    footer: '<a href="Login.html">Inicia sesión como admin</a>'
                }).then(() => {
                    window.location.href = "index.html";
                });
            }
        })
        .catch(error => {
            
            console.error("Error al verificar el acceso:", error);
            Swal.fire({
                icon: "error",
                title: "Error al verificar permisos.",
                text: "Ocurrió un error al verificar el acceso. Redirigiendo...",
            }).then(() => {
                window.location.href = "index.html";
            });
        });
    });



document.addEventListener("DOMContentLoaded", function() {
    fetch("../Modulos/verSuscripciones.php")
        .then(response => response.json())
        .then(data => {

            if (Array.isArray(data)) {
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

function borrarSuscripcion(id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "La suscripcion " + id + " se eliminará permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#baff39",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../Modulos/borrarSuscripcion.php", {
                method: "POST",
                body: JSON.stringify({ id_suscripcion: id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) { 
                    Swal.fire({
                    width: 250,
                    toast: true,
                    background: "#baff39",
                    position: "top",
                    title: "Suscripcion Eliminada",
                    showConfirmButton: false,
                    timer: 1500
                    }).then(() => {
                        setTimeout(() => { location.reload(); 
                        }, 200);
        
                    });
                } else {
                    Swal.fire({
                        width: 370,
                        toast: true,
                        background: "red",
                        position: "top",
                        title: "Error al eliminar La suscripcion",
                        showConfirmButton: false,
                        timer: 1500
                    });                }
            })
            .catch(error => {
                console.error("Error al borrar suscripción:", error);
                alert("Hubo un problema al eliminar la suscripción.");
            });
        }
    });
}
