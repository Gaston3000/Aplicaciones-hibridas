# Cómo publicar el sitio en internet

Guía paso a paso con servicios gratuitos:

- **MongoDB Atlas** → la base de datos
- **Render** → el backend (API)
- **Vercel** → el frontend (React)

El código **ya está preparado** para producción. Lo único que falta es crear las cuentas
y cargar las variables de entorno.

---

## Antes de empezar

Verificá que todo funcione localmente:

```bash
npm run setup
npm run lint --prefix frontend
npm run build --prefix frontend
```

Y subí el proyecto a un repositorio de GitHub (Render y Vercel despliegan desde ahí):

```bash
git remote add origin https://github.com/TU-USUARIO/world-cup-26-sedes.git
git push -u origin final-aplicaciones-hibridas
```

> El `.gitignore` ya evita subir `node_modules`, `dist` y los archivos `.env`.

---

## Paso 1 — Base de datos (MongoDB Atlas)

1. Crear una cuenta gratuita en https://www.mongodb.com/atlas
2. Crear un cluster **M0 (Free)**.
3. En **Database Access**, crear un usuario de base de datos con contraseña.
4. En **Network Access**, agregar la IP `0.0.0.0/0`
   (necesario para que Render pueda conectarse).
5. En **Connect → Drivers**, copiar la cadena de conexión. Queda parecida a:

```
mongodb+srv://USUARIO:CONTRASENIA@cluster0.xxxxx.mongodb.net/world_cup_26?retryWrites=true&w=majority
```

Guardala: es el valor de `MONGO_URI`.

---

## Paso 2 — Backend (Render)

1. Crear una cuenta en https://render.com y conectarla con GitHub.
2. **New → Web Service** y elegir el repositorio.
3. Configurar:

| Campo | Valor |
|-------|-------|
| Root Directory | `backend` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | `Free` |

4. En **Environment Variables**, cargar:

```
NODE_ENV=production
MONGO_URI=<la cadena del paso 1>
JWT_SECRET=<una cadena larga y aleatoria>
JWT_EXPIRES_IN=4h
ADMIN_NAME=Administrador
ADMIN_EMAIL=<tu email de admin>
ADMIN_PASSWORD=<una contraseña propia y segura>
FRONTEND_URL=http://localhost:5173
```

> `FRONTEND_URL` se completa bien en el paso 4, cuando ya exista la URL de Vercel.
> No hace falta configurar `PORT`: Render lo asigna solo y el servidor lo lee
> con `process.env.PORT`.

5. Desplegar. Al terminar queda una URL del estilo
   `https://world-cup-26-backend.onrender.com`.

6. Abrila en el navegador: tiene que verse la página informativa de la API.
   Probá también `https://TU-BACKEND.onrender.com/api/estadios`, que debería
   devolver las cuatro sedes que carga el seed.

> **Ojo con el plan gratuito de Render:** el servicio se duerme si no recibe visitas.
> La primera carga después de un rato puede tardar unos 40 segundos. Es normal.

---

## Paso 3 — Frontend (Vercel)

1. Crear una cuenta en https://vercel.com y conectarla con GitHub.
2. **Add New → Project** y elegir el mismo repositorio.
3. Configurar:

| Campo | Valor |
|-------|-------|
| Root Directory | `frontend` |
| Framework Preset | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. En **Environment Variables**, agregar:

```
VITE_API_URL=https://TU-BACKEND.onrender.com
```

(sin barra al final)

5. Desplegar. Queda una URL del estilo `https://world-cup-26-sedes.vercel.app`.

> El archivo `frontend/vercel.json` ya está incluido: hace que rutas como
> `/estadios/123` o `/admin/estadios` funcionen al recargar la página.
> Sin eso, Vercel devolvería 404 en las rutas de React.

---

## Paso 4 — Conectar el CORS

Volver a Render y actualizar la variable:

```
FRONTEND_URL=https://TU-FRONTEND.vercel.app
```

Guardar y esperar el redeploy. Sin este paso el navegador bloquea los pedidos por CORS.

> Se pueden poner varias URLs separadas por coma, por ejemplo:
> `FRONTEND_URL=https://TU-FRONTEND.vercel.app,http://localhost:5173`

---

## Paso 5 — Probar el sitio publicado

1. Abrir la URL de Vercel: tienen que verse las cuatro sedes.
2. Entrar a `/login` con el `ADMIN_EMAIL` y `ADMIN_PASSWORD` que pusiste en Render.
3. Entrar a `/admin` y comprobar el dashboard y los tres CRUD.
4. Recargar `/admin/estadios` directamente: la sesión tiene que mantenerse.
5. Cerrar sesión y confirmar que `/admin` redirige a `/login`.
6. Abrir una ruta inventada y confirmar que aparece la página 404.

---

## Checklist previo al deploy

- [x] El servidor escucha en `process.env.PORT`
- [x] `MONGO_URI` obligatoria en producción (el server no arranca sin ella)
- [x] `JWT_SECRET` obligatoria en producción (el server no arranca sin ella)
- [x] `mongodb-memory-server` está en `devDependencies` y no se carga en producción
- [x] CORS por variable de entorno, no abierto a todos
- [x] La URL de la API sale de `VITE_API_URL`
- [x] `vercel.json` para las rutas de React
- [x] `.gitignore` cubre `node_modules`, `dist` y `.env`
- [x] No hay contraseñas ni secretos en el repositorio
- [x] El build del frontend funciona
- [ ] Cuentas creadas en Atlas, Render y Vercel ← **paso manual**
- [ ] Variables de entorno cargadas en cada servicio ← **paso manual**

---

## Anotar las URLs cuando estén listas

Completar en el `README.md`, en la sección **Deploy**:

```
Frontend:      https://__________.vercel.app
Backend (API): https://__________.onrender.com
Base de datos: MongoDB Atlas (cluster M0 gratuito)
```
