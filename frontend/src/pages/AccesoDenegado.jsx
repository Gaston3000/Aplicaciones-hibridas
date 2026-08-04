import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Cuando alguien logueado pero sin rol admin quiere meterse en el panel.
function AccesoDenegado() {
  const { usuario } = useAuth();

  return (
    <section className="pagina-mensaje">
      <span className="pagina-mensaje-codigo denegado">403</span>
      <h2>Acceso denegado</h2>
      <p>
        Tu cuenta ({usuario?.email}) tiene el rol <strong>{usuario?.rol}</strong> y el
        panel de administración es solo para administradores.
      </p>
      <div className="pagina-mensaje-acciones">
        <Link to="/" className="btn-primary">Volver al inicio</Link>
        <Link to="/perfil" className="btn-ghost">Ver mi perfil</Link>
      </div>
    </section>
  );
}

export default AccesoDenegado;
