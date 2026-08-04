/**
 * Las pruebas de la API.
 *
 * Pega en todos los endpoints y chequea que devuelvan el código HTTP que
 * corresponde: registro, login, tokens, roles, el CRUD de las tres entidades,
 * validaciones, ids mal escritos y cosas que no existen.
 *
 * Para correrlo hacen falta dos terminales:
 *   1) en una:  npm start          (levanta el backend)
 *   2) en otra: npm run test:api
 */

import 'dotenv/config';

const API = process.env.TEST_API_URL || `http://localhost:${process.env.PORT || 3000}`;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@worldcup26.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';

let pasaron = 0;
let fallaron = 0;
const fallos = [];

// Hace el pedido y me devuelve { status, body } para no repetir el fetch.
async function pedir(metodo, ruta, { token, body } = {}) {
    const headers = {};
    if (body) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API}${ruta}`, {
        method: metodo,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    let datos = null;
    const texto = await res.text();
    if (texto) {
        try {
            datos = JSON.parse(texto);
        } catch {
            datos = texto;
        }
    }
    return { status: res.status, body: datos };
}

function chequear(descripcion, esperado, obtenido, extra = '') {
    if (esperado === obtenido) {
        pasaron++;
        console.log(`  OK   ${descripcion}  ->  ${obtenido}`);
    } else {
        fallaron++;
        const detalle = `${descripcion}  ->  esperado ${esperado}, obtenido ${obtenido} ${extra}`;
        fallos.push(detalle);
        console.log(`  FALLA ${detalle}`);
    }
}

function titulo(texto) {
    console.log(`\n=== ${texto} ===`);
}

async function main() {
    console.log(`Probando la API en ${API}\n`);

    // Le meto la hora al email para poder correr el script mil veces seguidas
    // sin que choque con un usuario de la corrida anterior.
    const emailNuevo = `test_${Date.now()}@test.com`;

    // --- Usuarios ---
    titulo('Registro y login');

    let r = await pedir('POST', '/api/usuarios/registro', {
        body: { nombre: 'Usuario Test', email: emailNuevo, password: 'test1234' }
    });
    chequear('Registro válido', 201, r.status);
    chequear('El registro NO devuelve la password', undefined, r.body?.password);
    chequear('El registro asigna rol "usuario"', 'usuario', r.body?.rol);

    r = await pedir('POST', '/api/usuarios/registro', {
        body: { nombre: 'Repetido', email: emailNuevo, password: 'test1234' }
    });
    chequear('Registro con email repetido', 409, r.status);

    r = await pedir('POST', '/api/usuarios/registro', {
        body: { nombre: 'Corto', email: `corta_${Date.now()}@test.com`, password: '123' }
    });
    chequear('Registro con password de menos de 6 caracteres', 400, r.status);

    r = await pedir('POST', '/api/usuarios/registro', {
        body: { nombre: 'Sin mail', email: 'esto-no-es-un-email', password: 'test1234' }
    });
    chequear('Registro con email inválido', 400, r.status);

    r = await pedir('POST', '/api/usuarios/registro', { body: { nombre: 'Solo nombre' } });
    chequear('Registro con campos faltantes', 400, r.status);

    r = await pedir('POST', '/api/usuarios/login', {
        body: { email: emailNuevo, password: 'test1234' }
    });
    chequear('Login correcto', 200, r.status);
    const tokenUsuario = r.body?.token;
    chequear('El login devuelve un token', true, Boolean(tokenUsuario));
    chequear('El login NO devuelve la password', undefined, r.body?.usuario?.password);

    r = await pedir('POST', '/api/usuarios/login', {
        body: { email: emailNuevo, password: 'contrasenia-incorrecta' }
    });
    chequear('Login con password incorrecta', 401, r.status);

    r = await pedir('POST', '/api/usuarios/login', {
        body: { email: 'noexiste@test.com', password: 'test1234' }
    });
    chequear('Login con email inexistente', 401, r.status);

    // --- Tokens ---
    titulo('Tokens y roles');

    r = await pedir('GET', '/api/usuarios/perfil');
    chequear('Perfil sin token', 401, r.status);

    r = await pedir('GET', '/api/usuarios/perfil', { token: 'token.falso.123' });
    chequear('Perfil con token inválido', 401, r.status);

    r = await pedir('GET', '/api/usuarios/perfil', { token: tokenUsuario });
    chequear('Perfil con token válido', 200, r.status);

    r = await pedir('GET', '/api/usuarios', { token: tokenUsuario });
    chequear('Usuario común listando usuarios (solo admin)', 403, r.status);

    r = await pedir('POST', '/api/categorias', {
        token: tokenUsuario,
        body: { nombre: 'Intento no admin' }
    });
    chequear('Usuario común creando categoría (solo admin)', 403, r.status);

    r = await pedir('POST', '/api/estadios', { body: { nombre: 'Sin token' } });
    chequear('Crear estadio sin token', 401, r.status);

    // Ahora entro como el admin que crea el seed.
    r = await pedir('POST', '/api/usuarios/login', {
        body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
    });
    chequear('Login del administrador', 200, r.status, JSON.stringify(r.body));
    const tokenAdmin = r.body?.token;
    chequear('El administrador tiene rol admin', 'admin', r.body?.usuario?.rol);

    if (!tokenAdmin) {
        console.log('\nSin token de administrador no se puede seguir. Revisá ADMIN_EMAIL / ADMIN_PASSWORD.');
        return resumen();
    }

    r = await pedir('GET', '/api/usuarios', { token: tokenAdmin });
    chequear('Admin listando usuarios', 200, r.status);
    chequear('El listado de usuarios es un array', true, Array.isArray(r.body));

    // --- Categorias ---
    titulo('CRUD de categorías');

    r = await pedir('GET', '/api/categorias');
    chequear('Listar categorías (público)', 200, r.status);
    const categoriasIniciales = Array.isArray(r.body) ? r.body.length : 0;
    chequear('El seed cargó categorías', true, categoriasIniciales > 0);

    const nombreCategoria = `Categoria Test ${Date.now()}`;
    r = await pedir('POST', '/api/categorias', {
        token: tokenAdmin,
        body: { nombre: nombreCategoria, descripcion: 'Creada por el script de pruebas' }
    });
    chequear('Crear categoría', 201, r.status);
    const categoriaId = r.body?._id;

    r = await pedir('POST', '/api/categorias', {
        token: tokenAdmin,
        body: { nombre: nombreCategoria }
    });
    chequear('Crear categoría duplicada', 409, r.status);

    r = await pedir('POST', '/api/categorias', { token: tokenAdmin, body: { nombre: '   ' } });
    chequear('Crear categoría con nombre vacío', 400, r.status);

    r = await pedir('GET', `/api/categorias/${categoriaId}`);
    chequear('Obtener categoría por ID', 200, r.status);

    r = await pedir('PUT', `/api/categorias/${categoriaId}`, {
        token: tokenAdmin,
        body: { descripcion: 'Descripción editada' }
    });
    chequear('Editar categoría', 200, r.status);
    chequear('La edición guardó el cambio', 'Descripción editada', r.body?.descripcion);

    r = await pedir('GET', '/api/categorias/000000000000000000000000');
    chequear('Categoría inexistente', 404, r.status);

    r = await pedir('GET', '/api/categorias/id-invalido');
    chequear('Categoría con ID de formato inválido', 400, r.status);

    // --- Estadios ---
    titulo('CRUD de estadios');

    r = await pedir('GET', '/api/estadios');
    chequear('Listar estadios (público)', 200, r.status);
    const estadiosIniciales = Array.isArray(r.body) ? r.body.length : 0;
    chequear('El seed cargó estadios', true, estadiosIniciales > 0);
    chequear(
        'La categoría viene populada (objeto con nombre)',
        true,
        typeof r.body?.[0]?.categoria === 'object' && Boolean(r.body?.[0]?.categoria?.nombre)
    );

    r = await pedir('POST', '/api/estadios', {
        token: tokenAdmin,
        body: {
            nombre: 'Estadio de Prueba',
            ciudad: 'Ciudad Test',
            estado: 'Estado Test',
            precio: 100000,
            capacidad: 50000,
            descripcion: 'Estadio creado por el script de pruebas',
            categoria: categoriaId
        }
    });
    chequear('Crear estadio', 201, r.status);
    const estadioId = r.body?._id;

    r = await pedir('POST', '/api/estadios', {
        token: tokenAdmin,
        body: { nombre: 'Sin campos obligatorios' }
    });
    chequear('Crear estadio sin campos obligatorios', 400, r.status);

    r = await pedir('POST', '/api/estadios', {
        token: tokenAdmin,
        body: {
            nombre: 'Precio negativo',
            ciudad: 'Test',
            precio: -50,
            categoria: categoriaId
        }
    });
    chequear('Crear estadio con precio negativo', 400, r.status);

    r = await pedir('POST', '/api/estadios', {
        token: tokenAdmin,
        body: {
            nombre: 'Categoria inexistente',
            ciudad: 'Test',
            precio: 100,
            categoria: '000000000000000000000000'
        }
    });
    chequear('Crear estadio con categoría inexistente', 400, r.status);

    r = await pedir('GET', `/api/estadios/${estadioId}`);
    chequear('Obtener estadio por ID', 200, r.status);

    r = await pedir('PUT', `/api/estadios/${estadioId}`, {
        token: tokenAdmin,
        body: { precio: 250000 }
    });
    chequear('Editar estadio', 200, r.status);
    chequear('La edición guardó el precio', 250000, r.body?.precio);

    r = await pedir('PUT', `/api/estadios/${estadioId}`, {
        token: tokenAdmin,
        body: { precio: -1 }
    });
    chequear('Editar estadio con precio negativo (runValidators)', 400, r.status);

    r = await pedir('GET', '/api/estadios/000000000000000000000000');
    chequear('Estadio inexistente', 404, r.status);

    r = await pedir('GET', '/api/estadios/abc123');
    chequear('Estadio con ID de formato inválido', 400, r.status);

    r = await pedir('DELETE', `/api/estadios/${estadioId}`, { token: tokenUsuario });
    chequear('Usuario común eliminando estadio', 403, r.status);

    // La categoría de prueba tiene un estadio colgando, así que no me la tiene
    // que dejar borrar hasta que saque el estadio.
    r = await pedir('DELETE', `/api/categorias/${categoriaId}`, { token: tokenAdmin });
    chequear('Eliminar categoría con estadios asociados', 409, r.status);

    r = await pedir('DELETE', `/api/estadios/${estadioId}`, { token: tokenAdmin });
    chequear('Eliminar estadio', 200, r.status);

    r = await pedir('DELETE', `/api/categorias/${categoriaId}`, { token: tokenAdmin });
    chequear('Eliminar categoría ya sin estadios', 200, r.status);

    // --- Usuarios ---
    titulo('CRUD de usuarios (admin)');

    const emailAdminTest = `admin_test_${Date.now()}@test.com`;
    r = await pedir('POST', '/api/usuarios', {
        token: tokenAdmin,
        body: { nombre: 'Creado por admin', email: emailAdminTest, password: 'test1234', rol: 'usuario' }
    });
    chequear('Admin creando usuario', 201, r.status);
    const usuarioId = r.body?._id;

    r = await pedir('GET', `/api/usuarios/${usuarioId}`, { token: tokenAdmin });
    chequear('Admin obteniendo usuario por ID', 200, r.status);

    r = await pedir('PUT', `/api/usuarios/${usuarioId}`, {
        token: tokenAdmin,
        body: { nombre: 'Nombre Editado', rol: 'admin' }
    });
    chequear('Admin editando usuario', 200, r.status);
    chequear('La edición guardó el rol', 'admin', r.body?.rol);

    r = await pedir('PUT', `/api/usuarios/${usuarioId}`, {
        token: tokenAdmin,
        body: { rol: 'superusuario' }
    });
    chequear('Editar usuario con un rol inexistente', 400, r.status);

    r = await pedir('PUT', `/api/usuarios/${usuarioId}`, {
        token: tokenAdmin,
        body: { email: ADMIN_EMAIL }
    });
    chequear('Editar usuario con un email ya usado', 409, r.status);

    r = await pedir('GET', '/api/usuarios/000000000000000000000000', { token: tokenAdmin });
    chequear('Usuario inexistente', 404, r.status);

    r = await pedir('DELETE', `/api/usuarios/${usuarioId}`, { token: tokenAdmin });
    chequear('Admin eliminando usuario', 200, r.status);

    // --- Varios ---
    titulo('Rutas y errores generales');

    r = await pedir('GET', '/api/ruta-que-no-existe');
    chequear('Ruta inexistente', 404, r.status);

    resumen();
}

function resumen() {
    console.log('\n============================================');
    console.log(`  PRUEBAS OK:      ${pasaron}`);
    console.log(`  PRUEBAS FALLIDAS: ${fallaron}`);
    console.log('============================================');
    if (fallos.length) {
        console.log('\nDetalle de las fallas:');
        fallos.forEach((f) => console.log(`  - ${f}`));
    }
    process.exit(fallaron > 0 ? 1 : 0);
}

main().catch((error) => {
    console.error('\nNo se pudo completar la prueba:', error.message);
    console.error('¿Está corriendo el backend? Probá "npm start" en otra terminal.');
    process.exit(1);
});
