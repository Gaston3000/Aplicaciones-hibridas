import { useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Hook propio para pedir datos a la API.
// Centraliza el patrón que se repite en todas las pantallas:
// "cargando" mientras se espera, "error" si algo falla y los datos si sale bien.
//
// consulta: función async (envuelta en useCallback) que devuelve los datos.
//
// Devuelve: { datos, cargando, error, recargar }
// ---------------------------------------------------------------------------
export function useCargarDatos(consulta) {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    // Cambiar este número vuelve a disparar el efecto (sirve para "Reintentar").
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        // Si el componente se desmonta antes de que llegue la respuesta,
        // "vigente" evita actualizar el estado de un componente que ya no existe.
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
