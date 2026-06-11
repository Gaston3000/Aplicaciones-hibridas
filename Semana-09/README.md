# Semana 09 — Rutas y Login

Proyecto React con **React Router**: navegación entre páginas, formulario de **Login** conectado a
la API de la Semana 06 y una página de **Detalle** que lee el id desde la URL.

## Rutas

| Ruta | Página | Qué hace |
|------|--------|----------|
| `/` | `Home.jsx` | Lista los productos traídos del backend |
| `/registro` | `Register.jsx` | Formulario de registro (POST) |
| `/login` | `Login.jsx` | Formulario de login (POST), guarda el token |
| `/producto/:id` | `Detail.jsx` | Detalle de un producto según el id de la URL |

## Estructura

```
Semana-09/
├── index.html
├── package.json
└── src/
    ├── main.jsx              # acá envuelvo la app con <BrowserRouter>
    ├── App.jsx              # definición de las rutas (<Routes>)
    ├── App.css
    ├── components/
    │   ├── Navbar.jsx        # navegación con <Link>
    │   ├── Footer.jsx
    │   └── Input.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── Register.jsx
    │   ├── Login.jsx
    │   └── Detail.jsx
    └── services/
        └── api.js            # todas las llamadas fetch a la API
```

## Cómo funciona

- **Rutas:** la app se envuelve con `BrowserRouter` en `main.jsx` y las rutas se definen con
  `Routes` / `Route` en `App.jsx`. La navegación se hace con `Link` (sin recargar la página).
- **Detalle:** uso `useParams()` para leer el `:id` de la URL y con ese id le pido el producto a la
  API. Desde el Home cada tarjeta es un `Link` a `/producto/:id`.
- **Login:** el formulario manda email y password con un `fetch` POST. Si las credenciales son
  correctas el backend devuelve un token (JWT) que guardo en `localStorage` y redirijo al inicio
  con `useNavigate`.
- **Servicios:** todas las llamadas `fetch` están en `services/api.js` para no repetir la URL del
  backend en cada componente.

## Cómo correr

```bash
npm install
npm run dev
```

Necesita el backend de la Semana 06 corriendo en `http://localhost:3000`.

## Integrantes

- Gastón Costabella
