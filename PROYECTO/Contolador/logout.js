document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnCerrSes').addEventListener('click', function() {
        fetch('http://localhost/PROYECTO/Modulos/logout.php', {
            method: 'GET'
        })

        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message);
                window.location.href = 'Login.html';
            } else {
                console.error(data.message);
                alert('Ocurrió un error al cerrar sesión.');
            }
        })

        .catch(error => {
            console.error(error);
            alert('Ocurrió un error al enviar la solicitud.');
        });
    });
});
