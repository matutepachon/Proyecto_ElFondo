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

            data.forEach(producto => {
                const col = document.createElement('div');
                col.className = 'col-lg-3 col-md-4 col-sm-6 mt-2 mb-2';

                const card = document.createElement('div');
                card.className = 'card';

                const img = document.createElement('img');
                img.src = producto.Imagen;
                img.className = 'card-img-top';
                img.style.height = '200px';
                img.style.objectFit = 'cover';

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                // Campos editables
                const title = document.createElement('input');
                title.className = 'form-control mb-2';
                title.type = 'text';
                title.value = producto.Nom_Pro;
                title.disabled = true;

                const description = document.createElement('textarea');
                description.className = 'form-control mb-2';
                description.value = producto.Desc_Pro;
                description.disabled = true;

                const precio = document.createElement('input');
                precio.className = 'form-control mb-2';
                precio.type = 'number';
                precio.value = producto.Precio;
                precio.disabled = true;

                const imagen = document.createElement('input');
                imagen.className = 'form-control mb-2';
                imagen.type = 'text';
                imagen.value = producto.Imagen;
                imagen.disabled = true;

                // Botón de modificar
                const btnModificar = document.createElement('button');
                btnModificar.className = 'btn btn-warning';
                btnModificar.textContent = 'Modificar';
                let editando = false;

                btnModificar.onclick = () => {
                    if (!editando) {
                        // Permitir edición
                        title.disabled = false;
                        description.disabled = false;
                        precio.disabled = false;
                        imagen.disabled = false;
                        btnModificar.textContent = 'Guardar';
                        editando = true;
                    } else {
                        // Guardar cambios
                        modificarProducto({
                            ID_Pro: producto.ID_Pro, // Incluyendo el ID del producto
                            Nom_Pro: title.value,
                            Precio: precio.value,
                            Desc_Pro: description.value,
                            Imagen: imagen.value
                        });
                        title.disabled = true;
                        description.disabled = true;
                        precio.disabled = true;
                        imagen.disabled = true;
                        btnModificar.textContent = 'Modificar';
                        editando = false;
                    }
                };

                // Botón de eliminar
                const btnEliminar = document.createElement('button');
                btnEliminar.className = 'btn btn-danger';
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.onclick = () => eliminarProducto(producto.ID_Pro);

                cardBody.appendChild(title);
                cardBody.appendChild(description);
                cardBody.appendChild(precio);
                cardBody.appendChild(imagen);
                cardBody.appendChild(btnModificar);
                cardBody.appendChild(btnEliminar);

                card.appendChild(img);
                card.appendChild(cardBody);

                col.appendChild(card);
                container.appendChild(col);
            });
        })
        .catch(error => console.error('Error al cargar productos:', error));
}





// Función para agregar un nuevo producto
function agregarProducto() {
    const nombre = document.getElementById('nombreProducto').value;
    const descripcion = document.getElementById('descripcionProducto').value;
    const precio = document.getElementById('precioProducto').value;
    const imagenURL = document.getElementById('imagenProductoURL').value; // Obteniendo la URL de la imagen

    const formData = new FormData();
    formData.append('ID_Pro', Date.now().toString()); // Generar un ID único
    formData.append('Nom_Pro', nombre);
    formData.append('Desc_Pro', descripcion);
    formData.append('Precio', precio);
    formData.append('Imagen', imagenURL); // Ahora agregamos la URL de la imagen

    fetch('../Modulos/productos.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        cargarProductos(); // Recargar los productos después de agregar
        $('#modalAgregarProducto').modal('hide'); // Cerrar el modal
        document.getElementById('formAgregarProducto').reset(); // Reiniciar el formulario
    })
    .catch(error => console.error('Error al agregar producto:', error));
}







// Función para eliminar un producto
function eliminarProducto(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        fetch('../Modulos/productos.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                cargarProductos(); // Recargar los productos después de eliminar
            })
            .catch(error => console.error('Error al eliminar producto:', error));
}
}
// Al cargar la página
window.onload = () => {
    cargarProductos();
    document.getElementById('btnGuardarProducto').onclick = agregarProducto; // Vincula el botón de guardar
};



function modificarProducto(producto) {
    fetch('../Modulos/productos.php', {
        method: 'PUT', // Asumiendo que usarás el método PUT para actualizar
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto), // Convertir el objeto a formato JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al modificar el producto');
        }
        return response.json(); // Obtener la respuesta en formato JSON
    })
    .then(data => {
        // Manejar la respuesta si es necesario (p. ej., mostrar un mensaje de éxito)
        console.log('Producto modificado:', data);
        cargarProductos(); // Volver a cargar los productos para reflejar los cambios
    })
    .catch(error => {
        console.error('Error al modificar el producto:', error);
    });
}


