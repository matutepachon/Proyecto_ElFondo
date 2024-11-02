document.addEventListener('DOMContentLoaded', function() {
    // Verificar la sesión del usuario al cargar la página
    fetch('/PROYECTO/Modulos/session_check.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const nomUsu = document.getElementById('nomUsu');
            const InicioSes = document.querySelector('.nav-link.btn-primary'); // Botón de Iniciar Sesión
            const btnCerrSes = document.getElementById('btnCerrSes');
            const rootMenuButton = document.getElementById('rootmenu');

            if (data.success) {
                nomUsu.textContent = ` ${data.nombre}`; // Muestra el nombre del usuario en el menú
                InicioSes.style.display = 'none'; // Oculta el botón de Iniciar Sesión
                if (btnCerrSes) {
                    btnCerrSes.style.display = 'inline'; // Muestra el botón de Cerrar Sesión
                }

                // Muestra el menú root solo si el correo coincide
                if (data.correo === 'root@gmail.com') {
                    if (rootMenuButton) {
                        rootMenuButton.style.display = 'inline'; // Muestra el menú root
                    }
                } else {
                    if (rootMenuButton) {
                        rootMenuButton.style.display = 'none'; // Oculta el menú root
                    }
                }
            } else {
                nomUsu.textContent = '';
                InicioSes.style.display = 'inline'; // Muestra el botón de Iniciar Sesión
                if (btnCerrSes) {
                    btnCerrSes.style.display = 'none'; // Oculta el botón de Cerrar Sesión
                }
                if (rootMenuButton) {
                    rootMenuButton.style.display = 'none'; // Oculta el menú root
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al verificar la sesión.');
        });

    // Evento para el botón de cerrar sesión
    const btnCerrSes = document.getElementById('btnCerrSes');
    if (btnCerrSes) {
        btnCerrSes.addEventListener('click', function() {
            fetch('http://localhost/PROYECTO/Modulos/logout.php', {
                method: 'GET'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log(data.message);
                    window.location.href = 'Login.html'; // Redirige a la página de inicio de sesión
                } else {
                    console.error('Error:', data.message);
                    alert('Ocurrió un error al cerrar sesión.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al enviar la solicitud.');
            });
        });
    }
});
