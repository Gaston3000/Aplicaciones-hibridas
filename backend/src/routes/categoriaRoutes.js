import { Router } from 'express';
import {
    getCategorias,
    postCategoria,
    deleteCategoria
} from '../controllers/categoriaController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

router.get('/',       getCategorias);
router.post('/',      verificarToken, postCategoria);
router.delete('/:id', verificarToken, deleteCategoria);

export default router;
