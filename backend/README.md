# Semana 06 — API con MongoDB, Usuarios y JWT

API REST de productos de limpieza. Continúa el servidor MVC de la Semana 05, pero ahora con
persistencia real en **MongoDB** (Mongoose), una entidad **usuarios** con registro/login,
contraseñas encriptadas con **bcrypt** y autenticación con **JSON Web Token**.

## Nombre de la API

**API Limpieza Total**

## Descripción

Permite registrar usuarios e iniciar sesión, y gestionar productos y categorías de limpieza.
La lectura de productos y categorías es pública; la creación, edición y borrado están protegidas
con un token JWT que se obtiene al hacer login. En la ruta raíz `/` se sirve una página estática
con la información de la API.

## Estructura

```
Semana-06/
├── package.json
├── .env.example
├── public/
│   └── index.html            # info de la API (ruta /)
└── src/
    ├── index.js              # servidor + conexión a Mongo
    ├── seed.js               # carga productos de ejemplo la 1ra vez
    ├── config/
    │   └── db.js             # conexión Mongoose
    ├── models/
    │   ├── usuarioModel.js
    │   ├── productoModel.js
    │   └── categoriaModel.js
    ├── controllers/
    │   ├── usuarioController.js
    │   ├── productoController.js
    │   └── categoriaController.js
    ├── middlewares/
    │   └── auth.js           # valida el token JWT
    └── routes/
        ├── usuarioRoutes.js
        ├── productoRoutes.js
        └── categoriaRoutes.js
```

## Endpoints

### Usuarios — `/api/usuarios`
| Método | Ruta | Acción |
|--------|------|--------|
| POST | `/registro` | Crear usuario (`{ nombre, email, password }`) |
| POST | `/login` | Iniciar sesión (`{ email, password }`) → devuelve `token` |
| GET | `/` | Listar usuarios (requiere token) |

### Productos — `/api/productos`
| Método | Ruta | Acción |
|--------|------|--------|
| GET | `/` | Listar todos |
| GET | `/:id` | Obtener uno |
| POST | `/` | Crear (requiere token) |
| PUT | `/:id` | Actualizar (requiere token) |
| DELETE | `/:id` | Eliminar (requiere token) |

### Categorías — `/api/categorias`
| Método | Ruta | Acción |
|--------|------|--------|
| GET | `/` | Listar todas |
| POST | `/` | Crear (requiere token) |
| DELETE | `/:id` | Eliminar (requiere token) |

## Cómo correr

```bash
npm install
cp .env.example .env     # completar MONGO_URI y JWT_SECRET
npm start
```

Necesita una instancia de MongoDB corriendo (local o Atlas). La primera vez se cargan algunos
productos de ejemplo para poder probar los GET.

## Integrantes

- Gastón Costabella
