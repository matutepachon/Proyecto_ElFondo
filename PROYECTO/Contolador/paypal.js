paypal.Buttons({
    createOrder: function(data, actions) {
        const total = carrito.calcularTotal(); 
        if (total <= 0) {
            alert("El carrito está vacío. No se puede proceder con la compra.");
            return;
        }
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
            // Enviar detalles de la transacción al servidor para generar la factura
            fetch('../Modulos/gestionCompra.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderID: data.orderID,
                    total: carrito.calcularTotal()
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Compra completada con éxito. Se ha generado la factura.');
                    carrito.limpiarCarrito();  // Limpiar el carrito
                    console.log(PDFLib);
                    // Obtener los detalles de la última factura
                    fetch('../Modulos/generarFacturas.php')
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                // Generar el PDF con los datos de la factura
                                generarPDF(data.factura);
                            } else {
                                alert('No se pudo recuperar la factura');
                            }
                        })
                        .catch((error) => {
                            console.error('Error al recuperar la factura:', error);
                            alert('Hubo un error al obtener los detalles de la factura.');
                        });
                } else {
                    alert('Hubo un problema al generar la factura.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Hubo un error al procesar su transacción. Inténtelo de nuevo.');
            });
        });
    },
    onCancel: function(data) {
        alert('La transacción fue cancelada');
    },
    onError: function(err) {
        console.error('Ocurrió un error durante la transacción:', err);
        alert('Hubo un error al procesar su transacción. Inténtelo de nuevo.');
    }
}).render('#paypal-button-container');

// Función para generar el PDF usando PDF-LIB
function generarPDF(factura) {
    const { PDFDocument, rgb } = PDFLib;

    const { ID_Fact, Fecha_Emision, Direccion, Rut, Telefono, Nom_Emisor, Precio_Total, Subtotal, Constancia, Iva } = factura;

    (async () => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]); // Tamaño de la página (ancho x alto)
        
        const fontSize = 12;

        // Contenido del PDF
        page.drawText(`Factura: ${ID_Fact}`, { x: 50, y: 350, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Fecha de emisión: ${Fecha_Emision}`, { x: 50, y: 330, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Emisor: ${Nom_Emisor}`, { x: 50, y: 310, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Dirección: ${Direccion}`, { x: 50, y: 290, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`RUT: ${Rut}`, { x: 50, y: 270, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Teléfono: ${Telefono}`, { x: 50, y: 250, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Subtotal: $${Subtotal}`, { x: 50, y: 230, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`IVA: $${Iva}`, { x: 50, y: 210, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Total: $${Precio_Total}`, { x: 50, y: 190, size: fontSize, color: rgb(0, 0, 0) });
        page.drawText(`Constancia: ${Constancia}`, { x: 50, y: 170, size: fontSize, color: rgb(0, 0, 0) });

        // Descargar el PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `factura_${ID_Fact}.pdf`;
        link.click();
    })();
}
