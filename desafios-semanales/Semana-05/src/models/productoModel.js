// Modelo Producto - estructura del recurso.
// Por ahora trabaja con un array en memoria. Más adelante se conecta a la DB.

export const productos = [
    { id: 1, nombre: 'Detergente', precio: 1500, categoriaId: 1 },
    { id: 2, nombre: 'Lavandina',  precio: 800,  categoriaId: 1 },
    { id: 3, nombre: 'Esponjas',   precio: 450,  categoriaId: 2 }
];

export const crearProducto = ({ nombre, precio, categoriaId }) => ({
    id: productos.length ? productos[productos.length - 1].id + 1 : 1,
    nombre,
    precio,
    categoriaId
});
