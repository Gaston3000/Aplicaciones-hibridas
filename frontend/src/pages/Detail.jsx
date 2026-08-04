import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getEstadio } from "../services/estadioService";
import { useCargarDatos } from "../hooks/useCargarDatos";
import { formatearPrecio, formatearNumero } from "../utils/formato";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

// Ficha completa de una sede. El id viene de la URL: /estadios/:id
function Detail() {
  const { id } = useParams();
  const [sinFoto, setSinFoto] = useState(false);

  const consulta = useCallback(() => getEstadio(id), [id]);
  const { datos: estadio, cargando, error } = useCargarDatos(consulta);

  if (cargando) return <Loading texto="Cargando la sede..." />;

  // Si el id no existe o tiene un formato inválido, la API responde 404 / 400.
  if (error || !estadio) {
    return (
      <section className="detalle-vacio">
        <ErrorMessage mensaje={error || "No se encontró la sede."} />
        <Link to="/estadios" className="btn-ghost">← Volver a las sedes</Link>
      </section>
    );
  }

  return (
    <section className="detalle">
      <Link to="/estadios" className="detalle-back">← Volver a las sedes</Link>

      <div className="detalle-grid">
        <div className="detalle-media">
          {estadio.imagen && !sinFoto && (
            <img src={estadio.imagen} alt={estadio.nombre} onError={() => setSinFoto(true)} />
          )}
          {(!estadio.imagen || sinFoto) && (
            <span className="detalle-media-fallback">{estadio.nombre}</span>
          )}
          <span className="card-badge">{estadio.categoria?.nombre || "Sin categoría"}</span>
        </div>

        <div className="detalle-info">
          <span className="detalle-city">
            {estadio.ciudad}
            {estadio.estado ? `, ${estadio.estado}` : ""}
          </span>
          <h2 className="detalle-title">{estadio.nombre}</h2>
          <p className="detalle-desc">{estadio.descripcion}</p>

          <dl className="detalle-datos">
            <div>
              <dt>Categoría</dt>
              <dd>{estadio.categoria?.nombre || "Sin categoría"}</dd>
            </div>
            <div>
              <dt>Ciudad</dt>
              <dd>{estadio.ciudad}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{estadio.estado || "—"}</dd>
            </div>
            <div>
              <dt>Capacidad</dt>
              <dd>
                {estadio.capacidad ? `${formatearNumero(estadio.capacidad)} espectadores` : "—"}
              </dd>
            </div>
          </dl>

          <div className="detalle-price-row">
            <div>
              <span className="detalle-price-label">Valor estimado de la sede</span>
              <span className="detalle-price">{formatearPrecio(estadio.precio)}</span>
            </div>
            <Link to="/estadios" className="btn-primary">Ver otras sedes</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Detail;
