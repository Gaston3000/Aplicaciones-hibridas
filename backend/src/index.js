import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import seedProductos from './seed.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// archivo estatico con la info de la API en la raiz /
app.use(express.static('public'));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// conectamos a la base y recien ahi levantamos el servidor
connectDB().then(async () => {
    await seedProductos();
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
});
