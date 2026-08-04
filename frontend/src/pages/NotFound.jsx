import { Link } from "react-router-dom";

// El 404. Cualquier ruta que no exista termina acá.
function NotFound() {
  return (
    <section className="pagina-mensaje">
      <span className="pagina-mensaje-codigo">404</span>
      <h2>Esta página no existe</h2>
      <p>
        El enlace que abriste no corresponde a ninguna sección del sitio.
        Puede que la dirección esté mal escrita o que la página se haya movido.
      </p>
      <div className="pagina-mensaje-acciones">
        <Link to="/" className="btn-primary">Volver al inicio</Link>
        <Link to="/estadios" className="btn-ghost">Ver las sedes</Link>
      </div>
    </section>
  );
}

export default NotFound;
