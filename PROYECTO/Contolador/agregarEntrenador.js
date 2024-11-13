document.addEventListener('DOMContentLoaded', function() {
    // Verificar el acceso del usuario al cargar la página
    fetch('/PROYECTO/Modulos/accesos.php')
        .then(response => {
            return response.json();
        })
        .then(data => {
            const tipoUsuario = data.tipo_usuario;

            // Verifica si el usuario no es admin y está en la página de agregarEntrenador.html
            if (window.location.pathname.includes('agregarEntrenador.html') && tipoUsuario !== 'admin') {
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
            window.location.href = "index.html";
            });
        });
    

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
                    Swal.fire({
                        width: 300,
                        toast: true,
                        background: "#baff39",
                        position: "top",
                        title: "Cuenta de entrenador creada con éxito",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    Swal.fire({
                    width: 300,
                    toast: true,
                    background: "#baff39",
                    position: "top",
                    title: "Error al crear cuenta.",
                    showConfirmButton: false,
                    timer: 1500
                });
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
