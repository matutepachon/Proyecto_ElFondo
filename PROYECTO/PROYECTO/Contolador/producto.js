// producto.js
class Producto {
    constructor(id, nombre, precio, categoria, descuento, rutaImagen, descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio); // Asegurarse de que el precio sea numérico
        this.categoria = categoria;
        this.descuento = parseFloat(descuento); // Convertir el descuento en número
        this.rutaImagen = rutaImagen;
        this.descripcion = descripcion;
        this.cantidad = 1; // Inicializar la cantidad en 1
    }
}
