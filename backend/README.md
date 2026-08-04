# Backend — API World Cup 26

API REST de las sedes del Mundial 2026: Express + MongoDB (Mongoose) + JWT.
La documentación completa del proyecto está en el [README principal](../README.md).

## Comandos

```bash
npm install        # instalar dependencias
npm start          # levantar la API (http://localhost:3000)
npm run dev        # igual, pero reiniciando ante cada cambio
npm run test:api   # pruebas de la API (necesita el servidor corriendo)
```

## Variables de entorno

Copiar `.env.example` como `.env` y completar. Las importantes:

- `MONGO_URI` — si se deja vacía en desarrollo, se levanta una base en memoria.
  En producción es obligatoria.
- `JWT_SECRET` — clave para firmar los tokens. En producción es obligatoria.
- `FRONTEND_URL` — orígenes permitidos por CORS (separados por coma).
- `ADMIN_EMAIL` y `ADMIN_PASSWORD` — administrador que crea el seed la primera vez.

## Organización

```
src/
├── index.js              servidor, CORS y orden de los middlewares
├── seed.js               datos iniciales (idempotente)
├── config/db.js          conexión a MongoDB
├── models/               esquemas de Mongoose (Usuario, Estadio, Categoria)
├── controllers/          lógica de cada recurso
├── middlewares/
│   ├── auth.js           verificarToken y soloAdmin
│   └── errorHandler.js   404 y manejo central de errores
└── routes/               definición de las URI
```

## Endpoints

| Recurso | Lectura | Escritura |
|---------|---------|-----------|
| `/api/estadios` | Pública | Solo admin |
| `/api/categorias` | Pública | Solo admin |
| `/api/usuarios` | Solo admin | Solo admin |

`POST /api/usuarios/registro` y `POST /api/usuarios/login` son públicos.
`GET /api/usuarios/perfil` necesita token.

El detalle completo de cada endpoint está en el README principal y también se ve
en la página informativa que sirve la API en la ruta `/`.

## Detalles de seguridad

- Las contraseñas se guardan hasheadas con **bcrypt** (10 rondas).
- El campo `password` tiene `select: false`: nunca sale en las consultas.
  Para el login se pide explícitamente con `.select('+password')`.
- El registro público siempre crea usuarios con rol `usuario`; el rol `admin`
  solo se puede asignar desde el BackOffice.
- El token incluye únicamente `{ id, email, rol }`.
- Siempre tiene que quedar al menos un administrador en el sistema.
