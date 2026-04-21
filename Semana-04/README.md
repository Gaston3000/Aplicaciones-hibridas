# Semana 04 — Servidor con Express.js

Servidor Express escuchando en el puerto **3000** con tres partes:

## Parte 1 — Rutas informativas
| Ruta | Respuesta |
|------|-----------|
| `/` | Nombre y apellido. |
| `/materia` | Datos de la materia. |
| `/profesor` | Datos del profesor. |
| cualquier otra | Página no encontrada (404). |

## Parte 2 — `/peliculas/:nombre`
Array con 5 películas favoritas. Recibe el nombre por parámetro:
- Si está → `"La película ... ya está en favoritos"`.
- Si no → `404 - película no encontrada`.

## Parte 3 — `/productos`
10 productos (`id`, `nombre`, `precio`).
- `GET /productos` → listado completo.
- `GET /productos/:id` → un producto por id.
- `GET /productos?min=1000&max=2000` → filtra por rango de precio. Cualquiera de las dos queries es opcional.

## Cómo correr
```bash
npm install
npm start
```

## Ejemplos de URLs
```
http://localhost:3000/
http://localhost:3000/materia
http://localhost:3000/peliculas/Interestelar
http://localhost:3000/productos
http://localhost:3000/productos/3
http://localhost:3000/productos?min=1000
http://localhost:3000/productos?max=1500
http://localhost:3000/productos?min=1000&max=2500
```
