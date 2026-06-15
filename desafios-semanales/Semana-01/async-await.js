// Parte 3 - async/await con try/catch
// mismo flujo que los callbacks pero con await (queda mas limpio)

function task1() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const producto = { id: 1, nombre: 'Detergente', precio: 1500 };
            console.log('Task 1: producto obtenido');
            resolve(producto);
        }, 1000);
    });
}

function task2(producto) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!producto) return reject(new Error('No se recibió un producto'));
            const descuento = producto.precio * 0.10;
            const precioFinal = producto.precio - descuento;
            console.log('Task 2: descuento aplicado');
            resolve({ ...producto, descuento, precioFinal });
        }, 1000);
    });
}

function task3(producto) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (producto.precioFinal <= 0) return reject(new Error('Precio final inválido'));
            const reporte = `Reporte → ${producto.nombre}: $${producto.precioFinal} (antes $${producto.precio})`;
            console.log('Task 3: reporte generado');
            resolve(reporte);
        }, 1000);
    });
}

async function mainAsync() {
    try {
        const producto = await task1();
        const productoConDescuento = await task2(producto);
        const reporte = await task3(productoConDescuento);
        console.log(reporte);
    } catch (err) {
        console.error('Falló la cadena asincrónica:', err.message);
    }
}

mainAsync();
