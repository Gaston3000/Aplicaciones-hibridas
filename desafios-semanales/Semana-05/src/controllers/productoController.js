import * as productoService from '../services/productoService.js';

export const getProductos = (req, res) => {
    res.json(productoService.obtenerTodos());
};

export const getProductoById = (req, res) => {
    const producto = productoService.obtenerPorId(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
};

export const postProducto = (req, res) => {
    const { nombre, precio, categoriaId } = req.body || {};
    if (!nombre || precio === undefined) {
        return res.status(400).json({ error: 'nombre y precio son requeridos' });
    }
    const nuevo = productoService.crear({ nombre, precio, categoriaId });
    res.status(201).json(nuevo);
};

export const putProducto = (req, res) => {
    const actualizado = productoService.actualizar(req.params.id, req.body || {});
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
};

export const deleteProducto = (req, res) => {
    const eliminado = productoService.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(eliminado);
};
