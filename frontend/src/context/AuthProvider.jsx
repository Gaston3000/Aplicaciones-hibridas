import { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import * as authService from '../services/authService';
import {
    guardarSesion,
    borrarSesion,
    leerToken,
    leerUsuarioGuardado,
    registrarCierreDeSesion
} from '../services/api';

// ---------------------------------------------------------------------------
// AuthProvider: maneja la sesión de toda la aplicación.
// Guarda el token y el usuario, restaura la sesión al recargar la página
// y cierra la sesión sola si el token venció.
// ---------------------------------------------------------------------------
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => leerToken());
    const [usuario, setUsuario] = useState(() => leerUsuarioGuardado());
    // "cargando" evita que PrivateRoute redirija al login antes de comprobar el token.
    const [cargando, setCargando] = useState(true);
    const [mensajeSesion, setMensajeSesion] = useState(null);

    const cerrarSesion = useCallback((mensaje = null) => {
        borrarSesion();
        setToken(null);
        setUsuario(null);
        setMensajeSesion(mensaje);
    }, []);

    // Si cualquier llamada a la API devuelve 401, se cierra la sesión.
    useEffect(() => {
        registrarCierreDeSesion((mensaje) => cerrarSesion(mensaje));
    }, [cerrarSesion]);

    // Al montar la app: si hay token guardado, se comprueba contra la API.
    useEffect(() => {
        const restaurarSesion = async () => {
            if (!leerToken()) {
                setCargando(false);
                return;
            }

            try {
                const perfil = await authService.getPerfil();
                setUsuario(perfil);
                guardarSesion(leerToken(), perfil);
            } catch (error) {
                // Token vencido, inválido o backend caído: la sesión no sirve.
                if (error.status === 401) {
                    cerrarSesion('La sesión expiró. Iniciá sesión de nuevo.');
                } else {
                    cerrarSesion();
                }
            } finally {
                setCargando(false);
            }
        };

        restaurarSesion();
    }, [cerrarSesion]);

    const iniciarSesion = useCallback(async (email, password) => {
        const datos = await authService.login({ email, password });
        guardarSesion(datos.token, datos.usuario);
        setToken(datos.token);
        setUsuario(datos.usuario);
        setMensajeSesion(null);
        return datos.usuario;
    }, []);

    const registrarse = useCallback(async (datos) => authService.registrar(datos), []);

    const limpiarMensajeSesion = useCallback(() => setMensajeSesion(null), []);

    // useMemo evita crear un objeto nuevo en cada render.
    const valor = useMemo(
        () => ({
            token,
            usuario,
            cargando,
            estaAutenticado: Boolean(token && usuario),
            esAdmin: usuario?.rol === 'admin',
            iniciarSesion,
            registrarse,
            cerrarSesion,
            mensajeSesion,
            limpiarMensajeSesion
        }),
        [token, usuario, cargando, iniciarSesion, registrarse, cerrarSesion, mensajeSesion, limpiarMensajeSesion]
    );

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
