import http from 'node:http';
import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const ALUMNO = 'Gastón Costabella';
const COMISION = 'Aplicaciones Híbridas';

const server = http.createServer(async (req, res) => {
    const url = req.url;

    if (url === '/alumno') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ alumno: ALUMNO, comision: COMISION }));
        return;
    }

    if (url === '/info') {
        const info = {
            plataforma: os.platform(),
            arquitectura: os.arch(),
            sistema: os.type(),
            release: os.release(),
            hostname: os.hostname(),
            uptimeSegundos: os.uptime(),
            memoriaLibreMB: Math.round(os.freemem() / 1024 / 1024),
            memoriaTotalMB: Math.round(os.totalmem() / 1024 / 1024),
            cpus: os.cpus().length
        };
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(info, null, 2));
        return;
    }

    if (url === '/static') {
        try {
            const html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
        } catch {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('No se pudo leer index.html');
        }
        return;
    }

    if (url === '/productos') {
        try {
            const data = await fs.readFile(path.join(__dirname, 'data', 'productos.json'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(data);
        } catch {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('No se pudieron leer los productos');
        }
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - Ruta no encontrada');
});

server.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en http://localhost:${PORT}`);
});
