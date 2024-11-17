$(document).ready(function () {
    const idUsuario = 1; // Cambiar esto por el ID del usuario logueado

    // Obtener las actividades disponibles
    $.ajax({
        url: '../Modulos/seleccionar_actividades.php',
        method: 'GET',
        success: function (response) {
            if (Array.isArray(response)) {
                response.forEach(function (actividad) {
                    $('#actividades').append(`
                        <div class="col-md-4">
                            <div class="card">
                                <img src="imagen_placeholder.jpg" class="card-img-top" alt="Actividad">
                                <div class="card-body">
                                    <h5 class="card-title">${actividad.Tipo_Act}</h5>
                                    <p class="card-text">Fecha: ${actividad.Fecha_Hora} <br> Duración: ${actividad.Duracion} mins</p>
                                    <button class="btn btn-primary select-btn" data-id="${actividad.ID_Actividad}" data-tipo="${actividad.Tipo_Act}" data-fecha="${actividad.Fecha_Hora}" data-duracion="${actividad.Duracion}">Suscribirse</button>
                                </div>
                            </div>
                        </div>
                    `);
                });

                // Manejador de clics en el botón de suscribirse
                $('.select-btn').click(function () {
                    const idActividad = $(this).data('id');
                    const tipoActividad = $(this).data('tipo');
                    $('#confirmarModal').modal('show');

                    $('#confirmarSeleccion').off('click').on('click', function () {
                        // Hacer la petición para seleccionar la actividad
                        $.ajax({
                            url: '../Modulos/seleccionar_actividades.php',
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({ ID_Usuario: idUsuario, ID_Actividad: idActividad }),
                            success: function (response) {
                                if (response.message) {
                                    alert(response.message);
                                } else {
                                    alert('Suscripción realizada con éxito.');
                                }
                                $('#confirmarModal').modal('hide');
                            },
                            error: function (xhr, status, error) {
                                console.error(`Error: ${status} - ${error}`);
                                console.log(xhr.responseText);
                                alert('Error al procesar la suscripción. Intenta nuevamente.');
                            }
                        });
                    });
                });
            } else {
                $('#actividades').append('<p>No hay actividades disponibles.</p>');
            }
        },
        error: function (xhr, status, error) {
            console.error(`Error: ${status} - ${error}`);
            console.log(xhr.responseText);
            $('#actividades').append('<p>Error al cargar las actividades disponibles.</p>');
        }
    });

    // Obtener las actividades suscritas del usuario
    $('#verSuscripciones').click(function () {
        $.ajax({
            url: `../Modulos/seleccionar_actividades.php?id_usuario=${idUsuario}`,
            method: 'GET',
            success: function (response) {
                if (Array.isArray(response)) {
                    $('#actividades-suscritas').empty();
                    response.forEach(function (actividad) {
                        $('#actividades-suscritas').append(`
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">${actividad.Tipo_Act}</h5>
                                        <p class="card-text">Fecha: ${actividad.Fecha_Hora} <br> Duración: ${actividad.Duracion} mins</p>
                                    </div>
                                </div>
                            </div>
                        `);
                    });
                } else {
                    $('#actividades-suscritas').append('<p>No estás suscrito a ninguna actividad.</p>');
                }
            },
            error: function (xhr, status, error) {
                console.error(`Error: ${status} - ${error}`);
                console.log(xhr.responseText);
                $('#actividades-suscritas').append('<p>Error al cargar tus suscripciones.</p>');
            }
        });
    });
});
