document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('agregarAdm').addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const formData = new FormData(this);

        fetch('/PROYECTO/Modulos/agregarAdmin.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text()) // Captura la respuesta como texto para ver si es JSON o HTML
        .then(text => {
            console.log('Respuesta del servidor:', text); // Muestra la respuesta en la consola

            try {
                const data = JSON.parse(text); // Intenta convertir el texto a JSON

                const mensaje = document.getElementById('mensaje');
                if (data.success) {
                    mensaje.textContent = 'Cuenta creada con éxito';
                    mensaje.style.color = 'green';
                } else {
                    mensaje.textContent = data.mensaje;
                    mensaje.style.color = 'red';
                }
            } catch (error) {
                console.error('Error al analizar JSON:', error);
                alert('Se recibió una respuesta inesperada del servidor.');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Ocurrió un error al enviar la solicitud.');
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Verificar el acceso del usuario al cargar la página
    fetch('/PROYECTO/Modulos/accesos.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Usuario autenticado
                const tipoUsuario = data.tipo_usuario;

                // Comprobar el acceso a productosAdmin.html
                if (window.location.pathname.includes('productosAdmin.html') && tipoUsuario !== 'admin') {
                    alert('No tienes permiso para acceder a esta página.');
                    window.location.href = 'index.html'; // Redirigir a la página principal
                }
            } else {
                // Usuario no autenticado
                alert('No tienes permiso para acceder a esta página.');
                window.location.href = 'Login.html'; // Redirigir a la página de inicio de sesión
            }
        })
        .catch(error => {
            console.error('Error al verificar el acceso:', error);
            alert('Ocurrió un error al verificar el acceso.');
        });
});