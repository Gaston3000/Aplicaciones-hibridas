import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { formatearFecha } from "../utils/formato";

// Página protegida con PrivateRoute: solo se ve con la sesión iniciada.
function Perfil() {
  const { usuario, esAdmin } = useAuth();

  return (
    <section className="formulario perfil">
      <h2>Mi perfil</h2>

      <dl className="perfil-datos">
        <div>
          <dt>Nombre</dt>
          <dd>{usuario?.nombre}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{usuario?.email}</dd>
        </div>
        <div>
          <dt>Rol</dt>
          <dd>
            <span className={`etiqueta-rol ${esAdmin ? "admin" : ""}`}>{usuario?.rol}</span>
          </dd>
        </div>
        <div>
          <dt>Miembro desde</dt>
          <dd>{formatearFecha(usuario?.createdAt)}</dd>
        </div>
      </dl>

      {esAdmin && (
        <Link to="/admin" className="btn-primary perfil-boton">
          Ir al panel de administración
        </Link>
      )}
    </section>
  );
}

export default Perfil;
