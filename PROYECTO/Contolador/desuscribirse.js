document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btdeSuscribirse").addEventListener("click", function () {
        desuscribirse(); 
    });
});

function desuscribirse() {
    fetch("../Modulos/desuscribirse.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                text: "Te desuscribiras",
                title: "¿Estas seguro?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#baff39",
                cancelButtonText:"Cancelar",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si"     
              }).then((result) => {
                if (result.isConfirmed) {
            if (data.success) {
                Swal.fire({
                    width: 250,
                    toast: true,
                    background: "#baff39",
                    position: "top",
                    title: "Te has desuscrito",
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    setTimeout(() => {
                        location.reload();
                    }, 200);
                });
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "No se pudo desuscribir",
                    text:"Inténtalo nuevamente más tarde.",
                });
                console.error(data.error );
            }
        }
        });
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Error al desuscribirse",
                text: "Hubo un problema al procesar tu solicitud. Inténtalo más tarde.",
            });
            console.error(error);
        });
}