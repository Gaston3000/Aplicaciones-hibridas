# Semana 08 — Formulario de Registro en React

Vista de **Registro** (`Register.jsx`) hecha con React + Vite, conectada a la API del backend de la
Semana 06. El formulario manda los datos con un `fetch` POST y el usuario queda guardado en MongoDB.

## Estructura

```
Semana-08/
├── index.html
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── components/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   └── Input.jsx        # input reutilizable (props + onChange)
    └── pages/
        └── Register.jsx
```

## Qué son los estados en React

Un **estado** es un dato que el componente "recuerda" entre renders y que, cuando cambia, hace que
React vuelva a dibujar la vista. Se declara con el hook `useState`, que devuelve el valor actual y
una función para actualizarlo:

```jsx
const [form, setForm] = useState({ nombre: "", email: "", password: "" });
```

En este formulario uso tres estados:

- `form`: guarda lo que el usuario va escribiendo en cada campo. Cada vez que se dispara el evento
  `onChange` actualizo el objeto con `setForm`, así el input siempre muestra el valor del estado
  (componente controlado).
- `errores`: guarda los mensajes de validación de cada campo.
- `mensaje`: guarda el resultado final (éxito o error) que devuelve la API.

La idea es que **nunca toco el DOM a mano**: cambio el estado y React se encarga de actualizar la
pantalla solo.

## Cómo correr

```bash
npm install
npm run dev
```

Hay que tener el backend de la Semana 06 corriendo en `http://localhost:3000` para que el registro
funcione.

## Integrantes

- Gastón Costabella
