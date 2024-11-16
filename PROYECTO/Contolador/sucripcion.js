document.addEventListener("DOMContentLoaded", function() {
    fetch("../Modulos/Suscripcion.php")
    .then(response => response.json())
    .then(data => {
        const Suscripcion = document.getElementById("suscripcionesContainer");
        const suscripcionTxt = document.getElementById("suscripcionTxt");

        if (data.success) {
            // Si el usuario ya está suscrito
            if(Suscripcion) {
                Suscripcion.style.display = "none";
                if (suscripcionTxt) {
                    suscripcionTxt.textContent = "Ya estás suscrito. Muchas gracias."; // Asigna el texto correctamente
                }
            }
        } else {
            if(window.location.pathname.includes("datosUsuarios.html")) {
                const btnSuscripcion = document.getElementById("btdeSuscribirse");
                if (btnSuscripcion) {
                    btnSuscripcion.style.display = "none"; 
                }
            }
            console.log("No suscrito");
        }
    })
    .catch(error => {
        console.error(error);
    });
});
