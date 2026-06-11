import { Router } from 'express';
import {
    getProductos,
    getProductoById,
    postProducto,
    putProducto,
    deleteProducto
} from '../controllers/productoController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

// lectura libre, escritura protegida con token
router.get('/',          getProductos);
router.get('/:id',       getProductoById);
router.post('/',         verificarToken, postProducto);
router.put('/:id',       verificarToken, putProducto);
router.delete('/:id',    verificarToken, deleteProducto);

export default router;
