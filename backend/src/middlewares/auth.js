import jwt from 'jsonwebtoken';

// Chequea que venga un token válido en el header Authorization.
// Se manda así:  Authorization: Bearer <token>
// Si está todo bien deja los datos del usuario en req.usuario y sigue de largo.
export const verificarToken = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Falta el token de autenticación' });
    }

    const token = header.split(' ')[1];

    try {
        // El secreto sale del .env, nunca lo escribo acá en el código.
        const datos = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = datos; // { id, email, rol }
        next();
    } catch (error) {
        // jsonwebtoken avisa distinto si el token venció o si directamente es trucho.
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'La sesión expiró, volvé a iniciar sesión' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// Este va siempre después de verificarToken.
// Deja pasar solo a los que tienen rol "admin".
export const soloAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'Falta el token de autenticación' });
    }

    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
    }

    next();
};
