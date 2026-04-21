# Semana 03 — Primer servidor con Node

Servidor HTTP nativo (módulo `http`) escuchando en el puerto **3000**.

## Rutas
| Ruta | Qué devuelve |
|------|--------------|
| `/alumno` | Nombre del alumno y comisión (JSON). |
| `/info` | Información del sistema operativo (`os`). |
| `/static` | `index.html` leído con `fs/promises`. |
| `/productos` | Listado de productos desde `data/productos.json`. |
| cualquier otra | `404 - Ruta no encontrada`. |

## Cómo correr
```bash
npm start
```
Abrir `http://localhost:3000/alumno`, `/info`, `/static`, `/productos`.
