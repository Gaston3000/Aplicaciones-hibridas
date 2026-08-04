import Categoria from '../models/categoriaModel.js';
import Estadio from '../models/estadioModel.js';

// ---------------------------------------------------------------------------
// GET /api/categorias  (público)
// ---------------------------------------------------------------------------
export const getCategorias = async (req, res, next) => {
    try {
        const categorias = await Categoria.find().sort({ nombre: 1 });
        res.json(categorias);
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// GET /api/categorias/:id  (público)
// ---------------------------------------------------------------------------
export const getCategoriaById = async (req, res, next) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json(categoria);
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// POST /api/categorias  (solo admin)
// ---------------------------------------------------------------------------
export const postCategoria = async (req, res, next) => {
    try {
        const { nombre, descripcion, activo } = req.body || {};

        if (!nombre || !String(nombre).trim()) {
            return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
        }

        const nombreLimpio = String(nombre).trim();

        // Evitamos categorías duplicadas (comparación sin distinguir mayúsculas).
        const existe = await Categoria.findOne({
            nombre: new RegExp(`^${escaparRegex(nombreLimpio)}$`, 'i')
        });
        if (existe) {
            return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        }

        const nueva = await Categoria.create({
            nombre: nombreLimpio,
            descripcion: descripcion || '',
            activo: activo !== undefined ? activo : true
        });

        res.status(201).json(nueva);
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// PUT /api/categorias/:id  (solo admin)
// ---------------------------------------------------------------------------
export const putCategoria = async (req, res, next) => {
    try {
        const { nombre } = req.body || {};

        if (nombre !== undefined && !String(nombre).trim()) {
            return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
        }

        if (nombre) {
            // Que el nombre nuevo no lo tenga ya OTRA categoría.
            const existe = await Categoria.findOne({
                _id: { $ne: req.params.id },
                nombre: new RegExp(`^${escaparRegex(String(nombre).trim())}$`, 'i')
            });
            if (existe) {
                return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
            }
        }

        const actualizada = await Categoria.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!actualizada) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json(actualizada);
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// DELETE /api/categorias/:id  (solo admin)
// No se puede borrar una categoría que tenga estadios asociados: si no,
// esos estadios quedarían apuntando a una categoría que ya no existe.
// ---------------------------------------------------------------------------
export const deleteCategoria = async (req, res, next) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const estadiosAsociados = await Estadio.countDocuments({ categoria: categoria._id });
        if (estadiosAsociados > 0) {
            return res.status(409).json({
                error: `No se puede eliminar: hay ${estadiosAsociados} estadio(s) usando esta categoría`
            });
        }

        await categoria.deleteOne();
        res.json({ mensaje: 'Categoría eliminada', categoria });
    } catch (error) {
        next(error);
    }
};

// Escapa los caracteres especiales para poder buscar un nombre exacto con RegExp.
function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
