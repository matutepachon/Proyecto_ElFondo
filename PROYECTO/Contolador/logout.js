document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnCerrSes").addEventListener("click", function() {
        fetch("../Modulos/logout.php", {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                carrito.limpiarCarrito();
                console.log(data.message);
                window.location.href = "Login.html";
            } else {
                console.error(data.message);
            }
        })
        .catch(error => {
            console.error(error);
        });
    });
});
