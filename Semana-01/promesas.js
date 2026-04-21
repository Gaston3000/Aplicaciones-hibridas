// Parte 2: Promesas
// Las mismas tareas convertidas a promesas, ejecutadas en paralelo con Promise.all.

function task1() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const producto = { id: 1, nombre: 'Detergente', precio: 1500 };
            console.log('Task 1 resuelta');
            resolve(producto);
        }, 1000);
    });
}

function task2() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const producto = { id: 2, nombre: 'Lavandina', precio: 800 };
            const descuento = producto.precio * 0.10;
            console.log('Task 2 resuelta');
            resolve({ ...producto, descuento, precioFinal: producto.precio - descuento });
        }, 1500);
    });
}

function task3() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const reporte = 'Reporte general de productos generado';
            console.log('Task 3 resuelta');
            resolve(reporte);
        }, 500);
    });
}

Promise.all([task1(), task2(), task3()])
    .then((resultados) => {
        console.log('Resultados en paralelo:');
        console.log(resultados);
    })
    .catch((err) => console.error('Error en Promise.all:', err));
