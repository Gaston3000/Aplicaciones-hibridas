import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Con esto cualquier componente puede saber cómo viene la sesión.
// Devuelve: { usuario, token, cargando, estaAutenticado, esAdmin,
//             iniciarSesion, cerrarSesion, mensajeSesion, limpiarMensajeSesion }
export function useAuth() {
    const contexto = useContext(AuthContext);

    // Si esto explota es porque me olvidé de envolver la app con el AuthProvider.
    if (!contexto) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }

    return contexto;
}

export default useAuth;
