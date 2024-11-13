document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnSuscripcion').addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const formData = new FormData(this);
    fetch('/PROYECTO/Modulos/agrSuscripcion.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                width: 300,
                toast: true,
                background: "#baff39",
                position: "top",
                title: "Suscripcion creada con exito",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
            width: 300,
            toast: true,
            background: "#baff39",
            position: "top",
            title: "Error al crear la suscripcion.",
            showConfirmButton: false,
            timer: 1500
        });
     }
    })
    .catch(error => console.error('Error al agregar la Suscripcion:', error));

});

});