import { request } from './api';

// Todo lo que le pido a /api/categorias.

export const getCategorias = () => request('/api/categorias');

export const getCategoria = (id) => request(`/api/categorias/${id}`);

export const crearCategoria = (datos) =>
    request('/api/categorias', { method: 'POST', body: datos, auth: true });

export const actualizarCategoria = (id, datos) =>
    request(`/api/categorias/${id}`, { method: 'PUT', body: datos, auth: true });

export const eliminarCategoria = (id) =>
    request(`/api/categorias/${id}`, { method: 'DELETE', auth: true });
