// Acá centralizo todas las llamadas a la API del backend (Semana 06).
// Si cambia la URL del servidor la toco en un solo lugar.
const API_URL = "http://localhost:3000";

export async function registrarUsuario(datos) {
  const res = await fetch(`${API_URL}/api/usuarios/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return res.json();
}

export async function loginUsuario(datos) {
  const res = await fetch(`${API_URL}/api/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return res.json();
}

export async function getProductos() {
  const res = await fetch(`${API_URL}/api/productos`);
  return res.json();
}

export async function getProducto(id) {
  const res = await fetch(`${API_URL}/api/productos/${id}`);
  return res.json();
}
