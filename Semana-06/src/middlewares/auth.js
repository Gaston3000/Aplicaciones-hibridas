import jwt from 'jsonwebtoken';

// Middleware que valida el token JWT que viene en el header Authorization.
// Se usa: Authorization: Bearer <token>
export const verificarToken = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Falta el token' });
    }

    const token = header.split(' ')[1];
    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = datos;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalido o expirado' });
    }
};

export default verificarToken;
