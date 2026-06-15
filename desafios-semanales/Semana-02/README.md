# Semana 02 — Módulos Nativos (Ejercicio 1)

Proyecto Node.js con una función `esPrimo` exportada en CommonJS e importada desde ES Modules.

## Estructura
- `esPrimo.cjs` → función exportada con `module.exports` (CommonJS).
- `index.js` → archivo principal que la importa con `import` (ES Modules, gracias a `"type": "module"`).
- `.env.example` → plantilla de variables de entorno. Copiar a `.env`.

## Pasos
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear `.env` a partir de `.env.example`.
3. Correr el proyecto:
   ```bash
   npm start
   ```

## Qué hace
Recorre una lista de productos y usa `esPrimo` para marcar cuáles tienen un ID primo (destacados) y cuáles no.
