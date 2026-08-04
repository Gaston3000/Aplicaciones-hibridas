import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

// ---------------------------------------------------------------------------
// PrivateRoute: protege las páginas que necesitan estar logueado.
// - Mientras se comprueba el token guardado, muestra "Cargando".
// - Si no hay sesión, redirige a /login y recuerda a dónde quería entrar.
// - Con "soloAdministradores" además exige el rol admin.
//
// Ojo: esto es protección de la interfaz. El backend TAMBIÉN valida el token
// y el rol en cada endpoint, así que no alcanza con tocar el frontend.
// ---------------------------------------------------------------------------
function PrivateRoute({ children, soloAdministradores = false }) {
    const { estaAutenticado, esAdmin, cargando } = useAuth();
    const ubicacion = useLocation();

    if (cargando) {
        return <Loading texto="Verificando sesión..." />;
    }

    if (!estaAutenticado) {
        return <Navigate to="/login" state={{ desde: ubicacion.pathname }} replace />;
    }

    if (soloAdministradores && !esAdmin) {
        return <Navigate to="/acceso-denegado" replace />;
    }

    return children;
}

export default PrivateRoute;
