import { categorias, crearCategoria } from '../models/categoriaModel.js';

export const obtenerTodas = () => categorias;

export const obtenerPorId = (id) =>
    categorias.find((c) => c.id === Number(id));

export const crear = (datos) => {
    const nueva = crearCategoria(datos);
    categorias.push(nueva);
    return nueva;
};

export const actualizar = (id, datos) => {
    const index = categorias.findIndex((c) => c.id === Number(id));
    if (index === -1) return null;
    categorias[index] = { ...categorias[index], ...datos, id: categorias[index].id };
    return categorias[index];
};

export const eliminar = (id) => {
    const index = categorias.findIndex((c) => c.id === Number(id));
    if (index === -1) return null;
    const [eliminada] = categorias.splice(index, 1);
    return eliminada;
};
