import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getEstadios } from "../../services/estadioService";
import { getCategorias } from "../../services/categoriaService";
import { getUsuarios } from "../../services/usuarioService";
import { useCargarDatos } from "../../hooks/useCargarDatos";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

// El resumen del panel: cuántos hay de cada cosa.
// Los números salen de la API, no están puestos a mano.
function Dashboard() {
  const { usuario } = useAuth();

  const consulta = useCallback(async () => {
    const [estadios, categorias, usuarios] = await Promise.all([
      getEstadios(),
      getCategorias(),
      getUsuarios(),
    ]);
    return {
      estadios: estadios.length,
      categorias: categorias.length,
      usuarios: usuarios.length,
    };
  }, []);

  const { datos, cargando, error, recargar } = useCargarDatos(consulta);

  const tarjetas = [
    { titulo: "Estadios", valor: datos?.estadios ?? 0, enlace: "/admin/estadios", texto: "Sedes cargadas" },
    { titulo: "Categorías", valor: datos?.categorias ?? 0, enlace: "/admin/categorias", texto: "Tipos de sede" },
    { titulo: "Usuarios", valor: datos?.usuarios ?? 0, enlace: "/admin/usuarios", texto: "Cuentas registradas" },
  ];

  return (
    <>
      <div className="admin-titulo">
        <div>
          <h1>Dashboard</h1>
          <p>Hola {usuario?.nombre}, este es el estado actual del sitio.</p>
        </div>
      </div>

      {cargando && <Loading texto="Cargando el resumen..." />}
      {!cargando && error && <ErrorMessage mensaje={error} onReintentar={recargar} />}

      {!cargando && !error && (
        <>
          <div className="dashboard-grid">
            {tarjetas.map((tarjeta) => (
              <Link key={tarjeta.titulo} to={tarjeta.enlace} className="dashboard-card">
                <span className="dashboard-card-titulo">{tarjeta.titulo}</span>
                <span className="dashboard-card-valor">{tarjeta.valor}</span>
                <span className="dashboard-card-texto">{tarjeta.texto}</span>
              </Link>
            ))}
          </div>

          <div className="admin-panel">
            <h2>Accesos rápidos</h2>
            <div className="admin-panel-acciones">
              <Link to="/admin/estadios/nuevo" className="btn-primary">Cargar una sede</Link>
              <Link to="/admin/categorias/nueva" className="btn-ghost">Crear una categoría</Link>
              <Link to="/" className="btn-ghost">Ver el sitio público</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
