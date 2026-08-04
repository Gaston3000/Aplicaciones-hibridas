// Un par de funciones de formato que uso en varias pantallas.

// Muestra el precio como plata. Si no viene un número devuelve un guion,
// así no se rompe la pantalla cuando falta el dato.
export const formatearPrecio = (valor) => {
    if (typeof valor !== 'number' || Number.isNaN(valor)) return '—';
    return `$${valor.toLocaleString('es-AR')}`;
};

// Lo mismo pero para la capacidad, con el punto de miles.
export const formatearNumero = (valor) => {
    if (typeof valor !== 'number' || Number.isNaN(valor)) return '—';
    return valor.toLocaleString('es-AR');
};

// Fecha cortita (dd/mm/aaaa) para las tablas del panel.
export const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '—';
    const fecha = new Date(fechaISO);
    if (Number.isNaN(fecha.getTime())) return '—';
    return fecha.toLocaleDateString('es-AR');
};
