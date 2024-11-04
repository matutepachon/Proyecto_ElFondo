document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('agregarEntrenador').addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const formData = new FormData(this);

        fetch('/PROYECTO/Modulos/agregarEntrenador.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text()) 
        .then(text => {
            console.log('Respuesta del servidor:', text); 

            try {
                const data = JSON.parse(text);

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
                const tipoUsuario = data.tipo_usuario;

                if (window.location.pathname.includes('productosAdmin.html') && tipoUsuario !== 'admin') {
                    alert('No tienes permiso para acceder a esta página.');
                    window.location.href = 'index.html'; 
                }
            } else {
                
                alert('No tienes permiso para acceder a esta página.');
                window.location.href = 'Login.html';
            }
        })
        .catch(error => {
            console.error('Error al verificar el acceso:', error);
            alert('Ocurrió un error al verificar el acceso.');
        });
});