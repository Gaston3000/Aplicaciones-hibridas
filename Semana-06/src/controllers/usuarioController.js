import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarioModel.js';

// POST /api/usuarios/registro
export const registrar = async (req, res) => {
    try {
        const { nombre, email, password } = req.body || {};
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'nombre, email y password son requeridos' });
        }

        const existe = await Usuario.findOne({ email });
        if (existe) {
            return res.status(409).json({ error: 'El email ya esta registrado' });
        }

        // hasheamos la password antes de guardarla
        const hash = await bcrypt.hash(password, 10);
        const usuario = await Usuario.create({ nombre, email, password: hash });

        res.status(201).json({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// POST /api/usuarios/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ error: 'email y password son requeridos' });
        }

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        const coincide = await bcrypt.compare(password, usuario.password);
        if (!coincide) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        const token = jwt.sign(
            { id: usuario._id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            token,
            usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesion' });
    }
};

// GET /api/usuarios  (ruta protegida, solo para probar el token)
export const getUsuarios = async (req, res) => {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
};
