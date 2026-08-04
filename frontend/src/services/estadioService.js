import { request } from './api';

// Llamadas al recurso /api/estadios.
// Las lecturas son públicas; crear, editar y borrar necesitan token de admin.

export const getEstadios = () => request('/api/estadios');

export const getEstadio = (id) => request(`/api/estadios/${id}`);

export const crearEstadio = (datos) =>
    request('/api/estadios', { method: 'POST', body: datos, auth: true });

export const actualizarEstadio = (id, datos) =>
    request(`/api/estadios/${id}`, { method: 'PUT', body: datos, auth: true });

export const eliminarEstadio = (id) =>
    request(`/api/estadios/${id}`, { method: 'DELETE', auth: true });
