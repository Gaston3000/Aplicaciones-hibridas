import { request } from './api';

// Llamadas relacionadas con la autenticación.

export const registrar = (datos) =>
    request('/api/usuarios/registro', { method: 'POST', body: datos });

export const login = (datos) =>
    request('/api/usuarios/login', { method: 'POST', body: datos });

// Devuelve los datos del usuario logueado. Sirve para restaurar la sesión
// al recargar la página y para comprobar que el token siga siendo válido.
export const getPerfil = () => request('/api/usuarios/perfil', { auth: true });
