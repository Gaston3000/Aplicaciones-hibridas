import Estadio from '../models/estadioModel.js';
import Categoria from '../models/categoriaModel.js';

// ---------------------------------------------------------------------------
// GET /api/estadios  (público)
// Acepta ?categoria=<id> para filtrar y ?activo=true para ver solo los activos.
// ---------------------------------------------------------------------------
export const getEstadios = async (req, res, next) => {
    try {
        const filtro = {};
        if (req.query.categoria) filtro.categoria = req.query.categoria;
        if (req.query.activo === 'true') filtro.activo = true;
        if (req.query.activo === 'false') filtro.activo = false;

        // populate trae el documento completo de la categoría, no solo el id.
        const estadios = await Estadio.find(filtro)
            .populate('categoria', 'nombre descripcion')
            .sort({ createdAt: 1 });

        res.json(estadios);
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// GET /api/estadios/:id  (público)
// ---------------------------------------------------------------------------
export const getEstadioById = async (req, res, next) => {
    try {
        const estadio = await Estadio.findById(req.params.id).populate(
            'categoria',
            'nombre descripcion'
        );
        if (!estadio) {
            return res.status(404).json({ error: 'Estadio no encontrado' });
        }
        res.json(estadio);
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// POST /api/estadios  (solo admin)
// ---------------------------------------------------------------------------
export const postEstadio = async (req, res, next) => {
    try {
        const { nombre, ciudad, precio, categoria } = req.body || {};

        if (!nombre || !ciudad || precio === undefined || precio === '' || !categoria) {
            return res.status(400).json({
                error: 'nombre, ciudad, precio y categoria son obligatorios'
            });
        }

        // La categoría tiene que existir de verdad en la base.
        const categoriaExiste = await Categoria.findById(categoria);
        if (!categoriaExiste) {
            return res.status(400).json({ error: 'La categoría indicada no existe' });
        }

        const nuevo = await Estadio.create(req.body);
        const conCategoria = await nuevo.populate('categoria', 'nombre descripcion');

        res.status(201).json(conCategoria);
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// PUT /api/estadios/:id  (solo admin)
// ---------------------------------------------------------------------------
export const putEstadio = async (req, res, next) => {
    try {
        // Si mandan una categoría nueva, verificamos que exista.
        if (req.body?.categoria) {
            const categoriaExiste = await Categoria.findById(req.body.categoria);
            if (!categoriaExiste) {
                return res.status(400).json({ error: 'La categoría indicada no existe' });
            }
        }

        // runValidators hace que Mongoose valide también en las actualizaciones.
        const actualizado = await Estadio.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('categoria', 'nombre descripcion');

        if (!actualizado) {
            return res.status(404).json({ error: 'Estadio no encontrado' });
        }

        res.json(actualizado);
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// DELETE /api/estadios/:id  (solo admin)
// ---------------------------------------------------------------------------
export const deleteEstadio = async (req, res, next) => {
    try {
        const eliminado = await Estadio.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: 'Estadio no encontrado' });
        }
        res.json({ mensaje: 'Estadio eliminado', estadio: eliminado });
    } catch (error) {
        next(error);
    }
};
