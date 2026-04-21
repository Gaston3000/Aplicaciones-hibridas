// Parte 1 - Callbacks
// 3 tareas async con setTimeout (producto)

function task1(callback) {
    setTimeout(() => {
        const producto = { id: 1, nombre: 'Detergente', precio: 1500 };
        console.log('Task 1: producto obtenido');
        callback(null, producto);
    }, 1000);
}

function task2(producto, callback) {
    setTimeout(() => {
        const descuento = producto.precio * 0.10;
        const precioFinal = producto.precio - descuento;
        console.log('Task 2: descuento aplicado');
        callback(null, { ...producto, descuento, precioFinal });
    }, 1000);
}

function task3(producto, callback) {
    setTimeout(() => {
        const reporte = `Reporte → ${producto.nombre}: $${producto.precioFinal} (antes $${producto.precio})`;
        console.log('Task 3: reporte generado');
        callback(null, reporte);
    }, 1000);
}

function mainCallback() {
    console.log('arranca la cadena de callbacks...');
    task1((err, producto) => {
        if (err) return console.error('Error en task1:', err);
        task2(producto, (err, productoConDescuento) => {
            if (err) return console.error('Error en task2:', err);
            task3(productoConDescuento, (err, reporte) => {
                if (err) return console.error('Error en task3:', err);
                console.log(reporte);
            });
        });
    });
}

mainCallback();

