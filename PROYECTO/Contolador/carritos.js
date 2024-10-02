class Carrito {
    constructor() {
        // Cargar productos del localStorage si existen
        const productosGuardados = JSON.parse(localStorage.getItem('carrito')) || [];
        this.productos = productosGuardados;
    }

    agregarProducto(producto) {
        this.productos.push(producto);
        // Guardar el carrito en localStorage cada vez que se agregue un producto
        localStorage.setItem('carrito', JSON.stringify(this.productos));
    }

    eliminarProducto(id) {
        this.productos = this.productos.filter(producto => producto.id !== id);
        localStorage.setItem('carrito', JSON.stringify(this.productos)); // Actualizar localStorage
    }

    calcularTotal() {
        return this.productos.reduce((total, producto) => total + producto.precio, 0);
    }

    obtenerProductos() {
        return this.productos;
    }

    limpiarCarrito() {
        this.productos = [];
        localStorage.removeItem('carrito'); // Limpiar también el localStorage
    }
}

// Crear una instancia del carrito
const carrito = new Carrito();

function mostrarCarrito() {
    const container = document.getElementById('carrito');
    container.innerHTML = ''; // Limpiar contenido previo

    carrito.obtenerProductos().forEach(producto => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6';

        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = producto.imagen;
        img.className = 'card-img-top';
        img.style.height = '200px';
        img.style.objectFit = 'cover';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = producto.nombre;

        const price = document.createElement('p');
        price.className = 'card-text';
        price.textContent = `$${producto.precio.toFixed(2)}`;

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => {
            carrito.eliminarProducto(producto.id); // Eliminar del carrito
            mostrarCarrito(); // Actualizar la visualización del carrito
            alert(`${producto.nombre} ha sido eliminado del carrito.`);
        };

        // Agregar elementos al cuerpo de la tarjeta
        cardBody.appendChild(title);
        cardBody.appendChild(price);
        cardBody.appendChild(deleteButton); // Agregar el botón de eliminar
        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);
        container.appendChild(col);
    });

    const totalDiv = document.getElementById('total');
    const total = carrito.calcularTotal();
    totalDiv.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
}

// Inicializa el carrito desde localStorage al cargar la página del carrito
window.onload = function() {
    mostrarCarrito();
};