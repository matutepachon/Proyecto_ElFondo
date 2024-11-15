document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("registro").addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        const formData = new FormData(this);

        fetch("../Modulos/registro.php", {
            method: "POST",
            body: formData
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            const mensaje = document.getElementById("mensaje");

            if (data.success) {
                console.log("Cuenta creada con éxito");
                window.location.href = "index.html";
            } else {
                mensaje.textContent = data.mensaje;
            }
        })
        .catch(error => {
            console.error(error);
        });
    });
});
