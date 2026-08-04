import { useState } from "react";
import { Link } from "react-router-dom";
import { formatearPrecio } from "../utils/formato";

// La tarjeta de cada sede. El estadio le llega por props.
// La categoría viene populada desde la API, por eso puedo usar categoria.nombre.
function TarjetaEstadio({ estadio, index = 0 }) {
  const [sinFoto, setSinFoto] = useState(false);

  const enlace = `/estadios/${estadio._id}`;
  const nombreCategoria = estadio.categoria?.nombre || "Sin categoría";

  return (
    <article className="card" style={{ animationDelay: `${index * 90}ms` }}>
      <Link to={enlace} className="card-media">
        {estadio.imagen && !sinFoto && (
          <img src={estadio.imagen} alt={estadio.nombre} onError={() => setSinFoto(true)} />
        )}
        {(!estadio.imagen || sinFoto) && (
          <span className="card-media-fallback">{estadio.nombre}</span>
        )}
        <span className="card-badge">{nombreCategoria}</span>
      </Link>

      <div className="card-body">
        <span className="card-city">
          {estadio.ciudad}
          {estadio.estado ? `, ${estadio.estado}` : ""}
        </span>
        <h3 className="card-title">{estadio.nombre}</h3>
        <p className="card-desc">{estadio.descripcion}</p>

        <div className="card-foot">
          <span className="card-price">{formatearPrecio(estadio.precio)}</span>
          <Link to={enlace} className="btn-add">Ver sede</Link>
        </div>
      </div>
    </article>
  );
}

export default TarjetaEstadio;
