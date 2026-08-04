import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarioModel.js';

// Devuelve el usuario "limpio" para las respuestas de la API (nunca la password).
const formatearUsuario = (usuario) => ({
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    createdAt: usuario.createdAt,
    updatedAt: usuario.updatedAt
});

// Genera el JWT con lo mínimo necesario: id, email y rol.
const generarToken = (usuario) =>
    jwt.sign(
        { id: usuario._id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '4h' }
    );

// ---------------------------------------------------------------------------
// POST /api/usuarios/registro  (público)
// ---------------------------------------------------------------------------
export const registrar = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body || {};

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const emailNormalizado = String(email).trim().toLowerCase();
        const existe = await Usuario.findOne({ email: emailNormalizado });
        if (existe) {
            return res.status(409).json({ error: 'El email ya está registrado' });
        }

        // La password se hashea con bcrypt ANTES de guardarla.
        const hash = await bcrypt.hash(password, 10);

        // El registro público siempre crea usuarios con rol "usuario":
        // nadie puede convertirse en admin mandando { rol: "admin" } en el body.
        const usuario = await Usuario.create({
            nombre: String(nombre).trim(),
            email: emailNormalizado,
            password: hash,
            rol: 'usuario'
        });

        res.status(201).json(formatearUsuario(usuario));
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// POST /api/usuarios/login  (público)
// ---------------------------------------------------------------------------
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ error: 'email y password son obligatorios' });
        }

        // La password tiene select:false en el modelo, hay que pedirla explícitamente.
        const usuario = await Usuario.findOne({
            email: String(email).trim().toLowerCase()
        }).select('+password');

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const coincide = await bcrypt.compare(password, usuario.password);
        if (!coincide) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        res.json({
            token: generarToken(usuario),
            usuario: formatearUsuario(usuario)
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// GET /api/usuarios/perfil  (requiere token)
// Devuelve los datos del usuario que está logueado.
// ---------------------------------------------------------------------------
export const getPerfil = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(formatearUsuario(usuario));
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// GET /api/usuarios  (solo admin)
// ---------------------------------------------------------------------------
export const getUsuarios = async (req, res, next) => {
    try {
        const usuarios = await Usuario.find().sort({ createdAt: -1 });
        res.json(usuarios.map(formatearUsuario));
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// GET /api/usuarios/:id  (solo admin)
// ---------------------------------------------------------------------------
export const getUsuarioById = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(formatearUsuario(usuario));
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// POST /api/usuarios  (solo admin)
// Alta de usuarios desde el BackOffice, acá sí se puede elegir el rol.
// ---------------------------------------------------------------------------
export const postUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body || {};

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const emailNormalizado = String(email).trim().toLowerCase();
        const existe = await Usuario.findOne({ email: emailNormalizado });
        if (existe) {
            return res.status(409).json({ error: 'El email ya está registrado' });
        }

        const usuario = await Usuario.create({
            nombre: String(nombre).trim(),
            email: emailNormalizado,
            password: await bcrypt.hash(password, 10),
            rol: rol === 'admin' ? 'admin' : 'usuario'
        });

        res.status(201).json(formatearUsuario(usuario));
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// PUT /api/usuarios/:id  (solo admin)
// La password es opcional: si viene, se vuelve a hashear con bcrypt.
// ---------------------------------------------------------------------------
export const putUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body || {};

        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (nombre !== undefined) usuario.nombre = String(nombre).trim();

        if (email !== undefined) {
            const emailNormalizado = String(email).trim().toLowerCase();
            // Si cambia el email, revisamos que no lo tenga otro usuario.
            if (emailNormalizado !== usuario.email) {
                const existe = await Usuario.findOne({ email: emailNormalizado });
                if (existe) {
                    return res.status(409).json({ error: 'El email ya está registrado' });
                }
            }
            usuario.email = emailNormalizado;
        }

        if (rol !== undefined) {
            // Protección: no dejar la aplicación sin ningún administrador.
            if (usuario.rol === 'admin' && rol !== 'admin') {
                const admins = await Usuario.countDocuments({ rol: 'admin' });
                if (admins <= 1) {
                    return res.status(409).json({
                        error: 'No se puede quitar el rol: debe quedar al menos un administrador'
                    });
                }
            }
            usuario.rol = rol;
        }

        if (password) {
            if (String(password).length < 6) {
                return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
            }
            usuario.password = await bcrypt.hash(password, 10);
        }

        // save() dispara las validaciones del schema (equivale a runValidators).
        await usuario.save();
        res.json(formatearUsuario(usuario));
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// DELETE /api/usuarios/:id  (solo admin)
// ---------------------------------------------------------------------------
export const deleteUsuario = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Un admin no puede borrarse a sí mismo (se quedaría sin sesión válida).
        if (String(usuario._id) === String(req.usuario.id)) {
            return res.status(409).json({ error: 'No podés eliminar tu propio usuario' });
        }

        // Protección: siempre tiene que quedar al menos un administrador.
        if (usuario.rol === 'admin') {
            const admins = await Usuario.countDocuments({ rol: 'admin' });
            if (admins <= 1) {
                return res.status(409).json({
                    error: 'No se puede eliminar: debe quedar al menos un administrador'
                });
            }
        }

        await usuario.deleteOne();
        res.json({ mensaje: 'Usuario eliminado', usuario: formatearUsuario(usuario) });
    } catch (error) {
        next(error);
    }
};
