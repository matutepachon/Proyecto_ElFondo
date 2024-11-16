function filtrarProductos() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase(); // Obtener el texto de búsqueda
    const productosFiltrados = data.filter(producto => 
        producto.Nom_Pro.toLowerCase().includes(searchTerm) // Filtrar productos que coinciden con el término de búsqueda
    );

    mostrarProductos(productosFiltrados); // Mostrar productos filtrados
}