import { request } from './api';

// Las llamadas que tienen que ver con el login.

export const registrar = (datos) =>
    request('/api/usuarios/registro', { method: 'POST', body: datos });

export const login = (datos) =>
    request('/api/usuarios/login', { method: 'POST', body: datos });

// Trae los datos del que está logueado. Lo uso para levantar la sesión
// cuando recargás la página y, de paso, para ver si el token sigue vivo.
export const getPerfil = () => request('/api/usuarios/perfil', { auth: true });
