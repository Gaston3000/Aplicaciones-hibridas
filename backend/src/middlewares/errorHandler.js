// ---------------------------------------------------------------------------
// Manejo centralizado de errores.
// Los controladores hacen try/catch y llaman a next(error); acá se traduce
// ese error al código HTTP y al mensaje que corresponde. Así no repetimos
// el mismo bloque de errores en cada controlador.
// ---------------------------------------------------------------------------

// 404 para cualquier ruta que no exista en la API.
export const rutaNoEncontrada = (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
};

export const manejarErrores = (error, req, res, next) => { // eslint-disable-line no-unused-vars
    // Error de validación de Mongoose (campos obligatorios, min, max, enum...)
    if (error.name === 'ValidationError') {
        const detalles = Object.values(error.errors).map((e) => e.message);
        return res.status(400).json({ error: detalles[0], detalles });
    }

    // ID de MongoDB con formato inválido (por ejemplo /api/estadios/123)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ error: 'El ID no tiene un formato válido' });
    }

    // Clave duplicada (email de usuario o nombre de categoría repetido)
    if (error.code === 11000) {
        const campo = Object.keys(error.keyPattern || {})[0] || 'valor';
        return res.status(409).json({ error: `Ya existe un registro con ese ${campo}` });
    }

    // Cualquier otra cosa: error interno del servidor.
    console.error('Error inesperado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
};
