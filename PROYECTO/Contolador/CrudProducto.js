function cargarProductos() {
    fetch('/PROYECTO/Modulos/productos.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const container = document.getElementById('container');
            container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos
            
            data.forEach(producto => {
                const col = document.createElement('div');
                col.className = 'col-lg-3 col-md-4 col-sm-6 mt-2 mb-2';

                const card = document.createElement('div');
                card.className = 'card';

                const img = document.createElement('img');
                img.src = producto.Rut_Img; // Usar Rut_Img para la ruta de la imagen
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
                description.value = producto.Descripcion; // Descripción adicional
                description.disabled = true;

                const precio = document.createElement('input');
                precio.className = 'form-control mb-2';
                precio.type = 'number';
                precio.value = producto.Precio;
                precio.disabled = true;

                const categoria = document.createElement('input');
                categoria.className = 'form-control mb-2';
                categoria.type = 'text';
                categoria.value = producto.Cat_Pro; // Categoría del producto
                categoria.disabled = true;

                const descuento = document.createElement('input');
                descuento.className = 'form-control mb-2';
                descuento.type = 'text';
                descuento.value = producto.Desc_Pro; // Descuento
                descuento.disabled = true;

                const imagen = document.createElement('input');
                imagen.className = 'form-control mb-2';
                imagen.type = 'text';
                imagen.value = producto.Rut_Img; // Ruta de la imagen
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
                        descuento.disabled = false;
                        categoria.disabled = false;
                        btnModificar.textContent = 'Guardar';
                        editando = true;
                    } else {
                        // Guardar cambios
                        modificarProducto({
                            ID_Pro: producto.ID_Pro, // Incluyendo el ID del producto
                            Nom_Pro: title.value,
                            Precio: precio.value,
                            Cat_Pro: categoria.value,
                            Desc_Pro: descuento.value,
                            Descripcion: description.value,
                            Rut_Img: imagen.value
                        });
                        title.disabled = true;
                        description.disabled = true;
                        precio.disabled = true;
                        imagen.disabled = true;
                        descuento.disabled = true;
                        categoria.disabled = true;
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
                cardBody.appendChild(categoria);
                cardBody.appendChild(descuento);
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




function agregarProducto() {
    const id = document.getElementById('idProducto').value;
    const nombre = document.getElementById('nombreProducto').value;
    const descripcion = document.getElementById('descripcionProducto').value;
    const precio = parseFloat(document.getElementById('precioProducto').value).toFixed(2); // Convertir a decimal
    const imagenURL = document.getElementById('imagenProductoURL').value;
    const categoria = document.getElementById('categoriaProducto').value;
    const descuento = document.getElementById('descuentoProducto').value;

    // Crear objeto con los datos del producto
    const producto = {
        ID_Pro: id,
        Nom_Pro: nombre,
        Descripcion: descripcion,
        Precio: precio,
        Rut_Img: imagenURL,
        Cat_Pro: categoria,
        Desc_Pro: descuento
    };

    // Enviar el objeto como JSON
    fetch('/PROYECTO/Modulos/productos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto) // Convertir el objeto a JSON
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        cargarProductos(); // Actualizar la lista de productos
        $('#modalAgregarProducto').modal('hide'); // Cerrar el modal
        document.getElementById('formAgregarProducto').reset(); // Limpiar el formulario
    })
    .catch(error => console.error('Error al agregar producto:', error));
}





// Función para eliminar un producto
// Función para eliminar un producto
// Función para eliminar un producto
function eliminarProducto(id) {
    console.log("ID del producto a eliminar:", id);
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        fetch(`/PROYECTO/Modulos/productos.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json' // Indica que el cuerpo de la solicitud está en JSON
            },
            body: JSON.stringify({ id }) // Envía el ID en el cuerpo de la solicitud
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message); // Muestra el mensaje de éxito o error
            cargarProductos(); // Llama a la función para recargar los productos
        })
        .catch(error => console.error('Error al eliminar producto:', error)); // Maneja errores
    }
}




// Al cargar la página
window.onload = () => {
    cargarProductos();
    document.getElementById('btnGuardarProducto').onclick = agregarProducto; // Vincula el botón de guardar
};



function modificarProducto(producto) {
    fetch('/PROYECTO/Modulos/productos.php', {
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


document.addEventListener('DOMContentLoaded', function() {
    // Verificar el acceso del usuario al cargar la página
    fetch('/PROYECTO/Modulos/accesos.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Usuario autenticado
                const tipoUsuario = data.tipo_usuario;

                // Comprobar el acceso a productosAdmin.html
                if (window.location.pathname.includes('productosAdmin.html') && tipoUsuario !== 'admin') {
                    alert('No tienes permiso para acceder a esta página.');
                    window.location.href = 'index.html'; // Redirigir a la página principal
                }
            } else {
                // Usuario no autenticado
                alert('Debes iniciar sesión para acceder a esta página.');
                window.location.href = 'Login.html'; // Redirigir a la página de inicio de sesión
            }
        })
        .catch(error => {
            console.error('Error al verificar el acceso:', error);
            alert('Ocurrió un error al verificar el acceso.');
        });
});


