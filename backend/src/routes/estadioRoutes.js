import { Router } from 'express';
import {
    getEstadios,
    getEstadioById,
    postEstadio,
    putEstadio,
    deleteEstadio
} from '../controllers/estadioController.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.js';

const router = Router();

// Leer lo puede hacer cualquiera, es lo que muestra la parte pública.
router.get('/', getEstadios);
router.get('/:id', getEstadioById);

// Crear, editar y borrar: solo admin y con token.
router.post('/', verificarToken, soloAdmin, postEstadio);
router.put('/:id', verificarToken, soloAdmin, putEstadio);
router.delete('/:id', verificarToken, soloAdmin, deleteEstadio);

export default router;
