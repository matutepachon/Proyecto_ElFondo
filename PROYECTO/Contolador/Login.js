document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch('../Modulos/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.getElementById('message');
        if (data.success) {
            console.log("Logeado correctamente");
            window.location.href = 'index.html';
        } else {
            messageElement.textContent = `${data.message}`;
        }
    })
    .catch(error => {
        console.error(error);
        console.error('Ocurrió un error al enviar la solicitud.');
    });
});


