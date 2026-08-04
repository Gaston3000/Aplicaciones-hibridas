# Checklist del examen final — Aplicaciones Híbridas

Cada punto de la consigna, con el archivo exacto donde se cumple.
Estado: ✅ cumplido · ⏳ pendiente de una cuenta externa.

---

## Estructura del proyecto

| # | Requisito | Estado | Dónde |
|---|-----------|--------|-------|
| 1 | Separación de Backend y Frontend | ✅ | Carpetas `backend/` y `frontend/`, con su propio `package.json` y sus propias dependencias |
| 2 | Backend: API REST | ✅ | `backend/src/index.js` monta `/api/usuarios`, `/api/estadios` y `/api/categorias` |
| 3 | Frontend: React.js | ✅ | `frontend/src/`, React 19 + Vite |
| 4 | Autenticación con JWT | ✅ | `backend/src/controllers/usuarioController.js` (firma) y `backend/src/middlewares/auth.js` (validación) |
| 5 | Base de datos MongoDB | ✅ | `backend/src/config/db.js` + Mongoose en `backend/src/models/` |
| 6 | Implementación de usuarios | ✅ | `backend/src/models/usuarioModel.js` con `rol` (`usuario` / `admin`) |
| 7 | Al menos dos entidades además de usuarios | ✅ | **Estadio** (`estadioModel.js`) y **Categoría** (`categoriaModel.js`) |
| 8 | CRUD para cada entidad | ✅ | Ver la sección "CRUD" más abajo |
| 9 | BackOffice (administración) | ✅ | `frontend/src/pages/admin/` + `components/admin/AdminLayout.jsx`, en la ruta `/admin` |
| 10 | FrontOffice (parte pública) | ✅ | `frontend/src/pages/` (Home, Estadios, Detail, Login, Register, Perfil, 404) |
| 11 | Deploy en un host gratuito | ⏳ | Todo preparado. Falta crear las cuentas externas: ver `docs/DEPLOY.md` |

---

## CRUD de las tres entidades

| Entidad | Crear | Leer | Actualizar | Eliminar |
|---------|-------|------|------------|----------|
| **Usuario** | `POST /api/usuarios` (admin) y `POST /api/usuarios/registro` (público) | `GET /api/usuarios`, `GET /api/usuarios/:id`, `GET /api/usuarios/perfil` | `PUT /api/usuarios/:id` | `DELETE /api/usuarios/:id` |
| **Estadio** | `POST /api/estadios` | `GET /api/estadios`, `GET /api/estadios/:id` | `PUT /api/estadios/:id` | `DELETE /api/estadios/:id` |
| **Categoría** | `POST /api/categorias` | `GET /api/categorias`, `GET /api/categorias/:id` | `PUT /api/categorias/:id` | `DELETE /api/categorias/:id` |

Los tres CRUD también están disponibles **visualmente** desde el BackOffice:

- Estadios → `AdminEstadios.jsx` + `AdminEstadioForm.jsx`
- Categorías → `AdminCategorias.jsx` + `AdminCategoriaForm.jsx`
- Usuarios → `AdminUsuarios.jsx` + `AdminUsuarioForm.jsx`

---

## Criterios de evaluación · General

| # | Requisito | Estado | Dónde |
|---|-----------|--------|-------|
| 12 | Validación de datos | ✅ | Validaciones de esquema en `backend/src/models/*.js`, chequeos en los controladores, `runValidators: true` en las actualizaciones y validación de formularios en el frontend |
| 13 | Autenticación con JWT | ✅ | Token firmado con `{ id, email, rol }` y vencimiento configurable (`JWT_EXPIRES_IN`) |

---

## Criterios de evaluación · Backend

| # | Requisito | Estado | Dónde |
|---|-----------|--------|-------|
| 14 | API REST correctamente creada y estructurada | ✅ | `backend/src/index.js` + carpetas separadas |
| 15 | Controladores | ✅ | `backend/src/controllers/` (uno por entidad) |
| 16 | Routers | ✅ | `backend/src/routes/` (uno por entidad) |
| 17 | Middleware | ✅ | `middlewares/auth.js` (`verificarToken`, `soloAdmin`) y `middlewares/errorHandler.js` (404 + errores) |
| 18 | Esquemas | ✅ | `backend/src/models/` con esquemas de Mongoose |
| 19 | Correcto uso de URI | ✅ | Recursos en plural y sin verbos: `/api/estadios/:id`, `/api/categorias/:id`, `/api/usuarios/:id` |
| 20 | Uso de MongoDB | ✅ | Mongoose; en producción MongoDB Atlas |
| 21 | Correcto modelado de la base | ✅ | `Estadio.categoria` es un `ObjectId` con `ref: "Categoria"` y se usa `.populate()`. No hay categorías guardadas como texto suelto |

### Códigos HTTP usados

| Código | Cuándo |
|--------|--------|
| `200` | Consulta o actualización correcta |
| `201` | Registro creado |
| `400` | Datos inválidos, campos faltantes o ID mal formado |
| `401` | Falta el token, es inválido o venció |
| `403` | Hay token válido pero el rol no alcanza |
| `404` | El recurso o la ruta no existe |
| `409` | Duplicado, o conflicto (categoría con estadios, último admin) |
| `500` | Error inesperado del servidor |

---

## Criterios de evaluación · Frontend

| # | Requisito | Estado | Dónde |
|---|-----------|--------|-------|
| 22 | Componentes funcionales y hooks | ✅ | Todos los componentes son funciones; se usan `useState`, `useEffect`, `useCallback`, `useMemo`, `useContext` y dos hooks propios (`useAuth`, `useCargarDatos`) |
| 23 | Clara división de componentes | ✅ | `components/` (reutilizables), `components/admin/` (panel), `pages/` (pantallas), `layouts` (`LayoutPublico`, `AdminLayout`) |
| 24 | Routers para las distintas páginas | ✅ | `frontend/src/App.jsx` con React Router y rutas anidadas |
| 25 | PrivateRoute para páginas con autenticación | ✅ | `components/PrivateRoute.jsx` y `components/AdminRoute.jsx` |
| 26 | Separación de vistas y lógica de las APIs | ✅ | Todo el `fetch` vive en `services/` (`api.js` + un servicio por recurso). Las páginas no llaman a `fetch` |
| 27 | Manejo correcto del estado | ✅ | Estado local en formularios y pantallas; **Context API** (`AuthProvider`) para la sesión global. Se controlan `cargando`, `error`, `success` y datos |

---

## Correcciones del segundo parcial que se resolvieron

| Problema anterior | Cómo quedó |
|-------------------|------------|
| El README y el backend hablaban de productos de limpieza | Todo el proyecto es coherente con las sedes del Mundial 2026 |
| La entidad se llamaba `Producto` pero se usaba como estadio | Renombrada a `Estadio` en modelo, controller, router, servicios, componentes y textos |
| Rutas `/api/productos` y `/producto/:id` | Ahora `/api/estadios` y `/estadios/:id` |
| La categoría era un texto suelto | Es una referencia real (`ObjectId` + `ref` + `populate`) |
| El JWT se guardaba pero no se usaba en los pedidos | El servicio central agrega `Authorization: Bearer <token>` |
| No había BackOffice | BackOffice completo en `/admin` con las tres entidades |
| No existía `PrivateRoute` | `PrivateRoute` + `AdminRoute` implementados |
| Categorías y usuarios sin CRUD completo | Los tres CRUD están completos, en API y en pantalla |
| No había gestión global de autenticación | `AuthContext` + `AuthProvider` + `useAuth` |
| Sin roles ni administrador | Campo `rol`, middleware `soloAdmin` y admin inicial por seed |
| CORS totalmente abierto | Lista de orígenes permitidos desde `FRONTEND_URL` |
| Secreto JWT escrito en el código | Sale de `JWT_SECRET`; en producción el server no arranca sin ella |
| URL del backend fija en `localhost` | Sale de `VITE_API_URL` |
| Botón "Agregar al carrito" sin carrito real | Eliminado y reemplazado por navegación real |
| El contador de sedes estaba escrito a mano ("04") | Sale de `estadios.length` |
| El seed dependía de que la base estuviera vacía | Seed idempotente: revisa registro por registro |
| `mongodb-memory-server` como dependencia de producción | Pasó a `devDependencies` y se carga con import dinámico solo en desarrollo |

---

## Resultado de las pruebas

| Prueba | Comando | Resultado |
|--------|---------|-----------|
| API del backend | `npm run test:api --prefix backend` | **58 OK / 0 fallidas** |
| Lint del frontend | `npm run lint --prefix frontend` | **Sin errores ni warnings** |
| Build del frontend | `npm run build --prefix frontend` | **Compila correctamente** |
| Consola del navegador | Recorrido manual de todas las pantallas | **Sin errores** |

### Comprobado a mano en el navegador

- Registro, login correcto, login incorrecto y persistencia de la sesión al recargar.
- Logout y vuelta al estado de visitante.
- `PrivateRoute`: entrar a `/admin` sin sesión redirige a `/login`.
- Restricción por rol: un usuario común en `/admin` va a `/acceso-denegado`,
  y la API le responde `403` aunque llame directo al endpoint.
- Token corrupto o vencido: se cierra la sesión sola y avisa en pantalla.
- Alta, edición y baja de estadios desde el panel, con confirmación.
- Eliminar una categoría con estadios asociados muestra el error del servidor.
- Home, listado con filtros, detalle, 404 y detalle con un ID inválido.
- Recarga directa de rutas profundas (`/admin/estadios`) manteniendo la sesión.
- Responsive en 375 px: sin scroll horizontal, menú hamburguesa y tablas en tarjetas.

---

## Único punto pendiente

**Deploy en un host gratuito (punto 11).**

El código ya está preparado para producción: el servidor usa `process.env.PORT`,
el CORS se configura por variable de entorno, la API del frontend sale de `VITE_API_URL`,
`vercel.json` resuelve las rutas de React al recargar y no hay secretos en el repositorio.

Falta únicamente crear las cuentas externas (MongoDB Atlas, Render y Vercel) y pegar
las variables de entorno. Los pasos exactos están en `docs/DEPLOY.md`.
