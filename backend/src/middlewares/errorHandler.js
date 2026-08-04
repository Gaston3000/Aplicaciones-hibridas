// Acá centralizo el manejo de errores.
// Los controladores hacen try/catch y me tiran el error con next(error);
// yo lo agarro acá y lo traduzco al código HTTP y al mensaje que corresponde.
// De esta forma no repito el mismo bloque de errores en cada controlador.

// Si el usuario pega en una ruta que no existe, cae acá.
export const rutaNoEncontrada = (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
};

export const manejarErrores = (error, req, res, next) => { // eslint-disable-line no-unused-vars
    // Alguna validación del schema no pasó (campo obligatorio, min, max, enum...)
    if (error.name === 'ValidationError') {
        const detalles = Object.values(error.errors).map((e) => e.message);
        return res.status(400).json({ error: detalles[0], detalles });
    }

    // Le mandaron un id que no tiene forma de ObjectId, por ejemplo /api/estadios/123
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ error: 'El ID no tiene un formato válido' });
    }

    // Se repite algo que tiene que ser único (el email o el nombre de la categoría).
    if (error.code === 11000) {
        const campo = Object.keys(error.keyPattern || {})[0] || 'valor';
        return res.status(409).json({ error: `Ya existe un registro con ese ${campo}` });
    }

    // Cualquier otra cosa rara termina siendo un 500.
    console.error('Error inesperado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
};
