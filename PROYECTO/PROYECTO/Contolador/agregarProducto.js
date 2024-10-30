document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('producto').addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const formData = new FormData(this);

        fetch('http://localhost/PROYECTO/Modulos/agregarProducto.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            const mensaje = document.getElementById('mensaje');

            if (data.success) {
                console.log('Producto Agregado con exito');
                window.location.href = 'agregarProducto.html';
            } else {
                mensaje.textContent = data.mensaje;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al enviar la solicitud.');
        });
    });
});
