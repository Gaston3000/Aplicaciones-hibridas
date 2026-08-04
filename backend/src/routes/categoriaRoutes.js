import { Router } from 'express';
import {
    getCategorias,
    getCategoriaById,
    postCategoria,
    putCategoria,
    deleteCategoria
} from '../controllers/categoriaController.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.js';

const router = Router();

// La lectura es pública (la usa el FrontOffice para filtrar sedes).
router.get('/', getCategorias);
router.get('/:id', getCategoriaById);

// Crear, editar y eliminar: solo administradores autenticados.
router.post('/', verificarToken, soloAdmin, postCategoria);
router.put('/:id', verificarToken, soloAdmin, putCategoria);
router.delete('/:id', verificarToken, soloAdmin, deleteCategoria);

export default router;
