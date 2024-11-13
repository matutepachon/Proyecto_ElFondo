document.addEventListener('DOMContentLoaded', function() {

    // Verificar el acceso del usuario
    fetch('../Modulos/accesos.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tipoUsuario = data.tipo_usuario;

            // Verifica si el usuario no es admin y está en la página de admin.html
            if (window.location.pathname.includes('admin.html') && tipoUsuario !== 'admin') {
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
            console.error('Error al verificar el acceso:', error);
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
        fetch('../Modulos/lista_usuarios.php')
            .then(response => response.json())
            .then(data => {
                const tabladeUsu = document.getElementById('tabladeUsu');
                tabladeUsu.innerHTML = '';

                if (data.success) {
                    data.usuarios.forEach(usuario => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${usuario.ID_Usuario}</td>
                            <td>${usuario.Nombre}</td>
                            <td>${usuario.Apellidos}</td>
                            <td>${usuario.Correo_usu}</td>
                            <td>
                                <button class="btn btn-danger BorraUsu" data-id="${usuario.ID_Usuario}">Eliminar</button>
                            </td>
                        `;
                        tabladeUsu.appendChild(row);
                    });

                    // Agregar evento de eliminación a cada botón
                    document.querySelectorAll('.BorraUsu').forEach(button => {
                        button.addEventListener('click', function() {
                            const usuarioId = this.getAttribute('data-id');
                            // Confirmar antes de eliminar
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
                                    fetch('../Modulos/eliminar_usuario.php', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        body: new URLSearchParams({ usuario_id: usuarioId })
                                    })
                                    .then(response => {
                                        if (!response.ok) {
                                            return response.text().then(text => {
                                                console.error('Error response:', text);  // Muestra el error en la consola
                                                throw new Error(text); // Lanza el error para capturarlo
                                            });
                                        }
                                        return response.json(); // Si la respuesta es válida, la convertimos en JSON
                                    })
                                    .then(data => {
                                        console.log(data);  // Muestra los datos que recibimos
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
                                            alert(data.mensaje); // Mostrar el mensaje de error
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);  // Muestra el error en la consola
                                        alert('Ocurrió un error al eliminar el usuario.');
                                    });
                                    
                                    
                                }
                            });
                        });
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.mensaje || 'No se pudo cargar la lista de usuarios.'
                    });
                }
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al cargar la lista de usuarios.'
                });
            });
    }
    // Cargar usuarios al iniciar
    loadUsers();

});
