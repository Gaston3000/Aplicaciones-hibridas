// Services - lógica de negocio / acceso a datos.
import { productos, crearProducto } from '../models/productoModel.js';

export const obtenerTodos = () => productos;

export const obtenerPorId = (id) =>
    productos.find((p) => p.id === Number(id));

export const crear = (datos) => {
    const nuevo = crearProducto(datos);
    productos.push(nuevo);
    return nuevo;
};

export const actualizar = (id, datos) => {
    const index = productos.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    productos[index] = { ...productos[index], ...datos, id: productos[index].id };
    return productos[index];
};

export const eliminar = (id) => {
    const index = productos.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    const [eliminado] = productos.splice(index, 1);
    return eliminado;
};
