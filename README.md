# Limpieza Total — Aplicaciones Híbridas (DW4)

Tienda de productos de limpieza. Tiene un **backend** (API con Express + MongoDB + JWT) y un
**frontend** (React con React Router). Hecho por Gastón Costabella.

## Cómo correr (2 comandos)

Desde esta carpeta:

```bash
npm run setup     # instala todo (la primera vez, una sola vez)
npm start         # levanta el backend y el frontend juntos
```

Después abrir en el navegador el link que muestra el frontend (por defecto **http://localhost:5173**).

> No hace falta instalar MongoDB. Si la computadora no tiene una base de datos, el backend
> **levanta una base en memoria automáticamente** y carga algunos productos de ejemplo. Solo se
> necesita tener Node instalado y conexión a internet la primera vez.

## Estructura

```
.
├── backend/              # API (Express + Mongoose + JWT)
├── frontend/             # React (Router, Registro, Login, Detalle)
└── desafios-semanales/   # los desafíos semana a semana de la materia (historial)
```

## Qué se puede hacer

- **Registrarse** (nombre, email, contraseña). La contraseña se guarda encriptada (bcrypt).
- **Iniciar sesión** (devuelve un token JWT).
- **Ver el catálogo** de productos y el **detalle** de cada uno.

## Endpoints principales (backend)

| Método | Ruta | Acción |
|--------|------|--------|
| POST | `/api/usuarios/registro` | Crear usuario |
| POST | `/api/usuarios/login` | Iniciar sesión (devuelve token) |
| GET | `/api/productos` | Listar productos |
| GET | `/api/productos/:id` | Ver un producto |

## Si querés usar una base de datos propia

Crear un archivo `backend/.env` con:

```
MONGO_URI=mongodb://127.0.0.1:27017/limpieza_total
JWT_SECRET=loquequieras
```

Si ese archivo no existe, igual funciona (usa la base en memoria).
