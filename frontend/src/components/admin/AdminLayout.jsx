import { useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Estructura común de todo el BackOffice: menú lateral + encabezado.
// Las páginas del panel se dibujan en el <Outlet />.
function AdminLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate("/");
  };

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <div className="admin">
      <aside className={`admin-menu ${menuAbierto ? "abierto" : ""}`}>
        <Link to="/admin" className="admin-marca" onClick={cerrarMenu}>
          WORLD CUP <b>26</b>
          <span>Panel de administración</span>
        </Link>

        <nav className="admin-nav">
          <NavLink to="/admin" end onClick={cerrarMenu}>Dashboard</NavLink>
          <NavLink to="/admin/estadios" onClick={cerrarMenu}>Estadios</NavLink>
          <NavLink to="/admin/categorias" onClick={cerrarMenu}>Categorías</NavLink>
          <NavLink to="/admin/usuarios" onClick={cerrarMenu}>Usuarios</NavLink>
        </nav>

        <div className="admin-menu-pie">
          <Link to="/" className="admin-volver" onClick={cerrarMenu}>← Volver al sitio</Link>
        </div>
      </aside>

      <div className="admin-contenido">
        <header className="admin-header">
          <button
            type="button"
            className="admin-toggle"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="admin-header-usuario">
            <span className="admin-header-nombre">{usuario?.nombre}</span>
            <span className="etiqueta-rol admin">{usuario?.rol}</span>
          </div>

          <button type="button" className="btn-ghost btn-chico" onClick={salir}>
            Cerrar sesión
          </button>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>

      {/* Fondo oscuro que cierra el menú en celular */}
      {menuAbierto && <div className="admin-fondo" onClick={cerrarMenu}></div>}
    </div>
  );
}

export default AdminLayout;
