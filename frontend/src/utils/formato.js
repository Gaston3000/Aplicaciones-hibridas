// Funciones chicas de formato que se usan en varias pantallas.

// Muestra el precio como moneda. Si el dato no es un número devuelve un guion,
// así ninguna pantalla se rompe cuando falta el valor.
export const formatearPrecio = (valor) => {
    if (typeof valor !== 'number' || Number.isNaN(valor)) return '—';
    return `$${valor.toLocaleString('es-AR')}`;
};

// Muestra la capacidad con separador de miles.
export const formatearNumero = (valor) => {
    if (typeof valor !== 'number' || Number.isNaN(valor)) return '—';
    return valor.toLocaleString('es-AR');
};

// Fecha corta (dd/mm/aaaa) para las tablas del BackOffice.
export const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '—';
    const fecha = new Date(fechaISO);
    if (Number.isNaN(fecha.getTime())) return '—';
    return fecha.toLocaleDateString('es-AR');
};
