import express from 'express';
import peliculas from './data/peliculas.js';
import productos from './data/productos.js';

const app = express();
const PORT = 3000;

// app.use(express.json()); // por ahora no lo necesito, son todos GET

// Parte 1
app.get('/', (req, res) => {
    res.send('<h1>Gastón Costabella</h1>');
});

app.get('/materia', (req, res) => {
    res.json({
        nombre: 'Aplicaciones Híbridas',
        carrera: 'Diseño y Programación Web',
        cuatrimestre: 'DW4'
    });
});

app.get('/profesor', (req, res) => {
    res.json({
        nombre: 'Briar',
        materia: 'Aplicaciones Híbridas',
        comision: 'DW4'
    });
});

// Parte 2: /peliculas/:nombre
app.get('/peliculas/:nombre', (req, res) => {
    const { nombre } = req.params;
    const encontrada = peliculas.find(
        (p) => p.toLowerCase() === nombre.toLowerCase()
    );
    if (encontrada) {
        return res.send(`La película "${encontrada}" ya está en favoritos`);
    }
    return res.status(404).send('404 - película no encontrada');
});

// Parte 3: /productos con id param y queries min/max
app.get('/productos', (req, res) => {
    const { min, max } = req.query;
    const minNum = min !== undefined ? Number(min) : null;
    const maxNum = max !== undefined ? Number(max) : null;

    if ((min !== undefined && Number.isNaN(minNum)) ||
        (max !== undefined && Number.isNaN(maxNum))) {
        return res.status(400).json({ error: 'min y max deben ser numéricos' });
    }

    const filtrados = productos.filter((p) => {
        if (minNum !== null && p.precio < minNum) return false;
        if (maxNum !== null && p.precio > maxNum) return false;
        return true;
    });

    res.json(filtrados);
});

app.get('/productos/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    const producto = productos.find((p) => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
});

// 404 global
app.use((req, res) => {
    res.status(404).send('<h1>Página no encontrada</h1>');
});

app.listen(PORT, () => {
    console.log(`Servidor Express en http://localhost:${PORT}`);
});

