import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

// Tapa las páginas a las que no podés entrar sin estar logueado.
// - Mientras chequea el token guardado muestra "cargando".
// - Si no hay sesión te manda a /login, pero se acuerda de a dónde querías ir.
// - Con "soloAdministradores" además te pide que seas admin.
//
// Ojo: esto es solo la interfaz. El backend igual valida el token y el rol en
// cada endpoint, así que tocando el front no te alcanza para entrar.
function PrivateRoute({ children, soloAdministradores = false }) {
    const { estaAutenticado, esAdmin, cargando } = useAuth();
    const ubicacion = useLocation();

    if (cargando) {
        return <Loading texto="Verificando sesión..." />;
    }

    if (!estaAutenticado) {
        return <Navigate to="/login" state={{ desde: ubicacion.pathname }} replace />;
    }

    // Está logueado pero es un usuario común queriendo entrar al panel.
    if (soloAdministradores && !esAdmin) {
        return <Navigate to="/acceso-denegado" replace />;
    }

    return children;
}

export default PrivateRoute;
