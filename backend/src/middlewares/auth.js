import jwt from 'jsonwebtoken';

// ---------------------------------------------------------------------------
// verificarToken: revisa que venga un JWT válido en el header Authorization.
// Se usa así:  Authorization: Bearer <token>
// Si el token está OK, deja los datos del usuario en req.usuario y sigue.
// ---------------------------------------------------------------------------
export const verificarToken = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Falta el token de autenticación' });
    }

    const token = header.split(' ')[1];

    try {
        // El secreto SIEMPRE sale de las variables de entorno (nunca escrito en el código).
        const datos = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = datos; // { id, email, rol }
        next();
    } catch (error) {
        // jsonwebtoken avisa distinto si el token venció o si es inválido.
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'La sesión expiró, volvé a iniciar sesión' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// ---------------------------------------------------------------------------
// soloAdmin: se usa DESPUÉS de verificarToken.
// Deja pasar únicamente a los usuarios con rol "admin".
// ---------------------------------------------------------------------------
export const soloAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'Falta el token de autenticación' });
    }

    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
    }

    next();
};
