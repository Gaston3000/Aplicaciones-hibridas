import mongoose from 'mongoose';

// Modelo Categoría: agrupa a los estadios (por ejemplo "Sede de la Final").
// El nombre es único para no tener categorías repetidas.
const categoriaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre de la categoría es obligatorio'],
            unique: true,
            trim: true,
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
            maxlength: [60, 'El nombre no puede superar los 60 caracteres']
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [300, 'La descripción no puede superar los 300 caracteres'],
            default: ''
        },
        activo: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('Categoria', categoriaSchema);
