document.addEventListener('DOMContentLoaded', function() {
    fetch('/PROYECTO/Modulos/session_check.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const nomUsu = document.getElementById('nomUsu');
            const InicioSes = document.getElementById('InicioSes');
            const btnCerrSes = document.getElementById('btnCerrSes');
            const dropdown = document.getElementById('dropdown');
            const rootMenuButton = document.getElementById('rootmenu');

            if (data.success) {
                nomUsu.textContent = ` ${data.nombre}`;
                InicioSes.style.display = 'none'; 
                btnCerrSes.style.display = 'inline';
                dropdown.style.display = 'inline';

                if (data.correo === 'root@gmail.com') {
                    if (rootMenuButton) {
                        rootMenuButton.style.display = 'inline';
                    }
                } else {
                    if (rootMenuButton) {
                        rootMenuButton.style.display = 'none';
                    }
                }
            } else {
                nomUsu.textContent = '';
                InicioSes.style.display = 'inline';
                btnCerrSes.style.display = 'none'; 
                dropdown.style.display = 'none';
                if (rootMenuButton) {
                    rootMenuButton.style.display = 'none'; 
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al verificar la sesión.');
        });

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
