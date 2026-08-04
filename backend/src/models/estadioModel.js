import mongoose from 'mongoose';

// Cada sede oficial del Mundial 2026.
// Ojo con "categoria": no es un texto, es el id de un documento de Categoria.
// Guardándolo así después puedo usar .populate('categoria') y mostrar el nombre
// en el front sin tener que hacer otra consulta.
const estadioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del estadio es obligatorio'],
            trim: true,
            minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
            maxlength: [100, 'El nombre no puede superar los 100 caracteres']
        },
        ciudad: {
            type: String,
            required: [true, 'La ciudad es obligatoria'],
            trim: true,
            maxlength: [80, 'La ciudad no puede superar los 80 caracteres']
        },
        estado: {
            type: String,
            trim: true,
            maxlength: [80, 'El estado no puede superar los 80 caracteres'],
            default: ''
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [600, 'La descripción no puede superar los 600 caracteres'],
            default: ''
        },
        precio: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            min: [0, 'El precio no puede ser negativo']
        },
        capacidad: {
            type: Number,
            min: [0, 'La capacidad no puede ser negativa'],
            default: 0
        },
        imagen: {
            type: String,
            trim: true,
            default: ''
        },
        categoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categoria',
            required: [true, 'La categoría es obligatoria']
        },
        activo: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('Estadio', estadioSchema);
