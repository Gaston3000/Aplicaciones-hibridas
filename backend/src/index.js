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

// El secreto del JWT nunca va escrito en el código.
// En producción, si falta, prefiero que no arranque antes que firmar tokens con
// una clave que conoce cualquiera que mire el repo.
if (!process.env.JWT_SECRET) {
    if (enProduccion) {
        console.error('Falta la variable JWT_SECRET. En producción es obligatoria.');
        process.exit(1);
    }
    process.env.JWT_SECRET = 'clave_solo_para_desarrollo_local';
    console.warn('AVISO: no hay JWT_SECRET en el .env, se usa una clave temporal de desarrollo.');
}

// CORS: solo dejo entrar a los orígenes que configuré.
// En FRONTEND_URL puedo poner varias URLs separadas por coma.
const origenesPermitidos = [
    ...(process.env.FRONTEND_URL || '')
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean),
    // Los puertos que usa Vite cuando trabajo local.
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173'
];

app.use(
    cors({
        origin(origin, callback) {
            // Cuando no viene origin es el mismo servidor o alguna herramienta
            // tipo Postman o el script de pruebas, así que lo dejo pasar.
            if (!origin) return callback(null, true);
            if (origenesPermitidos.includes(origin)) return callback(null, true);
            callback(new Error(`Origen no permitido por CORS: ${origin}`));
        }
    })
);

app.use(express.json());

// La página con la info de la API que se ve entrando a "/".
// Armo la ruta con import.meta.url y no relativa, así funciona sin importar
// desde qué carpeta arranque el servidor.
const carpetaActual = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(carpetaActual, '..', 'public')));

// Las rutas de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/estadios', estadioRoutes);
app.use('/api/categorias', categoriaRoutes);

// El 404 y el manejo de errores van siempre últimos, si no se comen las rutas.
app.use(rutaNoEncontrada);
app.use(manejarErrores);

// Primero conecto a la base, cargo los datos iniciales y recién ahí levanto el server.
connectDB().then(async () => {
    await cargarDatosIniciales();
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
});

export default app;
