// ---------------------------------------------------------------------------
// Punto central de comunicación con la API.
// Todos los servicios (auth, estadios, categorías, usuarios) usan request().
// Acá se arma el header, se agrega el token y se traducen los errores;
// así no repetimos fetch ni try/catch en cada función.
// ---------------------------------------------------------------------------

// La URL sale de la variable de entorno VITE_API_URL (archivo .env).
// El localhost queda solo como respaldo para desarrollo.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';

// --- Guardado de la sesión en localStorage ---
export const leerToken = () => localStorage.getItem(CLAVE_TOKEN);

export const guardarSesion = (token, usuario) => {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
};

export const borrarSesion = () => {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
};

export const leerUsuarioGuardado = () => {
    try {
        const guardado = localStorage.getItem(CLAVE_USUARIO);
        return guardado ? JSON.parse(guardado) : null;
    } catch {
        return null;
    }
};

// Si la API responde 401 (token vencido o inválido) avisamos al AuthProvider
// para que cierre la sesión en toda la aplicación.
let alPerderSesion = null;
export const registrarCierreDeSesion = (callback) => {
    alPerderSesion = callback;
};

// ---------------------------------------------------------------------------
// request: hace el pedido y devuelve los datos ya parseados.
// Si algo sale mal lanza un Error con .status para poder mostrarlo en pantalla.
// ---------------------------------------------------------------------------
export async function request(ruta, { method = 'GET', body, auth = false } = {}) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    if (auth) {
        const token = leerToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let respuesta;
    try {
        respuesta = await fetch(`${API_URL}${ruta}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined
        });
    } catch {
        // No hubo respuesta: el servidor está apagado o no hay conexión.
        const error = new Error('No se pudo conectar con el servidor. Verificá que el backend esté funcionando.');
        error.status = 0;
        throw error;
    }

    // 204 y respuestas vacías no traen JSON.
    const texto = await respuesta.text();
    let datos = null;
    if (texto) {
        try {
            datos = JSON.parse(texto);
        } catch {
            datos = null;
        }
    }

    if (!respuesta.ok) {
        // Token vencido o inválido: cerramos la sesión en toda la app.
        if (respuesta.status === 401 && auth && alPerderSesion) {
            alPerderSesion(datos?.error || 'La sesión expiró. Iniciá sesión de nuevo.');
        }
        const error = new Error(datos?.error || `Error ${respuesta.status} al comunicarse con el servidor`);
        error.status = respuesta.status;
        throw error;
    }

    return datos;
}
