function cargarSuscripciones() {
    fetch("../Modulos/suscripciones.php")  // Ruta donde se obtienen las suscripciones
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("suscripcionesContainer");
            container.innerHTML = "";  // Limpiar el contenedor antes de agregar nuevas suscripciones
            
            data.forEach(suscripcion => {
                const col = document.createElement("div");
                col.className = "col-lg-3 col-md-4 col-sm-6 mb-4";
                
                const card = document.createElement("div");
                card.className = "card";
                
                const cardBody = document.createElement("div");
                cardBody.className = "card-body";
                
                const title = document.createElement("h5");
                title.className = "card-title";
                title.textContent = suscripcion.Plan_Sub;
                
                const tipo = document.createElement("p");
                tipo.className = "card-text text-muted";
                tipo.textContent = `Tipo de plan: ${suscripcion.Tipo}`;
                
                const precio = document.createElement("p");
                precio.className = "card-text";
                precio.textContent = `Precio: $${parseFloat(suscripcion.Precio).toFixed(2)}`;
                
                const estado = document.createElement("p");
                estado.className = "card-text";
                estado.textContent = `Estado: ${suscripcion.Estado}`;
                
                const button = document.createElement("button");
                button.className = "btn btn-primary";
                button.textContent = "Agregar al Carrito";

                // Aquí transformamos la suscripción a un producto
                const producto = new Producto(
                    suscripcion.ID_Subs,   // Usamos el ID de la suscripción como el ID del producto
                    suscripcion.Plan_Sub,  // El nombre del plan como el nombre del producto
                    suscripcion.Precio,    // El precio de la suscripción como el precio del producto
                    "Suscripción",         // Categoría fija como "Suscripción"
                    0,                     // No aplicamos descuento, o puedes poner 0 si es necesario
                    "",                    // Ruta de imagen vacía ya que no tenemos una imagen para la suscripción
                    "Plan de suscripción"  // Descripción general del plan
                );

                // Verificamos si el producto ya está en el carrito
                const productoExistente = carrito.obtenerProductos().find(p => p.id === producto.id);
                if (productoExistente) {
                    button.disabled = true;
                    button.textContent = "Ya agregado";
                }
                
                button.onclick = () => {
                    const productoExistente = carrito.obtenerProductos().find(p => p.id === producto.id);

                    if (productoExistente) {
                        Swal.fire({
                            icon: "info",
                            title: "Producto ya agregado",
                            text: `${suscripcion.Plan_Sub} ya está en el carrito.`,
                            confirmButtonText: "Ok"
                        });
                    } else {
                        // Realizamos la solicitud para agregar la suscripción al carrito
                        fetch("../Modulos/agregarSubAlCarrito.php", {  // Usamos la función agregarSubAlCarrito.php
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                idSuscripcion: producto.id // Solo enviamos el ID de la suscripción (producto transformado)
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                carrito.agregarProducto(producto);
                                Swal.fire({
                                    icon: "success",
                                    title: "Producto agregado",
                                    text: `${suscripcion.Plan_Sub} ha sido agregado al carrito.`,
                                    confirmButtonText: "Ok"
                                });
                                button.disabled = true;
                                button.textContent = "Ya agregado";
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    text: data.message,
                                    confirmButtonText: "Ok"
                                });
                            }
                        })
                        .catch(error => {
                            console.error("Error al agregar suscripción al carrito:", error);
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Hubo un problema al agregar la suscripción al carrito.",
                                confirmButtonText: "Ok"
                            });
                        });
                    }
                };

                cardBody.appendChild(title);
                cardBody.appendChild(tipo);
                cardBody.appendChild(precio);
                cardBody.appendChild(estado);
                cardBody.appendChild(button);
                
                card.appendChild(cardBody);
                
                col.appendChild(card);
                container.appendChild(col);
            });
        })
        .catch(error => {
            console.error("Error al cargar las suscripciones:", error);
        });
}

window.onload = cargarSuscripciones;
