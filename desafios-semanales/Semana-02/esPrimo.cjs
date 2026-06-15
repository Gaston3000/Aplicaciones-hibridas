// Exportación con CommonJS (module.exports)
// Verifica si un número es primo — lo vamos a usar con IDs de productos.

function esPrimo(n) {
    if (!Number.isInteger(n) || n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

module.exports = esPrimo;
