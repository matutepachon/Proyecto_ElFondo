document.addEventListener('DOMContentLoaded', async () => {
    const facturasContainer = document.getElementById('facturasContainer');

    try {
        const response = await fetch('../Modulos/misfacturas.php');
        const facturas = await response.json();

        if (facturas.error) {
            facturasContainer.innerHTML = `<p>${facturas.error}</p>`;
            return;
        }

        facturas.forEach(factura => {
            const facturaElement = document.createElement('div');
            facturaElement.classList.add('factura');

            // Actualizamos los nombres de las propiedades aquí para coincidir con los datos del servidor
            facturaElement.innerHTML = `
                <h3>Factura #${factura.ID_Fact}</h3>
                <p>Fecha: ${factura.Fecha_Emision}</p>
                <p>Total: $${factura.Precio_Total}</p>
                <p>Detalles: ${factura.Descripcion}</p>
                <button class="descargar-btn" data-id="${factura.ID_Fact}" data-total="${factura.Precio_Total}" data-detalles="${factura.Descripcion}">
                    Descargar Factura
                </button>
            `;

            facturasContainer.appendChild(facturaElement);
        });

        document.querySelectorAll('.descargar-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const idFactura = event.target.dataset.id;
                const total = event.target.dataset.total;
                const detalles = event.target.dataset.detalles;

                await generarPDF(idFactura, total, detalles);
            });
        });
    } catch (error) {
        facturasContainer.innerHTML = `<p>Error al cargar las facturas</p>`;
        console.error(error);
    }
});

async function generarPDF(idFactura, total, detalles) {
    const { PDFDocument, rgb } = PDFLib;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText(`Factura #${idFactura}`, { x: 50, y: 350, size: 20, color: rgb(0, 0, 0) });
    page.drawText(`Total: $${total}`, { x: 50, y: 300, size: 16 });
    page.drawText(`Detalles: ${detalles}`, { x: 50, y: 250, size: 16 });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Factura_${idFactura}.pdf`;
    link.click();
}
