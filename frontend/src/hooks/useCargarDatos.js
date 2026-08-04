import { useState, useEffect, useCallback } from 'react';

// Hook para pedirle datos a la API.
// Junta lo que se repetía en todas las pantallas: mostrar "cargando" mientras
// llega la respuesta, el error si falla, y los datos si sale todo bien.
//
// consulta: una función async (envuelta en useCallback) que devuelve los datos.
// Devuelve: { datos, cargando, error, recargar }
export function useCargarDatos(consulta) {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    // Cambiar este número vuelve a disparar el efecto, es lo que usa "Reintentar".
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        // Si te vas de la pantalla antes de que llegue la respuesta, "vigente"
        // evita que intente actualizar un componente que ya no está.
        let vigente = true;

        consulta()
            .then((resultado) => {
                if (!vigente) return;
                setDatos(resultado);
                setError(null);
            })
            .catch((err) => {
                if (vigente) setError(err.message);
            })
            .finally(() => {
                if (vigente) setCargando(false);
            });

        return () => {
            vigente = false;
        };
    }, [consulta, intento]);

    const recargar = useCallback(() => {
        setCargando(true);
        setError(null);
        setIntento((numero) => numero + 1);
    }, []);

    return { datos, cargando, error, recargar };
}

export default useCargarDatos;
