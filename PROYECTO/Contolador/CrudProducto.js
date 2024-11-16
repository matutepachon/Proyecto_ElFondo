function cargarProductos() {
    fetch('../Modulos/productos.php')
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            const container = document.getElementById("container");
            container.innerHTML = '';
            
            data.forEach(producto => {
                const col = document.createElement("div");
                col.className = "col-lg-3 col-md-4 col-sm-6 mt-2 mb-2";

                const card = document.createElement("div");
                card.className = "card";

                const img = document.createElement("img");
                img.src = producto.Rut_Img; 
                img.className = "card-img-top";
                img.style.height = '200px';
                img.style.objectFit = 'cover';

                const cardBody = document.createElement("div");
                cardBody.className = "card-body";

                const title = document.createElement("input");
                title.className = "form-control mb-2";
                title.type = "text";
                title.value = producto.Nom_Pro;
                title.disabled = true;

                const description = document.createElement("textarea");
                description.className = "form-control mb-2";
                description.value = producto.Descripcion;
                description.disabled = true;

                const precio = document.createElement("input");
                precio.className = "form-control mb-2";
                precio.type = "number";
                precio.min = "0";
                precio.value = producto.Precio;
                precio.disabled = true;

                const categoria = document.createElement("input");
                categoria.className = "form-control mb-2";
                categoria.type = "text";
                categoria.value = producto.Cat_Pro; 
                categoria.disabled = true;

                const descuento = document.createElement("input");
                descuento.className = "form-control mb-2";
                descuento.type = "number";
                descuento.min = "0";
                descuento.max = "99";
                descuento.value = producto.Desc_Pro;
                descuento.disabled = true;


                const imagen = document.createElement("input");
                imagen.className = "form-control mb-2";
                imagen.type = "text";
                imagen.value = producto.Rut_Img;
                imagen.disabled = true;

                const btnModificar = document.createElement("button");
                btnModificar.className = "btn btn-warning";
                btnModificar.textContent = "Modificar";
                let editando = false;

                btnModificar.onclick = () => {
                    if (!editando) {
                        title.disabled = false;
                        description.disabled = false;
                        precio.disabled = false;
                        imagen.disabled = false;
                        descuento.disabled = false;
                        categoria.disabled = false;
                        btnModificar.textContent = "Guardar";
                        editando = true;
                    } else {
                        modificarProducto({
                            ID_Pro: producto.ID_Pro,
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
                        btnModificar.textContent = "Modificar";
                        editando = false;
                    }
                };

                // Botón de eliminar
                const btnEliminar = document.createElement("button");
                btnEliminar.className = "btn btn-danger ms-2";
                btnEliminar.textContent = "Eliminar";
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
        .catch(error => console.error( error));
}




function agregarProducto() {
    const id = document.getElementById("idProducto").value;
    const nombre = document.getElementById("nombreProducto").value;
    const descripcion = document.getElementById("descripcionProducto").value;
    const precio = parseFloat(document.getElementById('precioProducto').value).toFixed(2); // Convertir a decimal
    const imagenURL = document.getElementById("imagenProductoURL").value;
    const categoria = document.getElementById("categoriaProducto").value;
    const descuento = document.getElementById("descuentoProducto").value;

    const producto = {
        ID_Pro: id,
        Nom_Pro: nombre,
        Descripcion: descripcion,
        Precio: precio,
        Rut_Img: imagenURL,
        Cat_Pro: categoria,
        Desc_Pro: descuento
    };

    fetch("../Modulos/productos.php", {
        method: "POST",
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        cargarProductos(); 
        $("#modalAgregarProducto").modal("hide");
        document.getElementById("formAgregarProducto").reset(); 
    })
    .catch(error => console.error(error));
}


function eliminarProducto(id) {
    console.log("ID del producto a eliminar:", id);
    
    Swal.fire({
        title: "¿Estas seguro?",
        text: "El producto "+ id + " se eliminara permanentemente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#baff39",
        cancelButtonText:"Cancelar",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"     
      }).then((result) => {
        if (result.isConfirmed) {

            fetch('../Modulos/productos.php', {
            method: 'DELETE',
            body: JSON.stringify({ id: id })
            
            })


            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                cargarProductos(); 
                Swal.fire({
                    width: 250,
                    toast: true,
                    background: "#baff39",
                    position: "top",
                    title: "Producto Eleminado",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => console.error(error));
    
        }
      });
    
}




window.onload = () => {
    cargarProductos();
    document.getElementById("btnGuardarProducto").onclick = agregarProducto; 
};



function modificarProducto(producto) {
    fetch("../Modulos/productos.php", {
        method: "PUT",
        body: JSON.stringify(producto),
    })
    .then(response => {
        
        return response.json();
    })
    .then(data => {
        console.log("Producto modificado:", data);
        cargarProductos(); 
    })
    .catch(error => {
        console.error(error);
    });
}


document.addEventListener("DOMContentLoaded", function() {
    fetch("../Modulos/accesos.php")
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const tipoUsuario = data.tipo_usuario;

                if (window.location.pathname.includes("productosAdmin.html") && tipoUsuario !== "admin") {
                    alert("No tienes permiso para acceder a esta página.");
                    window.location.href = 'index.html'; 
                }
            } else {
                alert("No tienes permiso para acceder a esta página.");
                window.location.href = "Login.html"; 
            }
        })
        .catch(error => {
            console.error(error);
        });
});


