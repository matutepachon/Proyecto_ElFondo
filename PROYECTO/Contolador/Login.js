document.getElementById("login").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch("../Modulos/login.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const mensaje = document.getElementById("mensaje");
        if (data.success) {
            console.log("Logeado correctamente");
            window.location.href = "index.html";
        } else {
            mensaje.textContent = `${data.message}`;
        }
    })
    .catch(error => {
        console.error(error);
    });
});


