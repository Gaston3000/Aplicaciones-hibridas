import Categoria from '../models/categoriaModel.js';

export const getCategorias = async (req, res) => {
    const categorias = await Categoria.find();
    res.json(categorias);
};

export const postCategoria = async (req, res) => {
    const { nombre } = req.body || {};
    if (!nombre) {
        return res.status(400).json({ error: 'nombre es requerido' });
    }
    const nueva = await Categoria.create({ nombre });
    res.status(201).json(nueva);
};

export const deleteCategoria = async (req, res) => {
    const eliminada = await Categoria.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ error: 'Categoria no encontrada' });
    res.json(eliminada);
};
