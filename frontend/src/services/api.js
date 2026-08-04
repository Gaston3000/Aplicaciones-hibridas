// Todo lo que habla con el backend pasa por acá.
// Los servicios (auth, estadios, categorías, usuarios) usan request(), que se
// encarga de armar los headers, meter el token y traducir los errores.
// Así no repito el mismo fetch con su try/catch en cada pantalla.

// La URL sale del .env (VITE_API_URL). El localhost queda solo de respaldo
// para cuando trabajo local y no configuré nada.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';

// La sesión la guardo en el localStorage para que sobreviva al F5.
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

// Si la API contesta 401 (token vencido o inválido) le aviso al AuthProvider
// para que cierre la sesión en toda la app de una.
let alPerderSesion = null;
export const registrarCierreDeSesion = (callback) => {
    alPerderSesion = callback;
};

// Hace el pedido y devuelve los datos ya parseados.
// Si algo sale mal tira un Error con .status, así la pantalla sabe qué mostrar.
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
        // Ni siquiera hubo respuesta: o está apagado el backend o no hay internet.
        const error = new Error('No se pudo conectar con el servidor. Verificá que el backend esté funcionando.');
        error.status = 0;
        throw error;
    }

    // Los 204 y las respuestas vacías no traen JSON, por eso leo el texto primero.
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
        // Token vencido o trucho: cierro la sesión en toda la app.
        if (respuesta.status === 401 && auth && alPerderSesion) {
            alPerderSesion(datos?.error || 'La sesión expiró. Iniciá sesión de nuevo.');
        }
        const error = new Error(datos?.error || `Error ${respuesta.status} al comunicarse con el servidor`);
        error.status = respuesta.status;
        throw error;
    }

    return datos;
}
