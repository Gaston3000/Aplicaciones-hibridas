import Producto from './models/productoModel.js';

// Carga los estadios (productos) la primera vez, para tener datos con los que probar
// el GET y la pagina de detalle del front. Si ya hay productos no hace nada.
export const seedProductos = async () => {
    const total = await Producto.countDocuments();
    if (total > 0) return;

    await Producto.insertMany([
        {
            nombre: 'New York New Jersey Stadium',
            marca: 'Nueva York / Nueva Jersey',
            categoria: 'Sede de la Final',
            precio: 1250000000,
            imagen: '/estadios/new-york.jpg',
            descripcion: 'Sede premium del Mundial 2026, pensada para noches históricas, finales inolvidables y eventos de escala mundial.'
        },
        {
            nombre: 'Dallas Stadium',
            marca: 'Dallas, Texas',
            categoria: 'Sede Premium',
            precio: 890000000,
            imagen: '/estadios/dallas.jpg',
            descripcion: 'Un estadio imponente, moderno y preparado para recibir partidos masivos con una experiencia visual de alto impacto.'
        },
        {
            nombre: 'Los Angeles Stadium',
            marca: 'Los Ángeles, California',
            categoria: 'Sede Tecnológica',
            precio: 1100000000,
            imagen: '/estadios/los-angeles.jpg',
            descripcion: 'Una sede cinematográfica, tecnológica y elegante, ideal para vivir el Mundial con una estética moderna y global.'
        },
        {
            nombre: 'Miami Stadium',
            marca: 'Miami, Florida',
            categoria: 'Sede Exclusiva',
            precio: 760000000,
            imagen: '/estadios/miami.jpg',
            descripcion: 'Una sede vibrante, cálida y exclusiva, con energía internacional y una experiencia mundialista única.'
        }
    ]);
    console.log('Estadios de ejemplo cargados');
};

export default seedProductos;
