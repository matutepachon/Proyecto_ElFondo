// Asegúrate de que el archivo 'producto.js' esté cargado antes que este script
function cargarProductos() {
    fetch('../Modulos/productos.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('container');
            container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos

            // Crear las cartas para cada producto
            data.forEach(producto => {
                // Crear la columna
                const col = document.createElement('div');
                col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4'; // Ajustar el número de columnas según el tamaño de la pantalla

                // Crear la tarjeta
                const card = document.createElement('div');
                card.className = 'card'; // Clase Bootstrap para una tarjeta

                // Crear la imagen de la tarjeta
                const img = document.createElement('img');
                img.src = producto.Imagen; // Asegúrate de que la URL de la imagen sea correcta
                img.className = 'card-img-top'; // Clase para la imagen en la parte superior
                img.style.height = '200px'; // Limitar la altura de la imagen
                img.style.objectFit = 'cover'; // Mantener la proporción y cubrir el área disponible

                // Crear el cuerpo de la tarjeta
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                // Crear el título de la tarjeta
                const title = document.createElement('h5');
                title.className = 'card-title';
                title.textContent = producto.Nom_Pro; // Asignar el nombre del producto

                // Crear la descripción de la tarjeta
                const description = document.createElement('p');
                description.className = 'card-text';
                description.textContent = producto.Desc_Pro; // Asignar la descripción del producto

                // Botón "Agregar al Carrito"
                const button = document.createElement('button');
                button.className = 'btn btn-primary';
                button.textContent = 'Agregar al Carrito';
                button.onclick = () => {
                    // Crear un nuevo producto y agregarlo al carrito
                    const nuevoProducto = new Producto(producto.ID_Pro, producto.Nom_Pro, producto.Precio, producto.Imagen);
                    carrito.agregarProducto(nuevoProducto);

                    // Depuración: Imprimir el producto agregado y el contenido del carrito
                    console.log('Producto agregado:', nuevoProducto);
                    console.log('Contenido del carrito:', carrito.obtenerProductos());
                    console.log(JSON.parse(localStorage.getItem('carrito'))); // Verificar contenido del localStorage

                    // Mostrar alerta al agregar el producto
                    alert(`${producto.Nom_Pro} ha sido agregado al carrito.`);
                };

                // Agregar elementos al cuerpo de la tarjeta
                cardBody.appendChild(title);
                cardBody.appendChild(description);
                cardBody.appendChild(button);

                // Agregar la imagen y el cuerpo de la tarjeta a la tarjeta
                card.appendChild(img);
                card.appendChild(cardBody);

                // Agregar la tarjeta a la columna
                col.appendChild(card);

                // Agregar la columna al contenedor
                container.appendChild(col);
            });
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
        });
}

// Llama a la función para cargar los productos al cargar la página
window.onload = cargarProductos;
