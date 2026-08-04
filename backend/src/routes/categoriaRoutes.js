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

// Leer es libre, el front las usa para armar los filtros.
router.get('/', getCategorias);
router.get('/:id', getCategoriaById);

// Crear, editar y borrar: solo admin y con token.
router.post('/', verificarToken, soloAdmin, postCategoria);
router.put('/:id', verificarToken, soloAdmin, putCategoria);
router.delete('/:id', verificarToken, soloAdmin, deleteCategoria);

export default router;
