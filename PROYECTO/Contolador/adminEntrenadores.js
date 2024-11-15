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
    function recargaEntrenadores() {
        fetch("../Modulos/lista_Entrenadores.php")
            .then(response => response.json())
            .then(data => {
                const tabladeUsu = document.getElementById("tabladeEntrenadores");
                tabladeUsu.innerHTML = "";
   
                if (data.success) {
                    if (Array.isArray(data.entrenadores)) { // Verifica que sea un array
                        data.entrenadores.forEach(entrenador => {
                            const row = document.createElement("tr");
                            row.innerHTML = `
                                <td>${entrenador.ID_Usuario}</td>
                                <td>${entrenador.Correo_usu}</td>
                                <td>
                                    <button class="btn btn-danger BorraEntrenador" data-id="${entrenador.ID_Usuario}">Eliminar</button>
                                </td>
                            `;
                            tabladeUsu.appendChild(row);
                        });
                    } else {
                        alert("Error al cargar la lista de entrenadores.");
                    }
   
                    document.querySelectorAll(".BorraEntrenador").forEach(button => {
                        button.addEventListener("click", function() {
                            const usuarioId = this.getAttribute('data-id');
                            Swal.fire({
                                title: "¿Estás seguro?",
                                text: "El entrenador " + usuarioId + " se eliminará permanentemente.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#baff39",
                                cancelButtonText: "Cancelar",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Sí"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    fetch("../Modulos/elimina_Entrenador.php", {
                                        method: "POST",
                                        body: new URLSearchParams({ usuario_id: usuarioId })
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.success) {
                                            Swal.fire({
                                                width: 250,
                                                toast: true,
                                                background: "#baff39",
                                                position: "top",
                                                title: "Entrenador Eliminado",
                                                showConfirmButton: false,
                                                timer: 1500
                                            });
                                            recargaEntrenadores();
                                        } else {
                                            alert(data.mensaje);
                                        }
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                                }
                            });
                        });
                    });
                } else {
                    console.error(data.mensaje);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
   
    recargaEntrenadores();
});

