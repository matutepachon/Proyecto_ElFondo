document.getElementById("entrenamientoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const tipoEnt = document.getElementById("tipo_ent").value;
    const tiempoEnt = parseInt(document.getElementById("tiempo_ent").value);
    const calorQuem = parseInt(document.getElementById("calor_quem").value);
    const peso = parseFloat(document.getElementById("peso").value);
    
    try {
        // Obtener altura del cliente a partir del nuevo CRUD
        const altura = await obtenerAlturaCliente();

        if (peso && altura) {
            const imc = (peso / (altura * altura)).toFixed(2);
            document.getElementById("imc").value = imc;

            const data = {
                tipo_ent: tipoEnt,
                tiempo_ent: tiempoEnt,
                calor_quem: calorQuem,
                peso: peso,
                imc: imc
            };

            const response = await fetch("entrenamiento.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            alert(result.message);
        } else {
            alert("Por favor, ingrese un peso válido y asegúrese de que la altura se obtenga correctamente.");
        }
    } catch (error) {
        alert(error.message);
    }
});

async function obtenerAlturaCliente() {
    const response = await fetch("http://localhost/PROYECTO/Modulos/clientes.php");
    const data = await response.json();

    if (data.message) {
        throw new Error(data.message); // Maneja el error si no se encuentra el cliente
    }

    return data.Altura; // Cambia 'altura' por 'Altura' para que coincida con el JSON devuelto
}

async function calcularIMC() {
    const peso = parseFloat(document.getElementById("peso").value);
    try {
        const altura = await obtenerAlturaCliente();

        if (peso && altura) {
            const imc = (peso / (altura * altura)).toFixed(2);
            document.getElementById("imc").value = imc;
        } else {
            alert("Por favor, ingrese un peso válido y asegúrese de que la altura se obtenga correctamente.");
        }
    } catch (error) {
        alert("Error al obtener la altura del cliente: " + error.message);
    }
}

// Llama a la función calcularIMC cuando el peso cambia
document.getElementById("peso").addEventListener("change", calcularIMC);

function calcularCalorias() {
    const tiempo = document.getElementById("tiempo_ent").value;
    let calorias = 0;

    if (tiempo === "1") calorias = 300; // Suponiendo 300 calorías por 1 hora
    else if (tiempo === "2") calorias = 600; // Suponiendo 600 calorías por 2 horas
    else if (tiempo === "3") calorias = 900; // Suponiendo 900 calorías por 3 horas

    document.getElementById("calor_quem").value = calorias;
}
