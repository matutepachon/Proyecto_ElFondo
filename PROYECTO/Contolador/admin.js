document.addEventListener('DOMContentLoaded', function() {
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
                                            loadUsers(); // Recargar usuarios
                                        } else {
                                            alert(data.mensaje);
                                        }
                                    })
                                    .catch(error => {
                                        console.error(error);
                                        alert('Ocurrió un error al eliminar el usuario.');
                                    });
                                }
                            });
                        });
                    });
                } else {
                    alert(data.mensaje);
                }
            })
            .catch(error => {
                console.error(error);
                alert('Ocurrió un error al cargar la lista de usuarios.');
            });
    }

    // Cargar usuarios al iniciar
    loadUsers();
});
