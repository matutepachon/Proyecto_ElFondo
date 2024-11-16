document.addEventListener("DOMContentLoaded", function() {

    // Verificar el acceso del usuario
    fetch("../Modulos/accesos.php")
        .then(response => {
            return response.json();
        })
        .then(data => {
            const tipoUsuario = data.tipo_usuario;

            // Verifica si el usuario no es admin y está en la página de admin.html
            if (window.location.pathname.includes("admin.html") && tipoUsuario !== "admin") {
                Swal.fire({
                    icon: "error",
                    title: "No tienes permiso para acceder a esta página.",
                    footer: '<a href="Login.html">Inicia sesión como admin</a>'
                }).then(() => {
                    window.location.href = 'index.html';
                });
            }
        })
        .catch(error => {
            console.error("Error al verificar el acceso: ", error);
            Swal.fire({
                icon: "error",
                title: "Error al verificar permisos.",
                text: "Ocurrió un error al verificar el acceso. Redirigiendo...",
            }).then(() => {
                window.location.href = 'index.html';
            });
        });

    // Función para cargar usuarios
    function loadUsers() {
        fetch("../Modulos/lista_usuarios.php")
            .then(response => response.json())
            .then(data => {
                const tabladeUsu = document.getElementById("tabladeUsu");
                tabladeUsu.innerHTML = "";
    
                if (data.success) {
                    data.usuarios.forEach(usuario => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${usuario.ID_Usuario}</td>
                            <td>${usuario.Nombre_Completo}</td>
                            <td>${usuario.Correo_usu}</td>
                            <td>${usuario.Estado_Suscripción}</td>
                            <td>
                                <button class="btn btn-danger BorraUsu" data-id="${usuario.ID_Usuario}">Eliminar</button>
                            </td>
                        `;
                        tabladeUsu.appendChild(row);
                    });
    
                    // Asignar eventos a los botones de eliminar
                    document.querySelectorAll(".BorraUsu").forEach(button => {
                        button.addEventListener("click", function() {
                            const usuarioId = this.getAttribute("data-id");
                            Swal.fire({
                                title: "¿Estás seguro?",
                                text: "El usuario " + usuarioId + " se eliminará permanentemente.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#baff39",
                                cancelButtonText: "Cancelar",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Sí"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    fetch("../Modulos/eliminar_usuario.php", {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
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
                                                title: "Usuario Eliminado",
                                                showConfirmButton: false,
                                                timer: 1500
                                            });
                                            loadUsers();
                                        } else {
                                            console.error(data.mensaje);
                                        }
                                    })
                                    .catch(error => {
                                        console.error(error); 
                                        Swal.fire({
                                            width: 350,
                                            toast: true,
                                            background: "Red",
                                            color: "White",
                                            position: "top",
                                            title: "Ocurrió un error al borrar el usuario",
                                            showConfirmButton: false,
                                            timer: 1500
                                        });
                                    });
                                }
                            });
                        });
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudo cargar la lista de usuarios."
                    });
                }
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un error al cargar la lista de usuarios."
                });
            });
    }
    
    
    loadUsers();

});
