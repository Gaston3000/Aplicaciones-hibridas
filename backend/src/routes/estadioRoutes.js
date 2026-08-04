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

// La lectura es pública (la usa el FrontOffice).
router.get('/', getEstadios);
router.get('/:id', getEstadioById);

// Crear, editar y eliminar: solo administradores autenticados.
router.post('/', verificarToken, soloAdmin, postEstadio);
router.put('/:id', verificarToken, soloAdmin, putEstadio);
router.delete('/:id', verificarToken, soloAdmin, deleteEstadio);

export default router;
