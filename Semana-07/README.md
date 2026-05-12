# Semana 07 — Home en React (Productos de Limpieza)

Estructura inicial de la Home para el catálogo de productos. Hecho con **React + Vite**, sin librerías externas.

## Estructura

```
Semana-07/
├── index.html
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── components/
    │   ├── Header.jsx
    │   ├── ListaProductos.jsx
    │   ├── TarjetaProducto.jsx
    │   └── Footer.jsx
    └── data/
        └── productos.js
```

## Cómo correr

```bash
npm install
npm run dev
```

Después abrir `http://localhost:5173/`.

## Notas

- Los productos están hardcodeados en `src/data/productos.js`.
- `ListaProductos` recorre el array con `.map()` y renderiza una `TarjetaProducto` por cada producto.
- El botón `[ Comprar ]` por ahora no hace nada (esta entrega es solo de estructura).
