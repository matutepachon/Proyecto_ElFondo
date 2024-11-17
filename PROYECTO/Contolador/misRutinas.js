document.addEventListener('DOMContentLoaded', () => {
    // Asignar el evento al botón para abrir el modal
    const btnVerRutinas = document.getElementById('btnVerRutinas');
    btnVerRutinas.addEventListener('click', () => {
        // Llamar al backend para obtener el ID del usuario logueado
        obtenerIdUsuarioLogueado();
    });
});

// Función para obtener el ID del usuario logueado desde el backend
function obtenerIdUsuarioLogueado() {
    fetch('../Modulos/obtenerIDUsuario.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Si el usuario está logueado, usamos el ID
            const idUsuario = data.ID_Usuario;
            cargarRutinasCliente(idUsuario);
            
            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('modalRutinas'));
            modal.show();
        } else {
            alert('No se pudo obtener el ID del usuario logueado. ' + data.message);
        }
    })
    .catch(error => console.error('Error al obtener el ID del usuario logueado:', error));
}

// Función para cargar las rutinas asignadas al cliente
function cargarRutinasCliente(idUsuario) {
    fetch(`../Modulos/obtenerRutinasCliente.php?idUsuario=${idUsuario}`)
        .then(response => response.json())
        .then(data => {
            const rutinasList = document.getElementById('rutinasList').getElementsByTagName('tbody')[0];
            rutinasList.innerHTML = ''; // Limpiar la tabla antes de mostrar nuevas rutinas

            if (data.success && Array.isArray(data.rutinas)) {
                // Mostrar las rutinas en la tabla
                data.rutinas.forEach(rutina => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${rutina.ID_Rut}</td>
                        <td>${rutina.Tipo_Rut}</td>
                        <td>${rutina.Duracion}</td>
                        <td>${rutina.Objetivos}</td>
                        <td>${rutina.Instrucción}</td>
                        <td>${rutina.Frecuencia}</td>
                    `;
                    rutinasList.appendChild(tr);
                });
            } else if (data.message) {
                // Mostrar mensaje si no hay rutinas
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td colspan="6" class="text-center">${data.message}</td>
                `;
                rutinasList.appendChild(tr);
            } else {
                // Manejar casos inesperados
                console.error('Formato de respuesta desconocido:', data);
            }
        })
        .catch(error => console.error('Error al cargar rutinas del cliente:', error));
}
