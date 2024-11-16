// Evento de envío del formulario
document.getElementById("entrenamientoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const tipoEnt = document.getElementById("tipo_ent").value;
    const tiempoEnt = parseInt(document.getElementById("tiempo_ent").value);
    const calorQuem = parseInt(document.getElementById("calor_quem").value);
    const peso = parseFloat(document.getElementById("peso").value);
    const imcInput = document.getElementById("imc");

    try {
        // Obtener altura del cliente a partir del nuevo CRUD
        const altura = await obtenerAlturaCliente();

        // Verifica si tanto el peso como la altura son válidos
        if (peso && altura) {
            // Comprobar si el valor del IMC es válido, si no lo es, calcularlo
            let imc = parseFloat(imcInput.value); // Usamos el valor calculado previamente
            if (isNaN(imc) || imc === 0) {
                imc = (peso / (altura * altura)).toFixed(2); // Calcular IMC solo si no está presente
            }

            // Verificar que el valor calculado del IMC sea un número válido antes de enviarlo
            if (isNaN(imc) || imc === 0) {
                alert("Error en el cálculo del IMC. Por favor, asegúrese de que el peso y la altura sean correctos.");
                return;
            }

            // Establecer el valor calculado del IMC en el campo
            imcInput.value = imc;

            const data = {
                tipo_ent: tipoEnt,
                tiempo_ent: tiempoEnt,
                calor_quem: calorQuem,
                peso: peso,
                imc: imc
            };

            // Enviar los datos al servidor para agregar el entrenamiento
            const response = await fetch("../Modulos/entrenamientos.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.message) {
                alert(result.message); // Muestra el mensaje del servidor
            } else {
                alert("Hubo un error al agregar el entrenamiento.");
            }
        } else {
            alert("Por favor, ingrese un peso válido y asegúrese de que la altura se obtenga correctamente.");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Función para obtener la altura del cliente
async function obtenerAlturaCliente() {
    try {
        const response = await fetch("../Modulos/clientes.php");
        const data = await response.json();

        if (data.message) {
            throw new Error(data.message); // Maneja el error si no se encuentra el cliente
        }

        return data.Altura; // Cambia 'altura' por 'Altura' para que coincida con el JSON devuelto
    } catch (error) {
        alert("Error al obtener la altura del cliente: " + error.message);
        throw error; // Propaga el error para manejarlo en el bloque catch principal
    }
}

// Calcular IMC automáticamente al cambiar el peso
document.getElementById("peso").addEventListener("input", async function () {
    const peso = parseFloat(document.getElementById("peso").value);
    try {
        const altura = await obtenerAlturaCliente();

        if (peso && altura) {
            let imc = (peso / (altura * altura)*100).toFixed(2); // Calcula el IMC cuando el peso cambia
            document.getElementById("imc").value = imc; // Muestra el IMC calculado
        } else {
            alert("Por favor, ingrese un peso válido y asegúrese de que la altura se obtenga correctamente.");
        }
    } catch (error) {
        alert("Error al obtener la altura del cliente: " + error.message);
    }
});

// Calcular las calorías basadas en el tiempo de entrenamiento
function calcularCalorias() {
    const tiempo = document.getElementById("tiempo_ent").value;
    let calorias = 0;

    if (tiempo === "1") calorias = 300; // Suponiendo 300 calorías por 1 hora
    else if (tiempo === "2") calorias = 600; // Suponiendo 600 calorías por 2 horas
    else if (tiempo === "3") calorias = 900;
    else if (tiempo === "4") calorias = 1200;
    else if (tiempo === "5") calorias = 1500;

     

    document.getElementById("calor_quem").value = calorias;
}

// Obtener referencias a los elementos
const listarEntrenamientosBtn = document.getElementById("listarEntrenamientosBtn");
const modalEntrenamientos = document.getElementById("modalEntrenamientos");
const cerrarModalBtn2 = document.getElementById("cerrarModalBtn");
const entrenamientosLista = document.getElementById("entrenamientosLista");

// Función para cargar la lista de entrenamientos
async function cargarEntrenamientos() {
    try {
        // Solicitar los entrenamientos al servidor
        const response = await fetch("../Modulos/entrenamientos.php");
        const data = await response.json();
        
        // Crear el HTML para mostrar los entrenamientos
        let html = "";
        data.forEach(entrenamiento => {
            html += `
                <div>
                    <p>Tipo de Entrenamiento: ${entrenamiento.Tipo_Ent}</p>
                    <p>Tiempo: ${entrenamiento.Tiempo_Ent} minutos</p>
                    <p>Calorías Quemadas: ${entrenamiento.Calor_Quem}</p>
                    <button class="eliminarBtn" data-id="${entrenamiento.ID_Ent}">Eliminar</button>
                </div>
            `;
        });
        entrenamientosLista.innerHTML = html; // Actualizar la lista en el modal
    } catch (error) {
        console.error("Error al obtener entrenamientos:", error);
    }
}

// Evento para abrir el modal
listarEntrenamientosBtn.addEventListener("click", async function() {
    // Cargar los entrenamientos en el modal
    await cargarEntrenamientos();
    modalEntrenamientos.style.display = "block"; // Mostrar el modal
});

// Evento para cerrar el modal
cerrarModalBtn2.addEventListener("click", function() {
    modalEntrenamientos.style.display = "none";
});

// Evento para eliminar entrenamiento
entrenamientosLista.addEventListener("click", async function(e) {
    if (e.target && e.target.classList.contains("eliminarBtn")) {
        const idEntrenamiento = e.target.getAttribute("data-id");

        // Realizar la eliminación en el servidor
        try {
            const response = await fetch("../Modulos/entrenamientos.php", {
                method: "DELETE",
                body: JSON.stringify({ id: idEntrenamiento }),
                headers: { "Content-Type": "application/json" }
            });

            // Verifica si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const result = await response.json();

            if (result.success) {
                // Eliminar el entrenamiento de la lista en la UI (solo si la eliminación fue exitosa)
                e.target.parentElement.remove();

                // Volver a cargar la lista de entrenamientos para asegurarnos que está actualizada
                await cargarEntrenamientos();
            } else {
                alert(result.message || "Hubo un problema al eliminar el entrenamiento.");
            }
        } catch (error) {
            console.error("Error al eliminar entrenamiento:", error);
        }
    }
});

// Obtener referencias a los elementos para mostrar la información completa
const mostrarInfoBtn = document.getElementById("mostrarInfoBtn");
const modalInfoEntrenamientos = document.getElementById("modalInfoEntrenamientos");
const cerrarModalBtn = document.getElementById("cerrarModalBtn");
const cantidadEntrenamientos = document.getElementById("cantidadEntrenamientos");
const minutosPorTipo = document.getElementById("minutosPorTipo").getElementsByTagName('tbody')[0];

// Evento para mostrar la información completa
mostrarInfoBtn.addEventListener("click", async function () {
    try {
        // Obtener la cantidad de entrenamientos y minutos por tipo de entrenamiento
        const response = await fetch("../Modulos/calcularentrenamientos.php");
        const data = await response.json();

        if (data.error) {
            console.error("Error del backend:", data.error);
            cantidadEntrenamientos.textContent = "Error al obtener la información.";
            return;
        }

        cantidadEntrenamientos.textContent = `Cantidad de entrenamientos: ${data.cantidad}`;

        minutosPorTipo.innerHTML = ""; // Limpiar la tabla antes de agregar los nuevos datos
        data.minutos.forEach(tipo => {
            const row = minutosPorTipo.insertRow();
            row.innerHTML = `
                <td>${tipo.Tipo_Ent}</td>
                <td>${tipo.Minutos_Acumulados} minutos</td>
            `;
        });

        modalInfoEntrenamientos.style.display = "block";
    } catch (error) {
        console.error("Error al obtener la información:", error);
        cantidadEntrenamientos.textContent = "Error al conectar con el servidor.";
    }
});

// Evento para cerrar el modal
cerrarModalBtn.addEventListener("click", function () {
    modalInfoEntrenamientos.style.display = "none";
});






// Función para obtener el estado de salud del usuario
function obtenerEstadoSalud() {
    // Realizar la petición a la API
    fetch('../Modulos/estadoSalud.php')
        .then(response => response.json())
        .then(data => {
            // Verificar si hay error en los datos
            if (data.error) {
                alert(data.error);
                return;
            }

            // Mostrar el estado de salud y los datos en el modal
            mostrarEstadoSalud(data);

            // Abrir el modal con Bootstrap
            let modal = new bootstrap.Modal(document.getElementById('modalEstadoSalud'), {
                keyboard: false  // Deshabilitar cierre con el teclado
            });
            modal.show();
        })
        .catch(error => {
            console.error('Error al obtener los datos de salud:', error);
        });
}

// Función para mostrar el estado de salud en el modal
function mostrarEstadoSalud(data) {
    // Variables de los datos
    let imcActual = data.imcActual; // Tomamos el valor como string
    let variacionPeso = data.variacionPeso;

    // Verificar si imcActual es un número válido
    console.log("IMC Actual recibido: ", imcActual);  // Para depuración

    // Convertir imcActual a número (si es posible)
    let imcNumerico = parseFloat(imcActual);

    // Si imcActual no es un número válido o está vacío, asignamos un valor por defecto
    if (isNaN(imcNumerico)) {
        imcNumerico = 0; // Valor por defecto en caso de que no sea un número válido
    }

    // Determinar el estado de salud según el IMC
    let estado = '';
    if (imcNumerico < 0.18) {
        estado = 'Bajo peso';
    } else if (imcNumerico >= 0.18 && imcNumerico < 0.24) {
        estado = 'Peso normal';
    } else if (imcNumerico >= 0.25 && imcNumerico < 0.30) {
        estado = 'Sobrepeso';
    } else {
        estado = 'Obesidad';
    }

    // Determinar si la variación de peso es aumento o disminución
    let mensajeVariacion = '';
    if (variacionPeso > 0) {
        mensajeVariacion = `Aumento de peso: ${variacionPeso} kg`;
    } else if (variacionPeso < 0) {
        mensajeVariacion = `Bajó de peso: ${Math.abs(variacionPeso)} kg`;
    } else {
        mensajeVariacion = `No hubo variación de peso.`;
    }

    // Actualizar los valores en el modal
    document.getElementById('estadoSalud').textContent = `Estado de salud: ${estado}`;
    document.getElementById('imcActual').textContent = `IMC actual: ${imcNumerico.toFixed(2)}`; // Mostramos el IMC con 2 decimales
    document.getElementById('variacionPeso').textContent = mensajeVariacion;
}

// Llamar la función al hacer clic en el botón
document.getElementById('btnEstadoSalud').addEventListener('click', function () {
    obtenerEstadoSalud();
});
