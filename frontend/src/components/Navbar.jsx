import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  // Si el logo oficial no está cargado todavía, muestro un texto como respaldo.
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
      <Link to="/" className="brand">
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

      <nav className="nav-links">
        <NavLink to="/" end>Sedes</NavLink>
        <NavLink to="/registro">Registro</NavLink>
        <NavLink to="/login">Ingresar</NavLink>
      </nav>
      </div>
    </header>
  );
}

export default Navbar;
