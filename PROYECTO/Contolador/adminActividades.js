document.addEventListener("DOMContentLoaded", function() {
    // Cargar las actividades cuando la página cargue
    cargarActividades();

    // Capturar el formulario de agregar entrenamiento
    const formAgregarEntrenamiento = document.getElementById('form-agregar-entrenamiento');

    // Evento al enviar el formulario
    formAgregarEntrenamiento.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        // Generar un ID único para la nueva actividad
        const idActividad = 'ACT-' + new Date().getTime(); // Usamos el timestamp actual para generar un ID único

        // Obtener los datos del formulario
        const tipoAct = document.getElementById('tipo-act').value;
        const fechaHora = document.getElementById('fecha-hora').value;
        const duracion = document.getElementById('duracion').value;

        // Crear un objeto para enviar al backend, incluyendo el ID generado
        const nuevaActividad = {
            ID_Actividad: idActividad,  // ID generado en el frontend
            Tipo_Act: tipoAct,
            Fecha_Hora: fechaHora,
            Duracion: duracion
        };

        // Enviar los datos al backend para guardar el nuevo entrenamiento
        fetch('../Modulos/crudActividades.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaActividad) // Enviar los datos como JSON
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Mensaje de confirmación
            if (data.message.includes('éxito')) {
                cargarActividades(); // Recargar la lista de actividades después de agregar el nuevo entrenamiento
                formAgregarEntrenamiento.reset(); // Limpiar el formulario
            }
        })
        .catch(error => {
            console.error('Error al agregar el entrenamiento:', error);
        });
    });

    // Función para obtener las actividades
    function cargarActividades() {
        fetch('../Modulos/crudActividades.php', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(actividades => {
            const actividadesList = document.getElementById('actividades-list');
            actividadesList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

            if (actividades.length > 0) {
                actividades.forEach(actividad => {
                    const actividadItem = document.createElement('div');
                    actividadItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                    
                    actividadItem.innerHTML = `
                        <strong>${actividad.Tipo_Act}</strong><br>
                        Fecha y Hora: ${actividad.Fecha_Hora}<br>
                        Duración: ${actividad.Duracion} minutos
                    `;
                    
                    // Almacenamos el ID de la actividad para que se pueda usar en los botones
                    const idActividad = actividad.ID_Actividad;

                    const eliminarBtn = document.createElement('button');
                    eliminarBtn.classList.add('btn', 'btn-danger');
                    eliminarBtn.innerText = 'Eliminar';
                    eliminarBtn.onclick = () => eliminarActividad(idActividad); // Usamos ID_Actividad aquí

                    const modificarBtn = document.createElement('button');
                    modificarBtn.classList.add('btn', 'btn-warning');
                    modificarBtn.innerText = 'Modificar';
                    modificarBtn.onclick = () => habilitarEdicion(actividadItem, actividad); // Usamos ID_Actividad aquí

                    actividadItem.appendChild(modificarBtn);
                    actividadItem.appendChild(eliminarBtn);
                    actividadesList.appendChild(actividadItem);
                });
            } else {
                actividadesList.innerHTML = '<p>No hay actividades disponibles.</p>';
            }
        })
        .catch(error => {
            console.error('Error al cargar las actividades:', error);
        });
    }

    // Función para eliminar una actividad
    function eliminarActividad(idActividad) {
        fetch('../Modulos/crudActividades.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ID_Actividad: idActividad })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message.includes('éxito')) {
                cargarActividades(); // Recargar la lista de actividades después de eliminar
            }
        })
        .catch(error => {
            console.error('Error al eliminar la actividad:', error);
        });
    }

    // Función para habilitar la edición de la actividad
    function habilitarEdicion(actividadItem, actividad) {
        // Guardamos el ID de la actividad para utilizarlo al guardar la edición
        const idActividad = actividad.ID_Actividad;

        actividadItem.innerHTML = `
            <input type="text" class="form-control mb-2" value="${actividad.Tipo_Act}" id="tipo-act">
            <input type="datetime-local" class="form-control mb-2" value="${actividad.Fecha_Hora.replace(' ', 'T')}" id="fecha-hora">
            <input type="number" class="form-control mb-2" value="${actividad.Duracion}" id="duracion">
        `;
        
        const guardarBtn = document.createElement('button');
        guardarBtn.classList.add('btn', 'btn-success');
        guardarBtn.innerText = 'Guardar';
        guardarBtn.onclick = () => guardarEdicion(idActividad, actividadItem); // Pasamos ID_Actividad aquí

        const cancelarBtn = document.createElement('button');
        cancelarBtn.classList.add('btn', 'btn-secondary');
        cancelarBtn.innerText = 'Cancelar';
        cancelarBtn.onclick = () => cargarActividades(); // Recargar sin guardar cambios

        actividadItem.appendChild(guardarBtn);
        actividadItem.appendChild(cancelarBtn);
    }

    // Función para guardar los cambios de la actividad
    function guardarEdicion(idActividad, actividadItem) {
        const tipoAct = document.getElementById('tipo-act').value;
        const fechaHora = document.getElementById('fecha-hora').value;
        const duracion = document.getElementById('duracion').value;

        fetch('../Modulos/crudActividades.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ID_Actividad: idActividad, // Incluimos el ID de la actividad
                Tipo_Act: tipoAct,
                Fecha_Hora: fechaHora,
                Duracion: duracion
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message.includes('éxito')) {
                cargarActividades(); // Recargar la lista de actividades después de guardar
            }
        })
        .catch(error => {
            console.error('Error al guardar los cambios:', error);
        });
    }
});
