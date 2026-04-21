import 'dotenv/config';
import express from 'express';
import productoRoutes from './routes/productoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
// TODO: conectar a mongo cuando veamos la clase de DB

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API MVC - Productos y Categorías',
        rutas: {
            productos: '/api/productos',
            categorias: '/api/categorias'
        }
    });
});

app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor MVC escuchando en http://localhost:${PORT}`);
});
