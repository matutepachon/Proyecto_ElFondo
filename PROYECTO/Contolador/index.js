document.addEventListener('DOMContentLoaded', function() {
    // Verificar la sesión del usuario al cargar la página
    fetch('/PROYECTO/Modulos/accesos.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const nomUsu = document.getElementById('nomUsu');
            const inicioSes = document.getElementById('inicioSes');
            const btnCerrSes = document.getElementById('btnCerrSes');
            const rootMenuButton = document.getElementById('rootmenu');
            const carrito = document.getElementById('carrito');

            if (data.success) {
                // Usuario ha iniciado sesión
                if (nomUsu) {
                    nomUsu.textContent = ` ${data.nombre}`; // Muestra el nombre del usuario en el menú
                    nomUsu.style.display = 'inline'; // Asegúrate de que el enlace del usuario esté visible
                }
                if (inicioSes) {
                    inicioSes.style.display = 'none'; // Oculta el botón de Iniciar Sesión
                }
                if (btnCerrSes) {
                    btnCerrSes.style.display = 'inline'; // Muestra el botón de Cerrar Sesión
                }
                if (rootMenuButton) {
                    rootMenuButton.style.display = (data.tipo_usuario === 'admin') ? 'inline' : 'none'; // Muestra u oculta el menú root
                }
                if (carrito) {
                    carrito.style.display = 'inline'; // Muestra u oculta el menú root
                }
            } else {
                // Usuario no ha iniciado sesión
                if (nomUsu) {
                    nomUsu.textContent = ''; // Limpia el nombre del usuario
                    nomUsu.style.display = 'none'; // Oculta el enlace del usuario
                }
                if (inicioSes) {
                    inicioSes.style.display = 'inline'; // Muestra el botón de Iniciar Sesión
                }
                if (btnCerrSes) {
                    btnCerrSes.style.display = 'none'; // Oculta el botón de Cerrar Sesión
                }
                if (rootMenuButton) {
                    rootMenuButton.style.display = 'none'; // Oculta el menú root
                }
                if (carrito) {
                    carrito.style.display = 'none'; //Oculta el carrito
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al verificar la sesión.');
        });

    // Evento para el botón de cerrar sesión
    document.getElementById('btnCerrSes').addEventListener('click', function() {
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
                window.location.href = 'Login.html'; 
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
    
});
