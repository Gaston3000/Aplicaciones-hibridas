# Semana 05 — Estructura MVC (Productos + Categorías)

Proyecto Express estructurado con el patrón **Model-View-Controller**, preparado para gestionar dos recursos: **productos** y **categorías**.

## Estructura
```
Semana-05/
├── package.json
├── .env.example
├── .gitignore
└── src/
    ├── index.js              # punto de entrada
    ├── config/
    │   └── db.js             # stub de conexión a DB
    ├── models/
    │   ├── productoModel.js
    │   └── categoriaModel.js
    ├── services/
    │   ├── productoService.js
    │   └── categoriaService.js
    ├── controllers/
    │   ├── productoController.js
    │   └── categoriaController.js
    └── routes/
        ├── productoRoutes.js
        └── categoriaRoutes.js
```

## Rutas CRUD

### Productos — `/api/productos`
| Método | Ruta | Acción |
|--------|------|--------|
| GET    | `/`    | Listar todos |
| GET    | `/:id` | Obtener uno |
| POST   | `/`    | Crear (body: `{ nombre, precio, categoriaId }`) |
| PUT    | `/:id` | Actualizar |
| DELETE | `/:id` | Eliminar |

### Categorías — `/api/categorias`
| Método | Ruta | Acción |
|--------|------|--------|
| GET    | `/`    | Listar todas |
| GET    | `/:id` | Obtener una |
| POST   | `/`    | Crear (body: `{ nombre }`) |
| PUT    | `/:id` | Actualizar |
| DELETE | `/:id` | Eliminar |

## Cómo correr
```bash
npm install
cp .env.example .env
npm start
```

## Notas
- La capa **Model** define la estructura del recurso.
- La capa **Service** contiene la lógica de negocio / acceso a datos (hoy, en memoria).
- La capa **Controller** adapta request/response y delega al servicio.
- Las **rutas** sólo mapean URL → controller.
- Reemplazar el array en memoria por Mongoose/Mongo en la próxima iteración.
