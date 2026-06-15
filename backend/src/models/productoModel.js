import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    marca: { type: String, trim: true },
    precio: {
        type: Number,
        required: true
    },
    categoria: { type: String, trim: true },
    imagen: { type: String, trim: true },
    descripcion: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Producto', productoSchema);
