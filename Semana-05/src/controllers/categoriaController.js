import * as categoriaService from '../services/categoriaService.js';

export const getCategorias = (req, res) => {
    res.json(categoriaService.obtenerTodas());
};

export const getCategoriaById = (req, res) => {
    const categoria = categoriaService.obtenerPorId(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
};

export const postCategoria = (req, res) => {
    const { nombre } = req.body || {};
    if (!nombre) return res.status(400).json({ error: 'nombre es requerido' });
    const nueva = categoriaService.crear({ nombre });
    res.status(201).json(nueva);
};

export const putCategoria = (req, res) => {
    const actualizada = categoriaService.actualizar(req.params.id, req.body || {});
    if (!actualizada) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(actualizada);
};

export const deleteCategoria = (req, res) => {
    const eliminada = categoriaService.eliminar(req.params.id);
    if (!eliminada) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(eliminada);
};
