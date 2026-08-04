import { request } from './api';

// Llamadas al recurso /api/usuarios que usa el BackOffice.
// Todas requieren token de administrador.

export const getUsuarios = () => request('/api/usuarios', { auth: true });

export const getUsuario = (id) => request(`/api/usuarios/${id}`, { auth: true });

export const crearUsuario = (datos) =>
    request('/api/usuarios', { method: 'POST', body: datos, auth: true });

export const actualizarUsuario = (id, datos) =>
    request(`/api/usuarios/${id}`, { method: 'PUT', body: datos, auth: true });

export const eliminarUsuario = (id) =>
    request(`/api/usuarios/${id}`, { method: 'DELETE', auth: true });
