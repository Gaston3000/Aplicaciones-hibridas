import mongoose from 'mongoose';

// El usuario es con lo que manejo el login de la app.
// La password se guarda siempre hasheada con bcrypt (eso pasa en el controller).
// El select:false hace que la password no salga nunca en las consultas normales:
// si la necesito para el login la tengo que pedir a mano con .select('+password').
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
