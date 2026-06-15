import Producto from '../models/productoModel.js';

export const getProductos = async (req, res) => {
    const productos = await Producto.find();
    res.json(productos);
};

export const getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(producto);
    } catch (error) {
        // si el id no tiene formato valido de mongo cae aca
        res.status(400).json({ error: 'Id invalido' });
    }
};

export const postProducto = async (req, res) => {
    const { nombre, precio } = req.body || {};
    if (!nombre || precio === undefined) {
        return res.status(400).json({ error: 'nombre y precio son requeridos' });
    }
    const nuevo = await Producto.create(req.body);
    res.status(201).json(nuevo);
};

export const putProducto = async (req, res) => {
    const actualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
};

export const deleteProducto = async (req, res) => {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(eliminado);
};
