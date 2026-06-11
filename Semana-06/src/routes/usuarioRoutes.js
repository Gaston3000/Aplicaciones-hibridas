import { Router } from 'express';
import { registrar, login, getUsuarios } from '../controllers/usuarioController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

router.post('/registro', registrar);
router.post('/login',    login);
router.get('/',          verificarToken, getUsuarios);

export default router;
