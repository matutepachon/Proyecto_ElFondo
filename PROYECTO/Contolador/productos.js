let productosData = [];

function cargarProductos() {
    fetch("../Modulos/productos.php")
        .then(response => response.json())
        .then(data => {
            productosData = data;
            mostrarProductos(productosData); 
        })
        .catch(error => {
            console.error(error);
        });
}

function filtrarProductos() {
    const searchTerm = document.getElementById("buscador").value.toLowerCase(); 
    const productosFiltrados = productosData.filter(producto => 
        producto.Nom_Pro.toLowerCase().includes(searchTerm)
    );

    mostrarProductos(productosFiltrados);
}

function mostrarProductos(data) {
    const container = document.getElementById("container");
    container.innerHTML = ""; 

    if (data.length === 0) {
        container.innerHTML = '<p class="text-center" id="txtNoencontrado">No se encontraron productos</p>';
        return;
    }

    data.forEach(producto => {
        const col = document.createElement("div");
        col.className = "col-lg-3 col-md-4 col-sm-6 mb-4";
        
        const card = document.createElement("div");
        card.className = "card";
        
        const img = document.createElement("img");
        img.src = producto.Rut_Img;
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
                carrito.agregarProducto(nuevoProducto);
                Swal.fire({
                    icon: "success",
                    title: "Producto agregado",
                    text: `${producto.Nom_Pro} ha sido agregado al carrito.`,
                    confirmButtonText: "Ok"
                });
                button.disabled = true;
                button.textContent = "Ya agregado";
            }
        };

        // Agregar los elementos al card
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
}

document.getElementById("btnbuscador").addEventListener("click", filtrarProductos);

window.onload = cargarProductos;