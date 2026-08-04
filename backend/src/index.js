import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import cargarDatosIniciales from './seed.js';
import { rutaNoEncontrada, manejarErrores } from './middlewares/errorHandler.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import estadioRoutes from './routes/estadioRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const enProduccion = process.env.NODE_ENV === 'production';

// --- El secreto del JWT nunca va escrito en el código ---
if (!process.env.JWT_SECRET) {
    if (enProduccion) {
        console.error('Falta la variable JWT_SECRET. En producción es obligatoria.');
        process.exit(1);
    }
    process.env.JWT_SECRET = 'clave_solo_para_desarrollo_local';
    console.warn('AVISO: no hay JWT_SECRET en el .env, se usa una clave temporal de desarrollo.');
}

// --- CORS: solo se aceptan los orígenes configurados ---
// FRONTEND_URL puede tener varias URLs separadas por coma.
const origenesPermitidos = [
    ...(process.env.FRONTEND_URL || '')
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean),
    // Puertos habituales de Vite en desarrollo.
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173'
];

app.use(
    cors({
        origin(origin, callback) {
            // Sin origin son pedidos del mismo servidor o de herramientas (Postman, tests).
            if (!origin) return callback(null, true);
            if (origenesPermitidos.includes(origin)) return callback(null, true);
            callback(new Error(`Origen no permitido por CORS: ${origin}`));
        }
    })
);

app.use(express.json());

// Página estática con la info de la API en la raíz "/".
const carpetaActual = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(carpetaActual, '..', 'public')));

// --- Rutas de la API ---
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/estadios', estadioRoutes);
app.use('/api/categorias', categoriaRoutes);

// --- 404 y manejo central de errores (siempre al final) ---
app.use(rutaNoEncontrada);
app.use(manejarErrores);

// Conectamos a la base, cargamos los datos iniciales y recién ahí levantamos el servidor.
connectDB().then(async () => {
    await cargarDatosIniciales();
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
});

export default app;
