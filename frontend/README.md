# Frontend — World Cup 26

Aplicación React (Vite) con el sitio público y el panel de administración.
La documentación completa del proyecto está en el [README principal](../README.md).

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo (http://localhost:5173)
npm run lint      # revisar el código con ESLint
npm run build     # generar la versión de producción en dist/
npm run preview   # ver el build de producción
```

## Variable de entorno

Copiar `.env.example` como `.env`:

```
VITE_API_URL=http://localhost:3000
```

Es la URL del backend. En producción se apunta a la API desplegada.

## Rutas

### Públicas
| Ruta | Página |
|------|--------|
| `/` | Home con el hero, las categorías y las sedes |
| `/estadios` | Listado completo con filtro por categoría |
| `/estadios/:id` | Ficha de una sede |
| `/registro` | Crear cuenta |
| `/login` | Iniciar sesión |
| `*` | Página 404 |

### Con sesión iniciada (`PrivateRoute`)
| Ruta | Página |
|------|--------|
| `/perfil` | Datos del usuario logueado |
| `/acceso-denegado` | Aviso para usuarios sin rol admin |

### Solo administradores (`AdminRoute`)
| Ruta | Página |
|------|--------|
| `/admin` | Dashboard |
| `/admin/estadios` | Listado de estadios |
| `/admin/estadios/nuevo` | Alta de estadio |
| `/admin/estadios/:id/editar` | Edición de estadio |
| `/admin/categorias` | Listado de categorías |
| `/admin/categorias/nueva` | Alta de categoría |
| `/admin/categorias/:id/editar` | Edición de categoría |
| `/admin/usuarios` | Listado de usuarios |
| `/admin/usuarios/nuevo` | Alta de usuario |
| `/admin/usuarios/:id/editar` | Edición de usuario |

## Cómo está organizado

- **`services/`** — toda la comunicación con la API. `api.js` tiene la función `request()`,
  que arma los headers, agrega el token y traduce los errores. Las páginas nunca usan `fetch`.
- **`context/`** — `AuthProvider` guarda la sesión (token, usuario y rol), la restaura al
  recargar y la cierra sola si el token vence.
- **`hooks/`** — `useAuth()` para leer la sesión y `useCargarDatos()` para el patrón
  cargando / error / datos que se repite en todas las pantallas.
- **`components/`** — componentes reutilizables; los del panel están en `components/admin/`.
- **`pages/`** — una carpeta por zona: las públicas en la raíz y las del panel en `pages/admin/`.

## Imágenes

Las fotos de las sedes están en `public/estadios/`. Si falta una imagen, la tarjeta muestra
un degradado con el nombre del estadio, así que la aplicación nunca queda rota.

El logo del Mundial es opcional: si se coloca un archivo en `public/logo-mundial.png`
la barra lo usa; si no está, muestra el texto "WORLD CUP 26".
