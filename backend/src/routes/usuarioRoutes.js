import { Router } from 'express';
import {
    registrar,
    login,
    getPerfil,
    getUsuarios,
    getUsuarioById,
    postUsuario,
    putUsuario,
    deleteUsuario
} from '../controllers/usuarioController.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.js';

const router = Router();

// --- Públicas ---
router.post('/registro', registrar);
router.post('/login', login);

// --- Requiere estar logueado ---
router.get('/perfil', verificarToken, getPerfil);

// --- Solo administradores (BackOffice) ---
router.get('/', verificarToken, soloAdmin, getUsuarios);
router.post('/', verificarToken, soloAdmin, postUsuario);
router.get('/:id', verificarToken, soloAdmin, getUsuarioById);
router.put('/:id', verificarToken, soloAdmin, putUsuario);
router.delete('/:id', verificarToken, soloAdmin, deleteUsuario);

export default router;
