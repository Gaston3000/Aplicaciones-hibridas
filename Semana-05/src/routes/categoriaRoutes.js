import { Router } from 'express';
import {
    getCategorias,
    getCategoriaById,
    postCategoria,
    putCategoria,
    deleteCategoria
} from '../controllers/categoriaController.js';

const router = Router();

router.get('/',       getCategorias);
router.get('/:id',    getCategoriaById);
router.post('/',      postCategoria);
router.put('/:id',    putCategoria);
router.delete('/:id', deleteCategoria);

export default router;
