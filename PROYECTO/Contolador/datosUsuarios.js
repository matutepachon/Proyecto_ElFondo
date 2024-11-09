fetch("../Modulos/datosUsuarios.php")
.then(response => response.json())
.then(data => {
    if (data.success) {
        document.getElementById("nombre").textContent = data.cliente.Nombre;
        document.getElementById("apellidos").textContent = data.cliente.Apellidos;
        document.getElementById("cedula").textContent =  data.cliente.Cedula;
        document.getElementById("edad").textContent =  data.cliente.Edad + " años";
        document.getElementById("peso").textContent = data.cliente.Peso + "kg";
        document.getElementById("altura").textContent = data.cliente.Altura + " cm";
        document.getElementById("centro-salud").textContent = data.cliente.Centro_salud;
        document.getElementById("fecha-registro").textContent = data.cliente.Fecha_registro;
    } else {
        document.getElementById("cliente-info").textContent = "No se encontraron datos del cliente.";
    }
})
.catch(error => {
    Swal.fire({
        icon: "error",
        title: "Error al cargar tus Datos"
    });
    console.error(error);
    document.getElementById("cliente-info").textContent = "Error al cargar los datos del cliente.";
});