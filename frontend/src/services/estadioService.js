import { request } from './api';

// Todo lo que le pido a /api/estadios.
// Leer es libre; para crear, editar y borrar hace falta el token de admin.

export const getEstadios = () => request('/api/estadios');

export const getEstadio = (id) => request(`/api/estadios/${id}`);

export const crearEstadio = (datos) =>
    request('/api/estadios', { method: 'POST', body: datos, auth: true });

export const actualizarEstadio = (id, datos) =>
    request(`/api/estadios/${id}`, { method: 'PUT', body: datos, auth: true });

export const eliminarEstadio = (id) =>
    request(`/api/estadios/${id}`, { method: 'DELETE', auth: true });
