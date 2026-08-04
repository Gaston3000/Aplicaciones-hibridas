import mongoose from 'mongoose';

// Modelo Usuario: es la entidad de autenticación de la aplicación.
// La contraseña se guarda siempre hasheada con bcrypt (ver usuarioController).
// Con "select: false" la password NO viaja nunca en las consultas normales:
// para el login hay que pedirla explícitamente con .select('+password').
const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
            maxlength: [60, 'El nombre no puede superar los 60 caracteres']
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email no tiene un formato válido']
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            select: false
        },
        rol: {
            type: String,
            enum: {
                values: ['usuario', 'admin'],
                message: 'El rol solo puede ser "usuario" o "admin"'
            },
            default: 'usuario'
        }
    },
    { timestamps: true }
);

export default mongoose.model('Usuario', usuarioSchema);
