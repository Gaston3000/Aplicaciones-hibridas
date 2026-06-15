// Importación con ES Modules de un módulo CommonJS (default import).
import 'dotenv/config';
import esPrimo from './esPrimo.cjs';

const tituloApp = process.env.APP_NAME || 'Chequeo de primos';
console.log(`=== ${tituloApp} ===`);

const productos = [
    { id: 2,  nombre: 'Detergente' },
    { id: 7,  nombre: 'Lavandina' },
    { id: 10, nombre: 'Esponjas' },
    { id: 11, nombre: 'Trapo de piso' },
    { id: 15, nombre: 'Cera líquida' }
];

productos.forEach((p) => {
    const resultado = esPrimo(p.id)
        ? `ID primo → producto destacado`
        : `ID compuesto → producto regular`;
    console.log(`#${p.id} ${p.nombre}: ${resultado}`);
});
