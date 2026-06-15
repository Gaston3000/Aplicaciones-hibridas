import Producto from './models/productoModel.js';

// Carga algunos productos la primera vez, para tener datos con los que probar
// el GET y la pagina de detalle del front. Si ya hay productos no hace nada.
export const seedProductos = async () => {
    const total = await Producto.countDocuments();
    if (total > 0) return;

    await Producto.insertMany([
        { nombre: 'Limpiador Multiuso', marca: 'Cif', precio: 1200, categoria: 'Multiuso' },
        { nombre: 'Detergente Limon', marca: 'Magistral', precio: 1500, categoria: 'Detergente' },
        { nombre: 'Lavandina Concentrada', marca: 'Ayudin', precio: 800, categoria: 'Lavandina' },
        { nombre: 'Quitagrasa', marca: 'Mr. Musculo', precio: 1800, categoria: 'Quitagrasa' }
    ]);
    console.log('Productos de ejemplo cargados');
};

export default seedProductos;
