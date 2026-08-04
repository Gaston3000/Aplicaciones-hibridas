import { request } from './api';

// Lo que usa el panel para manejar usuarios.
// Todas piden token de admin.

export const getUsuarios = () => request('/api/usuarios', { auth: true });

export const getUsuario = (id) => request(`/api/usuarios/${id}`, { auth: true });

export const crearUsuario = (datos) =>
    request('/api/usuarios', { method: 'POST', body: datos, auth: true });

export const actualizarUsuario = (id, datos) =>
    request(`/api/usuarios/${id}`, { method: 'PUT', body: datos, auth: true });

export const eliminarUsuario = (id) =>
    request(`/api/usuarios/${id}`, { method: 'DELETE', auth: true });
