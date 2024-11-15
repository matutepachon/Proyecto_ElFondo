document.addEventListener("DOMContentLoaded", function() {
    // Verificar el acceso del usuario al cargar la página
    fetch("../Modulos/accesos.php")
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                Swal.fire({
                    icon: "error",
                    title: "No tienes permiso para acceder a esta página.",
                    footer: '<a href="Login.html">Inicia sesión</a>'
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
                text: "Ocurrió un error al verificar el acceso.",
            }).then(() => {
            window.location.href = "index.html";
            });
        });

});
