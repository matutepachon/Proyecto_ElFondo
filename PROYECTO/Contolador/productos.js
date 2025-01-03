function cargarProductos() {
    fetch("../Modulos/productos.php")
        .then(response => {
            return response.json();
        })
        .then(data => {
            const container = document.getElementById("container");
            container.innerHTML = ""; 
            
            data.forEach(producto => {
                const col = document.createElement("div");
                col.className = "col-lg-3 col-md-4 col-sm-6 mb-4";
                
                const card = document.createElement("div");
                card.className = "card";
                
                const img = document.createElement("img");
                img.src = producto.Rut_Img || "default_image.jpg"; // Ruta a una imagen por defecto si no hay
                img.className = "card-img-top";
                img.style.height = "200px";
                img.style.objectFit = "cover";
                
                const cardBody = document.createElement("div");
                cardBody.className = "card-body";
                
                const title = document.createElement("h5");
                title.className = "card-title";
                title.textContent = producto.Nom_Pro;
                
                const description = document.createElement("p");
                description.className = "card-text";
                description.textContent = producto.Descripcion;
                
                const category = document.createElement("p");
                category.className = "card-text text-muted";
                category.textContent = `Categoría: ${producto.Cat_Pro}`;
                
                const price = document.createElement("p");
                price.className = "card-text";
                price.textContent = `Precio: $${parseFloat(producto.Precio).toFixed(2)}`;
                
                const discount = document.createElement("p");
                discount.className = "card-text text-danger";
                discount.textContent = `Descuento: ${producto.Desc_Pro}%`;
                
                const button = document.createElement("button");
                button.className = "btn btn-primary";
                button.textContent = "Agregar al Carrito";
  
                const productoExistente = carrito.obtenerProductos().find(p => p.id === producto.ID_Pro);
  
                if (productoExistente) {
                    button.disabled = true;
                    button.textContent = "Ya agregado";
                }
  
                button.onclick = () => {
                    const nuevoProducto = new Producto(
                        producto.ID_Pro,
                        producto.Nom_Pro,
                        producto.Precio,
                        producto.Cat_Pro,
                        producto.Desc_Pro,
                        producto.Rut_Img,
                        producto.Descripcion
                    );
  
                    const productoExistente = carrito.obtenerProductos().find(p => p.id === nuevoProducto.id);
  
                    if (productoExistente) {
                        Swal.fire({
                            icon: "info",
                            title: "Producto ya agregado",
                            text: `${producto.Nom_Pro} ya está en el carrito.`,
                            confirmButtonText: "Ok"
                        });
                    } else {
                        // Aquí realizamos la solicitud para agregar el producto al carrito sin enviar el ID de usuario
                        fetch("../Modulos/agregarAlCarrito.php", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                idProducto: nuevoProducto.id // Solo enviamos el ID del producto
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                carrito.agregarProducto(nuevoProducto);
                                Swal.fire({
                                    icon: "success",
                                    title: "Producto agregado",
                                    text: `${producto.Nom_Pro} ha sido agregado al carrito.`,
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
                            console.error("Error al agregar producto al carrito:", error);
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Hubo un problema al agregar el producto al carrito.",
                                confirmButtonText: "Ok"
                            });
                        });
                    }
                };
  
                cardBody.appendChild(title);
                cardBody.appendChild(description);
                cardBody.appendChild(category);
                cardBody.appendChild(price);
                cardBody.appendChild(discount);
                cardBody.appendChild(button);
                
                card.appendChild(img);
                card.appendChild(cardBody);
                
                col.appendChild(card);
                container.appendChild(col);
            });
        })
        .catch(error => {
            console.error(error);
        });
  }
  
  
  window.onload = cargarProductos;
      