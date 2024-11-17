// Cargar clientes y rutinas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarClientes();
    cargarRutinas();
});

// Función para cargar los clientes desde el archivo clientes.php
function cargarClientes() {
    fetch('../Modulos/lista_usuarios.php')  // Asegúrate de que esta URL devuelva los usuarios correctamente
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let selectCliente = document.getElementById("clienteSelect");

                // Limpiar el select antes de agregar las opciones
                selectCliente.innerHTML = "";

                // Crear la opción de 'Seleccionar' al inicio
                let option = document.createElement("option");
                option.text = "Seleccionar Cliente";
                option.value = "";
                selectCliente.appendChild(option);

                // Agregar los clientes al select
                data.usuarios.forEach(cliente => {
                    let option = document.createElement("option");
                    option.value = cliente.ID_Usuario;
                    option.text = `${cliente.Nombre} ${cliente.Apellidos}`;
                    selectCliente.appendChild(option);
                });
            } else {
                console.log('No se pudieron cargar los clientes');
            }
        })
        .catch(error => {
            console.error('Error al cargar los clientes:', error);
        });
}
// Llamar a la función para cargar los clientes
cargarClientes();

// Función para cargar las rutinas desde el archivo crudRutinas.php
function cargarRutinas() {
    fetch('../Modulos/crudRutinas.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const rutinaSelect = document.getElementById('rutinaSelect');
        data.forEach(rutina => {
            const option = document.createElement('option');
            option.value = rutina.ID_Rut;
            option.textContent = rutina.Tipo_Rut;
            rutinaSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar las rutinas:', error));
}

// Manejar el evento de clic en el botón para asignar la rutina al cliente
document.getElementById('asignarBtn').addEventListener('click', function() {
    const idUsuario = document.getElementById('clienteSelect').value;
    const idRutina = document.getElementById('rutinaSelect').value;

    if (!idUsuario || !idRutina) {
        alert('Por favor, selecciona un cliente y una rutina');
        return;
    }

    // Enviar los datos al archivo asignarRutina.php para asignar la rutina
    fetch('../Modulos/menuEntrenador.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ID_Usuario: idUsuario, ID_Rut: idRutina })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error('Error al asignar la rutina:', error));
});






document.addEventListener('DOMContentLoaded', () => {
    // Cargar las rutinas cuando la página esté lista
    cargarlistaRutinas();

    // Manejar la creación de una nueva rutina
    const formAgregarRutina = document.getElementById('formAgregarRutina');
    formAgregarRutina.addEventListener('submit', (e) => {
        e.preventDefault();

        // Generar un ID aleatorio para la rutina (por ejemplo, un código alfanumérico)
        const idRutina = 'RUT' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const nuevaRutina = {
            ID_Rut: idRutina, // Asignar el ID generado
            Tipo_Rut: document.getElementById('tipoRutina').value,
            Duracion: document.getElementById('duracionRutina').value,
            Objetivos: document.getElementById('objetivosRutina').value,
            Instrucción: document.getElementById('instruccionRutina').value,
            Frecuencia: document.getElementById('frecuenciaRutina').value,
        };

        // Enviar la solicitud para agregar la rutina
        fetch('../Modulos/crudRutinas.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaRutina),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === 'Rutina agregada con éxito') {
                cargarRutinas(); // Recargar las rutinas después de agregar una nueva
            }
        })
        .catch(error => console.error('Error al agregar rutina:', error));
    });
});

// Función para cargar todas las rutinas
function cargarlistaRutinas() {
    fetch('../Modulos/crudRutinas.php')
        .then(response => response.json())
        .then(rutinas => {
            const rutinasList = document.getElementById('rutinasList');
            rutinasList.innerHTML = ''; // Limpiar la tabla

            rutinas.forEach(rutina => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${rutina.ID_Rut}</td>
                    <td>${rutina.Tipo_Rut}</td>
                    <td>${rutina.Duracion}</td>
                    <td>${rutina.Objetivos}</td>
                    <td>${rutina.Instrucción}</td>
                    <td>${rutina.Frecuencia}</td>
                    <td>
                        <button class="btn btn-danger" onclick="eliminarRutina('${rutina.ID_Rut}')">Eliminar</button>
                    </td>
                `;
                rutinasList.appendChild(tr);
            });
        })
        .catch(error => console.error('Error al cargar rutinas:', error));
}

// Función para eliminar una rutina
function eliminarRutina(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
        fetch('../Modulos/crudRutinas.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === 'Rutina eliminada con éxito') {
                cargarRutinas(); // Recargar las rutinas después de eliminar una
            }
        })
        .catch(error => console.error('Error al eliminar rutina:', error));
    }
}
