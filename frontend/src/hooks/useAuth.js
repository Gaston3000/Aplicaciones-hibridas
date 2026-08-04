import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook para leer el estado de la sesión desde cualquier componente.
// Devuelve: { usuario, token, cargando, estaAutenticado, esAdmin,
//             iniciarSesion, cerrarSesion, mensajeSesion, limpiarMensajeSesion }
export function useAuth() {
    const contexto = useContext(AuthContext);

    if (!contexto) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }

    return contexto;
}

export default useAuth;
