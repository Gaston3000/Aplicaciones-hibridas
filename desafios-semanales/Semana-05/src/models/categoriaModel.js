// Modelo Categoría - estructura del recurso.

export const categorias = [
    { id: 1, nombre: 'Limpieza líquida' },
    { id: 2, nombre: 'Accesorios' }
];

export const crearCategoria = ({ nombre }) => ({
    id: categorias.length ? categorias[categorias.length - 1].id + 1 : 1,
    nombre
});
