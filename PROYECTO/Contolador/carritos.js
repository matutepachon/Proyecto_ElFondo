class Carrito {
    constructor() {
        const productosGuardados = JSON.parse(localStorage.getItem("carrito")) || [];
        this.productos = productosGuardados.map(prod => {
            return {
                ...prod,
                precio: parseFloat(prod.precio) || 0,
                descuento: parseFloat(prod.descuento) || 0,
                cantidad: parseInt(prod.cantidad, 10) || 1
            };
        });
    }

    agregarProducto(producto) {
        const existe = this.productos.find(p => p.id === producto.id);
        if (existe) {
            existe.cantidad += 1;
        } else {
            producto.cantidad = 1;
            this.productos.push(producto);
        }
        localStorage.setItem("carrito", JSON.stringify(this.productos));
    }

    eliminarProducto(id) {
        this.productos = this.productos.filter(producto => producto.id !== id);
        localStorage.setItem("carrito", JSON.stringify(this.productos));
    }

    actualizarProducto(id, nuevaCantidad) {
        const producto = this.productos.find(prod => prod.id === id);
        if (producto && nuevaCantidad >= 1) {
            producto.cantidad = nuevaCantidad;
            localStorage.setItem("carrito", JSON.stringify(this.productos));
        }
    }

    calcularTotal() {
        return this.productos.reduce((total, producto) => {
            const precioConDescuento = producto.precio - (producto.precio * (producto.descuento / 100));
            return total + (precioConDescuento * producto.cantidad);
        }, 0);
    }

    limpiarCarrito() {
        this.productos = [];
        localStorage.removeItem("carrito");
    }

    obtenerProductos() {
        return this.productos;
    }

    limpiarCarrito() {
        this.productos = [];
        localStorage.removeItem("carrito");
    }
}

const carrito = new Carrito();

function mostrarCarrito() {
    const container = document.getElementById("carrito1");
    container.innerHTML = '';

    carrito.obtenerProductos().forEach(producto => {
        const col = document.createElement("div");
        col.className = "col-md-12 mb-4";

        const card = document.createElement("div");
        card.className = "card rounded-3 mb-4";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body p-4";

        const row = document.createElement("div");
        row.className = "row d-flex justify-content-between align-items-center";

        const imgCol = document.createElement("div");
        imgCol.className = "col-md-2 col-lg-2 col-xl-2";
        const img = document.createElement("img");
        img.src = producto.rutaImagen;
        img.className = "img-fluid rounded-3";
        img.alt = producto.nombre;
        imgCol.appendChild(img);

        const detailsCol = document.createElement("div");
        detailsCol.className = "col-md-3 col-lg-3 col-xl-3";
        const title = document.createElement("p");
        title.className = "lead fw-normal mb-2";
        title.textContent = producto.nombre;

        const category = document.createElement("p");
        category.className = "text-muted";
        category.textContent = `Categoría: ${producto.categoria}`;

        detailsCol.appendChild(title);
        detailsCol.appendChild(category);

        const quantityCol = document.createElement("div");
        quantityCol.className = "col-md-3 col-lg-3 col-xl-2 d-flex";
        const minusButton = document.createElement("button");
        minusButton.className = "btn btn-link px-2";
        minusButton.innerHTML = '<i class="fas fa-minus"></i>';
        minusButton.onclick = () => {
            const input = quantityCol.querySelector('input[type=number]');
            const nuevaCantidad = Math.max(1, parseInt(input.value, 10) - 1);
            input.value = nuevaCantidad;
            carrito.actualizarProducto(producto.id, nuevaCantidad);
            mostrarCarrito();
        };

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.value = producto.cantidad;
        quantityInput.className = "form-control form-control-sm";
        quantityInput.onchange = () => {
            const nuevaCantidad = parseInt(quantityInput.value, 10);
            if (nuevaCantidad >= 1) {
                carrito.actualizarProducto(producto.id, nuevaCantidad);
                mostrarCarrito();
            }
        };

        const plusButton = document.createElement("button");
        plusButton.className = "btn btn-link px-2";
        plusButton.innerHTML = '<i class="fas fa-plus"></i>';
        plusButton.onclick = () => {
            const input = quantityCol.querySelector('input[type=number]');
            const nuevaCantidad = parseInt(input.value, 10) + 1;
            input.value = nuevaCantidad;
            carrito.actualizarProducto(producto.id, nuevaCantidad);
            mostrarCarrito();
        };

        quantityCol.appendChild(minusButton);
        quantityCol.appendChild(quantityInput);
        quantityCol.appendChild(plusButton);

        const priceCol = document.createElement("div");
        priceCol.className = "col-md-3 col-lg-2 col-xl-2 offset-lg-1";
        const price = document.createElement("h5");
        price.className = "mb-0";

        const precioConDescuento = producto.precio - (producto.precio * (producto.descuento / 100));
        const finalPrice = precioConDescuento * producto.cantidad;
        price.textContent = `$${finalPrice.toFixed(2)}`;

        priceCol.appendChild(price);

        const deleteCol = document.createElement("div");
        deleteCol.className = "col-md-1 col-lg-1 col-xl-1 text-end";
        const deleteButton = document.createElement("a");
        deleteButton.className = "text-danger";
        deleteButton.innerHTML = '<i class="fas fa-trash fa-lg"></i>';
        deleteButton.onclick = async () => {
            // Llamar al servidor para eliminar el producto del carrito
            try {
                const response = await fetch('../Modulos/carrito.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idProducto: producto.id })
                });
                const result = await response.json();
                if (result.success) {
                    carrito.eliminarProducto(producto.id);
                    mostrarCarrito();
                    verificarCarrito();
                    Toastify({ text: `${producto.nombre} ha sido eliminado del carrito.`, duration: 3000 }).showToast();
                } else {
                    console.error('Error al eliminar el producto:', result.error);
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        };

        deleteCol.appendChild(deleteButton);

        row.appendChild(imgCol);
        row.appendChild(detailsCol);
        row.appendChild(quantityCol);
        row.appendChild(priceCol);
        row.appendChild(deleteCol);

        cardBody.appendChild(row);
        card.appendChild(cardBody);
        col.appendChild(card);
        container.appendChild(col);
    });

    const totalDiv = document.getElementById("total");
    const total = carrito.calcularTotal();
    totalDiv.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
    
    if (typeof paypal !== "undefined") {
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2) 
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert('Transacción completada por ' + details.payer.name.given_name);
                });
            },
            onCancel: function(data) {
                Swal.fire({
                    width: 300,
                    toast: true,
                    background: "#baff39",
                    position: "top",
                    title: "La transacción fue cancelada",
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            onError: function(err) {
                console.error('Ocurrió un error durante la transacción:', err);
                Swal.fire({
                    width: 500,
                    toast: true,
                    background: "#baff39",
                    position: "top",
                    title: "Hubo un error al procesar su transacción. Inténtelo de nuevo.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }).render('#paypal-button-container');
    }
}



function verificarCarrito() {
    const carritoProductos = carrito.obtenerProductos();
    const botonComprar = document.getElementById("btnComprar");

    if (botonComprar) { // Verificar si el botón existe
        if (carritoProductos.length === 0) {
            botonComprar.style.display = "none"; // Si no hay productos en el carrito, ocultar el botón
        } else {
            botonComprar.style.display = "block"; // Si hay productos, mostrar el botón
        }
    } else {
        console.error("El botón de comprar no fue encontrado en el DOM.");
    }
}




window.onload = function() {
    verificarCarrito();
    mostrarCarrito();
};
