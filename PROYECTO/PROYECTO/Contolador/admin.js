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
                            <td>${usuario.Correo}</td>
                            <td>
                                <button class="btn btn-danger BorraUsu" data-id="${usuario.ID_Usuario}">Eliminar</button>
                            </td>
                        `;
                        tabladeUsu.appendChild(row);
                    });

                    document.querySelectorAll('.BorraUsu').forEach(button => {
                        button.addEventListener('click', function() {
                            const usuarioId = this.getAttribute('data-id');
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
                                    alert(data.mensaje);
                                    loadUsers();
                                } else {
                                    alert(data.mensaje);
                                }
                            })
                            .catch(error => {
                                console.error(error);
                                alert('Ocurrió un error al eliminar el usuario.');
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
    
    loadUsers();

});
