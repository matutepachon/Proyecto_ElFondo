
document.getElementById("añadSub").addEventListener("submit", function(e) {
    e.preventDefault(); 

    const formData = new FormData(this);

    fetch("../Modulos/agregarSuscripcion.php", {
        method: "POST",
        body: formData  
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.success) {
            Swal.fire({
                width: 350,
                toast: true,
                background: "#baff39",
                position: "top",
                title: "Suscripción agregada correctamente",
                showConfirmButton: false,
                timer: 1500

            }).then(() => {
                window.location.href = "admSuscripcion.html";
                });
        } else {
            Swal.fire({
                width: 350,
                toast: true,
                background: "Red",
                position: "top",
                title: "Error al intentar agregar la suscripcion",
                showConfirmButton: false,
                timer: 1500

            })
        }
    })
    .catch(error => {
        Swal.fire({
        width: 370,
        toast: true,
        background: "Red",
        position: "top",
        title: "Error al intentar agregar la suscripcion",
        showConfirmButton: false,
        timer: 1500

    })
    });
});
