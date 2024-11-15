document.addEventListener('DOMContentLoaded', function() {
    fetch('../Modulos/Suscripcion.php')
    .then(response => {
        return response.json();
    })
    .then(data => {
        const Suscripcion = document.getElementById('suscripcionesContainer');
        const suscripcionTxt = document.getElementById('suscripcionTxt');
        suscripcionTxt
        if (data.success) {
            if(Suscripcion){
                Suscripcion.style.display= "none"
                suscripcionTxt.textContent=" Ya estas suscrito Muchas Gracias"
            }

        } else {
            console.log("No suscrito")
        }
    })
    .catch(error => {
        console.error('Error:', error);
        console.error('Ocurrió un error al verificar la Suscripcion.');
    });

});