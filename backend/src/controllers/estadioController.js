import Estadio from '../models/estadioModel.js';
import Categoria from '../models/categoriaModel.js';

// GET /api/estadios  (público)
// Le puedo pasar ?categoria=<id> para filtrar y ?activo=true para ver solo los activos.
export const getEstadios = async (req, res, next) => {
    try {
        const filtro = {};
        if (req.query.categoria) filtro.categoria = req.query.categoria;
        if (req.query.activo === 'true') filtro.activo = true;
        if (req.query.activo === 'false') filtro.activo = false;

        // El populate cambia el id de la categoría por el documento entero,
        // así el front puede mostrar el nombre sin pedirlo aparte.
        const estadios = await Estadio.find(filtro)
            .populate('categoria', 'nombre descripcion')
            .sort({ createdAt: 1 });

        res.json(estadios);
    } catch (error) {
        next(error);
    }
};

// GET /api/estadios/:id  (público)
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

// POST /api/estadios  (solo admin)
export const postEstadio = async (req, res, next) => {
    try {
        const { nombre, ciudad, precio, categoria } = req.body || {};

        if (!nombre || !ciudad || precio === undefined || precio === '' || !categoria) {
            return res.status(400).json({
                error: 'nombre, ciudad, precio y categoria son obligatorios'
            });
        }

        // Me fijo que la categoría exista de verdad, no alcanza con que sea un id válido.
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

// PUT /api/estadios/:id  (solo admin)
export const putEstadio = async (req, res, next) => {
    try {
        // Si me mandan otra categoría, chequeo que exista igual que en el alta.
        if (req.body?.categoria) {
            const categoriaExiste = await Categoria.findById(req.body.categoria);
            if (!categoriaExiste) {
                return res.status(400).json({ error: 'La categoría indicada no existe' });
            }
        }

        // Sin runValidators, Mongoose no valida en los update y se cuela cualquier cosa.
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

// DELETE /api/estadios/:id  (solo admin)
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
