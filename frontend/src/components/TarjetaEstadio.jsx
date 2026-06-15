import { useState } from "react";
import { Link } from "react-router-dom";

// Tarjeta de una sede (estadio). Recibe el estadio por props.
function TarjetaEstadio({ estadio, index = 0 }) {
  const [agregado, setAgregado] = useState(false);
  const [sinFoto, setSinFoto] = useState(false);

  // feedback visual al "agregar" (el carrito real no es parte de esta entrega)
  const agregar = () => {
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1400);
  };

  return (
    <article className="card" style={{ animationDelay: `${index * 90}ms` }}>
      <Link to={`/producto/${estadio._id}`} className="card-media">
        {!sinFoto && (
          <img src={estadio.imagen} alt={estadio.nombre} onError={() => setSinFoto(true)} />
        )}
        {sinFoto && <span className="card-media-fallback">{estadio.nombre}</span>}
        <span className="card-badge">{estadio.categoria}</span>
      </Link>

      <div className="card-body">
        <span className="card-city">{estadio.marca}</span>
        <h3 className="card-title">{estadio.nombre}</h3>
        <p className="card-desc">{estadio.descripcion}</p>

        <div className="card-foot">
          <span className="card-price">${estadio.precio.toLocaleString("es-AR")}</span>
          <button className={`btn-add ${agregado ? "ok" : ""}`} onClick={agregar}>
            {agregado ? "Agregado ✓" : "Agregar"}
          </button>
        </div>

        <Link to={`/producto/${estadio._id}`} className="card-link">Ver sede →</Link>
      </div>
    </article>
  );
}

export default TarjetaEstadio;
