document.addEventListener("DOMContentLoaded", function() {
    cargarSuscripciones();
});

function cargarSuscripciones() {
    fetch('../Modulos/suscripciones.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error al cargar las suscripciones:", data.error);
            } else {
                mostrarSuscripciones(data);
            }
        })
        .catch(error => {
            console.error("Error al cargar las suscripciones:", error);
        });
}

function mostrarSuscripciones(suscripciones) {
    const suscrp = document.getElementById("suscripcionesContainer");


    suscrp.innerHTML = ''; // Limpiar el contenedor

    suscripciones.forEach(suscripcion => {
        const card = document.createElement("div");
        card.className = "col-md-4"; // Ancho de 4 columnas en pantallas medianas

        card.innerHTML = `
        <div class="card mb-4 rounded-4" style="background-color: #ffffff; color: #3c3c3c; border: 1px solid #e0e0e0;">
        <div class="card-body p-4">
        <h5 class="card-title fw-bold" style="color: #3c3c3c;">${suscripcion.Plan_Sub}</h5>
        <p class="card-subtitle mb-3" style="color: #6c757d;">Tipo de Plan: ${suscripcion.Tipo}</p>
        <p class="card-text fs-5">Precio: <span class="fw-semibold" style="color: #3c3c3c;">$${suscripcion.Precio}</span></p>
        <p class="card-text">
            <span class="badge" style="background-color: ${suscripcion.Estado === 'Activa' ? '#baff39' : '#6c757d'}; color: #ffffff;">
                Estado: ${suscripcion.Estado}
            </span>
            </p>
            <button class="btn mt-3 w-100" style="background-color: #baff39; color: #ffffff; border: none;" onclick="suscribirse('${suscripcion.ID_Subs}')">
                Suscribirse
             </button>
            </div>
        </div>


        `;

        suscrp.appendChild(card);
    });
}

function suscribirse(idSuscripcion) {

    fetch('../Modulos/suscribirse.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idSuscripcion: idSuscripcion })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                width: 300,
                toast: true,
                background: "#baff39",
                position: "top",
                title: "Te suscribiste Correctamente!!!",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            alertconsole.error("Hubo un error al suscribirte: " + data.error);
        }
    })
    .catch(error => {
        Swal.fire({
            icon: "error",
            title: "Error al Suscribirse",
            footer: '<a href="Login.html"> Inicia sesión </a>',
        }).then(() => {
            window.location.href = 'index.html';
        });
    });
}
