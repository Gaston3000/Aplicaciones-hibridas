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

// Este es el que maneja la sesión de toda la app: guarda el token y el usuario,
// vuelve a levantar la sesión cuando recargás la página y la cierra solo si el
// token se venció.
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => leerToken());
    const [usuario, setUsuario] = useState(() => leerUsuarioGuardado());
    // Sin este "cargando", PrivateRoute te patea al login antes de que llegue a
    // chequear el token que había guardado.
    const [cargando, setCargando] = useState(true);
    const [mensajeSesion, setMensajeSesion] = useState(null);

    const cerrarSesion = useCallback((mensaje = null) => {
        borrarSesion();
        setToken(null);
        setUsuario(null);
        setMensajeSesion(mensaje);
    }, []);

    // Le aviso al api.js que si alguna llamada devuelve 401, cierre la sesión.
    useEffect(() => {
        registrarCierreDeSesion((mensaje) => cerrarSesion(mensaje));
    }, [cerrarSesion]);

    // Al abrir la app: si había un token guardado, lo pruebo contra la API.
    // No alcanza con que exista, puede estar vencido.
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
                // Vencido, inválido o el backend caído: esa sesión ya no sirve.
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

    // El useMemo es para no armar un objeto nuevo en cada render y hacer que se
    // vuelva a renderizar media app al pedo.
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
