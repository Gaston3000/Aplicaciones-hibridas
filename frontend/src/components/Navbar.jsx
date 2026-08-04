import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// La barra de arriba. Cambia según quién esté mirando:
// visitante, usuario común o admin.
function Navbar() {
  // Si todavía no puse el logo, muestro el texto y listo.
  const [logoError, setLogoError] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { estaAutenticado, esAdmin, usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    setMenuAbierto(false);
    navigate("/");
  };

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={cerrarMenu}>
          {/* LOGO OFICIAL: poné el archivo en  frontend/public/logo-mundial.png */}
          {logoError ? (
            <span className="brand-text">WORLD CUP <b>26</b></span>
          ) : (
            <img
              src="/logo-mundial.png"
              alt="World Cup 26"
              className="brand-logo"
              onError={() => setLogoError(true)}
            />
          )}
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${menuAbierto ? "abierto" : ""}`}>
          <NavLink to="/" end onClick={cerrarMenu}>Inicio</NavLink>
          <NavLink to="/estadios" onClick={cerrarMenu}>Sedes</NavLink>

          {!estaAutenticado && (
            <>
              <NavLink to="/registro" onClick={cerrarMenu}>Registro</NavLink>
              <NavLink to="/login" onClick={cerrarMenu}>Ingresar</NavLink>
            </>
          )}

          {estaAutenticado && (
            <>
              {esAdmin && (
                <NavLink to="/admin" className="nav-admin" onClick={cerrarMenu}>
                  Administración
                </NavLink>
              )}
              <NavLink to="/perfil" className="nav-usuario" onClick={cerrarMenu}>
                {usuario?.nombre}
              </NavLink>
              <button type="button" className="nav-salir" onClick={salir}>
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
